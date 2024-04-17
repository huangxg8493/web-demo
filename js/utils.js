const utils = {
    // 工具方法：获取鼠标在画布上的position
    getMousePositionInCanvas: (event, canvasEle) => {
        // 移动事件对象，从中解构clientX和clientY
        let {clientX, clientY} = event;
        // 解构canvas的boundingClientRect中的left和top
        let {left, top} = canvasEle.getBoundingClientRect();
        // 计算得到鼠标在canvas上的坐标
        return {
            x: clientX - left,
            y: clientY - top
        };
    },
    // 工具方法：检查点point是否在矩形内
    isPointInRect: (rect, point) => {
        let {x: rectX, y: rectY, width, height} = rect;
        let {x: pX, y: pY} = point;
        return (rectX <= pX && pX <= rectX + width) && (rectY <= pY && pY <= rectY + height);
    },

}