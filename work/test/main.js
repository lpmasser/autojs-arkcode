auto.waitFor;
let currentEngine = engines.myEngine()
let runningEngines = engines.all()
let currentSource = currentEngine.getSource() + ''
if (runningEngines.length > 1) {
    runningEngines.forEach(compareEngine => {
        let compareSource = compareEngine.getSource() + ''
        if (currentEngine.id !== compareEngine.id && compareSource === currentSource) {
            // 强制关闭同名的脚本
            compareEngine.forceStop()
        }
    })
}

sleep(1000)

if (!images.requestScreenCapture(false)) {
    toast('请求截图失败');
    exit();
}
let i = 1

// console.show();

// setInterval(() => {
//     var img_raw = images.captureScreen();
//     // var img = images.resize(img_raw, [1600, 900])
//     // images.save(img, "/sdcard/Pictures/img.png", "png", 100);

//     var auto_img = images.clip(img_raw, 1405, 65, 75, 45);
//     // var auto_img = images.clip(img, 1445, 65, 100, 45); // 战斗计数
//     // var auto_img = images.clip(img, 90, 80, 170, 60);
//     // images.save(auto_clip, "/sdcard/Pictures/clip.png", "png", 100);
//     // var auto_img = images.inRange(auto_clip, '#74808b', '#ffffff')
//     images.save(auto_img, "/sdcard/Pictures/auto.png", "png", 100);

//     var auto_txt = paddle.ocrText(auto_img);
//     toastLog(auto_txt);

// }, 3000);

const ocrInRegion_capture = (x, y, width, height, color_in, range_in) => {
    let color = color_in || false;
    let range = range_in || ['', ''];
    let img_color = null;
    let img_raw = captureScreen();
    let img_clip = images.clip(img_raw, x, y, width, height);
    if (color) {
        img_color = images.inRange(img_clip, range[0], range[1]);
        log('二值化完成');
    }
    let img_result = img_color || img_clip;
    // images.save(img_result, '/sdcard/Arkcode/' + i + '.png', "png", 100);
    let txt = paddle.ocrText(img_result);
    i++;
    // log(txt);
    return txt;
};

let txt = ocrInRegion_capture(855, 200, 105, 60, true, ['#000000', '#b7bbbe'])
log(txt);


// 识别结果和截图信息
// let result = []
// let img = null
// let running = true
// let capturing = true

// /**
//  * 截图并识别OCR文本信息
//  */
// function captureAndOcr() {
//   capturing = true
//   img && img.recycle()
//   img = captureScreen()
//   if (!img) {
//     toastLog('截图失败')
//   }
//   let start = new Date()
//   result = paddle.ocr(img);
//   log(result);
//   toastLog('耗时' + (new Date() - start) + 'ms')
//   capturing = false
// }

// captureAndOcr()
