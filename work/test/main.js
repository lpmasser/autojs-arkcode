
if (!images.requestScreenCapture(false)) {
    toast('请求截图失败');
    exit();
}
// console.show();

setInterval(() => {
    var img_raw = images.captureScreen();
    // var img = images.resize(img_raw, [1600, 900])
    // images.save(img, "/sdcard/Pictures/img.png", "png", 100);

    var auto_img = images.clip(img_raw, 1405, 65, 75, 45);
    // var auto_img = images.clip(img, 1445, 65, 100, 45); // 战斗计数
    // var auto_img = images.clip(img, 90, 80, 170, 60);
    // images.save(auto_clip, "/sdcard/Pictures/clip.png", "png", 100);
    // var auto_img = images.inRange(auto_clip, '#74808b', '#ffffff')
    images.save(auto_img, "/sdcard/Pictures/auto.png", "png", 100);

    var auto_txt = paddle.ocrText(auto_img);
    toastLog(auto_txt);

}, 3000);
