auto.waitFor();
if (!images.requestScreenCapture(false)) {
    toast('请求截图失败');
    exit();
};

const store_sign = images.read('/sdcard/Arkcode/store_check.png');
const Name_t = ['强化芯片', '招募'];
const State_t = ['武器', '头盔', '铠甲', '项链', '戒指', '鞋子', '契约'];
const y = [260, 490, 720, 950];
let i = 1;
let n = 0;

const errorPage = () => {
    captureScreen("/sdcard/Arkcode/error.png");
    toastLog('运行错误');
    exit;
};

const ocrInRegion = (img, x, y, width, height) => {
    let img = images.clip(img, x, y, width, height);
    // images.save(img, '/sdcard/Arkcode/' + i + '.png', "png", 100);
    let txt = paddle.ocrText(img);
    i++;
    // toast(txt);
    img.recycle()
    return txt;
};

const ocrInRegion_capture = (x, y, width, height, color, range) => {
    let color = color || false;
    let range = range || ['', ''];
    let img_raw = captureScreen();
    let img = images.clip(img_raw, x, y, width, height);
    if (color) {
        let img = images.inRange(img, range[0], range[1]);
    }
    // images.save(img, '/sdcard/Arkcode/' + i + '.png', "png", 100);
    let txt = paddle.ocrText(img);
    i++;
    // log(txt);
    img.recycle()
    return txt;
};

// 秘密商店标志
const store_check = () => {
    let img = captureScreen();
    let position = images.findImageInRegion(img, store_sign, 1600, 700, 300, 120, 0.95);
    if (position) {
        img.recycle()
        return true;
    }
    img.recycle()
    return false;
};

const ocr_store_up = () => {
    let img = captureScreen();
    let statement = new Array;
    let name = new Array;
    let judge = [false, false, false, false];
    statement[0] = ocrInRegion(img, 972, 198, 75, 45);
    statement[1] = ocrInRegion(img, 956, 428, 75, 45);
    statement[2] = ocrInRegion(img, 940, 658, 75, 45);
    statement[3] = ocrInRegion(img, 925, 888, 75, 45);
    name[0] = ocrInRegion(img, 914, 123, 135, 40);
    name[1] = ocrInRegion(img, 898, 353, 135, 40);
    name[2] = ocrInRegion(img, 880, 583, 135, 40);
    name[3] = ocrInRegion(img, 865, 813, 135, 40);
    for (let i = 0; i < statement.length; i++) {
        let s = statement[i].toString();
        let n = name[i].toString();
        if (State_t.includes(s) || Name_t.includes(n)) {
            judge[i] = true;
        }
    }
    // log(statement);
    // log(name);
    img.recycle()
    return [judge, statement, name];
};

const ocr_store_down = () => {
    let img = captureScreen();
    let statement = new Array;
    let name = new Array;
    let judge = [false, false];
    statement[0] = ocrInRegion(img, 937, 698, 75, 45);
    statement[1] = ocrInRegion(img, 922, 928, 75, 45);
    name[0] = ocrInRegion(img, 880, 623, 135, 40);
    name[1] = ocrInRegion(img, 865, 853, 135, 40);
    for (let i = 0; i < statement.length; i++) {
        let s = statement[i].toString();
        let n = name[i].toString();
        if (State_t.includes(s) || Name_t.includes(n)) {
            judge[i] = true;
        }
    }
    // log(statement);
    // log(name);
    img.recycle()
    return [judge, statement, name];
};

const refreshStore = () => {
    n = 0;
    toast('刷新');
    click(220, 980);
    let refreshpage = false;
    while (!refreshpage) {
        if (ocrInRegion_capture(840, 380, 80, 50) == '刷新') {
            refreshpage = true;
        }
        n++;
        if (n > 5) {
            errorPage();
        }

        sleep(1000);
    }
    toastLog('刷新商店');
    click(1150, 650);
    return;
}

const Buy = (name) => {
    n = 0;
    let buypage = false;
    let getpage = false;
    while (!buypage) {
        if (ocrInRegion_capture(570, 275, 90, 50) == '购买') {
            buypage = true;
        }

        if (n > 5) {
            errorPage();
        }

        sleep(1000);
        n++;
    }
    toast("点击购买")
    click(1100, 750);
    while (!getpage) {
        if (ocrInRegion_capture(855, 200, 105, 60, true, ['#000000', '#b7bbbe']) == '获得') {
            getpage = true;
        }
        n++;
        if (n > 10) {
            errorPage();
        }
        sleep(1000);
    }
    toastLog("获得：" + name);
    click(10, 1070);
    return;
};
let appcheck = false;
while (!appcheck) {
    if(currentPackage() == 'com.nerversoft.ark.recode'){
        toastLog('com.nerversoft.ark.recode');
        appcheck = true;
    }
    sleep(500);
};

let pagecheck = false;
while (!pagecheck) {
    if(store_check()){
        toastLog('秘密商店');
        pagecheck = true;
    }
    sleep(500);
};

while (true) {

    swipe(1100, 200, 1100, 800, 1000);
    sleep(1000);
    let judge_up = ocr_store_up();
    log(judge_up);
    for (let i = 0; i < judge_up[0].length; i++) {
        if (judge_up[0][i]) {
            click(1400, y[i]);
            Buy(judge_up[1][i] + judge_up[2][i]);
            sleep(500);
        }
    }
    log('滑动');
    swipe(1100, 800, 1100, 200, 1000);
    sleep(1000);
    let judge_down = ocr_store_down();
    log(judge_down);
    for (let i = 0; i < judge_down[0].length; i++) {
        if (judge_down[0][i]) {
            i = i + 2;
            click(1400, y[i]);
            Buy(judge_down[1][i] + judge_down[2][i]);
            sleep(500);
        }
    }
    sleep(3000);
    log('刷新');
    refreshStore();
}



