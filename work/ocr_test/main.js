
if (!images.requestScreenCapture()) {
    toast('请求截图失败');
    exit();
}
console.show();
setInterval(() => {
    var img = images.captureScreen();
    var auto_info = images.clip(img, 1230, 65, 450, 45);
    var auto_txt = paddle.ocr(img);
    toastLog(auto_txt);
}, 2000);
