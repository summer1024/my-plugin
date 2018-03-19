/**
 * @file
 * @author summerfly1024@gmail.com
 * @date 2018-03-08
 */
let BorderPositions = ["center", "inside", "outside"];
let FillTypes = ["color", "gradient"];
let GradientTypes = ["linear", "radial", "angular"];
let ShadowTypes = ["outer", "inner"];
let TextAligns = ["left", "right", "center", "justify", "left"];
let ResizingType = ["stretch", "corner", "resize", "float"];
let regexNames = /OVERLAY\#|WIDTH\#|HEIGHT\#|TOP\#|RIGHT\#|BOTTOM\#|LEFT\#|VERTICAL\#|HORIZONTAL\#|NOTE\#|PROPERTY\#|LITE\#/;
let context = null;
 // 判断是否为artboard
 function isArtboard(layer) {
     return layer instanceof MSArtboardGroup || layer instanceof MSSymbolMaster;
 }

 function layerObject(layer, idx) {
    const parentName = layer.parentGroup() == null ? "" : layer.parentGroup().name();
    return {
        layer,
        name: `${layer.name()}`,
        frame: layer.frame(),
        idx,
        width: layer.frame().width(),
        height: layer.frame().height(),
        parentName: `${parentName}`
    };
 }
 export function setContext(cur) {
    context = cur;
 }
 export function parseData(context, onlyArtboards = false) {
    let contextData = context.selection;

    if (onlyArtboards) {
        const aBoards = [];
        contextData.forEach((el) => {
            while (el && !isArtboard(el)) {
                el = el.parentGroup();
            }
            if (el) {
                aBoards.push(el);
            }
        });
        contextData = Array.from(new Set(aBoards));
    }
    const data = {
        doc: context.document,
        pageName: `${context.document.currentPage().name()}`,
        selectionCount: Array.isArray(contextData) ? contextData.length : contextData.count(),
        selection: []
    };
    contextData.forEach((layer, i) => {
        data.selection[i] = layerObject(layer, i);
    });
    return data;
 }

export function findReplaceData(context) {
    const data = parseData(context);
    const layers = data.doc.currentPage().children();
    data.allLayers = [];

    layers.forEach((layer, i) => {
        data.allLayers[i] = layerObject(layer, i);
    });

    return data;
}

