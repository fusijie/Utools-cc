/*
 * @Author: JackyFu 
 * @Date: 2019-05-14 11:18:54 
 * @Last Modified by: JackyFu
 * @Last Modified time: 2019-05-14 13:10:55
 */

const child_process = require("child_process");
const fs = require("fs");

let projectName = "";

window.exec = function (command, callback) {
    child_process.exec(command, (err, stdout, stderr) => {
        if (err) {
            callback(stderr);
            return;
        }
        callback(stdout);
    })
}

//每当插件从后台进入到前台时，uTools将会主动调用这个方法。
utools.onPluginEnter(({
    code,
    type,
    payload
}) => {
    // console.log('用户进入插件', code, type, payload);
    utools.setSubInput((data) => {
        projectName = data.text;
    }, "请输入 Cocos Creator 项目名字");
});

//监听回车
document.onkeydown = function (e) {
    var keyCode = window.event ? e.keyCode : e.which
    if (keyCode == 13) {
        if (projectName === "") {
            return;
        }
        let projectPath = utools.getPath("home") + `/Project/${projectName}`;
        if (!fs.existsSync(projectPath)) {
            utools.showNotification(`项目 ${projectName} 不存在`);
            return;
        }
        window.exec(`/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path ${projectPath} --nologin`);
        utools.outPlugin();
        utools.hideMainWindow();
    }
}

//No use for now.

//当插件装载成功， uTools将会主动调用这个方法（ 生命周期内仅调用一次）。
//注意： 在此方法未被执行前， 无法调用其他方法。
utools.onPluginReady(() => {
    console.log('插件初始化完成');
});

//每当插件从前台进入到后台时，uTools将会主动调用这个方法。
utools.onPluginOut(() => {
    console.log('用户退出插件');
});

//用户对插件进行分离操作时，uTools将会主动调用这个方法。
utools.onPluginDetach(() => {
    console.log('插件被分离');
});

//当此插件的数据在其他设备上被更改后同步到此设备时，uTools将会主动调用这个方法（必须在插件可视的情况下才会触发）
utools.onDbPull(() => {
    console.log('onDbPull');
});