let lineCtx = {
    ctx: null,
    startx: 300,
    starty: 200,
    endx: 100,
    endy: 100,
    color: "#a3a3a3",
    arrowcolor: "#000000",
    mousedown: false
}
let mousePosition = null;// 记录每一次移动的位置
window.onload = function () {
    canvasEle = document.getElementById("canvasId");
    ctx = canvasEle.getContext('2d');
    lineCtx.ctx = ctx
    drawLineArrow(ctx, 300, 200, 100, 100, "#a3a3a3");

    canvasEle.addEventListener('mousedown', event => {
        // 获取鼠标按下时位置
        let {x, y} = utils.getMousePositionInCanvas(event, canvasEle);
        lineCtx.startx = x
        lineCtx.starty = y
        lineCtx.mousedown = true
    });

    canvasEle.addEventListener('mousemove', event => {
        if (lineCtx.mousedown === false) {
            return
        }
        mousePosition = utils.getMousePositionInCanvas(event, canvasEle);// 更新当前鼠标位置

        lineCtx.ctx.clearRect(0, 0, 400, 400)

        lineCtx.endx = mousePosition.x
        lineCtx.endy = mousePosition.y
        drawLineArrow(lineCtx.ctx, lineCtx.startx, lineCtx.starty, lineCtx.endx, lineCtx.endy, lineCtx.color)
    });

    canvasEle.addEventListener('mouseup', () => {
        lineCtx.mousedown = false
    });
}

/**
 * 绘制带有箭头的直线
 * @param cavParam canvas画布变量
 * @param fromX/fromY 起点坐标
 * @param toX/toY 终点坐标
 * @param color 线与箭头颜色
 **/
function drawLineArrow(ctx, fromX, fromY, toX, toY, color) {
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
    //画直线
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);

    arrowX = toX + topX;
    arrowY = toY + topY;
    //画上边箭头线
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(toX, toY);

    arrowX = toX + botX;
    arrowY = toY + botY;
    //画下边箭头线
    ctx.lineTo(arrowX, arrowY);
    ctx.closePath()

    ctx.strokeStyle = color;
    ctx.stroke();
}
