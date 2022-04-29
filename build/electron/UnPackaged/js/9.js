(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[9],{"1f49":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-page",{attrs:{padding:""}},[a("SettingBlock",{attrs:{label:e.t("language")}},[a("SettingSelect",{attrs:{options:e.languages},model:{value:e.language,callback:function(t){e.language=t},expression:"language"}})],1),a("SettingBlock",{attrs:{label:e.t("appearance")}},[a("SettingSelect",{attrs:{options:e.darkmodeOptions},model:{value:e.darkMode,callback:function(t){e.darkMode=t},expression:"darkMode"}})],1),a("SettingBlock",{attrs:{label:e.t("default_video_player")}},[a("SettingSelect",{attrs:{options:e.videoPlayerOptions},model:{value:e.defaultVideoPlayer,callback:function(t){e.defaultVideoPlayer=t},expression:"defaultVideoPlayer"}})],1),a("SettingBlock",{attrs:{label:e.t("start")}},[a("SettingCheckbox",e._b({on:{change:e.storeChange}},"SettingCheckbox",e.checkboxes.autoStart,!1)),a("SettingCheckbox",e._b({on:{change:e.storeChange}},"SettingCheckbox",e.checkboxes.autoStartUnfinished,!1))],1),a("SettingBlock",{attrs:{label:e.t("download_directory")}},[a("SettingDirectory",{attrs:{value:e.settings.downloadDirectory,keyName:"downloadDirectory"},on:{change:e.storeChange}})],1),a("SettingBlock",{attrs:{label:e.t("upload_directory")}},[a("SettingDirectory",{attrs:{value:e.settings.uploadDirectory,keyName:"uploadDirectory"},on:{change:e.storeChange}}),a("SettingCheckbox",e._b({on:{change:e.storeChange}},"SettingCheckbox",e.checkboxes.autoUpload,!1)),a("SettingCheckbox",e._b({on:{change:e.storeChange}},"SettingCheckbox",e.checkboxes.unlimitUpload,!1))],1),a("SettingBlock",{attrs:{label:e.t("transport_setting")}},[a("SettingSpeed",{attrs:{value:e.settings.downloadSpeed,keyName:"downloadSpeed",label:e.t("download_limit")},on:{change:e.storeChange}}),a("SettingSpeed",{attrs:{value:e.settings.uploadSpeed,keyName:"uploadSpeed",label:e.t("upload_limit")},on:{change:e.storeChange}})],1),a("SettingBlock",{attrs:{label:e.t("payed_user_share_rate")}},[a("SettingSlider",{attrs:{value:e.settings.payedUserShareRate,min:50,keyName:"payedUserShareRate"},on:{change:e.storeChange}})],1),a("SettingBlock",{attrs:{label:e.t("BT_setting")}},[a("SettingCheckbox",e._b({on:{change:e.storeChange}},"SettingCheckbox",e.checkboxes.saveMetadata,!1))],1),a("SettingBlock",{attrs:{label:e.t("task_manage")}},[a("SettingNumber",e._b({on:{change:e.storeChange}},"SettingNumber",e.taskManage.maxDownloadNum,!1)),a("SettingNumber",e._b({on:{change:e.storeChange}},"SettingNumber",e.taskManage.maxConns,!1)),a("SettingCheckbox",e._b({on:{change:e.storeChange}},"SettingCheckbox",e.checkboxes.jumpToDownload,!1)),a("SettingCheckbox",e._b({on:{change:e.storeChange}},"SettingCheckbox",e.checkboxes.notification,!1))],1),a("SettingBlock",{attrs:{label:e.t("disk_usage")}},[a("SettingNumber",e._b({on:{change:e.onMinDiskSpaceChange}},"SettingNumber",e.minDiskSpace,!1))],1),a("SettingFooter",{attrs:{disable:!e.changed,loading:e.loading},on:{submit:e.onSubmit,discard:e.onDiscard,reset:e.onReset}})],1)},i=[],o=a("1b40"),s=a("2d04"),l=a("0967"),r=a("a76d"),u=a("4d5f"),c=a("e061"),d=a("cdb1"),h=a("2e92"),g=a("9384"),m=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"col-12"},[a("input",{ref:"folderInput",staticStyle:{display:"none"},attrs:{type:"file",webkitdirectory:""},on:{change:e.onSelect}}),a("q-input",{staticClass:"setting-directory",attrs:{value:e.value,outlined:"",dense:""},on:{input:e.onChange,blur:e.onBlur},scopedSlots:e._u([{key:"append",fn:function(){return[a("q-icon",{staticClass:"cursor-pointer",attrs:{name:"folder"},on:{click:e.selectDirectory}})]},proxy:!0}])})],1)},p=[];a("ddb0");const b=l["b"].is.electron,k=b?a("a32b"):null,S=e=>{if(!k)return null;try{let t=k.dirname(e[0]);for(let a=1;a<e.length;a++)while(!e[a].includes(t)&&t.length>1)t=k.dirname(t);return t}catch(t){return null}};var f={props:{value:String,keyName:String},methods:{onChange(e){this.$emit("change",this.keyName,e)},onBlur(){this.$emit("blur")},selectDirectory(){b&&this.$refs.folderInput.click()},onSelect(e){const t=[...e.target.files].map((e=>e.path||e.webkitRelativePath));this.onChange(S(t)||"")}}},y=f,v=(a("2541"),a("2877")),C=a("27f9"),x=a("0016"),N=a("eebe"),_=a.n(N),w=Object(v["a"])(y,m,p,!1,null,"550fd462",null),D=w.exports;_()(w,"components",{QInput:C["a"],QIcon:x["a"]});var B=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"col-12 row q-mb-sm"},[a("q-checkbox",{staticClass:"q-mb-md q-mr-sm",attrs:{dense:""},model:{value:e.showCheckbox,callback:function(t){e.showCheckbox=t},expression:"showCheckbox"}}),a("q-input",{staticClass:"input",attrs:{disable:!e.showCheckbox,label:e.label,rules:[e.positiveNumber],type:"number",outlined:"",dense:"","bottom-slots":""},on:{blur:e.onBlur},scopedSlots:e._u([{key:"hint",fn:function(){return[a("div",{staticClass:"text-right"},[e._v("KB/s")])]},proxy:!0}]),model:{value:e.speed,callback:function(t){e.speed=e._n(t)},expression:"speed"}})],1)},P=[],U={props:{label:String,value:Number,keyName:String},data(){return{enable:!1,defaultSpeed:1e5}},computed:{showCheckbox:{get(){return this.value>=0},set(e){e?this.onChange(this.defaultSpeed):this.onChange(-1)}},speed:{get(){const e=Math.floor(this.value/1e3);return e<0?0:e},set(e){this.onChange(1e3*e)}}},methods:{positiveNumber(e){const t=this.$t("limit_input_error");return isNaN(e)?t:e>0||t},onChange(e){if(""===e)return this.$emit("change",this.keyName,this.defaultSpeed);this.$emit("change",this.keyName,e)},onBlur(){!0!==this.positiveNumber(this.value)&&this.$emit("change",this.keyName,this.defaultSpeed)}}},M=U,O=a("8f8e"),j=Object(v["a"])(M,B,P,!1,null,null,null),$=j.exports;_()(j,"components",{QCheckbox:O["a"],QInput:C["a"]});var R=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"row"},[a("q-slider",{staticClass:"setting-slider",attrs:{min:e.min,max:e.max,step:e.step,"track-size":"0.6rem","thumb-color":"primary","track-color":"page","selection-color":"secondary",markers:"","marker-labels":"",label:"","label-value":e.label},scopedSlots:e._u([{key:"marker-label-group",fn:function(t){var n=t.markerList;return e._l(n,(function(t){return a("div",{key:t.index,staticClass:"cursor-pointer",class:t.classes,style:t.style,on:{click:function(a){return e.setValue(t.value)}}},[e._v(e._s(t.value)+"%")])}))}}]),model:{value:e.slide,callback:function(t){e.slide=t},expression:"slide"}})],1)},V=[],q={props:{value:Number,min:{type:Number,default:0},max:{type:Number,default:100},step:{type:Number,default:5},keyName:String},computed:{slide:{get(){return Math.floor(100*this.value)},set(e){this.setValue(e)}},label(){return this.slide+"%"}},methods:{setValue(e){this.$emit("change",this.keyName,e/100)}}},L=q,A=(a("3ace"),a("c1d0")),Q=Object(v["a"])(L,R,V,!1,null,"40a608ea",null),T=Q.exports;_()(Q,"components",{QSlider:A["a"]});var E=a("284d"),I=function(e,t,a,n){var i,o=arguments.length,s=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)s=Reflect.decorate(e,t,a,n);else for(var l=e.length-1;l>=0;l--)(i=e[l])&&(s=(o<3?i(s):o>3?i(t,a,s):i(t,a))||s);return o>3&&s&&Object.defineProperty(t,a,s),s},J=function(e,t,a,n){function i(e){return e instanceof a?e:new a((function(t){t(e)}))}return new(a||(a=Promise))((function(a,o){function s(e){try{r(n.next(e))}catch(t){o(t)}}function l(e){try{r(n["throw"](e))}catch(t){o(t)}}function r(e){e.done?a(e.value):i(e.value).then(s,l)}r((n=n.apply(e,t||[])).next())}))};const z=a("ed08").isElectron();let F=class extends s["a"]{constructor(){super(...arguments),this.isWindows=!!l["b"].is.win,this.videoPlayerOptions=[{label:"Alphabiz",value:"Alphabiz"}]}created(){z&&this.updatePlayerPotions()}get darkmodeOptions(){return[{label:this.t("darkModeSystem"),value:r["a"].system},{label:this.t("darkModeLight"),value:r["a"].light},{label:this.t("darkModeDark"),value:r["a"].dark}]}get defaultVideoPlayer(){return this.settings.defaultVideoPlayer}set defaultVideoPlayer(e){this.storeChange("defaultVideoPlayer",e)}updatePlayerPotions(){return J(this,void 0,void 0,(function*(){(yield Object(u["a"])())&&(this.videoPlayerOptions=yield Object(u["a"])())}))}get checkboxes(){return{autoStart:{label:this.t("autoStart"),value:this.settings.autoLaunch,keyName:"autoLaunch"},autoStartUnfinished:{label:this.t("autoStartUnfinished"),value:this.settings.autoStartUnfinished,keyName:"autoStartUnfinished"},autoUpload:{label:this.t("enable_auto_upload"),value:this.settings.autoUpload,keyName:"autoUpload"},unlimitUpload:{label:this.t("unlimit_upload_amount"),value:this.settings.unlimitUploadAmount,keyName:"unlimitUploadAmount",tooltip:this.t("unlimit_upload_warning")},saveMetadata:{label:this.t("saveLinkSeed"),value:this.settings.saveLinkSeed,keyName:"saveLinkSeed"},jumpToDownload:{label:this.t("automaticSkip"),value:this.settings.autoJumpToDownload,keyName:"autoJumpToDownload"},notification:{label:this.t("afterNotification"),value:this.settings.notifyAfterDownloaded,keyName:"notifyAfterDownloaded"}}}get minDiskSpace(){return{label:this.t("pause_if_less_space"),value:Math.floor(this.settings.minDiskSpace/1e6),keyName:"minDiskSpace",rules:[e=>!(isNaN(e)||e<10||e>1e6)||this.t("range_error",["10MB","1TB"])],min:10}}onMinDiskSpaceChange(e,t){return this.storeChange("minDiskSpace",1e6*t)}get taskManage(){const e=e=>!(isNaN(e)||e<=0||e>20)||this.t("range_error",[1,20]);return{maxDownloadNum:{label:this.t("maximumDownloadNum"),value:this.settings.maximumDownloadNum,keyName:"maximumDownloadNum",rules:[e]},maxConns:{label:this.t("maximumConnectionsNum"),value:this.settings.maximumConnectionsNum,keyName:"maximumConnectionsNum",rules:[e]}}}get payedUserShareRate(){return this.settings.payedUserShareRate}set payedUserShareRate(e){this.storeChange("payedUserShareRate",e)}};F=I([Object(o["a"])({components:{SettingBlock:c["a"],SettingSelect:h["a"],SettingCheckbox:g["a"],SettingDirectory:D,SettingSpeed:$,SettingSlider:T,SettingNumber:E["a"],SettingFooter:d["a"]}})],F);var K=F,W=K,G=a("9989"),H=Object(v["a"])(W,n,i,!1,null,null,null);t["default"]=H.exports;_()(H,"components",{QPage:G["a"]})},2541:function(e,t,a){"use strict";a("46ef")},"3ace":function(e,t,a){"use strict";a("6864")},"46ef":function(e,t,a){},6864:function(e,t,a){}}]);