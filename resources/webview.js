import Vue from 'vue';
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-carbon.css'
import Tree from './pages/indexTree.vue';
import pluginCall from 'sketch-module-web-view/client'

Vue.use(MuseUI);

window.app  = new Vue({
    el: '#app',
    data: {
        sys: {}
    },
    components: {
        tree: Tree
    },
    methods: {
        changeSelect(params) {
            this.$refs.domtree.addNodeChange(params);
        }
    },
    mounted() {
        // FG.log('mounted');
        console.log(FG);
    }
});