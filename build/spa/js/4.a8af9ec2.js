(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{"206a":function(t,e,i){"use strict";i("ff65")},"235d":function(t,e,i){},"26d2":function(t,e,i){},"45e8":function(t,e,i){},"56e6":function(t,e,i){"use strict";i("b2ea")},"5f0d":function(t,e,i){"use strict";i("235d")},"713b":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-layout",{attrs:{view:"LHh Lpr lFf"}},[i("application-header",[i("template",{slot:"prepend"},[i("q-btn",{staticClass:"app-no-draggable",attrs:{flat:"","fab-mini":"",icon:t.leftDrawerOpen?"menu_open":"menu","aria-label":"Menu"},on:{click:function(e){t.leftDrawerOpen=!t.leftDrawerOpen}}})],1),i("template",{slot:"append"},[i("q-badge",{staticClass:"app-badge app-no-draggable cursor-pointer q-mx-sm non-selectable",attrs:{color:"page","text-color":"page"},on:{click:t.showAboutDialog}},[i("div",{attrs:{id:"version"}},[t._v(t._s("v"+t.publicVersion))]),i("q-separator",{staticClass:"version-separator",attrs:{vertical:""}}),i("div",{attrs:{id:"commit"}},[t._v(t._s(t.publicSourceCommit))])],1)],1)],2),i("left-drawer",{ref:"leftDrawer",model:{value:t.leftDrawerOpen,callback:function(e){t.leftDrawerOpen=e},expression:"leftDrawerOpen"}}),i("q-page-container",{staticClass:"bg-page text-page"},[i("keep-alive",{attrs:{include:"Player,Downloader,Library"}},[i("router-view")],1)],1)],1)},a=[],n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-drawer",{ref:"qDrawer",attrs:{value:t.value,side:"left","show-if-above":"",width:280,breakpoint:t.breakpoint},on:{input:function(e){return t.$emit("input",e)}}},[i("div",{staticClass:"full-height column items-stretch overflow-hidden"},[i("div",{staticClass:"left-drawer-header bg-primary text-primary",class:{"pt-30":t.isElectron}},[i("q-img",{staticClass:"ab-logo-background ab-logo absolute",staticStyle:{"z-index":"0"},attrs:{src:t.abLogo,contain:""}}),i("corner",{staticClass:"relative-position",staticStyle:{"z-index":"1"}})],1),i("q-scroll-area",{staticClass:"left-drawer-menu bg-page text-page",attrs:{visible:!1,"bar-style":{width:"0"},"thumb-style":{width:"0"}}},[i("q-list",{staticClass:"non-selectable"},t._l(t.essentialLinks,(function(e){return i("EssentialLink",t._b({key:e.id||e.title},"EssentialLink",e,!1))})),1)],1)],1)])},o=[],r=(i("ddb0"),function(){var t=this,e=t.$createElement,i=t._self._c||e;return!t.children||0===t.children.length&&!t.hide?i("q-item",{staticClass:"drawer-menu-item",attrs:{clickable:"",active:t.isActive,"inset-level":t.level,"active-class":"active-item"},on:{click:t.handleClick}},[t.icon?i("q-item-section",{attrs:{avatar:""}},[i("q-icon",{attrs:{name:t.icon}})],1):t._e(),i("q-item-section",[i("q-item-label",[t._v("\n      "+t._s(t.titleString)+"\n    ")])],1),t.badge?[i("q-item-section",{attrs:{side:""}},[i("q-badge",{attrs:{color:"positive","text-color":"positive"}},[t._v(t._s(t.badge))])],1)]:t._e()],2):t.children.length>0&&!t.hide?i("div",[i("q-expansion-item",{class:{"expansion-menu-item":!0,"active-item":t.isActive},attrs:{"expand-separator":"",icon:t.icon,label:t.titleString,"default-opened":""},model:{value:t.open,callback:function(e){t.open=e},expression:"open"}},[t.label?i("div",{staticClass:"item-label q-pl-lg q-py-xs text-grey-8"},[t._v(t._s(t.label)+"\n    ")]):t._e(),t._l(t.children,(function(e){return i("EssentialLink",t._b({key:e.id||e.title,attrs:{level:.5}},"EssentialLink",e,!1))}))],2)],1):t._e()}),c=[];function l(t){if(!t)return null;const e="string"===typeof t?{name:t}:t;return e}function d(t,e){if(!e)return!1;const i=t.name===e.name;if(!i)return!1;if(e.query){const i=Object.entries(e.query).some((([e,i])=>t.query[e]!==i));return!i}return!0}var u={name:"EssentialLink",props:{title:{type:[String,Function],required:!0},caption:{type:[String,Function],default:void 0},label:{type:String,default:""},icon:{type:String,default:""},badge:{type:String,default:void 0},route:{type:[String,Object],default:"Index"},query:{type:Object,default:void 0},level:{type:Number,default:0},children:{type:Array,default(){return[]}},hide:Boolean},data(){return{isActive:!1,open:!0}},computed:{titleString(){return"string"===typeof this.title?this.title:this.title()},captionString(){if(this.caption)return"string"===typeof this.caption?this.caption:this.caption()},isSelfActive(){const t=l(this.route);return d(this.$route,t)},isChildrenActive(){return this.children.map((t=>t.route)).some((t=>{const e=l(t);return d(this.$route,e)}))}},mounted(){const t=()=>{this.isActive=this.open?this.isSelfActive:this.isChildrenActive};this.$watch("$route",t,{immediate:!0}),this.$watch("open",t,{immediate:!0})},methods:{handleClick(){const t=l(this.route);t&&this.$router.push(t)}}},h=u,p=(i("206a"),i("2877")),g=i("66e5"),m=i("4074"),b=i("0016"),v=i("0170"),_=i("58a8"),f=i("3b73"),w=i("b498"),$=i("eebe"),y=i.n($),C=Object(p["a"])(h,r,c,!1,null,null,null),q=C.exports;y()(C,"components",{QItem:g["a"],QItemSection:m["a"],QIcon:b["a"],QItemLabel:v["a"],QBadge:_["a"],QExpansionItem:f["a"],QColor:w["a"]});var k=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"corner-account"},[t.$store.state.account.authState?"signedIn"===t.$store.state.account.authState?[i("div",{staticClass:"corner-account-info"},[i("div",{staticClass:"account-main"},[i("q-avatar",{staticClass:"account-avatar",attrs:{size:"64px"}},[i("q-img",{staticClass:"logo",attrs:{src:t.abLogo,contain:"",width:"48px",height:"48px"}})],1),i("div",{staticClass:"account-info column justify-center"},[i("div",{staticClass:"account-name"},[i("div",[i("span",[t._v(t._s(t.title)+" ")]),i("q-tooltip",{attrs:{"content-style":{fontSize:"0.8rem",padding:"2px 8px"},"transition-show":"scale","transition-hide":"scale",anchor:"bottom middle",self:"center start",delay:1e3}},[t._v(t._s(t.title))])],1),i("q-badge",{attrs:{color:"positive","text-color":"positive",label:t.caption}})],1)])],1),i("div",{staticClass:"account-info-more"},[i("alphabiz-button",{attrs:{icon:"more_horiz","button-type":"icon",color:"primary",size:"0.8rem"}},[i("corner-menu",{on:{signOut:t.requestSignOut,invite:t.invite}})],1)],1)])]:[i("div",{staticClass:"row"},[i("q-avatar",{staticClass:"account-avatar",attrs:{size:"64px"}},[i("q-img",{staticClass:"logo",attrs:{src:t.abLogo,contain:"",width:"48px",height:"48px"}})],1),i("div",{staticClass:"column justify-center q-ml-md"},[i("alphabiz-button",{attrs:{label:t.caption,size:"0.8rem",color:"secondary"},on:{click:t.$amplify.showSignedOutDialog}})],1)],1)]:[i("div",{staticClass:"row"},[i("q-avatar",{staticClass:"account-avatar",attrs:{size:"64px"}},[i("q-spinner",{attrs:{size:"32px"}})],1),i("div",{staticClass:"column justify-center q-ml-md"},[i("div",{staticClass:"account-loading"},[t._v(t._s(t.$t("account_loading")))])])],1)]],2)},x=[],S=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-menu",{attrs:{"auto-close":"","touch-position":"","transition-show":"jump-up","transition-hide":"jump-down"}},[i("q-list",{staticClass:"corner-menu__list",staticStyle:{"min-width":"160px"}},[i("q-item",{attrs:{clickable:""},on:{click:function(e){return t.$router.push("/account/settings")}}},[i("q-item-section",{attrs:{"data-cy":"account-settings-btn"}},[t._v("\n          "+t._s(t.$t("account_account_setting"))+"\n        ")])],1),i("q-separator"),i("q-item",{attrs:{clickable:""},on:{click:function(e){return t.$emit("signOut")}}},[i("q-item-section",{attrs:{"data-cy":"sign-out-btn"}},[t._v(t._s(t.$t("account_sign_out"))+"\n        ")])],1)],1)],1)},D=[],L={name:"CornerMenu",computed:{showInvite(){return this.$store.state.account.invitationCode&&this.$store.state.account.invitationCode.findIndex((t=>0===t.invitation_state))>=0}}},Q=L,O=i("4e73"),P=i("1c1c"),I=i("eb85"),U=Object(p["a"])(Q,S,D,!1,null,null,null),E=U.exports;y()(U,"components",{QMenu:O["a"],QList:P["a"],QItem:g["a"],QItemSection:m["a"],QSeparator:I["a"]});var T=i("48f4"),A=i("d8ad"),j={name:"Corner",data(){return{abLogo:i("a4a1")}},components:{CornerMenu:E},computed:{info(){return"signedIn"===this.$store.state.account.authState?this.$store.getters.accountUserInfo:null},title(){return this.info?this.info.nickname?this.info.nickname:this.info.emailVerified?this.info.email.split("@")[0]:this.info.phoneNumberVerified?this.info.phoneNumber:"???":this.$t("account_want_to_join")},caption(){return this.info?`Lv. ${this.info.accountLevel}`:this.$t("account_sign_in_now")}},methods:{requestSignOut(){A["a"].$emit("request-sign-out")},signOut(){T["a"].showPositive("signed_out"),this.$store.commit("ACCOUNT_UPDATE_STATE","signedOut"),(this.$route.path.startsWith("/account")||this.$route.path.startsWith("/credits"))&&this.$router.push("/"),this.$store.dispatch("ACCOUNT_SIGN_OUT")},invite(){this.$router.push({path:"/account/settings",query:{call:"invite"}})}},created(){A["a"].$on("confirm-sign-out",(()=>this.signOut()))}},z=j,B=(i("ce09"),i("cb32")),V=i("0d59"),N=i("068f"),F=i("05c0"),M=Object(p["a"])(z,k,x,!1,null,"5878c4d5",null),R=M.exports;y()(M,"components",{QAvatar:B["a"],QSpinner:V["a"],QImg:N["a"],QTooltip:F["a"],QBadge:_["a"]});var H=i("0613"),W=i("4aad"),J=i("ed08"),G={name:"LeftDrawer",components:{EssentialLink:q,Corner:R},props:{value:Boolean,currentTab:String},data(){return{abLogo:i("a4a1"),breakpoint:1080,currentBehavior:null,resizeListener:null,showCreditPage:!1,showBlockchainPage:!1,isElectron:Object(J["isElectron"])()}},created(){var t;this.updateCurrentBehavior(),this.resizeListener=t=>this.onWindowResize(t),window.addEventListener("resize",this.resizeListener);const e=null!==(t=localStorage.getItem("dataPaymentMixin.mode"))&&void 0!==t?t:"amplify";this.showCreditPage="amplify"===e,this.showBlockchainPage="blockchain"===e},computed:{indexItem(){if(!Object(J["isElectron"])())return{id:"task-management",title:this.$t("task_manage"),icon:"file_download",route:"Downloader"};const t=t=>{const e=H["a"].getters.taskCount[t];if(e)return e.toString()},e={id:"downloading",title:this.$t("downloading"),icon:"file_download",route:{name:"Downloader",query:{currentTab:"downloading"}},badge:t("downloading")},i={id:"uploading",title:this.$t("uploading"),caption:H["a"].getters.isUploadingLoading?this.$t("loading"):null,icon:"file_upload",route:{name:"Downloader",query:{currentTab:"uploading"}},badge:t("uploading")},s={id:"downloaded",title:this.$t("downloaded"),icon:"done",route:{name:"Downloader",query:{currentTab:"downloaded"}},badge:t("downloaded")};return{title:this.$t("download")+"/"+this.$t("upload"),caption:this.$t("home_caption"),icon:"import_export",children:[e,i,s]}},accountSettingItem(){const t=[];return"signedIn"===H["a"].state.account.authState&&t.push({title:this.$t("account_account_setting"),icon:"account_circle",route:"AccountSettings",caption:this.$t("account_setting_caption")}),t},disableDevTools(){return H["a"].getters.settings.disableDevTools},paymentItems(){const t={title:this.$t("credits"),caption:this.$t("credits_caption"),icon:"savings",route:"Credits"},e={title:this.$t("blockchain"),caption:this.$t("blockchain_caption"),icon:"account_balance_wallet",route:"Blockchain"},i=[];return this.showCreditPage&&i.push(t),this.showBlockchainPage&&i.push(e),i},developmentItem(){const t=[];try{H["a"].getters.isDevMode&&t.push({title:this.$t("development"),caption:this.$t("development_caption"),icon:"developer_mode",route:"Development"})}catch(e){}return t},essentialLinks(){const t=!W["a"].isLoggedIn||!W["a"].nonBlockFollowingChannels.length,e={title:this.$t("library"),caption:this.$t("library_caption"),icon:"video_library",children:[{title:this.$t("lib_index"),icon:"home",route:"LibraryIndex"},{title:this.$t("lib_following"),hide:t,icon:"collections_bookmark",route:"LibraryFollowing"},{title:this.$t("lib_local_favorites"),hide:t,icon:"star",route:"LibraryFavorites"},{title:this.$t("lib_edit"),icon:"edit_note",route:"LibraryEdit"}]};H["a"].getters.settings.libraryShowExplore&&e.children.splice(3,0,{title:this.$t("lib_explore"),hide:t,icon:"travel_explore",route:"LibraryExplore"});const i={id:"drawer-player",title:this.$t("player"),caption:this.$t("player_caption"),icon:"play_circle_filled",route:"Player"},s={title:this.$t("basic_setting"),icon:"assignment",route:"BasicSetting",caption:this.$t("basic_caption")},a={title:this.$t("advanced"),icon:"build",route:"AdvanceSetting",caption:this.$t("advanced")},n={title:this.$t("settings"),caption:this.$t("settings_caption"),icon:"settings",children:[...this.accountSettingItem,s,a]};return[e,this.indexItem,i,...this.paymentItems,n,...this.developmentItem]}},methods:{onWindowResize(){this.updateCurrentBehavior()},updateCurrentBehavior(){const t=window.innerWidth<=this.breakpoint-8?"mobile":"desktop";t!==this.currentBehavior&&(this.currentBehavior=t,this.$refs.qDrawer&&this.$refs.qDrawer.__updateLocal("belowBreakpoint","mobile"===t))}},beforeDestroy(){window.removeEventListener("resize",this.resizeListener)}},K=G,X=(i("9f43"),i("9404")),Y=i("4983"),Z=Object(p["a"])(K,n,o,!1,null,"14204fa7",null),tt=Z.exports;y()(Z,"components",{QDrawer:X["a"],QImg:N["a"],QScrollArea:Y["a"],QList:P["a"],QColor:w["a"]});var et=i("7f32"),it=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-header",{staticClass:"bg-primary text-primary",class:{"pt-30":t.isElectron}},[i("q-toolbar",{staticClass:"header-toolbar"},[t._t("prepend"),i("Breadcrumbs"),i("q-space"),t._t("append"),i("Updater",{directives:[{name:"show",rawName:"v-show",value:t.isElectron,expression:"isElectron"}]})],2)],1)},st=[],at=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"breadcrumbs q-ml-md"},[i("q-breadcrumbs",{staticClass:"text-primary bread-nowrap",attrs:{gutter:"none"},scopedSlots:t._u([{key:"separator",fn:function(){return[i("q-icon",{staticClass:"breadcrumb-separator",attrs:{name:"chevron_right"}})]},proxy:!0}])},[i("q-breadcrumbs-el",{staticClass:"crumb current-route nowrap",class:{normal:!t.historyPaths.length},on:{click:function(e){t.historyPaths.length&&t.goTo(t.currentPath,0)}}},[i("span",{staticClass:"crumb-label nowrap"},[t._v(t._s(t.currentPath.label))]),i("q-icon",{staticClass:"q-ml-xs breadcrumb-icon",attrs:{name:t.currentPath.icon,size:"1.1em"}})],1),t._l(t.historyPaths,(function(e,s){return i("q-breadcrumbs-el",{key:s,staticClass:"crumb nowrap",class:s===t.history.length-1?"last-crumb":"normal-crumb",attrs:{disable:s===t.history.length-1},on:{click:function(i){return t.goTo(e,s+1)}}},[i("span",{staticClass:"crumb-label nowrap",attrs:{title:e.label}},[t._v("\n        "+t._s(e.label.length>12?e.label.substring(0,11)+"...":e.label)+"\n      ")]),i("q-icon",{staticClass:"q-ml-xs breadcrumb-icon",attrs:{name:e.icon,size:"1.1em"}})],1)}))],2)],1)},nt=[],ot=(i("d9e2"),{data(){return{history:[]}},computed:{currentPath(){const t=this.$route.path.split("/")[1],e="downloader"===t?this.$route.query.currentTab:t,i=this.getPathTitle(e),s=this.getPathIcon(e);return{path:"/"+t,label:i,icon:s}},historyPaths(){return this.history.map(((t="")=>{const[e,i]=t.split("?"),s=e.split("/").splice(2);if(!s.length)return null;s.length>1&&console.warn(`The path "${t}" does not have a parser and may update header with something wrong.`);const a=s[0];return a?{path:t,label:this.getPathTitle(a,i),icon:this.getPathIcon(a,i)}:null})).filter((t=>t))}},methods:{parseQS(t=""){const e=Object.create(null);if(!t)return e;for(const i of t.split("&"))if(i.includes("=")){const[t,s]=i.split("=").map((t=>decodeURIComponent(t)));e[t]=s}else e[i]=!0;return e},getPathTitle(t,e=""){var i,s;switch(t){case"downloading":return this.$t("downloading");case"uploading":return this.$t("uploading");case"downloaded":return this.$t("downloaded");case"library":return this.$t("library");case"player":return this.$t("player");case"credits":return this.$t("credits");case"blockchain":return this.$t("blockchain");case"account":return this.$t("account_account_setting");case"basicSetting":return this.$t("basic_setting");case"advanceSetting":return this.$t("advancedSettings");case"development":return this.$t("development");case"creator":return(null===(i=this.parseQS(e))||void 0===i?void 0:i.name)||this.$t("creator");case"channel":return(null===(s=this.parseQS(e))||void 0===s?void 0:s.title)||this.$t("channel");case"following":return this.$t("lib_following");case"edit":return this.$t("lib_edit");case"explore":return this.$t("lib_explore");case"favorite":return this.$t("lib_favorite");default:return"Alphabiz"}},getPathIcon(t){switch(t){case"downloading":return"file_download";case"uploading":return"file_upload";case"downloaded":return"done";case"library":return"video_library";case"player":return"play_circle_filled";case"credits":return"savings";case"blockchain":return"account_balance_wallet";case"account":return"account_circle";case"basicSetting":return"assignment";case"advanceSetting":return"build";case"development":return"developer_mode";case"creator":return"account_circle";case"channel":return"subscriptions";case"following":return"star";case"edit":return"edit_note";case"explore":return"travel_explore";case"favorite":return"folder_special";default:return""}},goTo(t,e){console.log("goto",e,t),e!==this.history.length&&this.$router.push(t.path).then((t=>{t instanceof Error||this.history.splice(e)}))}},watch:{"currentPath.path"(t,e){t!==e&&this.history.splice(0)}},mounted(){this.$root.$on("navigate-to",(t=>{if(!t)return this.history.splice(0);this.history.push(t),this.history.length>2&&this.history.splice(0,this.history.length-2)})),this.$root.$on("update-path",(t=>{var e;console.log("update path",t);const i=null===(e=t.split("?"))||void 0===e?void 0:e[0];for(const s in this.history){const e=parseInt(s);if(isNaN(e))continue;const a=this.history[e];a.startsWith(i+"?")&&this.$set(this.history,e,t)}}))}}),rt=ot,ct=(i("5f0d"),i("56e6"),i("ead5")),lt=i("079e"),dt=Object(p["a"])(rt,at,nt,!1,null,"3715d482",null),ut=dt.exports;y()(dt,"components",{QBreadcrumbs:ct["a"],QIcon:b["a"],QBreadcrumbsEl:lt["a"]});var ht=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"alphabiz-updater"},[i("q-btn",{attrs:{color:"primary",icon:"update","fab-mini":"",flat:""},on:{click:t.onClick}},[i("q-tooltip",[t._v("\n      "+t._s(t.isUpdating?"Updating":t.hasNewVersion?t.$t("update_available"):t.$t("check_for_update"))+"\n    ")]),t.isUpdating?i("q-badge",{staticClass:"icon-badge",attrs:{rounded:"",floating:"",color:"transparent"}},[i("q-circular-progress",{attrs:{size:"16px",thickness:1,color:"green","center-color":"green","track-color":"white",value:t.totalProgress}})],1):t.hasNewVersion?i("q-badge",{attrs:{color:"yellow",rounded:"",floating:""}}):t._e()],1),i("q-dialog",{attrs:{persistent:t.persistant},model:{value:t.showDialog,callback:function(e){t.showDialog=e},expression:"showDialog"}},[i("q-card",{staticClass:"update-panel-card"},[i("q-card-section",{staticClass:"q-px-md q-pt-md q-pb-none"},[i("div",{staticClass:"text-h6 text-weight-bold"},[t._v(t._s(t.$t("update_alphabiz")))])]),i("q-card-section",{staticClass:"q-pb-none"},[i("div",{staticClass:"current-version"},[t._v(t._s(t.$t("current_version"))+": "),i("code",[t._v(t._s(t.currentVersion))])]),t.isUpdating?i("div",{staticClass:"update-status q-mt-sm"},[t._v("\n          "+t._s(t.$t("downloading_update"))+"\n          "),t._l(t.progressMessages,(function(e,s){return i("p",{key:s},[t._v(t._s(e))])}))],2):i("div",{staticClass:"release-infomation"},[i("div",{staticClass:"text-bold"},[t._v(t._s(t.newVersionHint))]),t.releaseLogs.length?i("div",{staticClass:"text"},[i("div",{staticClass:"text release-logs q-mt-sm"},[i("b",[t._v(t._s(t.$t("release_notes")))]),t._l(t.releaseLogs,(function(e,s){return i("p",{key:s,staticClass:"q-ml-sm"},[t._v(t._s(e))])}))],2)]):t._e()])]),i("q-card-actions",{staticClass:"q-px-md q-py-md",attrs:{vertical:""}},[i("q-btn",{attrs:{unelevated:"",color:"primary","text-color":"primary",label:t.confirmLabel,disable:t.loading,loading:t.loading},on:{click:t.onConfirm}}),t.persistant?t._e():i("q-btn",{attrs:{unelevated:"",color:t.isUpdating?"negative":"general","text-color":t.isUpdating?"negative":"general",disable:t.loading,label:t.isUpdating?t.$t("cancel_update"):t.$t("close")},on:{click:t.onClose}})],1)],1)],1)],1)},pt=[],gt=i("ddc3"),mt=i.n(gt),bt=i("f880"),vt=i("c83d"),_t=i("bc3a"),ft=i.n(_t);const wt="https://raw.githubusercontent.com/tanshuai/alphabiz/main/versions.json",$t={created(){const t=!1,e=Object(J["isElectron"])();this.$watch("vc$versionState",(i=>{"force_exit"!==i||e||t||console.log("todo: exit app")}),{immediate:!0})}},yt=t=>{const[e,...i]=t.split("-"),s=i.pop();if(!s)return e;const a=e+"-"+s;return a};var Ct={mixins:[$t],data(){return{hasNewVersion:!1,isLatest:!1,isUpdating:!1,isChecking:!1,isForceUpdate:!1,showDialog:!1,persistant:!1,updateDownloaded:!1,currentVersion:Object(vt["a"])("version"),newVersion:"",releaseLogs:[],downloadProgress:[],ipcRenderer:{send(){},on(){}}}},computed:{loading(){return this.isChecking},newVersionHint(){return this.newVersion?this.$t("new_version_hint",[this.newVersion]):this.isForceUpdate?this.$t("version_out_of_date"):this.isLatest?this.$t("current_is_latest"):this.$t("click_to_check_update")},confirmLabel(){return this.updateDownloaded?this.$t("exit_and_update"):this.isUpdating?this.$t("close"):this.hasNewVersion?this.$t("update_now"):this.$t("check_for_update")},totalProgress(){if(!this.downloadProgress.length)return 0;const[t,e]=this.downloadProgress.reduce(((t,e)=>{const{downloaded:i,length:s}=e[1];return isNaN(i)||isNaN(s)||(t[0]+=i,t[1]+=s),t}),[0,0]);return Math.floor(t/e*100)},progressMessages(){return this.downloadProgress.map((([t,e])=>{const i=Object(bt["a"])(e.downloaded,{byte:!1,gb:!1}),s=Object(bt["a"])(e.length,{byte:!1,gb:!1});return`${t}: ${i} / ${s}`}))}},methods:{async getMinVersion(){const t=H["a"].getters.settings.versionChannel;return ft.a.get(wt,{responseType:"json"}).then((({data:e})=>(console.log(e),e&&e.min&&e.min[t]?e.min[t]:this.currentVersion))).catch((()=>this.currentVersion))},async checkForceUpdate(){const t=await this.getMinVersion(),e=yt(t),s=yt(this.currentVersion);if(mt.a.gt(e,s)){const t=!1;console.log(e,s),H["a"].commit("changeDisableTasks",!0),this.isForceUpdate=!0,this.$q.dialog({title:this.$t("version_out_of_date"),message:this.$t("have_to_update"),persistent:!0,ok:this.$t("update_now"),cancel:t?this.$t("cancel"):this.$t("exit_alphabiz")}).onOk((()=>{this.persistant=!0,this.showDialog=!0,this.isChecking=!0,this.checkForUpdate()})).onCancel((()=>{if(Object(J["isElectron"])()){if(t)return H["a"].commit("changeDisableTasks",!1);i("bdb9").ipcRenderer.send("exit-app")}else location.reload()}))}else H["a"].commit("changeDisableTasks",!1)},confirmUpdate(){this.ipcRenderer.send("confirm-update")},checkForUpdate(){this.ipcRenderer.send("check-for-update")},onClick(){this.showDialog=!0},onConfirm(){return this.updateDownloaded?this.ipcRenderer.send("install-update"):this.isUpdating?this.close():(this.isChecking=!0,this.hasNewVersion?this.confirmUpdate():this.checkForUpdate())},onClose(){this.isUpdating?this.ipcRenderer.send("abort-update"):this.close()},close(){this.showDialog=!1}},async created(){if(!Object(J["isElectron"])())return;this.checkForceUpdate();const{ipcRenderer:t}=await Promise.resolve().then(i.t.bind(null,"bdb9",7));this.ipcRenderer=t,t.on("update-available",((t,e)=>{console.log(e),this.hasNewVersion=!0,this.newVersion=e.version,this.releaseLogs=(e.detail||"").split(/\r\n|\n/g),console.log("update available"),this.isChecking=!1})),t.on("update-not-available",((e,i)=>{if(this.isChecking=!1,this.isLatest=!0,this.hasNewVersion=!1,this.newVersion="",this.releaseLogs=[],!i||!i.reason||!i.showDialog)return t.send("dismiss-update");this.$q.dialog({class:"text-center",title:this.$t("no_update_available"),message:this.isForceUpdate?this.$t("download_latest_version_from_website"):this.$t(i.reason,[this.currentVersion]),ok:this.isForceUpdate?this.$t("to_the_website"):this.$t("ok"),cancel:!!this.isForceUpdate&&this.$t("cancel")}).onOk((()=>{if(!this.isForceUpdate)return;const e="https://alpha.biz";t.send("to_browserurl",e)})).onDismiss((()=>{t.send("dismiss-update")}))})),t.on("update-progress",((t,e)=>{this.isChecking=!1,this.isUpdating=!0,console.log(e),this.downloadProgress=Object.entries(e)})),t.on("update-failed",((e,i)=>{i.reason&&this.$q.dialog({title:this.$t("update_failed"),message:this.$t("update_failed_message")+this.$t(i.reason),ok:this.$t("ok")}).onDismiss((()=>{this.hasNewVersion=!1,this.isUpdating=!1,this.downloadProgress=[],this.releaseLogs=[],this.newVersion="",t.send("dismiss-update")}))})),t.on("update-aborted",(()=>{this.$q.dialog({message:this.$t("update_canceled"),ok:this.$t("ok")}).onDismiss((()=>{this.hasNewVersion=!0,this.isUpdating=!1,this.downloadProgress=[],t.send("dismiss-update")}))})),t.on("ready-to-restart",(()=>{this.$q.loading.hide();let e=10;const i=()=>(e<0&&(e=0),`<br><p class='text-right text-grey q-pa-md q-mb-xs'>( ${e} s )</p>`);let s=null;const a=this.$q.dialog({title:this.$t("ready_to_update"),html:!0,message:this.$t("restart_to_update")+i(),ok:!1,cancel:this.$t("cancel_update")}).onCancel((()=>{clearInterval(s),t.send("abort-update")}));s=setInterval((()=>{e--,a.update({title:this.$t("ready_to_update"),message:this.$t("restart_to_update")+i()}),e<=0&&clearInterval(s)}),1e3)})),t.on("install-aborted",(()=>{this.updateDownloaded=!0,this.isUpdating=!1}))}},qt=Ct,kt=(i("8d5b"),i("9c40")),xt=i("58ea"),St=i("24e8"),Dt=i("f09f"),Lt=i("a370"),Qt=i("4b7e"),Ot=Object(p["a"])(qt,ht,pt,!1,null,"b0b9ec5a",null),Pt=Ot.exports;y()(Ot,"components",{QBtn:kt["a"],QTooltip:F["a"],QBadge:_["a"],QCircularProgress:xt["a"],QDialog:St["a"],QCard:Dt["a"],QCardSection:Lt["a"],QCardActions:Qt["a"]});const It=i("ed08").isElectron();var Ut={name:"ApplicationHeader",components:{Updater:Pt,Breadcrumbs:ut},props:{},data(){return{isElectron:It,env:null}},created(){if(It){Promise.resolve().then(i.t.bind(null,"bdb9",7)).then((({ipcRenderer:t})=>{this.windowControl=e=>t.sendSync("app_window_control",e)}));const t=navigator.userAgent.toLowerCase(),e=/macintosh|mac os x/i.test(t);this.env=e?"mac":"win"}},computed:{applicationTitle(){const t={Downloader:this.$route.query.currentTab,Library:"library",Player:"player",Credits:"credits",AccountSettings:"account_account_setting",BasicSetting:"basic_setting",AdvanceSetting:"advancedSettings",Development:"development"},e=this.$route.name;return e&&t[e]?this.$t(t[e]):"Alphabiz"}}},Et=Ut,Tt=(i("ddc4"),i("e359")),At=i("65c6"),jt=i("2c91"),zt=Object(p["a"])(Et,it,st,!1,null,"7b7544d6",null),Bt=zt.exports;y()(zt,"components",{QHeader:Tt["a"],QToolbar:At["a"],QSpace:jt["a"]});const Vt=i("ed08").isElectron();var Nt={name:"MainLayout",components:{ApplicationHeader:Bt,ApplicationBar:et["a"],LeftDrawer:tt},data(){return{showAppBar:Vt,currentTab:"downloading",leftDrawerOpen:!1}},computed:{leftDrawerBehavior(){return this.$refs.leftDrawer.currentBehavior},applicationTitle(){const t={Index:this.$route.query.currentTab,Player:"player",Credits:"credits",AccountSettings:"account_account_setting",BasicSettings:"basic_setting",AdvancedSettings:"advancedSettings",Development:"development"},e=this.$route.name;return e&&t[e]?this.$t(t[e]):"Alphabiz"},publicVersion(){return Object(vt["a"])("version")},publicSourceCommit(){return Object(vt["a"])("sourceCommit")}},methods:{showAboutDialog(){const t=this.$root.$children[0];t.$refs.about.about_visible()}}},Ft=Nt,Mt=(i("89d3"),i("4d5a")),Rt=i("09e3"),Ht=i("7ff0"),Wt=Object(p["a"])(Ft,s,a,!1,null,null,null);e["default"]=Wt.exports;y()(Wt,"components",{QLayout:Mt["a"],QBtn:kt["a"],QBadge:_["a"],QSeparator:I["a"],QPageContainer:Rt["a"],QFooter:Ht["a"],QToolbar:At["a"]})},"89d3":function(t,e,i){"use strict";i("e87e")},"8d5b":function(t,e,i){"use strict";i("45e8")},"97ee":function(t,e,i){},"9f43":function(t,e,i){"use strict";i("26d2")},b2ea:function(t,e,i){},c4f8:function(t,e,i){},ce09:function(t,e,i){"use strict";i("c4f8")},ddc4:function(t,e,i){"use strict";i("97ee")},e87e:function(t,e,i){},ff65:function(t,e,i){}}]);