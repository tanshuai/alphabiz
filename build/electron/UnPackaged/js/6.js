(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{"0ab7":function(e,t,n){},"0fc6":function(e,t,n){"use strict";n("b593")},3042:function(e,t,n){"use strict";n("55d8")},"55d8":function(e,t,n){},"5e23":function(e,t,n){},"76e0":function(e,t,n){"use strict";n("0ab7")},8341:function(e,t,n){},9686:function(e,t,n){"use strict";n("5e23")},acab:function(e,t,n){},b006:function(e,t,n){"use strict";n.r(t);var s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("q-page",{staticClass:"q-pa-sm"},[n("q-card",{staticClass:"q-mb-sm",attrs:{bordered:"",flat:""}},[n("q-card-section",{staticClass:"panel"},e._l([{color:"positive",icon:"bug_report",label:"Open WebTorrent DevTools",handleClick:e.openWebtorrentDevTools},{color:"negative",icon:"delete_forever",label:"Clear Application Config",handleClick:e.delete_config},{color:"general",icon:"translate",label:"Get User Language",handleClick:e.getUsersLanguage},{color:"general",icon:"language",label:"Get Vue Locale",handleClick:e.getVueLocale},{color:"general",icon:"flag",label:"Get Quasar Locale",handleClick:e.getLocale}],(function(e,t){return n("alphabiz-button",{key:t,attrs:{color:e.color,icon:e.icon,label:e.label},on:{click:e.handleClick}})})),1)],1),n("q-card",{staticClass:"q-mb-sm",attrs:{bordered:"",flat:""}},[n("q-tabs",{attrs:{align:"left","no-caps":"","narrow-indicator":""},model:{value:e.currentTab,callback:function(t){e.currentTab=t},expression:"currentTab"}},e._l([{name:"accountInfo",icon:"account_circle",label:"Account Info"},{name:"amplify",icon:"developer_board",label:"Amplify"},{name:"devInfo",icon:"info",label:"Dev Info"},{name:"urlConvert",icon:"link",label:"Alphabiz URL Convert"},{name:"libraryEditor",icon:"shopping_bag",label:"Library Editor"}],(function(t){return n("q-tab",e._b({key:t.name},"q-tab",t,!1))})),1),n("q-separator"),n("q-tab-panels",{attrs:{animated:""},model:{value:e.currentTab,callback:function(t){e.currentTab=t},expression:"currentTab"}},[n("q-tab-panel",{attrs:{name:"accountInfo"}},[n("account-tab-panel")],1),n("q-tab-panel",{attrs:{name:"amplify"}},[n("amplify-tab-panel")],1),n("q-tab-panel",{attrs:{name:"devInfo"}},[n("dev-info-tab-panel")],1),n("q-tab-panel",{attrs:{name:"urlConvert"}},[n("url-convert")],1),n("q-tab-panel",{attrs:{name:"libraryEditor"}},[n("library-editor")],1)],1)],1)],1)},a=[],o=n("ed08"),l=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{staticClass:"q-ma-sm"},[n("q-checkbox",{attrs:{label:"isTestEnv"},model:{value:e.isTest,callback:function(t){e.isTest=t},expression:"isTest"}})],1),n("h4",[e._v(e._s(e.$store.state.account.authState))]),"signedIn"===e.$store.state.account.authState?n("div",{staticClass:"row",staticStyle:{margin:"-4px"}},[e._l(e.$store.getters.accountUserInfo,(function(t,s){return[Array.isArray(t)?[n("div",{key:s,staticClass:"col-12 col-lg-6 q-pa-xs"},[n("q-card",{staticClass:"overflow-hidden",attrs:{flat:"",bordered:""}},[Array.isArray(t)?n("q-expansion-item",{attrs:{"content-inset-level":.4,label:s}},e._l(t,(function(t,s){return n("div",{key:s},[e._v(e._s(t)+"\n              ")])})),0):e._e()],1)],1)]:[n("div",{key:s,staticClass:"col-6 col-sm-3 col-lg-2 q-pa-xs"},[n("q-card",{staticClass:"overflow-hidden q-px-md q-py-sm",staticStyle:{"min-height":"66px"},attrs:{flat:"",bordered:""}},[n("div",{staticClass:"text-capitalize",staticStyle:{"font-size":"0.8rem",opacity:"0.8"}},[e._v(e._s(s)+"\n            ")]),n("div",{staticClass:"text-weight-bold text-no-wrap ellipsis"},[e._v(e._s(t))])])],1)]]}))],2):e._e(),"signedIn"===e.$store.state.account.authState?[n("q-separator",{staticStyle:{margin:"16px -16px"}}),n("div",{staticClass:"q-mb-sm"},[n("q-input",{staticStyle:{"max-width":"300px"},attrs:{label:"TestToken",dense:"",outlined:""},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.testToken,callback:function(t){e.testToken=t},expression:"testToken"}})],1),n("div",[n("alphabiz-button",{attrs:{label:"Add Credits 100","on-click":e.addCredits}})],1)]:e._e()],2)},i=[],r=n("3eaf");const c=new r["a"].Rest("ABDevRest");var u={name:"AccountTabPanel",inject:["isTestEnv"],data(){return{testToken:""}},computed:{isTest:{get(){return this.isTestEnv.getValue()},set(e){this.isTestEnv.setValue(e)}}},methods:{async addCredits(){try{const e=await c.post("/development/addCredits",{testToken:this.testToken});console.log(e)}catch(e){this.$q.notify({message:e.message,type:"negative",position:"bottom-right",timeout:5e3})}}}},d=u,m=n("2877"),p=n("8f8e"),v=n("f09f"),b=n("3b73"),f=n("eb85"),h=n("27f9"),g=n("eebe"),y=n.n(g),_=Object(m["a"])(d,l,i,!1,null,"5a400cb1",null),C=_.exports;y()(_,"components",{QCheckbox:p["a"],QCard:v["a"],QExpansionItem:b["a"],QSeparator:f["a"],QInput:h["a"]});var k=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{staticClass:"q-my-xs"},e._l(e.$amplify.amplifyTest,(function(e,t){return n("amplify-button",{key:t,staticClass:"q-ma-xs",attrs:{label:t,"on-click":function(){return e()}}})})),1),n("div",[n("amplify-button",{staticClass:"q-ma-xs",attrs:{label:"testAPI","on-click":e.testAPI}}),n("amplify-button",{staticClass:"q-ma-xs",attrs:{label:"toFinish","on-click":e.toFinish}})],1),n("div",[n("amplify-button",{staticClass:"q-ma-xs",attrs:{label:"enableUserListener","on-click":e.enableUserListener}}),n("amplify-button",{staticClass:"q-ma-xs",attrs:{label:"disableUserListener","on-click":e.disableUserListener}}),n("amplify-button",{staticClass:"q-ma-xs",attrs:{label:"enablePublicListener","on-click":e.enablePublicListener}}),n("amplify-button",{staticClass:"q-ma-xs",attrs:{label:"disablePublicListener","on-click":e.disablePublicListener}})],1)])},q=[];const I=new r["a"].Rest("ABDevRest");var x={name:"AmplifyTabPanel",mounted(){},methods:{async enableUserListener(){await r["a"].GQL.enableUserListener(this.$store.state.account.sub),r["a"].GQL.addUserListener("hooks",(e=>{console.log("user:hooks",e)}))},async disableUserListener(){r["a"].GQL.disableUserListener()},async enablePublicListener(){await r["a"].GQL.enablePublicListener(),r["a"].GQL.addPublicListener("hooks",(e=>{console.log("pub:hooks",e)}))},async disablePublicListener(){r["a"].GQL.disablePublicListener()},async testAPI(){const e=await I.post("/test/transaction",{subA:"8df7f303-89e2-4231-b58e-c276b44ab19e",subB:"44b650d2-69a7-4faf-a900-38019dcc2cde",amount:1e3});console.log(e)},async toFinish(){const e=await this.$store.dispatch("CREDIT_PAY_DATA_FINISH",{transactionId:"d615d886-de57-4e5e-8d5c-e17c0e8bca30"});console.log(e)}}},S=x,w=Object(m["a"])(S,k,q,!1,null,"78db9fc0",null),T=w.exports,$=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e.devInfo.torrentStore?n("div",{staticClass:"full-width"},[e._v("Torrent Config Store:\n    "),n("alphabiz-button",{staticClass:"dev-info-action q-ml-md",attrs:{label:"Open"},on:{click:function(t){return e.open(e.devInfo.torrentStore)}}}),n("alphabiz-button",{staticClass:"dev-info-action q-ml-sm",attrs:{label:"Reset"},on:{click:e.resetTorrent}}),n("pre",[e._v(e._s(e.devInfo.torrentStore))])],1):e._e(),e.devInfo.settingStore?n("div",{staticClass:"full-width"},[e._v("Setting Config Store:\n    "),n("alphabiz-button",{staticClass:"dev-info-action q-ml-md",attrs:{label:"Open"},on:{click:function(t){return e.open(e.devInfo.settingStore)}}}),n("alphabiz-button",{staticClass:"dev-info-action q-ml-sm",attrs:{label:"Reset"},on:{click:e.resetSetting}}),n("pre",[e._v(e._s(e.devInfo.settingStore))])],1):e._e(),e._v("\n  We are using\n  "),e.devInfo.electronVer?n("div",{staticClass:"full-width"},[e._v("Electron "+e._s(e.devInfo.electronVer)+"\n  ")]):e._e(),e.devInfo.chromeVer?n("div",{staticClass:"full-width"},[e._v("Chrome "+e._s(e.devInfo.chromeVer)+"\n  ")]):e._e(),e.devInfo.nodeVer?n("div",{staticClass:"full-width"},[e._v("Node "+e._s(e.devInfo.nodeVer)+"\n  ")]):e._e(),n("div",[e._v("Quasar "+e._s(e.$q.version))]),n("div",[e._v("Vue "+e._s(e.vueVersion))]),n("div",[e._v(" "+e._s(e.$q.platform))]),e.devInfo.processArgv?n("div",{staticClass:"full-width"},[e._v("Process Argv "+e._s(e.devInfo.processArgv))]):e._e()])},D=[],R=n("2b0e");const L=n("ed08").isElectron(),Q=L?n("34bb").ipcRenderer:null;var O={name:"DevInfoTabPanel",inject:["io"],data(){return{devInfo:{torrentStore:"",settingStore:""}}},methods:{open(e){this.io.emit("show_torrent_file",e)},resetTorrent(){L&&Q.send("reset-torrent")},resetSetting(){this.$store.dispatch("resetSettings").then((e=>{this.$i18n.locale=e.language,this.$q.notify("Reset success")}))}},mounted(){L&&(Q.on("dev-info",((e,t)=>{t.torrentStore&&(this.devInfo.torrentStore=t.torrentStore),t.settingStore&&(this.devInfo.settingStore=t.settingStore),t.electronVer&&(this.devInfo.electronVer=t.electronVer),t.chromeVer&&(this.devInfo.chromeVer=t.chromeVer),t.nodeVer&&(this.devInfo.nodeVer=t.nodeVer),t.argv&&(this.devInfo.processArgv=t.argv)})),Q.send("dev-info")),this.io.off("notify",this.notify),this.io.on("notify",this.notify)},computed:{vueVersion(){return R["a"].version}}},E=O,j=(n("3042"),Object(m["a"])(E,$,D,!1,null,"5f269e2f",null)),A=j.exports,G=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e._v("\n  Alphabiz URL Convert\n  "),n("q-input",{staticClass:"q-my-md",attrs:{type:"text",label:"source url"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.url,callback:function(t){e.url=t},expression:"url"}}),n("q-btn",{attrs:{color:"primary",icon:"check",label:"Convert"},on:{click:e.convert}})],1)},B=[];const P=n("ed08").isElectron(),M=P?n("34bb").ipcRenderer:null;var V={name:"DevInfoTabPanel",inject:["io"],data(){return{url:""}},methods:{convert(){this.url&&P&&(M.once("convert-url",((e,t)=>{this.url=t})),M.send("convert-url",this.url))}}},z=V,F=n("9c40"),U=Object(m["a"])(z,G,B,!1,null,"4cb3b9fe",null),K=U.exports;y()(U,"components",{QInput:h["a"],QBtn:F["a"]});var N=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticStyle:{margin:"-16px"}},[n("ClientStatus"),n("div",{staticClass:"lib-editor-actions"},[n("q-dialog",{model:{value:e.showCreatorDialog,callback:function(t){e.showCreatorDialog=t},expression:"showCreatorDialog"}},[n("ResourceCreator",{on:{created:function(t){e.showCreatorDialog=!1}}})],1),n("q-dialog",{model:{value:e.showEditorDialog,callback:function(t){e.showEditorDialog=t},expression:"showEditorDialog"}},[n("ResourceEditor",{attrs:{id:e.editTarget},on:{removed:e.handleRemoved}})],1)],1),e.resourcesData?[n("q-separator",{staticClass:"q-my-xs"}),n("q-table",{attrs:{flat:"",columns:e.columns,"row-key":"id",data:e.resourcesData,selection:"single",selected:e.resourcesSelected},on:{"update:selected":function(t){e.resourcesSelected=t}},scopedSlots:e._u([{key:"top",fn:function(t){return[n("div",{staticClass:"text-weight-bold text-h5 q-mt-md"},[e._v("Resources")]),n("q-space"),n("alphabiz-button",{attrs:{icon:"add",label:"新建资源",immediate:""},on:{click:function(t){e.showCreatorDialog=!0}}}),n("q-btn",{staticClass:"q-ml-md",attrs:{flat:"",round:"",dense:"",icon:t.inFullscreen?"fullscreen_exit":"fullscreen"},on:{click:t.toggleFullscreen}})]}}],null,!1,3470689597)})]:e._e()],2)},W=[],J=(n("ddb0"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.currentResource?n("q-table",{staticClass:"resource-editor",attrs:{data:e.resourceRowData,flat:"",grid:"","row-key":"name"},scopedSlots:e._u([{key:"top",fn:function(t){return[n("div",{staticClass:"full-width"},[n("div",{staticClass:"row q-mt-md"},[e.currentResource.title?n("div",{staticClass:"text-weight-bold text-h5"},[e._v(e._s(e.currentResource.title["en-us"]))]):e._e(),n("q-space"),n("q-btn",{staticClass:"q-ml-md",attrs:{flat:"",round:"",dense:"",icon:t.inFullscreen?"fullscreen_exit":"fullscreen"},on:{click:t.toggleFullscreen}})],1),n("div",{staticClass:"q-mb-sm row items-center"},[n("div",{staticClass:"q-mr-sm non-selectable",staticStyle:{"font-size":"1.2rem"}},[e._v("ID:")]),n("div",{staticClass:"bg-general q-px-sm q-py-xs rounded-borders",staticStyle:{"font-size":"1rem"}},[e._v(e._s(e.currentResource.id))])])])]}},{key:"item",fn:function(t){return["title"===t.key?n("Title",{attrs:{id:e.currentResource.id,value:t.row.data}}):"cover"===t.key?n("Cover",{attrs:{id:e.currentResource.id,value:t.row.data}}):"source"===t.key?n("Source",{attrs:{id:e.currentResource.id,value:t.row.data}}):n("div",[n("div",[e._v(e._s(t))])])]}}],null,!1,1964497021)}):e._e()}),H=[],Y=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("Table",{attrs:{value:e.value,name:"Title",description:"当前资源的标题"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("Field",{attrs:{label:"title",value:t.itemVal,removable:"en-us"!==t.itemKey,"on-remove":function(){return e.removeItem(t.itemKey)},"on-save":function(n){return e.saveItem(n,t.itemKey)}},scopedSlots:e._u([{key:"prepend",fn:function(){return[n("q-select",{attrs:{dense:"",filled:"",label:"i18n",readonly:"",value:t.itemKey}})]},proxy:!0}],null,!0)})]}},{key:"appendItem",fn:function(){return[n("q-input",{attrs:{outlined:"",label:"new title"},scopedSlots:e._u([{key:"prepend",fn:function(){return[n("q-select",{attrs:{filled:"",dense:"",label:"i18n",options:e.itemModel.i18nOpts},model:{value:e.itemModel.i18n,callback:function(t){e.$set(e.itemModel,"i18n",t)},expression:"itemModel.i18n"}})]},proxy:!0},{key:"append",fn:function(){return[n("alphabiz-button",{attrs:{"button-type":"icon",icon:"add_circle","on-click":e.appendItem}},[n("q-tooltip",[e._v("添加")])],1)]},proxy:!0}]),model:{value:e.itemModel.label,callback:function(t){e.$set(e.itemModel,"label",t)},expression:"itemModel.label"}})]},proxy:!0}])})},X=[],Z=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("q-card",{staticClass:"editor-table",staticStyle:{outline:"1px solid gainsboro"},attrs:{flat:""}},[n("div",{staticClass:"row q-my-sm"},[n("div",[n("div",{staticClass:"editor-subtitle non-selectable text-capitalize",class:[e.inset?"inset":""]},[e._v(e._s(e.name))]),e.description?n("div",{staticClass:"text-caption non-selectable"},[e._v(e._s(e.description))]):e._e()]),n("q-space"),e._t("corner")],2),n("div",{staticClass:"q-my-sm"},[e._l(e.value,(function(t,s){return[e.value[s]?n("div",{key:s,staticClass:"q-my-md"},[e._t("default",null,{itemVal:t,itemKey:s})],2):e._e()]}))],2),n("div",{directives:[{name:"show",rawName:"v-show",value:e.$slots.removeItem,expression:"$slots.removeItem"}],staticClass:"q-my-sm"},[e._t("removeItem")],2),n("div",{directives:[{name:"show",rawName:"v-show",value:e.$slots.appendItem,expression:"$slots.appendItem"}],staticClass:"q-my-sm"},[n("div",{staticClass:"text-weight-bold q-mt-md q-mb-sm",staticStyle:{"font-size":"0.9rem"}},[e._v("新增")]),e._t("appendItem")],2)])},ee=[],te={name:"Table",props:{name:String,description:String,value:Object,inset:Boolean}},ne=te,se=(n("f255"),n("2c91")),ae=Object(m["a"])(ne,Z,ee,!1,null,null,null),oe=ae.exports;y()(ae,"components",{QCard:v["a"],QSpace:se["a"]});var le=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("q-input",{attrs:{label:e.label,dense:e.dense,outlined:"",value:e.curValue},on:{input:e.handleInput,focus:function(t){return e.handleFocus(t.type)},blur:function(t){return e.handleFocus(t.type)}},scopedSlots:e._u([{key:"prepend",fn:function(){return[e._t("prepend")]},proxy:!0},{key:"append",fn:function(){return[e.append?[n("alphabiz-button",{attrs:{"button-type":"icon",icon:"add_circle","on-click":e.onAppend}},[n("q-tooltip",[e._v("保存")])],1)]:[n("alphabiz-button",{directives:[{name:"show",rawName:"v-show",value:e.removable,expression:"removable"}],attrs:{"button-type":"icon",icon:"delete","on-click":function(){return e.onRemove()}}},[n("q-tooltip",[e._v("删除")])],1),n("alphabiz-button",{attrs:{"button-type":"icon",icon:"save","on-click":function(){return e.onSave(e.model)}}},[n("q-tooltip",[e._v("保存")])],1)]]},proxy:!0}],null,!0)})},ie=[],re={name:"Field",props:{label:String,dense:Boolean,value:String,removable:{type:Boolean,default:!0},append:Boolean,onRemove:Function,onSave:Function,onAppend:Function},data(){return{isFocus:!1,model:null}},computed:{curValue(){return this.append?this.value:this.isFocus?this.model:this.value}},methods:{handleFocus(e){"focusout"===e?this.isFocus=!1:(this.model=this.value,this.isFocus=!0)},handleInput(e){this.append?this.$emit("input",e):this.model=e}}},ce=re,ue=n("05c0"),de=Object(m["a"])(ce,le,ie,!1,null,null,null),me=de.exports;y()(de,"components",{QInput:h["a"],QTooltip:ue["a"]});var pe={name:"Title",components:{Table:oe,Field:me},props:{id:String,value:Object},data(){return{itemModel:{i18nOpts:["en-us","zh-cn","zh-tw"],i18n:"en-us",label:null}}},methods:{saveItem(e,...t){if(!e)return;const n=this.$GunDB.lib.titles.get(this.id),s=t.reduce(((e,t)=>e.get(t)),n);s.put(e)},removeItem(e){const t=this.$GunDB.lib.titles.get(this.id);t.get(e).put(null)},appendItem(){const{i18n:e,label:t}=this.itemModel;if(!e||!t)return;const n=this.$GunDB.lib.titles.get(this.id);n.get(e).put(t),this.itemModel.i18n="en-us",this.itemModel.label=null}}},ve=pe,be=n("ddd8"),fe=Object(m["a"])(ve,Y,X,!1,null,null,null),he=fe.exports;y()(fe,"components",{QSelect:be["a"],QInput:h["a"],QTooltip:ue["a"]});var ge=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("Table",{attrs:{value:e.value,name:"cover",description:"当前资源的封面图片的链接"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("Field",{attrs:{label:"cover src",value:t.itemVal,removable:e.removable,"on-remove":function(){return e.removeItem(t.itemKey)},"on-save":function(n){return e.saveItem(n,t.itemKey)}}})]}},{key:"appendItem",fn:function(){return[n("Field",{attrs:{append:"","on-append":e.appendItem,label:"cover src"},model:{value:e.itemModel,callback:function(t){e.itemModel=t},expression:"itemModel"}})]},proxy:!0}])})},ye=[],_e={name:"Cover",components:{Table:oe,Field:me},props:{id:String,value:Object},data(){return{itemModel:null}},computed:{removable(){const e=e=>{const t=this.value[e];return t&&"object"===typeof t&&Object.keys(t).length>=1};return Object.keys(this.value).filter(e).length>1}},methods:{saveItem(e,...t){if(!e)return;const n=this.$GunDB.lib.covers.get(this.id),s=t.reduce(((e,t)=>e.get(t)),n);s.put(e)},removeItem(e){const t=this.$GunDB.lib.covers.get(this.id);t.get(e).put(null)},appendItem(){if(!this.itemModel)return;const e=this.$GunDB.lib.covers.get(this.id);e.set(this.itemModel),this.itemModel=null}}},Ce=_e,ke=Object(m["a"])(Ce,ge,ye,!1,null,null,null),qe=ke.exports,Ie=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("Table",{attrs:{value:e.value,name:"source",description:"当前资源的数据来源"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("Table",{attrs:{inset:"",value:t.itemVal,name:"item ("+t.itemKey+")"},scopedSlots:e._u([{key:"default",fn:function(s){return[n("Field",{attrs:{label:s.itemKey,value:s.itemVal,removable:!1,"on-save":function(n){return e.saveItem(n,t.itemKey,s.itemKey)}}})]}},e.removable?{key:"removeItem",fn:function(){return[n("alphabiz-button",{attrs:{icon:"delete",label:"删除","on-click":function(){return e.removeItem(t.itemKey)}}})]},proxy:!0}:null],null,!0)})]}},{key:"appendItem",fn:function(){return[e._l(e.itemModel,(function(t,s){return n("q-input",{key:s,staticClass:"q-my-sm",attrs:{label:s,outlined:""},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.itemModel[s],callback:function(t){e.$set(e.itemModel,s,t)},expression:"itemModel[key]"}})})),n("alphabiz-button",{attrs:{icon:"add_circle",label:"添加","on-click":e.appendItem}})]},proxy:!0}])})},xe=[],Se={name:"Source",components:{Table:oe,Field:me},props:{id:String,value:Object},data(){return{itemModel:{link:null,rating:0,comments:null}}},computed:{removable(){const e=e=>{const t=this.value[e];return t&&"object"===typeof t&&Object.keys(t).length>=1};return Object.keys(this.value).filter(e).length>1}},methods:{saveItem(e,...t){if(!e)return;const n=this.$GunDB.lib.sources.get(this.id),s=t.reduce(((e,t)=>e.get(t)),n);s.put(e)},removeItem(e){const t=this.$GunDB.lib.sources.get(this.id);this.$GunDB.lib.removeNode(t.get(e),this.value[e])},appendItem(){if(!this.itemModel)return;if(!this.itemModel.link)return;if(!this.itemModel.rating)return;if(!this.itemModel.comments)return;const e=this.$GunDB.lib.sources.get(this.id);e.set(Object.assign({},this.itemModel)),this.itemModel.link=null,this.itemModel.rating=0,this.itemModel.comments=null}}},we=Se,Te=Object(m["a"])(we,Ie,xe,!1,null,null,null),$e=Te.exports;y()(Te,"components",{QInput:h["a"]});var De={name:"ResourceEditor",components:{Title:he,Cover:qe,Source:$e},props:{id:String},data(){return{currentResourceInterval:null,currentResource:{}}},created(){const e=e=>{this.currentResource=e};this.resourceInterval=this.$GunDB.lib.openSpecificResource(this.id,e)},computed:{resourceRowData(){const e=["title","cover","source"];return Object.entries(this.currentResource).map((([e,t])=>({name:e,data:t}))).filter((({name:e})=>"id"!==e)).sort(((t,n)=>{const s=e.indexOf(t.name),a=e.indexOf(n.name);return s>a?1:s<a?-1:0}))}},methods:{removeResource(){const e=this.currentResource,t=this.$GunDB.lib.resources.get(this.id);console.log(e,t),this.$emit("removed")}},beforeDestroy(){var e;null===(e=this.resourceInterval)||void 0===e||e.clear()}},Re=De,Le=(n("0fc6"),n("eaac")),Qe=Object(m["a"])(Re,J,H,!1,null,"3236dfa3",null),Oe=Qe.exports;y()(Qe,"components",{QTable:Le["a"],QSpace:se["a"],QBtn:F["a"]});var Ee=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("q-card",{staticClass:"resource-creator",attrs:{flat:"",bordered:""}},[n("div",{staticClass:"creator-header"},[n("div",[n("div",{staticClass:"text-weight-bolder non-selectable text-no-wrap ellipsis",staticStyle:{"font-size":"1.6rem"}},[e._v("Create Resource")]),n("div",{staticClass:"q-mt-md non-selectable",staticStyle:{"font-size":"0.8rem"}},[n("p",[e._v("Title: 新建资源时必须提供英文标题，若有其他语言的标题可后续添加。")]),n("p",[e._v("Source Rating: 标明该AB链接的优先级，必须为0-100的数字。")])])])]),n("div",{staticClass:"creator-container"},[n("q-input",{attrs:{outlined:"",dense:"",rules:e.rulesGeneral,label:"英文标题 | Title (en-us)"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.model.title,callback:function(t){e.$set(e.model,"title",t)},expression:"model.title"}}),n("q-input",{attrs:{outlined:"",dense:"",rules:e.rulesGeneral,label:"封面链接 | Cover"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.model.cover,callback:function(t){e.$set(e.model,"cover",t)},expression:"model.cover"}}),n("q-input",{attrs:{outlined:"",dense:"",rules:e.rulesGeneral,label:"AB链接 | Source Link"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.model.source.link,callback:function(t){e.$set(e.model.source,"link",t)},expression:"model.source.link"}}),n("q-input",{attrs:{outlined:"",dense:"",rules:e.rulesGeneral,label:"优先级 | Source Rating"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.model.source.rating,callback:function(t){e.$set(e.model.source,"rating",t)},expression:"model.source.rating"}}),n("q-input",{attrs:{outlined:"",dense:"",rules:e.rulesGeneral,label:"备注 | Source Comments"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.model.source.comments,callback:function(t){e.$set(e.model.source,"comments",t)},expression:"model.source.comments"}})],1),n("div",{staticClass:"q-mt-md"},[n("alphabiz-button",{attrs:{color:"primary",label:"Create","on-click":e.create}})],1)])},je=[],Ae=n("e1bd");const Ge=Object(Ae["a"])("1234567890abcdefghijklmnopqrstuvwxyz",20);var Be={name:"ResourceCreator",data(){return{model:{title:null,cover:null,source:{link:null,rating:null,comments:null}}}},computed:{rulesGeneral(){return[e=>e&&e.length>0||"此项不可为空"]}},methods:{create(){const e=Ge(),t={"en-us":this.model.title},n=[this.model.cover],s=[{link:this.model.source.link,rating:this.model.source.rating,comments:this.model.source.comments}];this.$GunDB.lib.createResource(e,{title:t,cover:n,source:s}),this.$emit("created",e)}}},Pe=Be,Me=(n("76e0"),Object(m["a"])(Pe,Ee,je,!1,null,"33ca416d",null)),Ve=Me.exports;y()(Me,"components",{QCard:v["a"],QInput:h["a"]});var ze=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e.clientStatusList&&e.clientStatusList.length>0?[n("q-table",{attrs:{flat:"",columns:e.columns,"row-key":"id",data:e.clientStatusData},scopedSlots:e._u([{key:"top",fn:function(){return[n("div",[n("div",{staticClass:"text-weight-bold text-h5 q-mt-md"},[e._v("Clients")]),n("div",{staticClass:"q-mt-sm"},[n("span",{staticClass:"text-weight-bold"},[e._v("Current: ")]),n("span",{staticClass:"inline-block bg-general q-ml-md q-py-sm q-px-sm rounded-borders"},[e._v(e._s((new Date).toUTCString()))])])]),n("q-space")]},proxy:!0},{key:"body-cell-id",fn:function(t){return[n("q-td",{style:t.row.local?{backgroundColor:"#f5f5dc"}:{},attrs:{props:t}},[n("div",[n("span",[e._v(e._s(t.value))]),t.row.local?n("q-badge",{staticClass:"q-ml-sm",attrs:{"text-color":"accent",color:"accent",label:"you"}}):e._e()],1)])]}},{key:"body-cell-status",fn:function(e){return[n("q-td",{attrs:{props:e,"auto-width":""}},[n("div",[n("q-badge",{attrs:{"text-color":{online:"positive",offline:"general"}[e.value],color:{online:"positive",offline:"general"}[e.value],label:e.value}})],1)])]}}],null,!1,2694056142)})]:e._e()],2)},Fe=[],Ue={name:"ClientStatus",data(){const e=(e,t,n,s)=>n.local?1:s.local?-1:n.timestamp===s.timestamp?0:n.timestamp>s.timestamp?1:-1,t=e=>(new Date).getTime()-e>1e4?"offline":"online";return{clientStatusList:[],clientInterval:null,columns:[{field:"id",name:"id",label:"Client ID",align:"left"},{field:"timestamp",name:"time",label:"Time",align:"right",format:e=>new Date(e).toUTCString()},{field:"timestamp",name:"timestamp",label:"Timestamp",align:"right",format:e=>e},{field:"timestamp",name:"status",label:"Status",align:"right",format:t,sortable:!0,sort:e,sortOrder:"da"}]}},computed:{clientStatusData(){const e=[];return e.push(...Object.values(this.clientStatusList)),e}},mounted(){this.clientInterval=this.$GunDB.client.openAllConnections((e=>{this.clientStatusList=e}))},beforeDestroy(){var e,t;null===(e=this.clientInterval)||void 0===e||null===(t=e.clear)||void 0===t||t.call(e)}},Ke=Ue,Ne=n("db86"),We=n("58a81"),Je=Object(m["a"])(Ke,ze,Fe,!1,null,"d053d2c2",null),He=Je.exports;y()(Je,"components",{QTable:Le["a"],QSpace:se["a"],QTd:Ne["a"],QBadge:We["a"]});var Ye={name:"LibraryEditor",components:{ResourceEditor:Oe,ResourceCreator:Ve,ClientStatus:He},data(){return{resourcesRaw:{},resourcesInterval:null,resourcesSelected:[],showCreatorDialog:!1,editTarget:null,columns:[{field:"id",label:"ID",align:"left"},{field:e=>{var t;return null===(t=e.title)||void 0===t?void 0:t["en-us"]},label:"Title",align:"left"}]}},created(){this.$GunDB.gun||this.$GunDB.enable({peers:["http://gun-manhattan.herokuapp.com/gun"],localStorage:!0})},mounted(){this.resourcesInterval=this.$GunDB.lib.openAllResources((e=>{this.resourcesRaw=e}))},beforeDestroy(){var e,t;null===(e=this.resourcesInterval)||void 0===e||null===(t=e.clear)||void 0===t||t.call(e)},methods:{isCompletedResource(e){return!(!e||"object"!==typeof e)&&(!!e.id&&!(!e.title||!e.title["en-us"]))},handleRemoved(){this.showEditorDialog=!1,this.resourcesInterval&&this.resourcesInterval.clear(),this.resourcesInterval=this.$GunDB.lib.openAllResources((e=>{this.resourcesRaw=e}))}},computed:{resources:{get(){const e={},t=Object.entries(this.resourcesRaw);return t.filter((e=>this.isCompletedResource(e[1]))).forEach((([t,n])=>{e[t]=n})),e},set(e){console.log(e)}},resourcesData(){return Object.values(this.resources)},showEditorDialog:{get(){const e=this.resources&&this.editTarget&&this.resources[this.editTarget];return Boolean(e)},set(e){e||(this.editTarget=null)}}},watch:{resourcesSelected(e){e&&e.length>0&&(this.editTarget=e[0].id)},editTarget(e){e||(this.resourcesSelected=[])}}},Xe=Ye,Ze=(n("9686"),n("24e8")),et=Object(m["a"])(Xe,N,W,!1,null,"5af860bc",null),tt=et.exports;y()(et,"components",{QDialog:Ze["a"],QSeparator:f["a"],QTable:Le["a"],QSpace:se["a"],QBtn:F["a"]});const nt=n("ed08").isElectron();var st={name:"Development",components:{AccountTabPanel:C,AmplifyTabPanel:T,DevInfoTabPanel:A,UrlConvert:K,LibraryEditor:tt},data(){return{currentTab:"accountInfo"}},methods:{delete_config(){this.$q.electron.ipcRenderer.invoke("deleteConfig").then((e=>{this.$q.notify(e)}))},getLocale(){this.$q.notify(this.$q.lang.getLocale())},getVueLocale(){this.$q.notify(this.$i18n.locale)},getUsersLanguage(){o["localConfigs"].getSettingsItem("language").then((e=>{this.$q.notify({message:e,position:"bottom-right",type:"positive",timeout:3e3})})).catch((()=>{this.$q.notify({message:"未获取到数据项",position:"bottom-right",type:"negative",timeout:3e3})}))},openWebtorrentDevTools(){if(nt)return n("34bb").ipcRenderer.send("open-webtorrent-devtools")}}},at=st,ot=(n("fb84"),n("9989")),lt=n("a370"),it=n("429b"),rt=n("7460"),ct=n("adad"),ut=n("823b"),dt=Object(m["a"])(at,s,a,!1,null,"dcaa97aa",null);t["default"]=dt.exports;y()(dt,"components",{QPage:ot["a"],QCard:v["a"],QCardSection:lt["a"],QTabs:it["a"],QTab:rt["a"],QSeparator:f["a"],QTabPanels:ct["a"],QTabPanel:ut["a"]})},b593:function(e,t,n){},f255:function(e,t,n){"use strict";n("8341")},fb84:function(e,t,n){"use strict";n("acab")}}]);