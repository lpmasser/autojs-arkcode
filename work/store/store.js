auto.waitFor();
if (!images.requestScreenCapture(false)) {
    toast('请求截图失败');
    exit();
};

const store_sign = images.read('/sdcard/Arkcode/store_check.png');
const loading_sign = images.read('/sdcard/Arkcode/loading_sign.png');
const Name_t = ['强化芯片', '招募'];
const State_t = ['武器', '头盔', '铠甲', '项链', '戒指', '鞋子', '契约'];
const y = [260, 490, 720, 950];
let i = 1;
let n = 0;
let img_G = null;
let img_capture = null;

const errorPage = () => {
    captureScreen("/sdcard/Arkcode/error.png");
    toastLog('运行错误');
    exit();
};

const ocrInRegion = (img, x, y, width, height, color_in, range_in) => {
    let color = color_in || false;
    let range = range_in || ['', ''];
    let img_clip = images.clip(img, x, y, width, height);
    if (color) {
        img_color = images.inRange(img_clip, range[0], range[1]);
    }
    // images.save(img_clip, '/sdcard/Arkcode/' + i + '.png', "png", 100);
    let txt = paddle.ocrText(img_clip);
    i++;
    // toast(txt);
    return txt;
};

const ocrInRegion_G = (x, y, width, height, color_in, range_in) => {
    let color = color_in || false;
    let range = range_in || ['', ''];
    let img_clip = images.clip(img_G, x, y, width, height);
    if (color) {
        img_color = images.inRange(img_clip, range[0], range[1]);
    }
    let txt = paddle.ocrText(img_clip);
    if (!txt) {
        images.save(img_clip, '/sdcard/Arkcode/' + i + '.png', "png", 100);
    }
    i++;
    // toast(txt);
    return txt;
};

const ocrInRegion_capture = (x, y, width, height, color_in, range_in) => {
    let color = color_in || false;
    let range = range_in || ['', ''];
    let img_color = null;
    img_capture && img_capture.recycle();
    img_capture = captureScreen();
    let img_clip = images.clip(img_capture, x, y, width, height);
    if (color) {
        img_color = images.inRange(img_clip, range[0], range[1]);
    }
    let img_result = img_color || img_clip;
    let txt = paddle.ocrText(img_result);
    if (!txt) {
        images.save(img_clip, '/sdcard/Arkcode/' + i + '.png', "png", 100);
    }
    i++;
    // log(txt);
    return txt;
};

const waitLoading = () =>{
    let loading_check = true;
    while (loading_check) {
        sleep(500);
        let img = captureScreen();
        if (!images.findImageInRegion(img, loading_sign, 680, 505, 25, 70, 0.95)){
            return;
        }
        log('loading...');
    }
}

// 秘密商店标志
const store_check = () => {
    let img = captureScreen();
    let position = images.findImageInRegion(img, store_sign, 1750, 700, 150, 120, 0.95);
    if (position) {
        return true;
    }
    return false;
};

const ocr_store_up = () => {
    let statement = new Array;
    let name = new Array;
    let judge = [false, false, false, false];
    statement[0] = ocrInRegion_G(972, 198, 75, 45);
    statement[1] = ocrInRegion_G(956, 428, 75, 45);
    statement[2] = ocrInRegion_G(940, 658, 75, 45);
    statement[3] = ocrInRegion_G(925, 888, 75, 45);
    name[0] = ocrInRegion_G(914, 123, 140, 40);
    name[1] = ocrInRegion_G(898, 353, 140, 40);
    name[2] = ocrInRegion_G(880, 583, 140, 40);
    name[3] = ocrInRegion_G(865, 813, 140, 40);
    for (let i = 0; i < statement.length; i++) {
        let s = statement[i].toString();
        let n = name[i].toString();
        if (!s && !n) {
            images.save(img_G, '/sdcard/Arkcode/null.png', "png", 100);
            toastLog('ocr识别错误');
            log([statement, name]);
            exit();
        }
        if (State_t.includes(s) || Name_t.includes(n)) {
            judge[i] = true;
        }
    }
    // log(statement);
    // log(name);
    return [judge, statement, name];
};

const ocr_store_down = () => {
    let statement = new Array;
    let name = new Array;
    let judge = [false, false];
    statement[0] = ocrInRegion_G(937, 698, 75, 45);
    statement[1] = ocrInRegion_G(922, 928, 75, 45);
    name[0] = ocrInRegion_G(880, 623, 140, 40);
    name[1] = ocrInRegion_G(865, 853, 140, 40);
    for (let i = 0; i < statement.length; i++) {
        let s = statement[i].toString();
        let n = name[i].toString();
        if (State_t.includes(s) || Name_t.includes(n)) {
            judge[i] = true;
        }
    }
    // log(statement);
    // log(name);
    return [judge, statement, name];
};

const refreshStore = () => {
    n = 0;
    toast('刷新');
    click(220, 980);
    let refreshpage = false;
    while (!refreshpage) {
        sleep(500);
        if (ocrInRegion_capture(840, 380, 80, 50) == '刷新') {
            refreshpage = true;
        }
        n++;
        if (n > 5) {
            errorPage();
        }
        sleep(500);
    }
    log('刷新商店');
    click(1150, 650);
    waitLoading();
    return;
}

const Buy = (name) => {
    n = 0;
    let buypage = false;
    let getpage = false;
    while (!buypage) {
        sleep(500);
        if (ocrInRegion_capture(570, 275, 90, 50) == '购买') {
            buypage = true;
        }
        if (n > 5) {
            errorPage();
        }
        n++;
        sleep(500);
    }
    toast("点击购买")
    click(1100, 750);
    while (!getpage) {
        sleep(500);
        if (ocrInRegion_capture(855, 200, 105, 60, true, ['#000000', '#b7bbbe']) == '获得') {
            getpage = true;
        }
        n++;
        if (n > 10) {
            errorPage();
        }
        sleep(500);
    }
    toastLog("获得：" + name);
    click(10, 1070);
    return;
};
let appcheck = false;
while (!appcheck) {
    sleep(500);
    if (currentPackage() == 'com.nerversoft.ark.recode') {
        toastLog('com.nerversoft.ark.recode');
        appcheck = true;
    }
};

let pagecheck = false;
while (!pagecheck) {
    sleep(500);
    if (store_check()) {
        toastLog('秘密商店');
        pagecheck = true;
    }
};

while (true) {
    swipe(1100, 300, 1100, 600, 1000);
    sleep(500);
    img_G = captureScreen();
    let judge_up = ocr_store_up();
    log(judge_up);
    for (let i = 0; i < judge_up[0].length; i++) {
        if (judge_up[0][i]) {
            click(1400, y[i]);
            Buy(judge_up[1][i].toString() + judge_up[2][i].toString());
            sleep(500);
        }
    }
    log('滑动');
    swipe(1100, 800, 1100, 200, 1000);
    sleep(500);
    img_G.recycle()
    img_G = captureScreen();
    let judge_down = ocr_store_down();
    log(judge_down);
    for (let i = 0; i < judge_down[0].length; i++) {
        if (judge_down[0][i]) {
            i = i + 2;
            click(1400, y[i]);
            Buy(judge_down[1][i].toString() + judge_down[2][i].toString());
            sleep(500);
        }
    }
    sleep(2000);
    img_G.recycle()
    log('刷新');
    refreshStore();
}



