<template>
    <div class="frontGenerator-wrapper">
        <div class="option-panel-wrapper">
            <mu-float-button icon="add" secondary mini class="demo-float-button" @click="clickAddNodeBtn" style="width: 24px;height: 24px;"/>
            <mu-float-button icon="delete" mini class="demo-float-button" @click="delNode" style="width: 24px;height: 24px;margin-left: 15px;"/>
            <mu-float-button icon="trending_up" mini class="demo-float-button" @click="up" style="width: 24px;height: 24px;margin-left: 15px;background: #1a237e;"/>
            <mu-float-button icon="trending_down" mini class="demo-float-button" @click="down" style="width: 24px;height: 24px;margin-left: 15px;background: #006064;"/>
            <mu-flat-button label="导出" icon="open_in_browser" @click="exportFile" class="demo-flat-button" color="#474a4f" style="float: right;margin-right: 10px;"/>
        </div>
        <div class="frontGenerator-content">
            <div class="frontGenerator-content-left">
                <div class="leftMenu-wrapper">
                    <vue-ztree 
                        :list.sync='domTree'
                        :func='nodeClick'
                        :contextmenu='contextmenuClick'
                        :is-open='true'
                        ref="vuetree">
                    </vue-ztree>
                    <mu-popup position="top" :overlay="false" popupClass="demo-popup-top" :open="selectPopup">
                        请选中一个图层
                    </mu-popup>
                    <mu-popup></mu-popup>
                    <mu-popup position="right" popupClass="popup-right" :open="rightPopup" @close="close('right')">
                        <!-- 选择图层为子图层 -->
                        <div class="addlayertip-wrapper">
                            <p>请点击相应画板选择添加层</p>
                        </div>
                        <div class="simplesetlayer-wrapper">
                            <p style="margin-bottom: 20px; font-size: 16px;">已选择图层：{{tempNode.layerName || '当前暂无选中图层'}}</p>
                            <mu-text-field hintText="请输入自定义类名" v-model="tempNode.className"/>
                            <mu-select-field 
                                v-model="tempNode.tagIndex" 
                                :labelFocusClass="['label-foucs']" 
                                label="选择标签">
                                <mu-menu-item
                                    v-for="(text, index) in tagList" 
                                    :key="index" 
                                    :value="index" 
                                    :title="text" />
                            </mu-select-field>
                            <div class="popup-right-btns">
                                <mu-raised-button label="取消" class="demo-raised-button" @click="() => {this.tempNode = {className: '', tagIndex: 0};close('right')}" primary/>
                                <mu-raised-button label="确定" class="demo-raised-button" @click="addNodeAction()" secondary/>
                            </div>
                        </div>
                    </mu-popup>
                </div>
            </div>
            <div class="frontGenerator-content-right">
                <div class="content-wrapper">
                    <p class="setting-title">属性</p>
                    <div class="setting-list-wrapper" v-if="nodeModel">
                        <li style="list-style:none;" v-for="(item, index) in Object.keys(nodeModel.styles.ownStyle)" :key="index">
                            <mu-text-field :label="item" :hintText="item" v-model="nodeModel.styles.ownStyle[item]"/>
                        </li>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import vueZtree from '../vue-ztree.vue'
import '../vue-ztree.less'
import tagType from './tagType.js'
import cssToJson from 'css-to-javascript'
import pluginCall from 'sketch-module-web-view/client'

let treeGuid = 0;

