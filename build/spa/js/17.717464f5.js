(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[17],{3660:function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"library-index"},[a("div",{staticClass:"library-inner-container"},[a("VirtualScrollGrid",{staticClass:"library-grid",attrs:{virtualScrollSliceRow:0,itemWidth:560,itemHeight:473,gutter:8,itemsSize:e.searchFilteredPosts.length,itemsFn:function(t,a){return e.itemsFn(t,a-t)}},on:{"virtual-scroll":function(t){var a=t.from;return e.scrollIndex=a||0}},scopedSlots:e._u([{key:"default",fn:function(t){var o=t.item;return[a("PostCard",{key:o.id,attrs:{post:o},on:{preview:function(t){return e.showPreview=t},follow:e.unfollow,"to-channel":e.toChannelPage}})]}},{key:"after",fn:function(){return[a("div",{staticClass:"rounded-borders bg-page column justify-center items-center",class:e.searchFilteredPosts.length?"q-mb-sm q-pa-md":"",style:e.searchFilteredPosts.length?{}:{height:"calc(100vh - var(--header-height) - var(--appbar-height) - 8px)"}},["loaded"!==e.loaderState||e.searchFilteredPosts.length?"loaded"===e.loaderState?a("div",[a("q-icon",{attrs:{name:"check_circle_outline",size:"1.2rem"}}),a("span",{staticClass:"q-ml-sm"},[e._v(e._s(e.$t("got_all_post")))])],1):[a("div",[a("q-spinner-ios",{attrs:{size:"1.2rem",color:"general"}}),a("span",{staticClass:"q-ml-sm"},[e._v(e._s(e.$t("loading"))+"...")])],1),e.searchFilteredPosts.length?e._e():a("div",{staticClass:"q-mt-sm"},[e._v(e._s(e.$t("lib_from_network")))])]:a("div",[a("q-icon",{attrs:{name:"error_outline",size:"1.2rem"}}),a("span",{staticClass:"q-ml-sm"},[e._v(e._s(e.$t("credit_no_data")))])],1)],2)]},proxy:!0}])}),e._e()],1),e._e(),a("BackToTop",{attrs:{show:e.scrollIndex>0||e.showBackToTop},on:{click:e.handleBackToTop}}),a("SearchChannel",{attrs:{higher:e.scrollIndex>0||e.showBackToTop}}),a("q-dialog",{model:{value:e.showPreview,callback:function(t){e.showPreview=t},expression:"showPreview"}},[a("q-card",{staticClass:"image-preview-card"},[a("q-card-section",{staticClass:"q-pa-none"},[a("img",{staticClass:"preview-image",attrs:{src:e.previewImage}})]),a("q-card-actions",{staticClass:"q-pa-none",staticStyle:{position:"absolute",bottom:"0",right:"0"},attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",padding:"none",size:"20px",icon:"close",color:"grey"}})],1)],1)],1)],1)},s=[],n=(a("e01a"),a("4aad")),l=a("2de9"),i=a("0ebe"),r=a("ed08"),d=a("6277"),c=(a("ddb0"),a("4069"),a("0613"));a("997a"),a("e9c4");const h=!0,u=function(e={},...t){if(!h)return;const{tags:a,type:o,styles:s}=Object.assign({tags:[],type:"log",styles:[{bgc:"rgb(247,247,247)",color:"black"},{bgc:"rgb(96,96,96)",color:"white"}]},e),n=Array.from(a,((e,t)=>{const o=s[(t+1)%2],n=[`background-color: ${o.bgc}`,`color: ${o.color}`];return n.push("padding: 2px 12px"),0===t&&n.push("border-top-left-radius: 8px","border-bottom-left-radius: 8px"),t===a.length-1&&n.push("border-top-right-radius: 8px","border-bottom-right-radius: 8px"),n.join("; ")})),l=a.map((e=>`%c${e}`)).join("");console[o](l,...n,...t)},g={log:{type:"log"},warn:{type:"warn"},error:{type:"error"},red:{styles:[{bgc:"rgb(248,160,160)",color:"black"},{bgc:"rgb(134,12,12)",color:"white"}]},green:{styles:[{bgc:"rgb(160,248,161)",color:"black"},{bgc:"rgb(35,154,17)",color:"white"}]},purple:{styles:[{bgc:"rgb(200,184,255)",color:"black"},{bgc:"rgb(44,31,162)",color:"white"}]},blue:{styles:[{bgc:"rgb(184,215,255)",color:"black"},{bgc:"rgb(31,107,162)",color:"white"}]},tags:e=>(...t)=>(e.options.tags=e.options.tags||[],e.options.tags.push(...t),p(e))},p=e=>new Proxy(e,{get(e,t){if("options"===t)return e.options||void 0;if(!Object.keys(g).includes(t))return;const a=(...e)=>u(a.options,...e);return a.options={},Object.assign(a.options,JSON.parse(JSON.stringify(e.options||{}))),"function"===typeof g[t]?g[t](a):(Object.assign(a.options,g[t]),p(a))}}),b=p(u);Object.defineProperties(u,Object.keys(g).reduce(((e,t)=>(e[t]={get(){return b[t]}},e)),{}));var m=u;const $=e=>new Promise((t=>{const a=setInterval((()=>{const o=e();void 0!==o&&(clearInterval(a),t(o))}),1e3)})),f={data(){return{previewImage:null}},computed:{showPreview:{set(e){this.previewImage=e||null},get(){return!!this.previewImage}}}},w={methods:{async initFilmRate(){const e=e=>{const t=new Date(e);if(!t||!t.valueOf())return;const a=Date.now();return t.setFullYear(t.getFullYear()+7),t.valueOf()<a?"PG":(t.setFullYear(t.getFullYear()+3),t.valueOf()<a?"PG-13":(t.setFullYear(t.getFullYear()+3),t.valueOf()<a?"R":(t.setFullYear(t.getFullYear()+4),t.valueOf()<a?"NC-17":void 0)))},t=async()=>{const e={type:"radio",model:"G"};e.items=[{label:this.$t("rate_g"),value:"G",tooltip:this.$t("rate_g_desc")},{label:this.$t("rate_pg"),value:"PG",tooltip:this.$t("rate_pg_desc")},{label:this.$t("rate_pg_13"),value:"PG-13",tooltip:this.$t("rate_pg_13_desc")},{label:this.$t("rate_r"),value:"R",tooltip:this.$t("rate_r_desc")},{label:this.$t("rate_nc_17"),value:"NC-17",tooltip:this.$t("rate_nc_17_desc")}];const t=this.$alphabiz.dialog({title:this.$t("set_film_rate"),message:this.$t("select_a_rate_before_enter"),options:e,ok:this.$t("ok")}),a=await t.promise("ok");if(a)return a.option},o=e=>{if(c["a"].dispatch("updateSettings",{libraryRate:e}),Object(r["isElectron"])()){const{ipcRenderer:t}=a("bdb9");t.send("set_settings",{libraryRate:e})}localStorage.setItem("set-film-rate",e)};if(localStorage.getItem("set-film-rate"))return;const s=await $((()=>{if(c["a"].getters.accountUserInfo&&c["a"].getters.accountUserInfo.sub)return c["a"].getters.accountUserInfo.birthday||null}));let n=e(s);n||(n=await t()),o(n)}},async activated(){await this.initFilmRate()}},v=m.blue.tags("LibLoader"),y=v.tags("Channel"),C=v.tags("Post"),P={data(){return{loader$loadedChannels:{}}},created(){this.$watch("followingChannels",(e=>{let t=!1;Object.keys(this.loader$loadedChannels).forEach((a=>{e.some((e=>e.id===a))||(delete this.loader$loadedChannels[a],t=!0)})),t&&(this.loader$loadedChannels=Object.assign({},this.loader$loadedChannels))}),{immediate:!0,deep:!0})},computed:{loader$toLoadChannels(){const e=this.followingChannels;return e.filter((e=>!(!e.title||!e.id)&&!this.loader$loadedChannels[e.id])).reduce(((e,t)=>(e[t.id]=t,e)),{})}},methods:{async loader$enableChannelsLoader({onLoaded:e},t){const a=async({onChannelLoaded:e,onChannelUpdated:t})=>{const a=Object.values(this.loader$toLoadChannels);await Promise.all(a.map((async a=>{const o=await n["a"].getChannelPostIds(a.id,!0);if(!this.loaderEnabled)return;const s=this.loader$loadedChannels[a.id];s?s.ids=o:this.loader$loadedChannels[a.id]={channel:a,ids:o},this.loader$loadedChannels=Object.assign({},this.loader$loadedChannels),await(s?t:e)(a.id)})))},o=()=>({toLoadCount:Object.keys(this.loader$toLoadChannels).length,loadedCount:Object.keys(this.loader$loadedChannels).length}),s=e=>new Promise((t=>setTimeout(t,e)));let l=!0;while(this.loaderEnabled){const n=o();if(!n.toLoadCount){if(l){e((()=>{const e=l;return l=!1,e})());continue}await s(t);continue}if(await a({onChannelLoaded:async e=>{if(!this.loaderEnabled)return;const{loadedCount:t,toLoadCount:a}=o(),s=`${t}/${t+a}`;y.tags("onLoaded",s).log(e)},onChannelUpdated:async e=>{this.loaderEnabled&&y.tags("onUpdated").log(e)}}),!this.loaderEnabled)break;const i=o();i.toLoadCount||(e((()=>{const e=l;return l=!1,e})()),await s(t))}}}},_={data(){return{loader$loadedPosts:{}}},computed:{loader$toLoadPosts(){return Object.values(this.loader$loadedChannels).map((({channel:e,ids:t})=>t.map((t=>({id:t,channelId:e.id}))))).flat(1).reduce(((e,t)=>(this.loader$loadedPosts[t.id]||(e[t.id]=t),e)),{})},loader$toLoadPostIdListSorted(){return Object.keys(this.loader$toLoadPosts).sort(((e,t)=>e&&t?e.localeCompare(t):0))}},created(){},methods:{async loader$loadPosts({count:e},{onPostsLoaded:t}){const a=async e=>{const{id:t,channelId:a}=e,o=this.loader$loadedChannels[a].channel,s=await n["a"].getPostById(a,t,!0);return s?(s.channel=o,s):null},o=e=>this.loader$toLoadPostIdListSorted.length?this.loader$toLoadPostIdListSorted.slice(0,e).map((e=>this.loader$toLoadPosts[e])):null,s=o(e);if(!s)return;const l=await Promise.all(s.map((async e=>{const t=await a(e);return t?(this.loader$loadedPosts[t.id]=t,{success:!0,id:t.id}):{success:!1,id:e.id,channelId:e.channelId}}))),i=l.filter((e=>e.success)).map((e=>e.id));return i.length&&(this.loader$loadedPosts=Object.assign({},this.loader$loadedPosts),await t(i)),l},async loader$loadPostsNext({count:e}={}){if(!Object.keys(this.loader$toLoadPosts).length)return;if("loaded"!==this.loaderState)return;this.loaderState="fetching",await new Promise((e=>setTimeout(e,1e3)));const t=async()=>{const e=()=>({toLoadCount:Object.keys(this.loader$toLoadPosts).length,loadedCount:Object.keys(this.loader$loadedPosts).length}),{loadedCount:t,toLoadCount:a}=e(),o=`${t}/${t+a}`;C.tags("onLoaded",o).log()};await this.loader$loadPosts({count:e},{onPostsLoaded:t}),this.loaderState="loaded"},async loader$initPostLoader({initialCount:e}={},{onPostsLoaded:t}={}){e=24,t=async()=>{const e=()=>({toLoadCount:Object.keys(this.loader$toLoadPosts).length,loadedCount:Object.keys(this.loader$loadedPosts).length}),{loadedCount:t,toLoadCount:a}=e(),o=`${t}/${t+a}`;C.tags("onLoaded",o).log()};const a=e=>new Promise((t=>setTimeout(t,e))),o=()=>({toLoadCount:Object.keys(this.loader$toLoadPosts).length,loadedCount:Object.keys(this.loader$loadedPosts).length}),s=()=>{const{toLoadCount:t,loadedCount:a}=o();return a&&(0===t||a>=e)};let n=!0;while(!s())await this.loader$loadPosts({count:10},{onPostsLoaded:t}),n?n=!1:await a(Math.round(3e3*Math.random()));C.log("loaded")}}},L={mixins:[P,_],data(){return{loaderState:"stopped"}},computed:{loaderEnabled(){return["loading","fetching","loaded","timeout"].includes(this.loaderState)}},created(){this.$watch("loaderState",((e,t)=>{let a=v.tags("State",e);const o={red:["timeout"]},s=Object.keys(o).find((t=>o[t].includes(e)));s&&(a=a[s]);const n={loading:"loading...",timeout:"timeout, maybe network error",fetching:"fetching next post slice",loaded:()=>{const e={loading:"loaded",timeout:"loaded but timeout"};return e[t]}};let l=n[e];"function"===typeof l&&(l=l()),l?a.log(l):a.log()}))},methods:{async enableLoader(){const e=e=>new Promise((t=>setTimeout(t,e))),t=async(t,a,o)=>{let s,n=!1;return await Promise.race([t.then((e=>{n=!0,s=e})),e(a).then((()=>{n||o&&(s=o())}))]),s};if(this.loaderEnabled)return;this.loaderState="loading";const a=6e4,o=async()=>{await new Promise((e=>this.loader$enableChannelsLoader({onLoaded:t=>{y.log(t?"loaded":"updated"),e(!0)}},1e4))),await this.loader$initPostLoader()},s=e=>{this.loaderEnabled&&(this.loaderState=e?"timeout":"loaded")};await t((async()=>{await o(),s(!1)})(),a,(()=>{s(!0)}))},async disableLoader(){this.loaderEnabled&&(this.loaderState="stopped")}}},k={methods:{loader$dialog(){const e=this.$alphabiz.dialog({title:this.$t("no_available_post"),message:this.$t("following_channel_no_post"),cancel:this.$t("cancel"),ok:this.$t("lib_explore")});return e.promise("ok").then((e=>{e&&(c["a"].getters.settings.libraryShowExplore||c["a"].dispatch("set",{libraryShowExplore:!0}),this.$root.$emit("navigate-to","/library/explore"),this.$router.push("/library/explore"))})),e}}},O={mixins:[L,k],computed:{loadedPosts(){return this.loader$loadedPosts}},created(){let e;this.$watch("loaderState",(t=>{if("timeout"===t){if(e)return;e=this.loader$dialog()}else{if(!e)return;try{e.hide()}finally{e=null}}}))},async activated(){const e=()=>{const e=Object.values(this.loader$loadedChannels).map((({ids:e})=>e)).flat(1),t=Object.keys(this.loader$loadedPosts).filter((t=>!e.includes(t)));t.forEach((e=>{delete this.loader$loadedPosts[e]})),t.length&&(this.loader$loadedPosts=Object.assign({},this.loader$loadedPosts))};e(),await n["a"].whenReady,this.enableLoader()},deactivated(){this.disableLoader()}};var S=a("e64e"),j=a("decc"),x=a("3013"),I={name:"LibraryIndex",components:{PostCard:l["a"],SearchChannel:d["a"],BackToTop:i["a"]},mixins:[f,w,O,S["a"],Object(j["a"])("index"),x["a"]],data(){return{isElectron:Object(r["isElectron"])(),active:!1,scrollIndex:0,lib:n["a"]}},computed:{followingChannels(){var e,t;const a=(null===(e=n["a"].userData)||void 0===e?void 0:e.blockChannels)||[],o=(null===(t=n["a"].userData)||void 0===t?void 0:t.blockUsers)||[];return n["a"].followingChannels.filter((e=>!n["a"].isBannedChannel(e)&&(!a.includes(e.id)&&!o.includes(e.creator))))},filteredPosts(){return Object.values(this.loadedPosts).filter((e=>!n["a"].isBannedPost(e))).filter((e=>n["a"].isValidRate(e.rate||"G")))},searchFilteredPosts(){console.log("search index");const e=this.searchText.toLowerCase(),t=n["a"].search.option.value,a=e=>{var a;switch(t){case"channel":return null===(a=e.channel)||void 0===a?void 0:a.title;case"channelID":return e.channel.id;case"description":return e.description;default:return e.title}},o=t=>{var o;return null===(o=a(t))||void 0===o?void 0:o.toLowerCase().includes(e)};return this.filteredPosts.filter(o)}},methods:{async fetchNext({isIntersecting:e}){e&&await this.loader$loadPostsNext({count:10})},itemsFn(e=0,t=5){return this.searchFilteredPosts.slice(e,e+t)},async unfollow(e){const t=this.$alphabiz.dialog({title:this.$t("unfollow"),message:this.$t("unfollow_confirm"),ok:this.$t("unfollow"),cancel:this.$t("cancel")}),a=await t.promise("ok");if(!a)return;const o=await n["a"].unfollowChannel(e);console.log("unfollowed",e,o)},toChannelPage(e){console.log("to",e);const t=["id","title"].map((t=>{const a=e[t];return encodeURIComponent(t)+"="+encodeURIComponent(a)})).join("&"),a=`/library/channel?${t}`;this.$root.$emit("navigate-to",a),this.$router.push(a)}},async activated(){this.active=!0;const e=()=>{this.lib.setSearchOption([{label:this.$t("post_title"),value:"post"},{label:this.$t("description"),value:"description"},{label:this.$t("channel_title"),value:"channel"},{label:this.$t("channel_id"),value:"channelID"}])};this.$root.$emit("navigate-to"),e()},deactivated(){this.active=!1},watch:{"searchFilteredPosts.length"(e,t){t||!e||this.active||this.$router.push("/library")}}},F=I,E=(a("81f6"),a("2877")),q=a("0016"),T=a("d9b2"),Q=a("eaac"),R=a("6b1d"),B=a("eb85"),U=a("3b16"),z=a("a12b"),G=a("24e8"),N=a("f09f"),Y=a("a370"),D=a("4b7e"),J=a("9c40"),V=a("9748"),A=a("7f67"),M=a("eebe"),H=a.n(M),W=Object(E["a"])(F,o,s,!1,null,null,null);t["default"]=W.exports;H()(W,"components",{QIcon:q["a"],QSpinnerIos:T["a"],QTable:Q["a"],QLinearProgress:R["a"],QSeparator:B["a"],QPagination:U["a"],QVirtualScroll:z["a"],QDialog:G["a"],QCard:N["a"],QCardSection:Y["a"],QCardActions:D["a"],QBtn:J["a"]}),H()(W,"directives",{Intersection:V["a"],ClosePopup:A["a"]})},"63ce":function(e,t,a){},"81f6":function(e,t,a){"use strict";a("63ce")}}]);