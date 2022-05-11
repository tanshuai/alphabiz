(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[7],{"0ab7":function(e,t,s){},"1e31":function(e,t,s){},3042:function(e,t,s){"use strict";s("55d8")},"4c7c":function(e,t,s){"use strict";s("1e31")},"55d8":function(e,t,s){},"76e0":function(e,t,s){"use strict";s("0ab7")},"96cf":function(e,t,s){"use strict";s("e61c")},acab:function(e,t,s){},b006:function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-page",{staticClass:"q-pa-sm"},[s("q-card",{staticClass:"q-mb-sm",attrs:{bordered:"",flat:""}},[s("q-card-section",{staticClass:"panel"},e._l([{color:"positive",icon:"bug_report",label:"Open WebTorrent DevTools",handleClick:e.openWebtorrentDevTools},{color:"negative",icon:"delete_forever",label:"Clear Application Config",handleClick:e.delete_config},{color:"general",icon:"translate",label:"Get User Language",handleClick:e.getUsersLanguage},{color:"general",icon:"language",label:"Get Vue Locale",handleClick:e.getVueLocale},{color:"general",icon:"flag",label:"Get Quasar Locale",handleClick:e.getLocale}],(function(e,t){return s("alphabiz-button",{key:t,attrs:{color:e.color,icon:e.icon,label:e.label},on:{click:e.handleClick}})})),1)],1),s("q-card",{staticClass:"q-mb-sm",attrs:{bordered:"",flat:""}},[s("q-tabs",{attrs:{align:"left","no-caps":"","narrow-indicator":""},model:{value:e.currentTab,callback:function(t){e.currentTab=t},expression:"currentTab"}},e._l([{name:"accountInfo",icon:"account_circle",label:"Account Info"},{name:"amplify",icon:"developer_board",label:"Amplify"},{name:"devInfo",icon:"info",label:"Dev Info"},{name:"urlConvert",icon:"link",label:"Alphabiz URL Convert"},{name:"libraryEditor",icon:"shopping_bag",label:"Library Editor"}],(function(t){return s("q-tab",e._b({key:t.name},"q-tab",t,!1))})),1),s("q-separator"),s("q-tab-panels",{attrs:{animated:""},model:{value:e.currentTab,callback:function(t){e.currentTab=t},expression:"currentTab"}},[s("q-tab-panel",{attrs:{name:"accountInfo"}},[s("account-tab-panel")],1),s("q-tab-panel",{attrs:{name:"amplify"}},[s("amplify-tab-panel")],1),s("q-tab-panel",{attrs:{name:"devInfo"}},[s("dev-info-tab-panel")],1),s("q-tab-panel",{attrs:{name:"urlConvert"}},[s("url-convert")],1),s("q-tab-panel",{attrs:{name:"libraryEditor"}},[s("library-editor")],1)],1)],1)],1)},n=[],l=s("ed08"),i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticClass:"q-ma-sm"},[s("q-checkbox",{attrs:{label:"isTestEnv"},model:{value:e.isTest,callback:function(t){e.isTest=t},expression:"isTest"}})],1),s("h4",[e._v(e._s(e.$store.state.account.authState))]),"signedIn"===e.$store.state.account.authState?s("div",{staticClass:"row",staticStyle:{margin:"-4px"}},[e._l(e.$store.getters.accountUserInfo,(function(t,a){return[Array.isArray(t)?[s("div",{key:a,staticClass:"col-12 col-lg-6 q-pa-xs"},[s("q-card",{staticClass:"overflow-hidden",attrs:{flat:"",bordered:""}},[Array.isArray(t)?s("q-expansion-item",{attrs:{"content-inset-level":.4,label:a}},e._l(t,(function(t,a){return s("div",{key:a},[e._v(e._s(t)+"\n              ")])})),0):e._e()],1)],1)]:[s("div",{key:a,staticClass:"col-6 col-sm-3 col-lg-2 q-pa-xs"},[s("q-card",{staticClass:"overflow-hidden q-px-md q-py-sm",staticStyle:{"min-height":"66px"},attrs:{flat:"",bordered:""}},[s("div",{staticClass:"text-capitalize",staticStyle:{"font-size":"0.8rem",opacity:"0.8"}},[e._v(e._s(a)+"\n            ")]),s("div",{staticClass:"text-weight-bold text-no-wrap ellipsis"},[e._v(e._s(t))])])],1)]]}))],2):e._e(),"signedIn"===e.$store.state.account.authState?[s("q-separator",{staticStyle:{margin:"16px -16px"}}),s("div",{staticClass:"q-mb-sm"},[s("q-input",{staticStyle:{"max-width":"300px"},attrs:{label:"TestToken",dense:"",outlined:""},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.testToken,callback:function(t){e.testToken=t},expression:"testToken"}})],1),s("div",[s("alphabiz-button",{attrs:{label:"Add Credits 100","on-click":e.addCredits}})],1)]:e._e()],2)},o=[],r=s("3eaf");const c=new r["a"].Rest("ABDevRest");var u={name:"AccountTabPanel",inject:["isTestEnv"],data(){return{testToken:""}},computed:{isTest:{get(){return this.isTestEnv.getValue()},set(e){this.isTestEnv.setValue(e)}}},methods:{async addCredits(){try{const e=await c.post("/development/addCredits",{testToken:this.testToken});console.log(e)}catch(e){this.$q.notify({message:e.message,type:"negative",position:"bottom-right",timeout:5e3})}}}},d=u,m=s("2877"),v=s("8f8e"),p=s("f09f"),b=s("3b73"),f=s("eb85"),h=s("27f9"),g=s("eebe"),C=s.n(g),y=Object(m["a"])(d,i,o,!1,null,"5a400cb1",null),x=y.exports;C()(y,"components",{QCheckbox:v["a"],QCard:p["a"],QExpansionItem:b["a"],QSeparator:f["a"],QInput:h["a"]});var q=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticClass:"q-my-xs"},e._l(e.$amplify.amplifyTest,(function(e,t){return s("amplify-button",{key:t,staticClass:"q-ma-xs",attrs:{label:t,"on-click":function(){return e()}}})})),1),s("div",[s("amplify-button",{staticClass:"q-ma-xs",attrs:{label:"testAPI","on-click":e.testAPI}}),s("amplify-button",{staticClass:"q-ma-xs",attrs:{label:"toFinish","on-click":e.toFinish}})],1),s("div",[s("amplify-button",{staticClass:"q-ma-xs",attrs:{label:"enableUserListener","on-click":e.enableUserListener}}),s("amplify-button",{staticClass:"q-ma-xs",attrs:{label:"disableUserListener","on-click":e.disableUserListener}}),s("amplify-button",{staticClass:"q-ma-xs",attrs:{label:"enablePublicListener","on-click":e.enablePublicListener}}),s("amplify-button",{staticClass:"q-ma-xs",attrs:{label:"disablePublicListener","on-click":e.disablePublicListener}})],1)])},w=[];const S=new r["a"].Rest("ABDevRest");var k={name:"AmplifyTabPanel",mounted(){},methods:{async enableUserListener(){await r["a"].GQL.enableUserListener(this.$store.state.account.sub),r["a"].GQL.addUserListener("hooks",(e=>{console.log("user:hooks",e)}))},async disableUserListener(){r["a"].GQL.disableUserListener()},async enablePublicListener(){await r["a"].GQL.enablePublicListener(),r["a"].GQL.addPublicListener("hooks",(e=>{console.log("pub:hooks",e)}))},async disablePublicListener(){r["a"].GQL.disablePublicListener()},async testAPI(){const e=await S.post("/test/transaction",{subA:"8df7f303-89e2-4231-b58e-c276b44ab19e",subB:"44b650d2-69a7-4faf-a900-38019dcc2cde",amount:1e3});console.log(e)},async toFinish(){const e=await this.$store.dispatch("CREDIT_PAY_DATA_FINISH",{transactionId:"d615d886-de57-4e5e-8d5c-e17c0e8bca30"});console.log(e)}}},I=k,_=Object(m["a"])(I,q,w,!1,null,"78db9fc0",null),T=_.exports,$=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[e.devInfo.torrentStore?s("div",{staticClass:"full-width"},[e._v("Torrent Config Store:\n    "),s("alphabiz-button",{staticClass:"dev-info-action q-ml-md",attrs:{label:"Open"},on:{click:function(t){return e.open(e.devInfo.torrentStore)}}}),s("alphabiz-button",{staticClass:"dev-info-action q-ml-sm",attrs:{label:"Reset"},on:{click:e.resetTorrent}}),s("pre",[e._v(e._s(e.devInfo.torrentStore))])],1):e._e(),e.devInfo.settingStore?s("div",{staticClass:"full-width"},[e._v("Setting Config Store:\n    "),s("alphabiz-button",{staticClass:"dev-info-action q-ml-md",attrs:{label:"Open"},on:{click:function(t){return e.open(e.devInfo.settingStore)}}}),s("alphabiz-button",{staticClass:"dev-info-action q-ml-sm",attrs:{label:"Reset"},on:{click:e.resetSetting}}),s("pre",[e._v(e._s(e.devInfo.settingStore))])],1):e._e(),e._v("\n  We are using\n  "),e.devInfo.electronVer?s("div",{staticClass:"full-width"},[e._v("Electron "+e._s(e.devInfo.electronVer)+"\n  ")]):e._e(),e.devInfo.chromeVer?s("div",{staticClass:"full-width"},[e._v("Chrome "+e._s(e.devInfo.chromeVer)+"\n  ")]):e._e(),e.devInfo.nodeVer?s("div",{staticClass:"full-width"},[e._v("Node "+e._s(e.devInfo.nodeVer)+"\n  ")]):e._e(),s("div",[e._v("Quasar "+e._s(e.$q.version))]),s("div",[e._v("Vue "+e._s(e.vueVersion))]),s("div",[e._v(" "+e._s(e.$q.platform))]),e.devInfo.processArgv?s("div",{staticClass:"full-width"},[e._v("Process Argv "+e._s(e.devInfo.processArgv))]):e._e()])},D=[],L=s("2b0e");const O=s("ed08").isElectron(),P=O?s("34bb").ipcRenderer:null;var Q={name:"DevInfoTabPanel",inject:["io"],data(){return{devInfo:{torrentStore:"",settingStore:""}}},methods:{open(e){this.io.emit("show_torrent_file",e)},resetTorrent(){O&&P.send("reset-torrent")},resetSetting(){this.$store.dispatch("resetSettings").then((e=>{this.$i18n.locale=e.language,this.$q.notify("Reset success")}))}},mounted(){O&&(P.on("dev-info",((e,t)=>{t.torrentStore&&(this.devInfo.torrentStore=t.torrentStore),t.settingStore&&(this.devInfo.settingStore=t.settingStore),t.electronVer&&(this.devInfo.electronVer=t.electronVer),t.chromeVer&&(this.devInfo.chromeVer=t.chromeVer),t.nodeVer&&(this.devInfo.nodeVer=t.nodeVer),t.argv&&(this.devInfo.processArgv=t.argv)})),P.send("dev-info")),this.io.off("notify",this.notify),this.io.on("notify",this.notify)},computed:{vueVersion(){return L["a"].version}}},R=Q,E=(s("3042"),Object(m["a"])(R,$,D,!1,null,"5f269e2f",null)),z=E.exports,A=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[e._v("\n  Alphabiz URL Convert\n  "),s("q-input",{staticClass:"q-my-md",attrs:{type:"text",label:"source url"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.url,callback:function(t){e.url=t},expression:"url"}}),s("q-btn",{attrs:{color:"primary",icon:"check",label:"Convert"},on:{click:e.convert}})],1)},G=[];const j=s("ed08").isElectron(),V=j?s("34bb").ipcRenderer:null;var B={name:"DevInfoTabPanel",inject:["io"],data(){return{url:""}},methods:{convert(){this.url&&j&&(V.once("convert-url",((e,t)=>{this.url=t})),V.send("convert-url",this.url))}}},U=B,F=s("9c40"),N=Object(m["a"])(U,A,G,!1,null,"4cb3b9fe",null),W=N.exports;C()(N,"components",{QInput:h["a"],QBtn:F["a"]});var J=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticStyle:{margin:"-16px"}},[s("ClientStatus"),s("div",{staticClass:"lib-editor-actions"},[s("q-dialog",{model:{value:e.showCreatorDialog,callback:function(t){e.showCreatorDialog=t},expression:"showCreatorDialog"}},[s("ResourceCreator",{on:{created:function(t){e.showCreatorDialog=!1}}})],1),s("q-dialog",{model:{value:e.showEditorDialog,callback:function(t){e.showEditorDialog=t},expression:"showEditorDialog"}},[e.resources[e.editTarget]?s("ResourceEditor",{attrs:{id:e.editTarget}}):e._e()],1)],1),e.resourcesData&&e.resourcesData.length>0?[s("q-separator",{staticClass:"q-my-xs"}),s("q-table",{attrs:{flat:"",columns:e.columns,"row-key":"id",data:e.resourcesData,selection:"single",selected:e.resourcesSelected},on:{"update:selected":function(t){e.resourcesSelected=t}},scopedSlots:e._u([{key:"top",fn:function(t){return[s("div",{staticClass:"text-weight-bold text-h5 q-mt-md"},[e._v("Resources")]),s("q-space"),s("alphabiz-button",{attrs:{icon:"add",label:"新建资源",immediate:""},on:{click:function(t){e.showCreatorDialog=!0}}}),s("q-btn",{staticClass:"q-ml-md",attrs:{flat:"",round:"",dense:"",icon:t.inFullscreen?"fullscreen_exit":"fullscreen"},on:{click:t.toggleFullscreen}})]}}],null,!1,3470689597)})]:e._e()],2)},Y=[],H=(s("ddb0"),function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-card",{staticClass:"resource-editor",attrs:{flat:"",bordered:""}},[s("div",{staticClass:"editor-header"},[e.value.title?s("div",{staticClass:"editor-title text-no-wrap ellipsis"},[e._v(e._s(e.value.title["en-us"]))]):e._e(),s("alphabiz-button",{staticClass:"q-mx-xs",attrs:{label:"删除资源","on-click":e.removeItem}}),s("alphabiz-button",{staticClass:"q-mx-xs",attrs:{label:"同步最新数据","on-click":e.sync}})],1),s("div",{staticClass:"q-mb-sm",staticStyle:{display:"flex","align-items":"center"}},[s("div",{staticClass:"q-mr-sm non-selectable",staticStyle:{"font-size":"1.2rem"}},[e._v("ID:")]),s("div",{staticClass:"bg-general q-px-sm q-py-xs rounded-borders",staticStyle:{"font-size":"1rem"}},[e._v(e._s(e.value.id))])]),s("div",{staticClass:"resource-item-container"},[e.value.title?s("q-card",{attrs:{flat:""}},[s("div",{staticStyle:{display:"flex"}},[s("div",{staticStyle:{"flex-grow":"1"}},[s("div",{staticClass:"editor-subtitle non-selectable"},[e._v("Title")]),s("div",{staticClass:"text-caption q-mb-sm non-selectable"},[e._v("当前资源的标题")])]),s("div")]),e._l(e.value.title,(function(t,a){return[e.value.title[a]?s("div",{key:a,staticClass:"q-pa-xs",staticStyle:{display:"flex",margin:"-8px"}},[s("q-select",{staticClass:"q-ma-xs",staticStyle:{"flex-shrink":"0"},attrs:{dense:"",outlined:"",label:"i18n",readonly:"",value:a}}),s("q-input",{staticClass:"q-ma-xs",staticStyle:{"flex-grow":"1"},attrs:{dense:"",outlined:"",label:"label"},nativeOn:{paste:function(e){e.stopPropagation()}},scopedSlots:e._u([{key:"after",fn:function(){return[s("alphabiz-button",{staticClass:"q-ma-xs",attrs:{label:"保存","on-click":function(){return e.saveItemTitle(a)}}}),s("alphabiz-button",{directives:[{name:"show",rawName:"v-show",value:"en-us"!==a,expression:"type!=='en-us'"}],staticClass:"q-ma-xs",attrs:{label:"移除","on-click":function(){return e.removeItemTitle(a)}}})]},proxy:!0}],null,!0),model:{value:e.value.title[a],callback:function(t){e.$set(e.value.title,a,t)},expression:"value.title[type]"}})],1):e._e()]})),s("div",{staticClass:"text-weight-bold q-mt-md q-mb-sm",staticStyle:{"font-size":"0.9rem"}},[e._v("添加新标题")]),s("div",{staticClass:"q-pa-xs",staticStyle:{display:"flex",margin:"-8px"}},[s("q-select",{staticClass:"q-ma-xs",attrs:{dense:"",outlined:"",label:"i18n",options:e.newItemTitle.i18nOpts},model:{value:e.newItemTitle.i18n,callback:function(t){e.$set(e.newItemTitle,"i18n",t)},expression:"newItemTitle.i18n"}}),s("q-input",{staticClass:"q-ma-xs",staticStyle:{"flex-grow":"1"},attrs:{dense:"",outlined:"",label:"new title"},scopedSlots:e._u([{key:"after",fn:function(){return[s("alphabiz-button",{staticClass:"q-ma-xs",attrs:{label:"添加","on-click":e.appendItemTitle}})]},proxy:!0}],null,!1,4185438170),model:{value:e.newItemTitle.label,callback:function(t){e.$set(e.newItemTitle,"label",t)},expression:"newItemTitle.label"}})],1)],2):e._e(),e.value.cover?s("q-card",{attrs:{flat:""}},[s("div",{staticStyle:{display:"flex"}},[s("div",{staticStyle:{"flex-grow":"1"}},[s("div",{staticClass:"editor-subtitle non-selectable"},[e._v("Cover")]),s("div",{staticClass:"text-caption q-mb-sm non-selectable"},[e._v("当前资源的封面图片的链接")])]),s("div")]),e._l(e.value.cover,(function(t,a){return[e.value.cover[a]?s("div",{key:a,staticClass:"q-pa-xs",staticStyle:{display:"flex",margin:"-8px"}},[s("q-input",{staticClass:"q-ma-xs",staticStyle:{"flex-grow":"1"},attrs:{dense:"",outlined:"",label:"src"},nativeOn:{paste:function(e){e.stopPropagation()}},scopedSlots:e._u([{key:"after",fn:function(){return[s("alphabiz-button",{staticClass:"q-ma-xs",attrs:{label:"保存","on-click":function(){return e.saveItemCover(a)}}}),s("alphabiz-button",{directives:[{name:"show",rawName:"v-show",value:Object.keys(e.value.cover).length>1,expression:"Object.keys(value.cover).length > 1"}],staticClass:"q-ma-xs",attrs:{label:"移除","on-click":function(){return e.removeItemCover(a)}}})]},proxy:!0}],null,!0),model:{value:e.value.cover[a],callback:function(t){e.$set(e.value.cover,a,t)},expression:"value.cover[k]"}})],1):e._e()]})),s("div",{staticClass:"text-weight-bold q-mt-md q-mb-sm",staticStyle:{"font-size":"0.9rem"}},[e._v("添加新的封面链接")]),s("div",{staticClass:"q-pa-xs",staticStyle:{display:"flex",margin:"-8px"}},[s("q-input",{staticClass:"q-ma-xs",staticStyle:{"flex-grow":"1"},attrs:{dense:"",outlined:"",label:"new src"},nativeOn:{paste:function(e){e.stopPropagation()}},scopedSlots:e._u([{key:"after",fn:function(){return[s("alphabiz-button",{staticClass:"q-ma-xs",attrs:{label:"添加","on-click":e.appendItemCover}})]},proxy:!0}],null,!1,3908693111),model:{value:e.newItemCover,callback:function(t){e.newItemCover=t},expression:"newItemCover"}})],1)],2):e._e(),e.value.source?s("q-card",{attrs:{flat:""}},[s("div",{staticStyle:{display:"flex"}},[s("div",{staticStyle:{"flex-grow":"1"}},[s("div",{staticClass:"editor-subtitle non-selectable"},[e._v("Source")]),s("div",{staticClass:"text-caption q-mb-sm non-selectable"},[e._v("当前资源的数据来源")])]),s("div")]),e._l(e.value.source,(function(t,a){return[e.value.source[a]?s("div",{key:a},[s("q-separator",{staticStyle:{margin:"8px 0"}}),s("div",{staticClass:"q-pa-xs",staticStyle:{display:"flex",margin:"-8px","flex-wrap":"wrap"}},[s("q-input",{staticClass:"q-ma-xs",staticStyle:{"min-width":"300px","flex-grow":"10"},attrs:{dense:"",outlined:"",label:"AB链接"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.value.source[a].link,callback:function(t){e.$set(e.value.source[a],"link",t)},expression:"value.source[k].link"}}),s("q-input",{staticClass:"q-ma-xs",staticStyle:{width:"56px","flex-grow":"1"},attrs:{dense:"",outlined:"",label:"Rating",type:"number"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.value.source[a].rating,callback:function(t){e.$set(e.value.source[a],"rating",t)},expression:"value.source[k].rating"}}),s("q-input",{staticClass:"q-ma-xs",staticStyle:{width:"100%","flex-grow":"1"},attrs:{dense:"",outlined:"",label:"备注信息"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.value.source[a].comments,callback:function(t){e.$set(e.value.source[a],"comments",t)},expression:"value.source[k].comments"}}),s("div",{staticClass:"q-ma-xs"},[s("alphabiz-button",{staticClass:"q-mr-sm",attrs:{label:"保存","on-click":function(){return e.saveItemSource(a)}}}),s("alphabiz-button",{directives:[{name:"show",rawName:"v-show",value:Object.keys(e.value.source).length>1,expression:"Object.keys(value.source).length > 1"}],attrs:{label:"移除","on-click":function(){return e.removeItemSource(a)}}})],1)],1)],1):e._e()]})),s("q-separator",{staticStyle:{margin:"8px 0"}}),s("div",{staticClass:"text-weight-bold q-mt-md q-mb-sm",staticStyle:{"font-size":"0.9rem"}},[e._v("添加新的数据源")]),s("div",{staticClass:"q-pa-xs",staticStyle:{display:"flex",margin:"-8px","flex-wrap":"wrap"}},[s("q-input",{staticClass:"q-ma-xs",staticStyle:{"min-width":"300px","flex-grow":"10"},attrs:{dense:"",outlined:"",label:"Link"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.newItemSource.link,callback:function(t){e.$set(e.newItemSource,"link",t)},expression:"newItemSource.link"}}),s("q-input",{staticClass:"q-ma-xs",staticStyle:{width:"56px","flex-grow":"1"},attrs:{dense:"",outlined:"",label:"Rating",type:"number"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.newItemSource.rating,callback:function(t){e.$set(e.newItemSource,"rating",t)},expression:"newItemSource.rating"}}),s("q-input",{staticClass:"q-ma-xs",staticStyle:{width:"100%","flex-grow":"1"},attrs:{dense:"",outlined:"",label:"Comments"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.newItemSource.comments,callback:function(t){e.$set(e.newItemSource,"comments",t)},expression:"newItemSource.comments"}}),s("div",{staticClass:"q-ma-xs"},[s("alphabiz-button",{attrs:{label:"添加","on-click":e.appendItemSource}})],1)],1)],2):e._e()],1)])}),K=[],M=s("2ef0"),X={name:"ResourceEditor",props:{id:String},data(){return{value:{},newItemCover:null,newItemTitle:{i18nOpts:["en-us","zh-cn","zh-tw"],i18n:"en-us",label:null},newItemSource:{link:null,rating:1,comments:null}}},created(){this.sync()},methods:{sync(){this.value=Object(M["cloneDeep"])(this.$GunDB.lib.resourcesDict[this.id])},getTitle(){return this.$GunDB.lib.titles.get(this.value.id)},getCover(){return this.$GunDB.lib.covers.get(this.value.id)},getSource(){return this.$GunDB.lib.sources.get(this.value.id)},saveItemTitle(e){this.getTitle().get(e).put(this.value.title[e]),setTimeout((()=>this.sync()),500)},saveItemCover(e){this.getCover().get(e).put(this.value.cover[e]),setTimeout((()=>this.sync()),500)},saveItemSource(e){const t=this.value.source[e];this.getSource().get(e).put(t),setTimeout((()=>this.sync()),500)},removeItemTitle(e){this.getTitle().get(e).put(null),setTimeout((()=>this.sync()),500)},removeItemCover(e){this.getCover().get(e).put(null),setTimeout((()=>this.sync()),500)},removeItemSource(e){this.$GunDB.lib.removeSource(this.value.id,e),setTimeout((()=>this.sync()),500)},removeItem(){this.$GunDB.lib.removeResource(this.value.id),setTimeout((()=>this.sync()),500)},appendItemTitle(){const{i18n:e,label:t}=this.newItemTitle;this.getTitle().get(e).put(t),this.newItemTitle.i18n="en-us",this.newItemTitle.label=null,setTimeout((()=>this.sync()),500)},appendItemCover(){this.getCover().set(this.newItemCover),this.value.cover=Object(M["cloneDeep"])(this.$GunDB.lib.resourcesDict[this.id].cover),this.newItemCover=null,setTimeout((()=>this.sync()),500)},appendItemSource(){this.getSource().set({link:this.newItemSource.link,rating:this.newItemSource.rating,comments:this.newItemSource.comments}),this.newItemSource.link=null,this.newItemSource.rating=1,this.newItemSource.comments=null,setTimeout((()=>this.sync()),500)}}},Z=X,ee=(s("4c7c"),s("ddd8")),te=Object(m["a"])(Z,H,K,!1,null,"9af7fe24",null),se=te.exports;C()(te,"components",{QCard:p["a"],QSelect:ee["a"],QInput:h["a"],QSeparator:f["a"]});var ae=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-card",{staticClass:"resource-creator",attrs:{flat:"",bordered:""}},[s("div",{staticClass:"creator-header"},[s("div",[s("div",{staticClass:"text-weight-bolder non-selectable text-no-wrap ellipsis",staticStyle:{"font-size":"1.6rem"}},[e._v("Create Resource")]),s("div",{staticClass:"q-mt-md non-selectable",staticStyle:{"font-size":"0.8rem"}},[s("p",[e._v("Title: 新建资源时必须提供英文标题，若有其他语言的标题可后续添加。")]),s("p",[e._v("Source Rating: 标明该AB链接的优先级，必须为0-100的数字。")])])])]),s("div",{staticClass:"creator-container"},[s("q-input",{attrs:{outlined:"",dense:"",rules:e.rulesGeneral,label:"英文标题 | Title (en-us)"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.model.title,callback:function(t){e.$set(e.model,"title",t)},expression:"model.title"}}),s("q-input",{attrs:{outlined:"",dense:"",rules:e.rulesGeneral,label:"封面链接 | Cover"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.model.cover,callback:function(t){e.$set(e.model,"cover",t)},expression:"model.cover"}}),s("q-input",{attrs:{outlined:"",dense:"",rules:e.rulesGeneral,label:"AB链接 | Source Link"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.model.source.link,callback:function(t){e.$set(e.model.source,"link",t)},expression:"model.source.link"}}),s("q-input",{attrs:{outlined:"",dense:"",rules:e.rulesGeneral,label:"优先级 | Source Rating"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.model.source.rating,callback:function(t){e.$set(e.model.source,"rating",t)},expression:"model.source.rating"}}),s("q-input",{attrs:{outlined:"",dense:"",rules:e.rulesGeneral,label:"备注 | Source Comments"},nativeOn:{paste:function(e){e.stopPropagation()}},model:{value:e.model.source.comments,callback:function(t){e.$set(e.model.source,"comments",t)},expression:"model.source.comments"}})],1),s("div",{staticClass:"q-mt-md"},[s("alphabiz-button",{attrs:{color:"primary",label:"Create","on-click":e.create}})],1)])},ne=[],le=s("e1bd");const ie=Object(le["a"])("1234567890abcdefghijklmnopqrstuvwxyz",20);var oe={name:"ResourceCreator",data(){return{model:{title:null,cover:null,source:{link:null,rating:null,comments:null}}}},computed:{rulesGeneral(){return[e=>e&&e.length>0||"此项不可为空"]}},methods:{create(){const e=ie(),t={"en-us":this.model.title},s=[this.model.cover],a=[{link:this.model.source.link,rating:this.model.source.rating,comments:this.model.source.comments}];this.$GunDB.lib.createResource(e,{title:t,cover:s,source:a}),this.$emit("created",e)}}},re=oe,ce=(s("76e0"),Object(m["a"])(re,ae,ne,!1,null,"33ca416d",null)),ue=ce.exports;C()(ce,"components",{QCard:p["a"],QInput:h["a"]});var de=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[e.clientStatusList&&e.clientStatusList.length>0?[s("q-table",{attrs:{flat:"",columns:e.columns,"row-key":"id",data:e.clientStatusData},scopedSlots:e._u([{key:"top",fn:function(){return[s("div",[s("div",{staticClass:"text-weight-bold text-h5 q-mt-md"},[e._v("Clients")]),s("div",{staticClass:"q-mt-sm"},[s("span",{staticClass:"text-weight-bold"},[e._v("YOUR ID: ")]),s("span",{staticClass:"inline-block bg-general q-ml-md q-py-sm q-px-sm rounded-borders"},[e._v(e._s(e.$GunDB.client.id))])])]),s("q-space")]},proxy:!0},{key:"body-cell-id",fn:function(t){return[s("q-td",{style:t.row.local?{backgroundColor:"#f5f5dc"}:{},attrs:{props:t}},[s("div",[s("span",[e._v(e._s(t.value))]),t.row.local?s("q-badge",{staticClass:"q-ml-sm",attrs:{"text-color":"accent",color:"accent",label:"you"}}):e._e()],1)])]}},{key:"body-cell-status",fn:function(e){return[s("q-td",{attrs:{props:e,"auto-width":""}},[s("div",[s("q-badge",{attrs:{"text-color":{online:"positive",offline:"general"}[e.value],color:{online:"positive",offline:"general"}[e.value],label:e.value}})],1)])]}}],null,!1,3754901019)})]:e._e()],2)},me=[],ve={name:"ClientStatus",data(){const e=(e,t,s,a)=>e===t?s.local?1:a.local?-1:0:"online"===e?1:-1;return{clientStatusList:[],clientInterval:null,columns:[{field:"id",name:"id",label:"Client ID",align:"left"},{field:"timestamp",name:"time",label:"Time",align:"right",format:e=>new Date(e).toUTCString()},{field:"status",name:"status",label:"Status",align:"right",sortable:!0,sort:e,sortOrder:"ad"}]}},computed:{clientStatusData(){const e=[];return e.push(...Object.values(this.clientStatusList)),e}},mounted(){const e=()=>{const e=()=>{this.clientStatusList=this.$GunDB.client.getAllConnections()};this.clientInterval||clearInterval(this.clientInterval),this.clientInterval=setInterval(e,1e3),e()};e()},beforeDestroy(){const e=["clientInterval"];e.forEach((e=>{this[e]||clearInterval(this[e]),this[e]=null}))}},pe=ve,be=s("eaac"),fe=s("2c91"),he=s("db86"),ge=s("58a81"),Ce=Object(m["a"])(pe,de,me,!1,null,"4d5afab5",null),ye=Ce.exports;C()(Ce,"components",{QTable:be["a"],QSpace:fe["a"],QTd:he["a"],QBadge:ge["a"]});var xe={name:"LibraryEditor",components:{ResourceEditor:se,ResourceCreator:ue,ClientStatus:ye},data(){return{resourcesRaw:{},resourcesInterval:null,resourcesSelected:[],showCreatorDialog:!1,editTarget:null,columns:[{field:"id",label:"ID",align:"left"},{field:e=>{var t;return null===(t=e.title)||void 0===t?void 0:t["en-us"]},label:"Title",align:"left"}]}},mounted(){const e=()=>{const e=()=>{const e=this.$GunDB.lib.resourcesDict;e&&this.resourcesRaw!==e&&(this.resourcesRaw=e)};this.resourcesInterval||clearInterval(this.resourcesInterval),this.resourcesInterval=setInterval(e,1e3),e()};e()},beforeDestroy(){const e=["resourcesInterval"];e.forEach((e=>{this[e]||clearInterval(this[e]),this[e]=null}))},methods:{isCompletedResource(e){return!(!e||"object"!==typeof e)&&(!!e.id&&!(!e.title||!e.title["en-us"]))}},computed:{resources:{get(){const e={},t=Object.entries(this.resourcesRaw);return t.filter((([e,t])=>this.isCompletedResource(t))).forEach((([t,s])=>{e[t]=s})),e},set(e){console.log(e)}},resourcesData(){return Object.values(this.resources)},showEditorDialog:{get(){const e=this.resources&&this.editTarget&&this.resources[this.editTarget];return Boolean(e)},set(e){e||(this.editTarget=null)}}},watch:{resourcesSelected(e){e&&e.length>0&&(this.editTarget=e[0].id)},editTarget(e){e||(this.resourcesSelected=[])}}},qe=xe,we=(s("96cf"),s("24e8")),Se=Object(m["a"])(qe,J,Y,!1,null,"00b4cbc8",null),ke=Se.exports;C()(Se,"components",{QDialog:we["a"],QSeparator:f["a"],QTable:be["a"],QSpace:fe["a"],QBtn:F["a"]});const Ie=s("ed08").isElectron();var _e={name:"Development",components:{AccountTabPanel:x,AmplifyTabPanel:T,DevInfoTabPanel:z,UrlConvert:W,LibraryEditor:ke},data(){return{currentTab:"accountInfo"}},methods:{delete_config(){this.$q.electron.ipcRenderer.invoke("deleteConfig").then((e=>{this.$q.notify(e)}))},getLocale(){this.$q.notify(this.$q.lang.getLocale())},getVueLocale(){this.$q.notify(this.$i18n.locale)},getUsersLanguage(){l["localConfigs"].getSettingsItem("language").then((e=>{this.$q.notify({message:e,position:"bottom-right",type:"positive",timeout:3e3})})).catch((()=>{this.$q.notify({message:"未获取到数据项",position:"bottom-right",type:"negative",timeout:3e3})}))},openWebtorrentDevTools(){if(Ie)return s("34bb").ipcRenderer.send("open-webtorrent-devtools")}}},Te=_e,$e=(s("fb84"),s("9989")),De=s("a370"),Le=s("429b"),Oe=s("7460"),Pe=s("adad"),Qe=s("823b"),Re=Object(m["a"])(Te,a,n,!1,null,"dcaa97aa",null);t["default"]=Re.exports;C()(Re,"components",{QPage:$e["a"],QCard:p["a"],QCardSection:De["a"],QTabs:Le["a"],QTab:Oe["a"],QSeparator:f["a"],QTabPanels:Pe["a"],QTabPanel:Qe["a"]})},e61c:function(e,t,s){},fb84:function(e,t,s){"use strict";s("acab")}}]);