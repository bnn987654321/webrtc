
var gCtx = null;
var gCanvas = null;
var c = 0;
var stype = 0;
var gUM = false;
var webkit = false;
var moz = false;
var v = null;

var imghtml = '';

var vidhtml = '<video id="v" autoplay></video>';

function initCanvas(w, h) {
    gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
}


function captureToCanvas() {
    if (stype !== 1)
        return;
    if (gUM) {
        try {
            gCtx.drawImage(v, 0, 0);
            try {
                qrcode.decode();
            }
            catch (e) {
                console.log(e);
                setTimeout(captureToCanvas, 500);
            };
        }
        catch (e) {
            console.log(e);
            setTimeout(captureToCanvas, 500);
        };
    }
}

function read(a) {
    //判斷前3碼是否符合，若是才跳轉
    if (a.indexOf("id=") === 0) {
        window.location = 'http://gbim.res.com.tw/BIMHub/QRCode/ScanResult?' + a;
    }
    else {
        var html = "掃描結果不符合系統分析，請重新掃描";
        html += "<div class=\"btn btn-warning\" style=\"margin:10px;font-size:large;\" onclick=\"load();\">重新掃描</div>";
        document.getElementById("result").innerHTML = html;
    }
}
//判斷是否支援canvas
function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}
//成功則設定讀取間隔
function success(stream) {
    v.srcObject = stream;
    v.play();
    gUM = true;
    setTimeout(captureToCanvas, 100);
}

function geterror(error) {
    gUM = false;
    return;
}
function error(error) {
    gUM = false;
    return;
}
function aa(){
	alert('go');
}
//網頁載入觸發點
function load() {
    if (isCanvasSupported()) {
        initCanvas(800, 600);
        qrcode.callback = read;
        document.getElementById("mainbody").style.display = "inline";
        setwebcam();
    }
    else {
        document.getElementById("mainbody").style.display = "inline";
        document.getElementById("mainbody").innerHTML = '<p id="mp1">請使用支援之瀏覽器</p><br>' +
            '<br><p id="mp2">抱歉，請使用支援WebRtc之瀏覽器</p><br><br>' +
            '<p id="mp1">例如Chrome or FireFox</p>';
    }
}

function setwebcam() {

    var options = true;
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
		try {
            navigator.mediaDevices.enumerateDevices()
                .then(function (devices) {
                    //先偵測相機
                    devices.forEach(function (device) {
                        if (device.kind === 'videoinput') {
                            //console.log(device.label);
                            //console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
                            if (device.label.toLowerCase().search("back") > -1)
                                options = { 'deviceId': { 'exact': device.deviceId }, 'facingMode': 'environment' };
                        }
                        //console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
                    });
                    //再進入設定
                    setwebcam2(options);
                });
        }
        catch (e) {
            console.log(e);
        }
    }
    else {
        alert('抱歉，找不到相機裝置，請使用支援WebRtc之瀏覽器');
        console.log("no navigator.mediaDevices.enumerateDevices");
        setwebcam2(options);
    }

}

function setwebcam2(options) {
    console.log('setwebcam2');
    console.log(options);
    document.getElementById("result").innerHTML = "- scanning -";
    if (stype === 1) {
        setTimeout(captureToCanvas, 500);
        return;
    }
    var n = navigator;
    document.getElementById("outdiv").innerHTML = vidhtml;
    v = document.getElementById("v");

    console.log(n);
    if (n.mediaDevices.getUserMedia) {
        n.mediaDevices.getUserMedia({ video: options, audio: false }).
            then(function (stream) {
                success(stream);
            }).catch(function (error) {
                //alert(error);
                geterror(error);
                //error(error);
            });
    }
    else
        if (n.getUserMedia) {
            webkit = true;
            n.getUserMedia({ video: options, audio: false }, success, error);
        }
        else
            if (n.webkitGetUserMedia) {
                webkit = true;
                n.webkitGetUserMedia({ video: options, audio: false }, success, error);
            }


    stype = 1;
    setTimeout(captureToCanvas, 500);
}