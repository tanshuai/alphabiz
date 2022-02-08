(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[10],{4779:function(t,e,s){},"9cb2":function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("q-page",{attrs:{padding:""}},[s("article",[s("div",[s("div",{staticClass:"configuration-variable q-pt-sm row"},[s("div",{staticClass:"col-4 m-t-8"},[s("span",{staticClass:"label-name"},[t._v(t._s(this.$t("language")))])]),s("div",{staticClass:"select-item col-8 row"},[s("div",{staticClass:"col-12"},[s("q-select",{staticClass:"select-direct",attrs:{outlined:"",size:"xs",dense:!0,options:t.language,"data-cy":"select-direct"},on:{input:t.selectLocaleLanguage},model:{value:t.currentLanguage,callback:function(e){t.currentLanguage=e},expression:"currentLanguage"}})],1)])]),s("div",{staticClass:"configuration-variable q-pt-sm row"},[s("div",{staticClass:"col-4 m-t-8"},[s("span",{staticClass:"label-name"},[t._v(t._s(this.$t("appearance")))])]),s("div",{staticClass:"select-item col-8 row"},[s("div",{staticClass:"col-12"},[s("q-select",{staticClass:"select-direct",attrs:{outlined:"",size:"xs",dense:!0,options:t.darkMode,"data-cy":"select-direct"},model:{value:t.currentDarkMode,callback:function(e){t.currentDarkMode=e},expression:"currentDarkMode"}})],1)])]),s("div",{staticClass:"configuration-variable q-pt-sm row"},[s("div",{staticClass:"col-4 m-t-4"},[s("span",{staticClass:"label-name"},[t._v(t._s(this.$t("start")))])]),s("div",{staticClass:"col-8 row"},[s("div",{staticClass:"col-12 m-b-8"},[s("q-checkbox",{staticClass:"rox-font",attrs:{color:"#606266",label:this.$t("autoStart"),size:"xs"},model:{value:t.settings.autoLaunch,callback:function(e){t.$set(t.settings,"autoLaunch",e)},expression:"settings.autoLaunch"}})],1),s("div",{staticClass:"col-12 m-b-8"},[s("q-checkbox",{staticClass:"rox-font",attrs:{size:"xs",label:this.$t("autoStartUnfinished")},model:{value:t.settings.autoStartUnfinished,callback:function(e){t.$set(t.settings,"autoStartUnfinished",e)},expression:"settings.autoStartUnfinished"}})],1)])]),s("div",{staticClass:"configuration-variable q-pt-sm row"},[s("div",{staticClass:"col-4 download_label"},[s("span",{staticClass:"label-name"},[t._v(t._s(this.$t("download_directory")))])]),s("div",{staticClass:"col-8 row"},[s("div",{staticClass:"col-12 "},[s("q-input",{staticClass:"directory-wd",attrs:{outlined:"",suffix:""},on:{blur:function(e){return t.validateDirectory(!1)}},scopedSlots:t._u([{key:"append",fn:function(){return[s("q-icon",{staticClass:"cursor-pointer",attrs:{name:"folder"},on:{click:function(e){return t.select_directory(!1)},clear:t.clear_select_directory}})]},proxy:!0}]),model:{value:t.settings.downloadDirectory,callback:function(e){t.$set(t.settings,"downloadDirectory",e)},expression:"settings.downloadDirectory"}})],1)])]),s("div",{staticClass:"configuration-variable row"},[s("div",{staticClass:"col-4 auto-upload"},[s("div",{staticClass:"label-name"},[t._v(t._s(t.$t("upload_directory")))])]),s("div",{staticClass:"col-8 row"},[s("div",{staticClass:"select-item col-12 m-b-8 select_label"},[s("q-input",{staticClass:"directory-wd",attrs:{outlined:"",dense:""},on:{blur:function(e){return t.validateDirectory(!0)}},scopedSlots:t._u([{key:"append",fn:function(){return[s("q-icon",{staticClass:"cursor-pointer",attrs:{name:"folder"},on:{click:function(e){return t.select_directory(!0)},clear:t.clear_select_directory}})]},proxy:!0}]),model:{value:t.settings.uploadDirectory,callback:function(e){t.$set(t.settings,"uploadDirectory",e)},expression:"settings.uploadDirectory"}}),s("q-checkbox",{staticClass:"q-mb-xs",model:{value:t.settings.autoUpload,callback:function(e){t.$set(t.settings,"autoUpload",e)},expression:"settings.autoUpload"}},[s("q-tooltip",[t._v("Enable")])],1)],1),s("q-checkbox",{attrs:{label:t.$t("unlimit_upload_amount")},model:{value:t.settings.unlimitUploadAmount,callback:function(e){t.$set(t.settings,"unlimitUploadAmount",e)},expression:"settings.unlimitUploadAmount"}},[s("q-tooltip",[t._v(t._s(t.$t("unlimit_upload_warning")))])],1)],1)]),s("div",{staticClass:"configuration-variable q-pt-sm row"},[s("div",{staticClass:"col-4 m-t-10"},[s("span",{staticClass:"label-name"},[t._v(t._s(this.$t("transport_setting")))])]),s("div",{staticClass:"col-8 row"},[s("div",{staticClass:"select-item col-12 m-b-8 select_label"},[s("q-checkbox",{staticStyle:{"margin-bottom":"16px"},model:{value:t.uploadLimit,callback:function(e){t.uploadLimit=e},expression:"uploadLimit"}}),s("q-input",{attrs:{disable:!t.uploadLimit,label:t.$t("upload_limit"),"bottom-slots":"",type:"number",outlined:"",dense:!0,rules:[t.positiveNumber]},scopedSlots:t._u([{key:"hint",fn:function(){return[s("div",{staticStyle:{"text-align":"right"}},[t._v("KB/s")])]},proxy:!0}]),model:{value:t.uploadSpeed,callback:function(e){t.uploadSpeed=t._n(e)},expression:"uploadSpeed"}})],1),s("div",{staticClass:"select-item col-12 m-b-8 select_label",staticStyle:{"line-height":"36px","vertical-align":"middle"}},[s("q-checkbox",{staticStyle:{"margin-bottom":"16px"},model:{value:t.downloadLimit,callback:function(e){t.downloadLimit=e},expression:"downloadLimit"}}),s("q-input",{attrs:{disable:!t.downloadLimit,label:t.$t("download_limit"),"bottom-slots":"",type:"number",outlined:"",dense:!0,rules:[t.positiveNumber],"stack-label":""},scopedSlots:t._u([{key:"hint",fn:function(){return[s("div",{staticStyle:{"text-align":"right"}},[t._v("KB/s")])]},proxy:!0}]),model:{value:t.downloadSpeed,callback:function(e){t.downloadSpeed=t._n(e)},expression:"downloadSpeed"}})],1)]),s("div",{staticClass:"col-4 q-mt-lg"},[s("div",{staticClass:"text text-right q-mr-md"},[t._v(t._s(t.$t("payed_user_share_rate")))])]),s("div",{staticClass:"col-6 q-mt-md"},[s("q-slider",{staticClass:"q-ml-xs",attrs:{min:50,max:100,step:5,label:"","label-always":"","label-value":t.payedUserShareRadix+"%"},model:{value:t.payedUserShareRadix,callback:function(e){t.payedUserShareRadix=e},expression:"payedUserShareRadix"}})],1)]),s("div",{staticClass:"configuration-variable q-pt-sm row"},[s("div",{staticClass:"col-4 m-t-4"},[s("span",{staticClass:"label-name col"},[t._v(t._s(this.$t("BT_setting")))])]),s("div",{staticClass:"col-8 row"},[s("div",{staticClass:"col-12 m-b-8"},[s("q-checkbox",{staticClass:"m-b-8",attrs:{size:"xs",label:this.$t("saveLinkSeed")},model:{value:t.settings.saveLinkSeed,callback:function(e){t.$set(t.settings,"saveLinkSeed",e)},expression:"settings.saveLinkSeed"}})],1)])]),s("div",{staticClass:"configuration-variable q-pt-sm row"},[s("div",{staticClass:"col-4 m-t-10"},[s("span",{staticClass:"label-name"},[t._v(t._s(this.$t("task_manage")))])]),s("div",{staticClass:"col-8 row"},[s("div",{staticClass:"select-item  col-12 m-b-8 select_label"},[s("div",{staticClass:"select-item-label select-label  "},[s("span",{},[t._v(t._s(this.$t("maximumDownloadNum")))])]),s("q-input",{attrs:{type:"number",dense:!0,outlined:""},model:{value:t.settings.maximumDownloadNum,callback:function(e){t.$set(t.settings,"maximumDownloadNum",t._n(e))},expression:"settings.maximumDownloadNum"}})],1),s("div",{staticClass:"select-item col-12 m-b-8 select_label"},[s("div",{staticClass:"select-item-label select-label"},[s("span",{},[t._v(t._s(this.$t("maximumConnectionsNum")))])]),s("q-input",{attrs:{size:"xs",outlined:"",type:"number",dense:!0},model:{value:t.settings.maximumConnectionsNum,callback:function(e){t.$set(t.settings,"maximumConnectionsNum",t._n(e))},expression:"settings.maximumConnectionsNum"}})],1),s("div",{staticClass:" col-12 m-b-8"},[s("q-checkbox",{staticClass:"m-b-8",attrs:{size:"xs",label:this.$t("automaticSkip")},model:{value:t.settings.autoJumpToDownload,callback:function(e){t.$set(t.settings,"autoJumpToDownload",e)},expression:"settings.autoJumpToDownload"}})],1),s("div",{staticClass:"col-12 m-b-8"},[s("q-checkbox",{staticClass:"m-b-8",attrs:{size:"xs",label:this.$t("afterNotification")},model:{value:t.settings.notifyAfterDownloaded,callback:function(e){t.$set(t.settings,"notifyAfterDownloaded",e)},expression:"settings.notifyAfterDownloaded"}})],1)])])])]),s("q-footer",{class:t.$q.dark.isActive?"bg-dark":"bg-white",attrs:{bordered:""}},[s("div",{staticClass:"row q-py-sm q-px-sm"},[s("q-btn",{staticClass:"q-mx-xs",attrs:{unelevated:"",color:"primary",loading:t.loading1,label:t.$t("submit")},on:{click:t.submit}}),s("q-btn",{staticClass:"q-mx-xs",attrs:{unelevated:"",color:t.$q.dark.isActive?"grey-9":"grey-3","text-color":t.$q.dark.isActive?"grey-3":"grey-9",loading:t.loading2,label:t.$t("discard")},on:{click:t.discard}}),s("q-space"),s("q-btn",{staticClass:"q-mx-xs",attrs:{unelevated:"",color:t.$q.dark.isActive?"red-10":"red-8",label:t.$t("reset")},on:{click:t.resetSettings}})],1)])],1)},a=[],l=(s("ddb0"),s("a79d"),s("ff52")),o=s("0c6d"),n=s("16ed"),c=s("2ef0");const r=t=>({...t});var d={name:"Settings",data(){const t=r(this.$store.state.setting.settings),e=Object(c["cloneDeep"])(t);return{settings:t,settingsOriginal:e,loading1:!1,loading2:!1,downloadLimit:t.downloadSpeed>0,uploadLimit:t.uploadSpeed>0,language:n["b"],darkMode:[{value:"system",label:"跟随系统"},{value:"light",label:"白色"},{value:"dark",label:"黑色"}]}},computed:{currentLanguage:{get(){for(const t of this.language)if(t.value===this.$i18n.locale)return t.label;return"English"},set(t){this.$i18n.locale=t,this.settings.language=t}},currentDarkMode:{get(){return this.darkMode.find((t=>t.value===this.settings.darkMode))},set(t){l["a"].set({system:"auto",light:!1,dark:!0}[t.value]),this.settings.darkMode=t.value}},downloadSpeed:{set(t){this.settings.downloadSpeed=1024*t},get(){return parseInt(this.settings.downloadSpeed/1024)||0}},uploadSpeed:{set(t){this.settings.uploadSpeed=1024*t},get(){return parseInt(this.settings.uploadSpeed/1024)||0}},payedUserShareRadix:{set(t){let e=t/100||.7;e<.5?e=.5:e>1&&(e=1),this.settings.payedUserShareRadix=e},get(){return parseInt(100*this.settings.payedUserShareRadix)}}},watch:{downloadLimit(t){t||(this.settings.downloadSpeed=-1)},uploadLimit(t){t||(this.settings.uploadSpeed=-1)}},methods:{async clear_select_directory(){await Object(o["a"])("set_setting",this.settings)},async select_directory(t){this.isSelectingDirectory=!0;const e=await Object(o["a"])("select_directory");this.isSelectingDirectory=!1,e&&(e.filePaths.length>1?this.$q.notify(this.$t("not_length")):t?this.settings.uploadDirectory=e.filePaths[0]:this.settings.downloadDirectory=e.filePaths[0])},async validateDirectory(t){if(this.isSelectingDirectory)return;const e=t?this.settings.uploadDirectory:this.settings.downloadDirectory;try{const t=s("3e8f"),i=t.existsSync(e);let a=!1;return i&&(a=t.statSync(e).isDirectory()),!(!i||!a)||(this.$q.dialog({title:"Directory not found",message:`${e} is not exist or not a directory. %tmp% will be use instead.`}),!1)}catch(i){return!1}},syncSettingsConfig(){this.$store.dispatch("fetchSettings",this.settings).then((t=>{this.settings=r(t),this.settingsOriginal=Object(c["cloneDeep"])(this.settings),this.settings.darkMode||(this.settings.darkMode="system"),l["a"].set({system:"auto",light:!1,dark:!0}[this.settings.darkMode])})).catch((t=>console.log(t)))},async submit(){return this.loading1=!0,this.$store.dispatch("set",this.settings).then((()=>{this.syncSettingsConfig(),this.$q.notify({message:this.$t("preferences_set_successfully"),position:"bottom-right",type:"positive",timeout:3e3})})).catch((()=>{this.$q.notify({message:this.$t("preferences_set_fail"),position:"bottom-right",type:"negative",timeout:3e3})})).finally((()=>{this.loading1=!1})),Object(o["a"])("update_torrent_settings",{uploadLimit:this.settings.uploadSpeed,downloadLimit:this.settings.downloadSpeed,maximumDownloadNum:this.settings.maximumDownloadNum,maximumConnectionsNum:this.settings.maximumConnectionsNum,highLevelRadix:this.settings.payedUserShareRadix})},discard(){if(this.settings.darkMode=this.settingsOriginal.darkMode,this.currentDarkMode=this.darkMode.find((t=>t.value===this.settings.darkMode)),void 0===this.settings.language||void 0===this.settingsOriginal.language)return;const t=this.settings.language.value,e=this.settingsOriginal.language.value;t!==e&&(this.$i18n.locale=e),this.syncSettingsConfig()},resetSettings(){this.$q.dialog({title:this.$t("reset"),message:this.$t("reset_all_settings"),ok:{textColor:"red",color:"unset",flat:!0,label:this.$t("reset")},cancel:{textColor:"unset",color:"unset",flat:!0,label:this.$t("not_now")}}).onOk((()=>{this.$store.dispatch("resetSettings").then((t=>{this.$i18n.locale=t.language,this.$q.notify({message:this.$t("preferences_resetted"),position:"bottom-right",type:"positive",timeout:3e3})}))}))},selectLocaleLanguage(t){if(!t)return;console.log(this.$i18n.locale);const e=Object(n["a"])(t.value);e&&(console.log("Select:"+e),this.$i18n.locale=e)},positiveNumber(t){const e=this.$t("limit_input_error");return isNaN(t)?e:t>0||e}},destroyed(){this.discard()},created(){this.syncSettingsConfig()}},u=d,m=(s("bf0e"),s("2877")),g=s("9989"),p=s("ddd8"),h=s("8f8e"),b=s("27f9"),v=s("0016"),f=s("05c0"),y=s("c1d0"),x=s("7ff0"),_=s("9c40"),C=s("2c91"),k=s("eebe"),w=s.n(k),$=Object(m["a"])(u,i,a,!1,null,"36f985aa",null);e["default"]=$.exports;w()($,"components",{QPage:g["a"],QSelect:p["a"],QCheckbox:h["a"],QInput:b["a"],QIcon:v["a"],QTooltip:f["a"],QSlider:y["a"],QFooter:x["a"],QBtn:_["a"],QSpace:C["a"]})},bf0e:function(t,e,s){"use strict";s("4779")}}]);