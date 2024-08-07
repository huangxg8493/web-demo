const CLASS_PATTERN = /^class[ {]/;

/**
 * @param {function} fn
 *
 * @return {boolean}
 */
function isClass(fn) {
    return CLASS_PATTERN.test(fn.toString());
}

/**
 * @param {any} obj
 *
 * @return {boolean}
 */
function isArray(obj) {
    return Array.isArray(obj);
}

/**
 * @param {any} obj
 * @param {string} prop
 *
 * @return {boolean}
 */
function hasOwnProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

/**
 * @typedef {import('./index.js').InjectAnnotated } InjectAnnotated
 */

/**
 * @template T
 *
 * @params {[...string[], T] | ...string[], T} args
 *
 * @return {T & InjectAnnotated}
 */
function annotate(...args) {
    if (args.length === 1 && isArray(args[0])) {
        args = args[0];
    }
    args = [...args];
    const fn = args.pop();
    fn.$inject = args;
    return fn;
}

// Current limitations:
// - can't put into "function arg" comments
// function /* (no parenthesis like this) */ (){}
// function abc( /* xx (no parenthesis like this) */ a, b) {}
//
// Just put the comment before function or inside:
// /* (((this is fine))) */ function(a, b) {}
// function abc(a) { /* (((this is fine))) */}
//
// - can't reliably auto-annotate constructor; we'll match the
// first constructor(...) pattern found which may be the one
// of a nested class, too.
const CONSTRUCTOR_ARGS = /constructor\s*[^(]*\(\s*([^)]*)\)/m;
const FN_ARGS = /^(?:async\s+)?(?:function\s*[^(]*)?(?:\(\s*([^)]*)\)|(\w+))/m;
const FN_ARG = /\/\*([^*]*)\*\//m;

/**
 * @param {unknown} fn
 *
 * @return {string[]}
 */
function parseAnnotations(fn) {
    if (typeof fn !== 'function') {
        throw new Error(`Cannot annotate "${fn}". Expected a function!`);
    }

    const match = fn.toString().match(isClass(fn) ? CONSTRUCTOR_ARGS : FN_ARGS);

    // may parse class without constructor
    if (!match) {
        return [];
    }

    const args = match[1] || match[2];

    return args && args.split(',').map(arg => {
        const argMatch = arg.match(FN_ARG);
        return (argMatch && argMatch[1] || arg).trim();
    }) || [];
}

/**
 * @typedef { import('./index.js').ModuleDeclaration } ModuleDeclaration
 * @typedef { import('./index.js').ModuleDefinition } ModuleDefinition
 * @typedef { import('./index.js').InjectorContext } InjectorContext
 *
 * @typedef { import('./index.js').TypedDeclaration<any, any> } TypedDeclaration
 */

/**
 * Create a new injector with the given modules.
 *
 * @param {ModuleDefinition[]} modules
 * @param {InjectorContext} [_parent]
 */
function Injector(modules, _parent) {
    const parent = _parent || ({
        get: function (name, strict) {
            currentlyResolving.push(name);
            if (strict === false) {
                return null;
            } else {
                throw error(`No provider for "${name}"!`);
            }
        }
    });

    const currentlyResolving = [];
    const providers = this._providers = Object.create(parent._providers || null);
    const instances = this._instances = Object.create(null);

    const self = instances.injector = this;

    const error = function (msg) {
        const stack = currentlyResolving.join(' -> ');
        currentlyResolving.length = 0;
        return new Error(stack ? `${msg} (Resolving: ${stack})` : msg);
    };

    /**
     * Return a named service.
     *
     * @param {string} name
     * @param {boolean} [strict=true] if false, resolve missing services to null
     *
     * @return {any}
     */
    function get(name, strict) {
        if (!providers[name] && name.includes('.')) {
            const parts = name.split('.');
            let pivot = get(/** @type { string } */ (parts.shift()));
            while (parts.length) {
                pivot = pivot[/** @type { string } */ (parts.shift())];
            }
            return pivot;
        }

        if (hasOwnProp(instances, name)) {
            return instances[name];
        }

        if (hasOwnProp(providers, name)) {
            if (currentlyResolving.indexOf(name) !== -1) {
                currentlyResolving.push(name);
                throw error('Cannot resolve circular dependency!');
            }

            currentlyResolving.push(name);
            instances[name] = providers[name][0](providers[name][1]);
            currentlyResolving.pop();

            return instances[name];
        }

        return parent.get(name, strict);
    }

    function fnDef(fn, locals) {
        if (typeof locals === 'undefined') {
            locals = {};
        }

        if (typeof fn !== 'function') {
            if (isArray(fn)) {
                fn = annotate(fn.slice());
            } else {
                throw error(`Cannot invoke "${fn}". Expected a function!`);
            }
        }

        /**
         * @type {string[]}
         */
        const inject = fn.$inject || parseAnnotations(fn);
        const dependencies = inject.map(dep => {
            if (hasOwnProp(locals, dep)) {
                return locals[dep];
            } else {
                return get(dep);
            }
        });

        return {
            fn: fn,
            dependencies
        };
    }

    /**
     * Instantiate the given type, injecting dependencies.
     *
     * @template T
     *
     * @param { Function | [...string[], Function ]} type
     *
     * @return T
     */
    function instantiate(type) {
        const {
            fn,
            dependencies
        } = fnDef(type);

        // instantiate var args constructor
        const Constructor = Function.prototype.bind.call(fn, null, ...dependencies);

        return new Constructor();
    }

    /**
     * Invoke the given function, injecting dependencies. Return the result.
     *
     * @template T
     *
     * @param { Function | [...string[], Function ]} func
     * @param { Object } [context]
     * @param { Object } [locals]
     *
     * @return {T} invocation result
     */
    function invoke(func, context, locals) {
        const {
            fn,
            dependencies
        } = fnDef(func, locals);

        return fn.apply(context, dependencies);
    }

    /**
     * @param {Injector} childInjector
     *
     * @return {Function}
     */
    function createPrivateInjectorFactory(childInjector) {
        return annotate(key => childInjector.get(key));
    }

    /**
     * @param {ModuleDefinition[]} modules
     * @param {string[]} [forceNewInstances]
     *
     * @return {Injector}
     */
    function createChild(modules, forceNewInstances) {
        if (forceNewInstances && forceNewInstances.length) {
            const fromParentModule = Object.create(null);
            const matchedScopes = Object.create(null);

            const privateInjectorsCache = [];
            const privateChildInjectors = [];
            const privateChildFactories = [];

            let provider;
            let cacheIdx;
            let privateChildInjector;
            let privateChildInjectorFactory;

            for (let name in providers) {
                provider = providers[name];
                if (forceNewInstances.indexOf(name) !== -1) {
                    if (provider[2] === 'private') {
                        cacheIdx = privateInjectorsCache.indexOf(provider[3]);
                        if (cacheIdx === -1) {
                            privateChildInjector = provider[3].createChild([], forceNewInstances);
                            privateChildInjectorFactory = createPrivateInjectorFactory(privateChildInjector);
                            privateInjectorsCache.push(provider[3]);
                            privateChildInjectors.push(privateChildInjector);
                            privateChildFactories.push(privateChildInjectorFactory);
                            fromParentModule[name] = [privateChildInjectorFactory, name, 'private', privateChildInjector];
                        } else {
                            fromParentModule[name] = [privateChildFactories[cacheIdx], name, 'private', privateChildInjectors[cacheIdx]];
                        }
                    } else {
                        fromParentModule[name] = [provider[2], provider[1]];
                    }
                    matchedScopes[name] = true;
                }

                if ((provider[2] === 'factory' || provider[2] === 'type') && provider[1].$scope) {
                    /* jshint -W083 */
                    forceNewInstances.forEach(scope => {
                        if (provider[1].$scope.indexOf(scope) !== -1) {
                            fromParentModule[name] = [provider[2], provider[1]];
                            matchedScopes[scope] = true;
                        }
                    });
                }
            }

            forceNewInstances.forEach(scope => {
                if (!matchedScopes[scope]) {
                    throw new Error('No provider for "' + scope + '". Cannot use provider from the parent!');
                }
            });

            modules.unshift(fromParentModule);
        }

        return new Injector(modules, self);
    }

    const factoryMap = {
        factory: invoke,
        type: instantiate,
        value: function (value) {
            return value;
        }
    };

    /**
     * @param {ModuleDefinition} moduleDefinition
     * @param {Injector} injector
     */
    function createInitializer(moduleDefinition, injector) {
        const initializers = moduleDefinition.__init__ || [];
        return function () {
            initializers.forEach(initializer => {
                // eagerly resolve component (fn or string)
                if (typeof initializer === 'string') {
                    injector.get(initializer);
                } else {
                    injector.invoke(initializer);
                }
            });
        };
    }

    /**
     * @param {ModuleDefinition} moduleDefinition
     */
    function loadModule(moduleDefinition) {
        const moduleExports = moduleDefinition.__exports__;
        // private module
        if (moduleExports) {
            const nestedModules = moduleDefinition.__modules__;
            const clonedModule = Object.keys(moduleDefinition).reduce((clonedModule, key) => {
                if (key !== '__exports__' && key !== '__modules__' && key !== '__init__' && key !== '__depends__') {
                    clonedModule[key] = moduleDefinition[key];
                }
                return clonedModule;
            }, Object.create(null));

            const childModules = (nestedModules || []).concat(clonedModule);

            const privateInjector = createChild(childModules);
            const getFromPrivateInjector = annotate(function (key) {
                return privateInjector.get(key);
            });

            moduleExports.forEach(function (key) {
                providers[key] = [getFromPrivateInjector, key, 'private', privateInjector];
            });

            // ensure child injector initializes
            const initializers = (moduleDefinition.__init__ || []).slice();

            initializers.unshift(function () {
                privateInjector.init();
            });

            moduleDefinition = Object.assign({}, moduleDefinition, {
                __init__: initializers
            });

            return createInitializer(moduleDefinition, privateInjector);
        }

        // normal module
        Object.keys(moduleDefinition).forEach(function (key) {
            if (key === '__init__' || key === '__depends__') {
                return;
            }

            const typeDeclaration = (moduleDefinition[key]);

            if (typeDeclaration[2] === 'private') {
                providers[key] = typeDeclaration;
                return;
            }

            const type = typeDeclaration[0];
            const value = typeDeclaration[1];

            providers[key] = [factoryMap[type], arrayUnwrap(type, value), type];
        });

        return createInitializer(moduleDefinition, self);
    }

    /**
     * @param {ModuleDefinition[]} moduleDefinitions
     * @param {ModuleDefinition} moduleDefinition
     *
     * @return {ModuleDefinition[]}
     */
    function resolveDependencies(moduleDefinitions, moduleDefinition) {
        if (moduleDefinitions.indexOf(moduleDefinition) !== -1) { // 已经解析了-> 模块定义中包含此模块
            return moduleDefinitions;
        }
        // 解析此模块的依赖模块，递归解析
        moduleDefinitions = (moduleDefinition.__depends__ || []).reduce(resolveDependencies, moduleDefinitions);

        if (moduleDefinitions.indexOf(moduleDefinition) !== -1) {// 模块定义中包含此模块
            return moduleDefinitions;
        }
        // let a = [];let b = a.concat(1); --> a = [],b = [1] concat 基于原数组创建一个新数组，然后将参数push到数组中
        return moduleDefinitions.concat(moduleDefinition);
    }

    /**
     * @param {ModuleDefinition[]} moduleDefinitions
     *
     * @return { () => void } initializerFn
     */
    function bootstrap(moduleDefinitions) {
        const initializers = moduleDefinitions
            .reduce(resolveDependencies, [])
            .map(loadModule);

        let initialized = false;

        return function () {
            if (initialized) {
                return;
            }
            initialized = true;
            initializers.forEach(initializer => initializer());
        };
    }

    // public API
    this.get = get;
    this.invoke = invoke;
    this.instantiate = instantiate;
    this.createChild = createChild;

    // setup
    this.init = bootstrap(modules);
}

// helpers ///////////////
function arrayUnwrap(type, value) {
    if (type !== 'value' && isArray(value)) {
        value = annotate(value.slice());
    }
    return value;
}

// export {Injector, annotate, parseAnnotations};
//# sourceMappingURL=index.js.map
