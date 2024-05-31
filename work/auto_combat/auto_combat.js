if (!images.requestScreenCapture(false)) {
    toast('请求截图失败');
    exit();
};
// console.show();

var instant = true;
var swithCount = 0;
var auto_skill_on = images.read('/sdcard/Arkcode/auto_skill_on.png');
var auto_panel_leave = images.read('/sdcard/Arkcode/auto_panel_leave.png');

// 错误处理
const errorPage = () => {
    captureScreen("/sdcard/Arkcode/error.png");
    toastLog('运行错误');
    clearInterval(instantCheck);
    exit;
}

// 区域ocr（越小越好）
const ocrInRegion = (img, x, y, width, height) => {
    var img = images.clip(img, x, y, width, height);
    var txt = paddle.ocrText(img);
    toast(txt);
    return txt;
};

//结算页面处理
const pageChange = (img) => {
    var point = images.findColorInRegion(img, '#ffe593', 1600, 910, 60, 30, 3);
    if (point) {
        toastLog('结算页面')
        var defeat = images.findColorInRegion(img, '#782c3a', 400, 1020, 200, 60, 3);
        var victory = images.findColorInRegion(img, '#03f3bf', 260, 930, 50, 50, 3);
        if (defeat) {
            toastLog('战斗失败, 点击重新运行');
            click(1670, 950);
            instant = true;
            return; 
        }
        if (victory) {
            toastLog('战斗胜利, 点击重新运行');
            click(1340, 950);
            instant = true;
            return;
        }
    }
    errorPage();
};

// 自动战斗标志检测
const combat_check = (img) => {
    var position = images.findImageInRegion(img, auto_skill_on, 1520, 920, 375, 140, 0.95);
    if (position) {
        return true;
    }
    return false;
};

// 托管战斗面板检测
const panel_check = (img) => {
    var position = images.findImageInRegion(img, auto_panel_leave, 1750, 140, 100, 100, 0.95);
    if (position) {
        return true;
    }
    return false;
};

var appcheck = false;
auto.waitFor();
while (!appcheck) {
    if(currentPackage() == 'com.nerversoft.ark.recode'){
        toastLog('com.nerversoft.ark.recode');
        appcheck = true;
    }

};

// 持续检测？自动战斗面板（两个特征：找图 + 文字计数：ocr）
// 持续检测？自动战斗详情 左下找图
// 结算页面检测：右下找色|战斗胜利，绿色、战斗失败：红色（找色：左下角） 
var instantCheck = setInterval(() => {
    if (!instant) {
        toastLog('不运行');
        return;
    }
    var img = images.captureScreen();
    var c = combat_check(img);
    var p = panel_check(img);
    if (!p && swithCount > 1) {
        instant = false;
        toastLog('非战斗面板消失' + instant);
        pageChange(img);
        return;
    }
    if (!c) {
        swithCount++;
        if (ocrInRegion(img, 1405, 65, 75, 45) == '结束') {
            instant = false;
            toastLog('检测到结束' + instant);
            pageChange(img);
            return;
        }
        if (swithCount == 4) {
            instant = false;
            toastLog('多次未检测到战斗' + instant);
            pageChange(img);
            return;
        }
        if (swithCount > 4) {
            errorPage();
            return
        }
    } else {
        swithCount = 0;
    }
    toast('战斗中 ' + swithCount);
}, 2000);

