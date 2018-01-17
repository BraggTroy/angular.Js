;function resize() {
    var colCount = 20,
        colSize = document.documentElement.clientWidth / colCount;
    document.documentElement.style.fontSize = colSize + "px";
}
resize();
window.addEventListener('resize', resize);