export function is(layer, theClass) {
    if (!layer) {
        return false;
    }
    var kclass = layer.class();
    return kclass === theClass;
}
export function getRectObj(layer) {
    var rect = layer.absoluteRect();
    return {
        x: Math.round(rect.x()),
        y: Math.round(rect.y()),
        width: Math.round(rect.width()),
        height: Math.round(rect.height()),
        maxX: Math.round(rect.x() + rect.width()),
        maxY: Math.round(rect.y() + rect.height())
    }
}
export function getRect(layer) {
    var rect = layer.absoluteRect();
    return {
        x: Math.round(rect.x()),
        y: Math.round(rect.y()),
        width: Math.round(rect.width()),
        height: Math.round(rect.height()),
        maxX: Math.round(rect.x() + rect.width()),
        maxY: Math.round(rect.y() + rect.height()),
        setX: function (x) {
            rect.setX(x);
            this.x = x;
            this.maxX = this.x + this.width;
        },
        setY: function (y) {
            rect.setY(y);
            this.y = y;
            this.maxY = this.y + this.height;
        },
        setWidth: function (width) {
            rect.setWidth(width);
            this.width = width;
            this.maxX = this.x + this.width;
        },
        setHeight: function (height) {
            rect.setHeight(height);
            this.height = height;
            this.maxY = this.y + this.height;
        }
    }
}
export function toHTMLEncode(str){
    return toJSString(str)
                .replace(/\</g, "&lt;")
                .replace(/\>/g, '&gt;')
                .replace(/\'/g, "&#39;")
                .replace(/\"/g, "&quot;")
                .replace(/\u2028/g,"\\u2028")
                .replace(/\u2029/g,"\\u2029")
                .replace(/\ud83c|\ud83d/g,"")
            ;
    // return str.replace(/\&/g, "&amp;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;").replace(/\</g, "&lt;").replace(/\>/g, '&gt;');
}
export function emojiToEntities(str) {
    var self = this,
    emojiRegExp = new RegExp("(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])", "g");
    return str.replace(
        emojiRegExp,
        function(match) {
            var u = "";
            for (var i = 0; i < match.length; i++) {
                if( !(i%2) ){
                    u += "&#" + match.codePointAt(i)
                }
            }

            return u;
        });
}
export function toJSString(str) {
    return new String(str).toString();
}
export function toJSNumber(str) {
    return Number(toJSString(str));
}
export function pointToJSON(point) {
    return {
        x: parseFloat(point.x),
        y: parseFloat(point.y)
    };
}
export function rectToJSON(rect, referenceRect) {
    if (referenceRect) {
        return {
            x: Math.round( ( rect.x() - referenceRect.x() ) * 10 ) / 10,
            y: Math.round( ( rect.y() - referenceRect.y() ) * 10 ) / 10,
            width: Math.round( rect.width() * 10 ) / 10,
            height: Math.round( rect.height() * 10 ) / 10
        };
    }
    return {
        x: Math.round(rect.x() * 10) / 10,
        y: Math.round(rect.y() * 10) / 10,
        width: Math.round(rect.width() * 10) / 10,
        height: Math.round(rect.height() * 10) /10
    };
}
export function colorToJSON(color) {
    return {
        r: Math.round(color.red() * 255),
        g: Math.round(color.green() * 255),
        b: Math.round(color.blue() * 255),
        a: color.alpha(),
        "color-hex": color.immutableModelObject().stringValueWithAlpha(false) + " " + Math.round(color.alpha() * 100) + "%",
        "argb-hex": "#" + toHex(color.alpha() * 255) + color.immutableModelObject().stringValueWithAlpha(false).replace("#", ""),
        "css-rgba": "rgba(" + [
                        Math.round(color.red() * 255),
                        Math.round(color.green() * 255),
                        Math.round(color.blue() * 255),
                        (Math.round(color.alpha() * 100) / 100)
                    ].join(",") + ")",
        "ui-color": "(" + [
                        "r:" + (Math.round(color.red() * 100) / 100).toFixed(2),
                        "g:" + (Math.round(color.green() * 100) / 100).toFixed(2),
                        "b:" + (Math.round(color.blue() * 100) / 100).toFixed(2),
                        "a:" + (Math.round(color.alpha() * 100) / 100).toFixed(2)
                    ].join(" ") + ")"
    }
}
export function toHex(c) {
    var hex = Math.round(c).toString(16).toUpperCase();
    return hex.length == 1 ? "0" + hex :hex;
}
export function colorStopToJSON(colorStop) {
    return {
        color: colorToJSON(colorStop.color()),
        position: colorStop.position()
    };
}
export function gradientToJSON(gradient) {
    var stopsData = [];
    var stop;
    var stopIter = gradient.stops().objectEnumerator();
    while (stop = stopIter.nextObject()) {
        stopsData.push(colorStopToJSON(stop));
    }

    return {
        type: GradientTypes[gradient.gradientType()],
        from: pointToJSON(gradient.from()),
        to: pointToJSON(gradient.to()),
        colorStops: stopsData
    };
}
export function shadowToJSON(shadow) {
    return {
        type: shadow instanceof MSStyleShadow ? 'outer' : 'inner',
        offsetX: shadow.offsetX(),
        offsetY: shadow.offsetY(),
        blurRadius: shadow.blurRadius(),
        spread: shadow.spread(),
        color: colorToJSON(shadow.color())
    };
}
export function getRadius(layer) {
    return (layer.layers && is(layer.layers().firstObject(), MSRectangleShape))
                ? layer.layers().firstObject().fixedRadius()
                : 0;
}
export function getBorders(style) {
    var bordersData  = [];
    var border;
    var borderIter = style.borders().objectEnumerator();
    while(border = borderIter.nextObject()) {
        if(border.isEnabled()) {
            var fillType = FillTypes[border.fillType()];
            var borderData = {
                fillType: fillType,
                position: BorderPositions[border.position()],
                thickness: border.thickness()
            };
            switch (fillType) {
                case 'color':
                    borderData.color = colorToJSON(border.color());
                    break;
                case 'gradient':
                    borderData.gradient = gradientToJSON(border.gradient());
                    break;
                default:
                    continue;
            }
            bordersData.push(borderData);
        }
    }
    return bordersData;
}
export function getFills(style) {
    var fillsData = [];
    var fill;
    var fillIter = style.fills().objectEnumerator();
    
    while (fill = fillIter.nextObject()) {
        if (fill.isEnabled()) {
            var fillType = FillTypes[fill.fillType()],
                fillData = {
                    fillType: fillType
                };

            switch (fillType) {
                case 'color':
                    fillData.color = colorToJSON(fill.color());
                    break;

                case 'gradient':
                    fillData.gradient = gradientToJSON(fill.gradient());
                    break;

                default:
                    continue;
            }
            fillsData.push(fillData);
        }
    }
    return fillsData;
}
export function getShadows(style) {
    var shadowsData = [];
    var shadow;
    var shadowIter = style.shadows().objectEnumerator();
    while (shadow = shadowIter.nextObject()) {
        if (shadow.isEnabled()) {
            shadowsData.push(shadowToJSON(shadow));
        }
    }
    shadowIter = style.innerShadows().objectEnumerator();
    while (shadow = shadowIter.nextObject()) {
        if (shadow.isEnabled()) {
            shadowsData.push(shadowToJSON(shadow));
        }
    }
    return shadowsData;
}
export function getOpacity(style) {
    return style.contextSettings().opacity();
}
export function getStyleName(layer) {
    var styles = is(layer, MSTextLayer)
                    ? context.document.documentData().layerTextStyles()
                    : context.document.documentData().layerStyles();
    var layerStyle = layer.style();
    var sharedObjectID = layerStyle.sharedObjectID();
    var style;

    styles = styles.objectsSortedByName();

    if (styles.count() > 0) {
        style = find({
            key: "(objectID != NULL) && (objectID == %@)",
            match: sharedObjectID
        }, styles);
    }
    if(!style) return '';
    return toJSString(style.name());
}
export function updateContext() {
    context.document = NSDocumentController.sharedDocumentController().currentDocument();
    context.selection = context.document.selectedLayers().layers();

    return context;
}
export function layerToJSON(layer) {
    var group = layer.parentGroup();
    var layerStates = getStates(layer);
    if (
        !isExportable(layer)
        || !layerStates.isVisible
        || ( layerStates.isLocked && !is(layer, MSSliceLayer))
        || layerStates.isEmpty
        || layerStates.hasSlice
        || layerStates.isMeasure
    ){
        log('nononono');
        return false;
    }
    var layerType = is(layer, MSTextLayer)
                        ? 'text'
                        : is(layer, MSSymbolInstance)
                            ? 'symbol'
                            : is(layer, MSSliceLayer) || hasExportSizes(layer)
                                ? 'slice'
                                : 'shape';
    var exportLayerRect;
    // export the default rect.
    exportLayerRect = layer.absoluteRect();

    var layerData = {
        objectID: toJSString( layer.objectID() ),
        type: layerType,
        name: toHTMLEncode(emojiToEntities(layer.name())),
        rect: rectToJSON(exportLayerRect)
    };

    if ( layerType != "slice" ) {
        var layerStyle = layer.style();
        layerData.rotation = layer.rotation();
        layerData.radius = getRadius(layer);
        layerData.borders = getBorders(layerStyle);
        layerData.fills = getFills(layerStyle);
        layerData.shadows = getShadows(layerStyle);
        layerData.opacity = getOpacity(layerStyle);
        layerData.styleName = getStyleName(layer);
    }

    if ( layerType == "text" ) {
        layerData.content = toHTMLEncode(emojiToEntities(layer.stringValue()));
        layerData.color = colorToJSON(layer.textColor());
        layerData.fontSize = layer.fontSize();
        layerData.fontFace = toJSString(layer.fontPostscriptName());
        layerData.textAlign = TextAligns[layer.textAlignment()];
        layerData.letterSpacing = toJSNumber(layer.characterSpacing()) || 0;
        layerData.lineHeight = layer.lineHeight() || layer.font().defaultLineHeightForFont();
    }

    var layerCSSAttributes = layer.CSSAttributes(),
        css = [];

    for(var i = 0; i < layerCSSAttributes.count(); i++) {
        var c = layerCSSAttributes[i]
        if(! /\/\*/.exec(c) ) css.push(toJSString(c));
    }
    if(css.length > 0) layerData.css = css;
    return layerData;
}
export function isExportable(layer) {
    return is(layer, MSTextLayer) ||
           is(layer, MSShapeGroup) ||
           is(layer, MSBitmapLayer) ||
           is(layer, MSSliceLayer) ||
           is(layer, MSSymbolInstance) ||
           isSliceGroup(layer)
}
export function isSliceGroup(layer) {
    return is(layer, MSLayerGroup) && hasExportSizes(layer);
}
export function getStates(layer) {
    var isVisible = true;
    var isLocked = false;
    var hasSlice = false;
    var isEmpty = false;
    var isMaskChildLayer = false;
    var isMeasure = false;

    while (!(is(layer, MSArtboardGroup) || is(layer, MSSymbolMaster))) {
        var group = layer.parentGroup();
        if( regexNames.exec(group.name()) ){
            isMeasure = true;
        }

        if (!layer.isVisible()) {
            isVisible = false;
        }

        if (layer.isLocked()) {
            isLocked = true;
        }

        if ( is(group, MSLayerGroup) && hasExportSizes(group) ) {
            hasSlice = true
        }

        if (
            is(layer, MSTextLayer)
            && layer.isEmpty()
        ) {
            isEmpty = true
        }

        layer = group;
    }
    return {
        isVisible: isVisible,
        isLocked: isLocked,
        hasSlice: hasSlice,
        isMaskChildLayer: isMaskChildLayer,
        isMeasure: isMeasure,
        isEmpty: isEmpty
    }
}
export function hasExportSizes(layer){
    return layer.exportOptions().exportFormats().count() > 0;
}
// help
export function find(format, container, returnArray){
    if(!format || !format.key  || !format.match){
        return false;
    }
    var document = context.document;
    var documentData = document.documentData();
    var UIMetadata = context.document.mutableUIMetadata();
    var window = document.window();
    var pages = document.pages();
    var page = document.currentPage();
    var artboard = page.currentArtboard();
    var current = artboard || page;
    var predicate = NSPredicate.predicateWithFormat(format.key,format.match),
        container = container || current,
        items;

    if(container.pages){
        items = container.pages();
    }
    else if( is( container, MSSharedStyleContainer ) || is( container, MSSharedTextStyleContainer ) ){
        items = container.objectsSortedByName();
    }
    else if( container.children ){
        items = container.children();
    }
    else{
        items = container;
    }

    var queryResult = items.filteredArrayUsingPredicate(predicate);

    if(returnArray) return queryResult;

    if (queryResult.count() == 1){
        return queryResult[0];
    } else if (queryResult.count() > 0){
        return queryResult;
    } else {
        return false;
    }
}

// files
export function getSavePath() {
    var filePath = context.document.fileURL()? context.document.fileURL().path().stringByDeletingLastPathComponent(): "~";
    var fileName = context.document.displayName().stringByDeletingPathExtension();
    var savePanel = NSSavePanel.savePanel();

    savePanel.setTitle('Export file');
    savePanel.setNameFieldLabel('Export to:');
    savePanel.setPrompt('Export');
    savePanel.setCanCreateDirectories(true);
    savePanel.setNameFieldStringValue(fileName);

    if (savePanel.runModal() != NSOKButton) {
        return false;
    }
    return savePanel.URL().path();
}
export function exportFile(treeObj) {
    var savePath = getSavePath();
    if (savePath) {
        writeFile({
            content: JSON.stringify(treeObj),
            path: toJSString(savePath),
            fileName: 'test.json'
        });
        NSWorkspace.sharedWorkspace().activateFileViewerSelectingURLs([NSURL.fileURLWithPath(`${savePath}/test.json`)]);
    }
}
export function writeFile(options) {
    var options = extend(options, {
            content: "Type something!",
            path: toJSString(NSTemporaryDirectory()),
            fileName: "temp.txt"
        }),
        content = NSString.stringWithString(options.content),
        savePathName = [];

    NSFileManager
        .defaultManager()
        .createDirectoryAtPath_withIntermediateDirectories_attributes_error(options.path, true, nil, nil);

    savePathName.push(
        options.path,
        "/",
        options.fileName
    );
    savePathName = savePathName.join("");

    content.writeToFile_atomically_encoding_error(savePathName, false, 4, null);
}
export function extend(options, target) {
    var target = target || this;

    for ( var key in options ){
        target[key] = options[key];
    }
    return target;
}