export default {
    mounted() {
    },
    components: {
        vueZtree,
        propSetting: {
            name: 'propSetting',
            props: {
                settingobj: {
                    type: Object,
                    default: {}
                }
            },
            template: `
                <div class="setting-list-wrapper">
                    <li v-for="(item, key) in settingobj">
                        <mu-text-field :hintText="key" v-model="item"/>
                    </li>
                </div>
            `
        }
    },
    data () {
        return {
            tagIndex: 0,
            tagList: ['div', 'p', 'h', 'span', 'a', 'i', 'em'],
            domTree:[{
                id: 1,
                objectID: '',
                layerName: '',
                rect: {},
                tagIndex: 0,
                className: 'Container-wrapper',
                styles: {
                    ownStyle: {}
                },
                children: []
            }],
            tempNode: {
                tagIndex: 0,
                className: ''
            }, // 记录临时新添加节点属性
            selectPopup: false,
            rightPopup: false,
            parentNodeModel: [], // 当前点击节点父亲对象
            nodeModel: null //当前点击节点对象
        }
    },
    watch: {
        selectPopup (val) {
            if (val) {
                setTimeout(() => {
                    this.selectPopup = false
                }, 2000)
            }
        }
    },
    methods: {
        popUp() {
            this.selectPopup = true;
        },
        open (position) {
            this[position + 'Popup'] = true
        },
        close (position) {
            if (position === 'right') {
                FG.currentPanel = 'common';
            }
            this[position + 'Popup'] = false
        },
        exportFile() {
            pluginCall('exportFile', JSON.stringify(this.$refs.vuetree.treeDataSource[0]));
        },
        clickAddNodeBtn() {
            if (this.nodeModel) {
                FG.currentPanel = 'addLayer';
                this.open('right');
            }
            else {
                this.popUp();
            }
        },
        addNodeChange(params) {
            let css = params.css; //Array
            let name = params.name;
            let objectID = params.objectID;
            let rect = params.rect;
            let cssStr;
            let cssObj = {};
            if (css && css.length) {
                for(var i = 0; i < css.length; i++) {
                    var cssFragArr = css[i].split(':');
                    var key = cssFragArr[0].trim();
                    var value = cssFragArr[1].trim();
                    value = value.split(';')[0].trim();
                    cssObj[key] = value;
                }
                // cssStr = `.ownStyle{${css.join('')}}`;
            }
            this.tempNode = {
                objectID: objectID,
                layerName: name,
                tagIndex: 0,
                rect: rect,
                tag: '',
                className: '',
                styles: {
                    ownStyle: cssObj || {}
                }
            }
        },
        addNodeAction() {
            let tag = this.tagList[this.tagIndex];
            if (!this.tempNode.objectID) {
                return;
            }
            this.addNode({
                className: this.tempNode.className,
                tagIndex: this.tempNode.tagIndex,
                styles: {
                    ownStyle: this.tempNode.styles.ownStyle
                },
                rect: this.tempNode.rect,
                objectID: this.tempNode.objectID,
                layerName: this.tempNode.layerName,
                clickNode: false,
                isFolder: false,
                isExpand: false,
                loadNode: 0,
                children: []
            });
            this.tempNode = {
                className: '',
                tagIndex: 0
            }
        },
        addNode(params) {
            if (this.nodeModel) {
                let newId = this.newTreeId();
                let newNode = Object.assign({id: newId, name: `name-${newId}`}, params);
                
                this.nodeModel.children.push(newNode);
                this.nodeModel.isFolder = true;
                this.tempNode = {
                    tagIndex: 0,
                    className: ''
                }
                this.close('right');
            }
            else {
                this.popUp();
                console.log('please select a node');
            }
        },
        delNode() {
            
            if (this.nodeModel) {
                if (this.parentNodeModel.hasOwnProperty('children')) {
                    this.parentNodeModel.children.splice(this.parentNodeModel.children.indexOf(this.nodeModel), 1);
                }
                else if (this.parentNodeModel instanceof Array) {
                    if (this.parentNodeModel.length === 1) {
                        return;
                    }
                    // first level node
                    this.parentNodeModel.splice(this.parentNodeModel.indexOf(this.nodeModel), 1);
                }
            }
            else {
                this.popUp();
                console.log('please select a node');
            }
        },
        up() {
            if (!this.nodeModel) {
                this.popUp();
                console.log('please select a node');
                return;
            }
            if (this.parentNodeModel.hasOwnProperty('children')) {
                var index = this.parentNodeModel.children.indexOf(this.nodeModel);
                // has and not the first
                if (index > 0) {
                    var model = this.parentNodeModel.children.splice(this.parentNodeModel.children.indexOf(this.nodeModel));
                    this.parentNodeModel.children.splice(index - 1, 0, model[0]);
                }
            }
            else if (this.parentNodeModel instanceof Array) {
                var index = this.parentNodeModel.indexOf(this.nodeModel);
                if (index > 0) {
                    var model = this.parentNodeModel.splice(index, 1);
                    this.parentNodeModel.splice(index - 1, 0, model[0]);
                }
            }
        },
        down() {
            if (!this.nodeModel) {
                this.popUp();
                console.log('please select a node');
                return;
            }
            if (this.parentNodeModel.hasOwnProperty('children')) {
                var index = this.parentNodeModel.children.indexOf(this.nodeModel);
                if (index < this.parentNodeModel.children.length) {
                    var model = this.parentNodeModel.children.splice(this.parentNodeModel.children.indexOf(this.nodeModel),1);
                    this.parentNodeModel.children.splice(index + 1, 0, model[0]);
                }
            }
            else if(this.parentNodeModel instanceof Array){
                // first level
                var index = this.parentNodeModel.indexOf(this.nodeModel);
                if(index + 1 <= this.parentNodeModel.length) {
                    var model = this.parentNodeModel.splice(index, 1);
                    this.parentNodeModel.splice(index + 1, 0, model[0]);
                }
            }
        },
        newTreeId() {
            return 'frontGenerator-tree-' + (++treeGuid);
        },
        // 点击节点
        nodeClick:function(m, parent, trees){
            this.nodeModel = m;  // 当前点击节点对象
            this.parentNodeModel = parent; //当前点击节点父亲对象
            console.log(m);
            console.log(parent);
        },
        // 右击事件
        contextmenuClick:function(m){
            console.log(m)
            console.log("触发了自定义的contextmenuClick事件");
        }
    }
}
</script>
<style lang="less">
    .frontGenerator-wrapper{
        .option-panel-wrapper{
            background: transparent;
            display: block;
            padding: 10px;
            font-size: 12px;
            box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
        }
    }
    .frontGenerator-content{
        margin: 0 auto;
        display: flex;
        min-height: 100%;
        .frontGenerator-content-left{
            box-sizing: border-box;
            flex: 1;
            min-height: 100%;
            background: #474a4f;
        }
        .frontGenerator-content-right{
            box-sizing: border-box;
            color: #474a4f;
            flex: 1;
            min-height: 100%;
            .content-wrapper{
                padding: 10px;
                .setting-title{
                    color: #ff5252;
                    font-size: 16px;
                }
                .mu-text-field{
                    width: 100%;
                }
            }
        }
    }
    .popup-right{
        background-color: #ffffff;
        height: 100%;
        width: 350px;
        color: #616161;
        text-align: center;
        .addlayertip-wrapper{
            font-size: 24px;
            padding: 20px 15px 10px;
        }
        .popup-right-btns{
            margin-top: 20px;
        }
    }
</style>