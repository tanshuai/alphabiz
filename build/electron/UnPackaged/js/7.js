(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[7],{1095:function(t,e,s){},"1a23":function(t,e,s){"use strict";s("e9df")},"28b2":function(t,e,s){"use strict";s("ea55")},"6bad":function(t,e,s){"use strict";s("8adb")},"76d3":function(t,e,s){},"8adb":function(t,e,s){},ba12:function(t,e,s){"use strict";s.r(e);var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("q-page",{attrs:{padding:""}},[s("SettingBlock",{directives:[{name:"show",rawName:"v-show",value:t.showDevOption,expression:"showDevOption"}],attrs:{label:"DevTools"}},[s("SettingCheckbox",t._b({on:{change:t.storeChange}},"SettingCheckbox",t.checkboxes.devTools,!1))],1),s("SettingBlock",{attrs:{label:t.t("autoUpdate")}},[s("SettingCheckbox",t._b({on:{change:t.storeChange}},"SettingCheckbox",t.checkboxes.autoUpdate,!1)),s("small",{staticClass:"col-12"},[t._v(t._s(t.t("last_check_at"))+": "+t._s(t.lastUpdateCheckTime))])],1),s("SettingBlock",{attrs:{label:t.t("update_channel")}},[s("SettingSelect",{attrs:{options:t.chanelOptions},model:{value:t.versionChannel,callback:function(e){t.versionChannel=e},expression:"versionChannel"}}),s("SettingText",t._b({directives:[{name:"show",rawName:"v-show",value:"internal"===t.versionChannel,expression:"versionChannel === 'internal'"}],on:{change:t.storeChange}},"SettingText",t.patConfig,!1))],1),s("SettingBlock",{attrs:{label:t.t("trackerService")}},[s("SettingMultiSelect",{attrs:{keyName:"trackerSource",value:t.settings.trackerSource,options:t.trackerOptions},on:{change:t.storeChange}}),s("SettingTextarea",{attrs:{keyName:"trackerList",value:t.settings.trackerList,label:"Trackers"},on:{change:t.storeChange}}),s("div",{staticClass:"col-12 tracker-links text-page q-mt-sm"},[s("span",[t._v(t._s(t.t("recommendUse"))+":")]),s("a",{attrs:{href:"https://github.com/ngosang/trackerslist",target:"_blank"}},[t._v("ngosang/trackerslist")]),s("a",{attrs:{href:"https://github.com/XIU2/TrackersListCollection",target:"_blank"}},[t._v("XIU2/TrackersListCollection")])]),s("SettingCheckbox",t._b({on:{change:t.storeChange}},"SettingCheckbox",t.checkboxes.autoUpdateTrackers,!1)),s("alphabiz-button",{staticClass:"q-mt-sm",attrs:{color:"primary",label:t.t("manualUpdateTracker")},on:{click:t.updateTrackers}}),s("small",{staticClass:"col-12 q-mt-sm"},[t._v(t._s(t.t("last_check_at"))+": "+t._s(t.lastUpdateTrackerTime))])],1),s("SettingBlock",{attrs:{label:t.t("listenPort")}},[s("SettingNumber",t._b({on:{change:t.storeChange}},"SettingNumber",t.ports.BTListenPort,!1)),s("SettingNumber",t._b({on:{change:t.storeChange}},"SettingNumber",t.ports.DHTListenPort,!1))],1),s("SettingBlock",{attrs:{label:t.t("encrypt_connection")}},[s("SettingSelect",{attrs:{options:t.secureOptions},model:{value:t.secureOption,callback:function(e){t.secureOption=e},expression:"secureOption"}})],1),s("SettingBlock",{attrs:{label:t.t("downloadAgreement")}},[s("div",{staticClass:"col-12 q-mt-sm"},[t._v(t._s(t.t("setDefaultClientForFollowingProtocols")))]),s("SettingCheckbox",t._b({on:{change:t.storeChange}},"SettingCheckbox",t.checkboxes.magnetUrl,!1))],1),t.isWindows?s("SettingBlock",{attrs:{label:t.t("torrent_file")}},[s("SettingCheckbox",t._b({on:{change:t.storeChange}},"SettingCheckbox",t.checkboxes.torrentFile,!1))],1):t._e(),t.isWindows?s("SettingBlock",{attrs:{label:t.t("video_file")}},[s("div",{staticClass:"col-6 row",attrs:{id:"bind-ports"}},t._l(t.fileExt.video,(function(e){return s("SettingCheckbox",t._b({key:e.label,on:{change:function(e,s){return t.storeExtChange("video",e,s)}}},"SettingCheckbox",e,!1))})),1)]):t._e(),t.isWindows?s("SettingBlock",{attrs:{label:t.t("audio_file")}},[s("div",{staticClass:"col-6 row"},t._l(t.fileExt.audio,(function(e){return s("SettingCheckbox",t._b({key:e.label,on:{change:function(e,s){return t.storeExtChange("audio",e,s)}}},"SettingCheckbox",e,!1))})),1)]):t._e(),s("SettingFooter",{attrs:{disable:!t.changed,loading:t.loading},on:{submit:t.submit,discard:t.onDiscard,reset:t.onReset}})],1)},a=[],i=s("1b40"),o=s("2d04"),l=s("0613"),r=s("8847");const c="https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_best.txt",u="https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_best_ip.txt",h="https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_all.txt",g="https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_all_ip.txt",d="https://cdn.jsdelivr.net/gh/ngosang/trackerslist/trackers_best.txt",b="https://cdn.jsdelivr.net/gh/ngosang/trackerslist/trackers_best_ip.txt",p="https://cdn.jsdelivr.net/gh/ngosang/trackerslist/trackers_all.txt",v="https://cdn.jsdelivr.net/gh/ngosang/trackerslist/trackers_all_ip.txt",k="https://raw.githubusercontent.com/XIU2/TrackersListCollection/master/best.txt",m="https://raw.githubusercontent.com/XIU2/TrackersListCollection/master/all.txt",x="https://raw.githubusercontent.com/XIU2/TrackersListCollection/master/http.txt",C="https://cdn.jsdelivr.net/gh/XIU2/TrackersListCollection/best.txt",_="https://cdn.jsdelivr.net/gh/XIU2/TrackersListCollection/all.txt",f="https://cdn.jsdelivr.net/gh/XIU2/TrackersListCollection/http.txt",S=[{label:"ngosang/trackerslist",options:[{value:c,label:"ngosang_best",cdn:!1},{value:u,label:"ngosang_best_ip",cdn:!1},{value:h,label:"ngosang_all",cdn:!1},{value:g,label:"ngosang_all_ip",cdn:!1},{value:d,label:"ngosang_best",cdn:!0},{value:b,label:"ngosang_best_ip",cdn:!0},{value:p,label:"ngosang_all",cdn:!0},{value:v,label:"ngosang_all_ip",cdn:!0}]},{label:"XIU2/TrackersListCollection",options:[{value:k,label:"xiu2_best",cdn:!1},{value:m,label:"xiu2_all",cdn:!1},{value:x,label:"xiu2_http",cdn:!1},{value:C,label:"xiu2_best",cdn:!0},{value:_,label:"xiu2_all",cdn:!0},{value:f,label:"xiu2_http",cdn:!0}]}];var T=s("0967"),w=s("0c6d"),y=s("e061"),U=s("cdb1"),O=s("9384"),N=s("2e92"),L=s("284d"),D=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"col-12 row"},[s("q-input",{staticClass:"setting-text-input q-mt-sm",attrs:{hint:t.label,type:"text",dense:"",outlined:""},nativeOn:{paste:function(t){t.stopPropagation()}},model:{value:t.text,callback:function(e){t.text=e},expression:"text"}})],1)},E=[],P={props:{value:String,keyName:String,label:String},computed:{text:{get(){return this.value},set(t){this.onChange(t)}}},methods:{onChange(t){this.$emit("change",this.keyName,t)}}},j=P,B=(s("28b2"),s("2877")),F=s("27f9"),A=s("eebe"),q=s.n(A),I=Object(B["a"])(j,D,E,!1,null,"188fdf7a",null),X=I.exports;q()(I,"components",{QInput:F["a"]});var $=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"col-12 row q-mt-sm"},[s("div",{staticClass:"col-12 q-ml-sm"},[t._v(t._s(t.label))]),s("q-input",{staticClass:"setting-textarea-input",attrs:{outlined:"",type:"textarea",rows:"5"},nativeOn:{paste:function(t){t.preventDefault()}},model:{value:t.texts,callback:function(e){t.texts=e},expression:"texts"}})],1)},V=[],Q={props:{value:Array,label:String,keyName:String},computed:{texts:{get(){return this.value.join("\n")},set(t){this.onChange(t.split("\n"))}}},methods:{onChange(t){this.$emit("change",this.keyName,t)}}},R=Q,H=(s("d71a"),s("6bad"),s("8572")),M=Object(B["a"])(R,$,V,!1,null,"1187b53c",null),W=M.exports;q()(M,"components",{QInput:F["a"],QField:H["a"]});var J=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"col-12 q-mt-sm"},[s("q-select",{staticClass:"select-multi-input",attrs:{value:t.selected,options:t.options,outlined:"",dense:"",multiple:"","use-chips":"","use-input":""},on:{input:t.onChange}})],1)},z=[],G={props:{value:Array,options:Array,keyName:String},computed:{selected:{get(){return this.value},set(t){this.onChange(t)}}},methods:{onChange(t){this.$emit("change",this.keyName,t)}}},K=G,Y=(s("1a23"),s("ddd8")),Z=Object(B["a"])(K,J,z,!1,null,"31302aa2",null),tt=Z.exports;q()(Z,"components",{QSelect:Y["a"]});var et=function(t,e,s,n){var a,i=arguments.length,o=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,s):n;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)o=Reflect.decorate(t,e,s,n);else for(var l=t.length-1;l>=0;l--)(a=t[l])&&(o=(i<3?a(o):i>3?a(e,s,o):a(e,s))||o);return i>3&&o&&Object.defineProperty(e,s,o),o},st=function(t,e,s,n){function a(t){return t instanceof s?t:new s((function(e){e(t)}))}return new(s||(s=Promise))((function(s,i){function o(t){try{r(n.next(t))}catch(e){i(e)}}function l(t){try{r(n["throw"](t))}catch(e){i(e)}}function r(t){t.done?s(t.value):a(t.value).then(o,l)}r((n=n.apply(t,e||[])).next())}))};const nt=!!T["b"].is.electron;let at;nt&&(at=s("34bb").ipcRenderer);const it=S.reduce(((t,e)=>{const s=e.options;return t.push(...s),t}),[]);let ot=class extends o["a"]{constructor(){super(...arguments),this.trackerOptions=it,this.isWindows=!!T["b"].is.win,this.chanelOptions=[{label:"stable",value:"stable"},{label:"nightly",value:"nightly"},{label:"internal",value:"internal"}],this.secureOptions=[{label:this.t("auto"),value:"auto"},{label:this.t("enable"),value:"enable"},{label:this.t("disable"),value:"disable"}]}get showDevOption(){return!l["a"].getters.settings.disableDevTools}onDevOptionsChange(t){this.settings.disableDevTools=!t}get lastUpdateCheckTime(){return new Date(l["a"].getters.settings.lastUpdateCheckTime).toLocaleString(r["b"].locale)}get lastUpdateTrackerTime(){return new Date(l["a"].getters.settings.trackerLastUpdateTime).toLocaleString(r["b"].locale)}get versionChannel(){return this.settings.versionChannel}set versionChannel(t){this.storeChange("versionChannel",t)}get patConfig(){return{label:"Github PAT (internal)",value:this.settings.githubPAT,keyName:"githubPAT"}}get secureOption(){return this.settings.secureOption}set secureOption(t){this.storeChange("secureOption",t)}get checkboxes(){return{devTools:{label:this.t("disable"),value:this.settings.disableDevTools,keyName:"disableDevTools"},autoUpdate:{label:this.t("autoCheckUpdate"),value:this.settings.autoCheckUpdate,keyName:"autoCheckUpdate"},autoUpdateTrackers:{label:this.t("autoUpdateTrackerServiceList"),value:this.settings.autoUpdateTrackerServiceList,keyName:"autoUpdateTrackerServiceList"},magnetUrl:{label:this.t("magnetUrl")+" [ magnet: ]",value:this.settings.bindMagnetUrl,keyName:"bindMagnetUrl"},torrentFile:{label:".torrent",value:this.settings.bindTorrentFile,keyName:"bindTorrentFile"},videoFile:{label:this.t("video_file"),value:this.settings.bindVideoFile,keyName:"bindVideoFile"},audioFile:{label:this.t("audio_file"),value:this.settings.bindAudioFile,keyName:"bindAudioFile"}}}get fileExt(){const t=["mp4","mkv","avi","mov","wmv","rmvb","flv","webm"],e=["mp3","wav","aac","flac","m4a","wma"];return{video:t.map((t=>(this.settings.bindVideoExts[t]||this.$set(this.settings.bindVideoExts,t,!1),{label:"."+t,value:this.settings.bindVideoExts[t],keyName:t,dense:!0}))),audio:e.map((t=>(this.settings.bindAudioExts[t]||this.$set(this.settings.bindAudioExts,t,!1),{label:"."+t,value:this.settings.bindAudioExts[t],keyName:t,dense:!0})))}}storeExtChange(t,e,s){const n="video"===t?this.settings.bindVideoExts:this.settings.bindAudioExts;n[e]=s,this.storeChange("video"===t?"bindVideoExts":"bindAudioExts",n)}get ports(){const t=t=>!(isNaN(t)||t<17e3||t>22e3)||this.t("range_error",[17e3,22e3]);return{BTListenPort:{label:this.t("BTlistenPort"),value:this.settings.BTlistenPort,keyName:"BTlistenPort",rules:[t],dice:[17e3,22e3]},DHTListenPort:{label:this.t("DHTlistenPort"),value:this.settings.DHTlistenPort,keyName:"DHTlistenPort",rules:[t],dice:[17e3,22e3]}}}updateTrackers(){return st(this,void 0,void 0,(function*(){const t=yield Object(w["a"])("update_tracker",this.settings.trackerSource);if(t&&t.data){const e=t.data;e.length?(this.storeChange("trackerList",e),t.time&&this.storeChange("trackerLastUpdateTime",t.time),this.notify(this.t("manualUpdateSuccess"))):this.notify(this.t("update_failed"))}}))}beforeRouteEnter(t,e,s){if(t.hash){const e=t.hash;s((()=>{setTimeout((()=>{const t=document.querySelector(e);t?t.scrollIntoView():console.log(e)}),100)}))}else s(!0)}submit(){return st(this,void 0,void 0,(function*(){this.onSubmit(),this.changes.get("versionChannel")&&nt&&setTimeout((()=>{at.send("check-for-update",!0)}),1e3)}))}};et([Object(i["b"])("showDevOption")],ot.prototype,"onDevOptionsChange",null),ot=et([Object(i["a"])({components:{SettingBlock:y["a"],SettingCheckbox:O["a"],SettingSelect:N["a"],SettingNumber:L["a"],SettingText:X,SettingTextarea:W,SettingMultiSelect:tt,SettingFooter:U["a"]}})],ot);var lt=ot,rt=lt,ct=(s("edcc"),s("9989")),ut=s("b498"),ht=Object(B["a"])(rt,n,a,!1,null,"cec79f6e",null);e["default"]=ht.exports;q()(ht,"components",{QPage:ct["a"],QColor:ut["a"]})},d71a:function(t,e,s){"use strict";s("76d3")},e9df:function(t,e,s){},ea55:function(t,e,s){},edcc:function(t,e,s){"use strict";s("1095")}}]);