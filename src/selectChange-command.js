import { isWebviewPresent, sendToWebview } from 'sketch-module-web-view/remote'
import * as utils from './lib/utils'
import sketch from 'sketch'

export function onSelectionChanged(params, ...args) {
    if (isWebviewPresent('frontGenerator')) {
        var layers = params.actionContext.document.selectedLayers().layers();
        utils.setContext(params.actionContext);
        if (layers.count()) {
            var layer = layers[0];
            var layerData = utils.layerToJSON(layer);
            log(layerData);
            
            sendToWebview('frontGenerator', 'FG.handleChange('+ JSON.stringify(layerData) +')');
        }
    }
}