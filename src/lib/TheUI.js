import WebUI from 'sketch-module-web-view';
import { exclamations } from './Constants';
import * as utils from './utils';

function hexToNSColor(hex) {
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const a = 1;

    return NSColor.colorWithRed_green_blue_alpha(r, g, b, a);
}

function showUpdatedMessage(count, data) {
    const layerStr = count === 1 ? 'Layer' : 'Layers';
    data.doc.showMessage(
        `${exclamations[Math.floor(Math.random() * exlamations.length)]} ${count} ${layerStr}`
    );
}

export default function theUI(context, data, options) {
    const webUI = new WebUI(context, require('../../resources/webview.html'), {
        identifier: options.identifier,
        x: 0,
        y: 0,
        width: options.width,
        height: options.height,
        title: options.title,
        blurredBackground: false,
        background: hexToNSColor('f7f7f7'),
        onlyShowCloseButton: true,
        hideTitleBar: false,
        shouldKeepAround: true,
        resizable: true,
        frameLoadDelegate: { // https://developer.apple.com/reference/webkit/webframeloaddelegate?language=objc
            'webView:didFinishLoadForFrame:': function (webView, webFrame) {
              // context.document.showMessage('frontGenerator: UI loaded!')
              let initScript = `console.log(FG)`;
              webUI.eval(initScript);
            }
        },
        handlers: {
            close: () => {
                log('close');
                webUI.close();
            },
            onLog: (str) => {
                context.document.showMessage(str)
            },
            exportFile: (str) => {
                log('fafdsa');
                var treeObj = JSON.parse(str);
                log(treeObj);
                utils.exportFile(treeObj);
            }
        }
    });
}