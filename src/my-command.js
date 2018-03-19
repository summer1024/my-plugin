import {parseData, setContext} from './lib/utils';
import theUI from './lib/TheUI';

export default function (context) {
    setContext(context);
    const data = parseData(context);

    // if (data.selectionCount <= 0) {
    //     context.document.showMessage("frontGenerator: You need to select at least one layer or artboard")
    //     return;
    // }

    const options = {
        identifier: 'frontGenerator',
        title: 'frontGenerator Panel',
        redirectTo: '',
        width: 502,
        height: 400
    };

    theUI(context, data, options);
}

export function onSelectionChanged(context) {
    log(context)
};