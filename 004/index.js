let selectedType = {
    line: false,
    rect: false,
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    buttons: null,
}
let line = {
    startx: 0,
    starty: 0,
    endx: 0,
    endy: 0,
    color: "#a3a3a3",
    arrowcolor: "#000000",
}

let rect = {
    x: 10,
    y: 10,
    width: 80,
    height: 60,
    selected: false,
    // hover效果
    hover: false,
};

let canvasEle = document.querySelector('#canvasId');
let ctx = canvasEle.getContext('2d')

canvasEle.addEventListener('mousedown', event => {
    let altKey = event.altKey // true or false
    let ctrlKey = event.ctrlKey// true or false
    let shiftKey = event.shiftKey // true or false
    let buttons = event.buttons// 1 left 2 right
    let {x, y} = utils.getMousePositionInCanvas(event, canvasEle);
    let bool = utils.isPointInRect(rect, {x, y});
    selectedType = {line: false, rect: false, altKey: false, ctrlKey: false, shiftKey: false, buttons: null}
    if (bool === true) {
        selectedType.rect = true
    } else {
        line.startx = x
        line.starty = y
        line.endx = x
        line.endy = y
        selectedType.line = true
    }
    selectedType.altKey = altKey
    selectedType.ctrlKey = ctrlKey
    selectedType.shiftKey = shiftKey
    selectedType.buttons = buttons
});

let mousePosition = null;
canvasEle.addEventListener('mousemove', event => {
    if (selectedType.line === true) {
        mousePosition = utils.getMousePositionInCanvas(event, canvasEle);// 更新当前鼠标位置
        line.endx = mousePosition.x
        line.endy = mousePosition.y
    }

    if (selectedType.rect === true) {
        let lastMousePosition = mousePosition;
        mousePosition = utils.getMousePositionInCanvas(event, canvasEle);
        rect.hover = utils.isPointInRect(rect, mousePosition);
        let buttons = event.buttons;
        if (!(buttons === 1 && selectedType.rect === true)) {// 判断是否鼠标左键点击且有矩形被选中,不满足则不处理
            return;
        }
        let offset = {};
        if (lastMousePosition === null) {// 首次记录，偏移dx和dy为0
            offset = {dx: 0, dy: 0};
        } else {// 曾经已经记录了位置，则偏移则为当前位置和上一次位置做向量差
            offset = {dx: mousePosition.x - lastMousePosition.x, dy: mousePosition.y - lastMousePosition.y};
        }
        rect.x = rect.x + offset.dx;
        rect.y = rect.y + offset.dy;
    }
    console.log(JSON.stringify(rect))
    console.log(JSON.stringify(line))
});

canvasEle.addEventListener('mouseup', () => {
    if (selectedType.line === true) {
        selectedType.line = false
    }
    if (selectedType.rect === true) {
        selectedType.rect = false
        rect.hover = false
    }
});

/**
 * 绘制带有箭头的直线
 * @param cavParam canvas画布变量
 * @param fromX/fromY 起点坐标
 * @param toX/toY 终点坐标
 * @param color 线与箭头颜色
 **/
function drawLineArrow(ctx, fromX, fromY, toX, toY, color) {
    if (fromX <= 0 && fromY <= 0) return
    if (fromX === toX && fromY === toY) return
    var headlen = 10;//自定义箭头线的长度
    var theta = 45;//自定义箭头线与直线的夹角
    var arrowX, arrowY;//箭头线终点坐标
    // 计算各角度和对应的箭头终点坐标
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI;
    var angle1 = (angle + theta) * Math.PI / 180;
    var angle2 = (angle - theta) * Math.PI / 180;
    var topX = headlen * Math.cos(angle1);
    var topY = headlen * Math.sin(angle1);
    var botX = headlen * Math.cos(angle2);
    var botY = headlen * Math.sin(angle2);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);

    arrowX = toX + topX;
    arrowY = toY + topY;
    ctx.moveTo(arrowX, arrowY);//画上边箭头线
    ctx.lineTo(toX, toY);

    arrowX = toX + botX;
    arrowY = toY + botY;

    ctx.lineTo(arrowX, arrowY);//画下边箭头线
    ctx.closePath()

    ctx.strokeStyle = color;
    ctx.stroke();
}

(function doRender() {
    requestAnimationFrame(() => {
        (function render() {
            ctx.clearRect(0, 0, canvasEle.width, canvasEle.height);// 先清空画布
            ctx.save();// 暂存当前ctx的状态

            // 被点击选中：正红色，指针为 'move'
            // 悬浮：带50%透明的正红色，指针为 'pointer'
            // 普通下为黑色，指针为 'default'
            if (selectedType.rect) {
                ctx.strokeStyle = '#FF0000';
                canvasEle.style.cursor = 'move';
            } else if (rect.hover) {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                canvasEle.style.cursor = 'pointer';
            } else {
                ctx.strokeStyle = '#000';
                canvasEle.style.cursor = 'default';
            }

            ctx.strokeRect(rect.x - 0.5, rect.y - 0.5, rect.width, rect.height);// 矩形所在位置画一个黑色框的矩形
            drawLineArrow(ctx, line.startx, line.starty, line.endx, line.endy, line.color)// 画箭头直线

            ctx.restore();// 恢复ctx的状态
        })();
        doRender();
    });
})();