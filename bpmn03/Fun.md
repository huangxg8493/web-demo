##1.详解 JS 中 new 调用函数原理
JavaScript 中经常使用构造函数创建对象（通过 new 操作符调用一个函数），那在使用 new 调用一个函数的时候到底发生了什么？先看几个例子，再解释背后发生了什么。
###1.1 看三个例子
+ 无 return 语句

构造函数最后没有 return 语句，这也是使用构造函数时默认情况，最后会返回一个新对象，如下：
```js
function Foo(age) {
  this.age = age;
}

var o = new Foo(111);
console.log(o);
```
这是常见的使用构造函数创建对象的过程，打印出来的是 {age: 111}。

+ return 对象类型数据

构造函数最后 return 对象类型数据：
```js
function Foo(age) {
  this.age = age;

  return { type: "我是显式返回的" };
}

var o = new Foo(222);
console.log(o);
```
打印出来的是 {type: '我是显式返回的'}，也就是说，return 之前的工作都白做了，最后返回 return 后面的对象。

+ return 基本类型数据

那是不是只要构造函数体内最后有 return，返回都是 return 后面的数据呢？
我们看下返回基本类型数据的情况：
```js
function Foo(age) {
  this.age = age;

  return 1;
}

var o = new Foo(333);
console.log(o);
```
打印出来的是 {age: 333}，和没有 return 时效果一样。跟预期不一样，背后你原理看下面分析。

###1.2 背后原理
+ 非箭头函数的情况

当使用 new 操作符创建对象是，ES5 官方文档在 函数定义 一节中做了如下定义 13.2.2 [[Construct]]：
When the [[Construct]] internal method for a Function object F is called with a possibly empty list of arguments, the following steps are taken:
1. Let obj be a newly created native ECMAScript object.
2. Set all the internal methods of obj as specified in 8.12.
3. Set the [[Class]] internal property of obj to Object.
4. Set the [[Extensible]] internal property of obj to true.
5. Let proto be the value of calling the [[Get]] internal property of F with argument "prototype".
6. If Type(proto) is Object, set the [[Prototype]] internal property of obj to proto.
7. If Type(proto) is not Object, set the [[Prototype]] internal property of obj to the standard built-in Object prototype object as described in 15.2.4.
8. Let result be the result of calling the [[Call]] internal property of F, providing obj as the this value and providing the argument list passed into [[Construct]] as args.
9. If Type(result) is Object then return result.
10. Return obj.

看第 8、9 步：
8）调用函数 F，将其返回值赋给 result；其中，F 执行时的实参为传递给 [[Construct]]（即 F 本身） 的参数，F 内部 this 指向 obj；
9）如果 result 是 Object 类型，返回 result；
这也就解释了如果构造函数显式返回对象类型，则直接返回这个对象，而不是返回最开始创建的对象。
最后在看第 10 步：
10）如果 F 返回的不是对象类型（第 9 步不成立），则返回创建的对象 obj。
如果构造函数没有显式返回对象类型（显式返回基本数据类型或者直接不返回），则返回最开始创建的对象。

+ 箭头函数的情况

那如果构造函数是箭头函数怎么办？
箭头函数中没有 [[Construct]] 方法，不能使用 new 调用，会报错。
NOTICE：其中 [[Construct]] 就是指构造函数本身。
相关规范在 ES6 的官方文档 中有提，但自从 ES6 以来的官方文档巨难懂，在此不做表述。

*****************************************************************************************************