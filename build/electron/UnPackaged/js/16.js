(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[16],{3660:function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"library-index"},[a("q-virtual-scroll",{ref:"vscroll",staticClass:"library-index-scroll",class:{web:!e.isElectron},attrs:{separator:"","virtual-scroll-slice-size":10,"virtual-scroll-item-size":385,"items-size":e.searchFilteredPosts.length,"virtual-scroll-sticky-size-end":16,"items-fn":e.itemsFn},on:{"virtual-scroll":function(t){return e.scrollIndex=t.index||0}},scopedSlots:e._u([{key:"default",fn:function(t){var o=t.item;return[a("PostCard",{key:o.id,attrs:{post:o},on:{preview:function(t){return e.showPreview=t},follow:e.unfollow,"to-channel":e.toChannelPage}})]}},{key:"after",fn:function(){return[a("div",{staticClass:"flex justify-center items-center",class:e.searchFilteredPosts.length?["q-mt-lg","q-mb-xl"]:["full-height"]},["loaded"!==e.loaderState||e.searchFilteredPosts.length?"loaded"===e.loaderState?[a("q-icon",{attrs:{name:"check_circle_outline",size:"1.2rem"}}),a("div",{staticClass:"q-ml-sm"},[e._v(e._s(e.$t("got_all_post")))])]:[a("q-spinner-ios",{attrs:{size:"1.2rem",color:"general"}}),a("div",{staticClass:"q-ml-sm"},[e._v(e._s(e.$t("loading"))+"...")])]:[a("q-icon",{attrs:{name:"error_outline",size:"1.2rem"}}),a("div",{staticClass:"q-ml-sm"},[e._v(e._s(e.$t("credit_no_data")))])]],2)]},proxy:!0}])}),a("BackToTop",{attrs:{show:e.scrollIndex>0},on:{click:function(t){return e.$refs.vscroll.scrollTo(0,"start")}}}),a("SearchChannel",{attrs:{higher:e.scrollIndex>0}}),a("q-dialog",{model:{value:e.showPreview,callback:function(t){e.showPreview=t},expression:"showPreview"}},[a("q-card",{staticClass:"image-preview-card"},[a("q-card-section",{staticClass:"q-pa-none"},[a("img",{staticClass:"preview-image",attrs:{src:e.previewImage}})]),a("q-card-actions",{staticClass:"q-pa-none",staticStyle:{position:"absolute",bottom:"0",right:"0"},attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",padding:"none",size:"20px",icon:"close",color:"grey"}})],1)],1)],1)],1)},s=[],l=(a("e01a"),a("4aad")),n=a("2de9"),i=a("0ebe"),r=a("ed08"),d=a("6277"),c=(a("a79d"),a("ddb0"),a("4069"),a("0613"));a("997a"),a("e9c4");const h=!0,u=function(e={},...t){if(!h)return;const{tags:a,type:o,styles:s}=Object.assign({tags:[],type:"log",styles:[{bgc:"rgb(247,247,247)",color:"black"},{bgc:"rgb(96,96,96)",color:"white"}]},e),l=Array.from(a,((e,t)=>{const o=s[(t+1)%2],l=[`background-color: ${o.bgc}`,`color: ${o.color}`];return l.push("padding: 2px 12px"),0===t&&l.push("border-top-left-radius: 8px","border-bottom-left-radius: 8px"),t===a.length-1&&l.push("border-top-right-radius: 8px","border-bottom-right-radius: 8px"),l.join("; ")})),n=a.map((e=>`%c${e}`)).join("");console[o](n,...l,...t)},g={log:{type:"log"},warn:{type:"warn"},error:{type:"error"},red:{styles:[{bgc:"rgb(248,160,160)",color:"black"},{bgc:"rgb(134,12,12)",color:"white"}]},green:{styles:[{bgc:"rgb(160,248,161)",color:"black"},{bgc:"rgb(35,154,17)",color:"white"}]},purple:{styles:[{bgc:"rgb(200,184,255)",color:"black"},{bgc:"rgb(44,31,162)",color:"white"}]},blue:{styles:[{bgc:"rgb(184,215,255)",color:"black"},{bgc:"rgb(31,107,162)",color:"white"}]},tags:e=>(...t)=>(e.options.tags=e.options.tags||[],e.options.tags.push(...t),b(e))},b=e=>new Proxy(e,{get(e,t,a){if("options"===t)return e.options||void 0;if(!Object.keys(g).includes(t))return;const o=(...e)=>u(o.options,...e);return o.options={},Object.assign(o.options,JSON.parse(JSON.stringify(e.options||{}))),"function"===typeof g[t]?g[t](o):(Object.assign(o.options,g[t]),b(o))}}),p=b(u);Object.defineProperties(u,Object.keys(g).reduce(((e,t)=>(e[t]={get(){return p[t]}},e)),{}));var m=u;global.$k=global.$k||{};const $=e=>new Promise((t=>{const a=setInterval((()=>{const o=e();void 0!==o&&(clearInterval(a),t(o))}),1e3)})),f={data(){return{previewImage:null}},computed:{showPreview:{set(e){this.previewImage=e||null},get(){return!!this.previewImage}}}},w={methods:{async initFilmRate(){const e=e=>{const t=new Date(e);if(!t||!t.valueOf())return;const a=Date.now();return t.setFullYear(t.getFullYear()+7),t.valueOf()<a?"PG":(t.setFullYear(t.getFullYear()+3),t.valueOf()<a?"PG-13":(t.setFullYear(t.getFullYear()+3),t.valueOf()<a?"R":(t.setFullYear(t.getFullYear()+4),t.valueOf()<a?"NC-17":void 0)))},t=async()=>{const e={type:"radio",model:"G"};e.items=[{label:this.$t("rate_g"),value:"G",tooltip:this.$t("rate_g_desc")},{label:this.$t("rate_pg"),value:"PG",tooltip:this.$t("rate_pg_desc")},{label:this.$t("rate_pg_13"),value:"PG-13",tooltip:this.$t("rate_pg_13_desc")},{label:this.$t("rate_r"),value:"R",tooltip:this.$t("rate_r_desc")},{label:this.$t("rate_nc_17"),value:"NC-17",tooltip:this.$t("rate_nc_17_desc")}];const t=this.$alphabiz.dialog({title:this.$t("set_film_rate"),message:this.$t("select_a_rate_before_enter"),options:e,ok:this.$t("ok")}),a=await t.promise("ok");if(a)return a.option},o=e=>{if(c["a"].dispatch("updateSettings",{libraryRate:e}),Object(r["isElectron"])()){const{ipcRenderer:t}=a("34bb");t.send("set_settings",{libraryRate:e})}localStorage.setItem("set-film-rate",e)};if(localStorage.getItem("set-film-rate"))return;const s=await $((()=>{if(c["a"].getters.accountUserInfo&&c["a"].getters.accountUserInfo.sub)return c["a"].getters.accountUserInfo.birthday||null}));let l=e(s);l||(l=await t()),o(l)}},async activated(){await this.initFilmRate()}},v=m.blue.tags("LibLoader"),y=v.tags("Channel"),C=v.tags("Post"),P={data(){return{loader$loadedChannels:{}}},created(){this.$watch("followingChannels",(e=>{let t=!1;Object.keys(this.loader$loadedChannels).forEach((a=>{e.some((e=>e.id===a))||(delete this.loader$loadedChannels[a],t=!0)})),t&&(this.loader$loadedChannels=Object.assign({},this.loader$loadedChannels))}),{immediate:!0,deep:!0})},computed:{loader$toLoadChannels(){const e=this.followingChannels;return e.filter((e=>!(!e.title||!e.id)&&!this.loader$loadedChannels[e.id])).reduce(((e,t)=>(e[t.id]=t,e)),{})}},methods:{async loader$enableChannelsLoader({onLoaded:e},t){const a=async({onChannelLoaded:e,onChannelUpdated:t})=>{const a=Object.values(this.loader$toLoadChannels);await Promise.all(a.map((async a=>{const o=await l["a"].getChannelPostIds(a.id,!0);if(!this.loaderEnabled)return;const s=this.loader$loadedChannels[a.id];s?s.ids=o:this.loader$loadedChannels[a.id]={channel:a,ids:o},this.loader$loadedChannels=Object.assign({},this.loader$loadedChannels),await(s?t:e)(a.id)})))},o=()=>({toLoadCount:Object.keys(this.loader$toLoadChannels).length,loadedCount:Object.keys(this.loader$loadedChannels).length}),s=e=>new Promise((t=>setTimeout(t,e)));let n=!0;while(this.loaderEnabled){const l=o();if(!l.toLoadCount){if(n){e((()=>{const e=n;return n=!1,e})());continue}await s(t);continue}if(await a({onChannelLoaded:async e=>{if(!this.loaderEnabled)return;const{loadedCount:t,toLoadCount:a}=o(),s=`${t}/${t+a}`;y.tags("onLoaded",s).log(e)},onChannelUpdated:async e=>{this.loaderEnabled&&y.tags("onUpdated").log(e)}}),!this.loaderEnabled)break;const i=o();i.toLoadCount||(e((()=>{const e=n;return n=!1,e})()),await s(t))}}}},_={data(){return{loader$loadedPosts:{}}},computed:{loader$toLoadPosts(){return Object.values(this.loader$loadedChannels).map((({channel:e,ids:t})=>t.map((t=>({id:t,channelId:e.id}))))).flat(1).reduce(((e,t)=>(this.loader$loadedPosts[t.id]||(e[t.id]=t),e)),{})},loader$toLoadPostIdListSorted(){return Object.keys(this.loader$toLoadPosts).sort(((e,t)=>e&&t?e.localeCompare(t):0))},loader$loadedPostsMin(){const e=10;return Object.keys(this.loader$loadedPosts).length>=e}},methods:{async loader$enablePostsLoader({onLoaded:e},t){const a=async({onPostLoaded:e})=>{const t=async e=>{const{id:t,channelId:a}=e,o=this.loader$loadedChannels[a].channel,s=await l["a"].getPostById(a,t,!0);if(this.loaderEnabled)return s?(s.channel=o,s):null},a=e=>this.loader$toLoadPostIdListSorted.length?this.loader$toLoadPostIdListSorted.slice(0,e).map((e=>this.loader$toLoadPosts[e])):null,o=a(10);if(!o)return;let s=await Promise.all(o.map((async e=>{const a=await t(e);if(this.loaderEnabled&&a)return this.loader$loadedPosts[a.id]=a,a.id})));s=s.filter((e=>void 0!==e)),s.length&&(this.loader$loadedPosts=Object.assign({},this.loader$loadedPosts),await e(s))},o=()=>({toLoadCount:Object.keys(this.loader$toLoadPosts).length,loadedCount:Object.keys(this.loader$loadedPosts).length}),s=e=>new Promise((t=>setTimeout(t,e)));let n=!0;while(this.loaderEnabled){const l=o();if(!l.toLoadCount){if(n){e((()=>{const e=n;return n=!1,e})());continue}await s(t);continue}if(await a({onPostLoaded:async e=>{if(!this.loaderEnabled)return;const{loadedCount:t,toLoadCount:a}=o(),s=`${t}/${t+a}`;C.tags("onLoaded",s).log()}}),!this.loaderEnabled)break;const i=o();i.toLoadCount||(e((()=>{const e=n;return n=!1,e})()),await s(t))}}}},L={mixins:[P,_],data(){return{loaderState:"disabled"}},computed:{loaderEnabled(){return["loading","loaded","timeout","loading_timeout"].includes(this.loaderState)}},created(){this.$watch("loaderState",((e,t)=>{let a=v.tags("State",e);const o={red:["timeout"]},s=Object.keys(o).find((t=>o[t].includes(e)));s&&(a=a[s]);const l={timeout:"timeout, maybe network error",loading_timeout:"timeout, but still loading posts",loaded:()=>{const e={loading_timeout:"loaded but timeout"};return e[t]}};let n=l[e];"function"===typeof n&&(n=n()),n?a.log(n):a.log()}))},methods:{async enableLoader(){const e=e=>new Promise((t=>setTimeout(t,e))),t=async(t,a,o)=>{let s,l=!1;return await Promise.race([t.then((e=>{l=!0,s=e})),e(a).then((()=>{l||o&&(s=o())}))]),s};if(this.loaderEnabled)return;this.loaderState="loading";const a=1e4,o=async()=>{await new Promise((e=>this.loader$enableChannelsLoader({onLoaded:t=>{y.log(t?"loaded":"updated"),e(!0)}},1e4))),await new Promise((e=>this.loader$enablePostsLoader({onLoaded:t=>{C.log(t?"loaded":"updated"),e(!0)}},1e4)))},s=e=>{this.loaderEnabled&&(e?this.loader$loadedPostsMin?this.loaderState="loading_timeout":this.loaderState="timeout":this.loaderState="loaded")};await t((async()=>{await o(),s(!1)})(),a,(()=>{s(!0)}))},async disableLoader(){this.loaderEnabled&&(this.loaderState="disabled")}}},k={methods:{async loader$dialog(){const e=this.$alphabiz.dialog({title:this.$t("no_available_post"),message:this.$t("following_channel_no_post"),cancel:this.$t("cancel"),ok:this.$t("lib_explore")}),t=this.$watch("loader$loadedPostsMin",(a=>{a&&(t(),e.hide())})),a=await e.promise("ok");a&&(c["a"].getters.settings.libraryShowExplore||c["a"].dispatch("set",{libraryShowExplore:!0}),this.$root.$emit("navigate-to","/library/explore"),this.$router.push("/library/explore"))}}},O={mixins:[L,k],computed:{loadedPosts(){return this.loader$loadedPosts}},created(){global.$k.debugInstance=this,this.$watch("loaderState",(e=>{"timeout"===e&&this.loader$dialog()}))},async activated(){const e=()=>{const e=Object.values(this.loader$loadedChannels).map((({ids:e})=>e)).flat(1),t=Object.keys(this.loader$loadedPosts).filter((t=>!e.includes(t)));t.forEach((e=>{delete this.loader$loadedPosts[e]})),t.length&&(this.loader$loadedPosts=Object.assign({},this.loader$loadedPosts))};e(),await l["a"].whenReady,this.enableLoader()},deactivated(){this.disableLoader()}};var j={name:"LibraryIndex",components:{PostCard:n["a"],SearchChannel:d["a"],BackToTop:i["a"]},mixins:[f,w,O],data(){return{isElectron:Object(r["isElectron"])(),scrollIndex:0,lib:l["a"]}},computed:{followingChannels(){var e,t;const a=(null===(e=l["a"].userData)||void 0===e?void 0:e.blockChannels)||[],o=(null===(t=l["a"].userData)||void 0===t?void 0:t.blockUsers)||[];return l["a"].followingChannels.filter((e=>!a.includes(e.id)&&!o.includes(e.creator)))},filteredPosts(){return Object.values(this.loadedPosts).filter((e=>l["a"].isValidRate(e.rate||"G")))},searchFilteredPosts(){const e=l["a"].search.text.toLowerCase(),t=l["a"].search.option.value,a=e=>{var a;switch(t){case"channel":return null===(a=e.channel)||void 0===a?void 0:a.title;case"channelID":return e.channel.id;case"description":return e.description;default:return e.title}},o=t=>{var o;return null===(o=a(t))||void 0===o?void 0:o.toLowerCase().includes(e)};return this.filteredPosts.filter(o)}},methods:{itemsFn(e=0,t=5){return this.searchFilteredPosts.slice(e,e+t)},async unfollow(e){const t=this.$alphabiz.dialog({title:this.$t("unfollow"),message:this.$t("unfollow_confirm"),ok:this.$t("unfollow"),cancel:this.$t("cancel")}),a=await t.promise("ok");if(!a)return;const o=await l["a"].unfollowChannel(e);console.log("unfollowed",e,o)},toChannelPage(e){console.log("to",e);const t=["id","title"].map((t=>{const a=e[t];return encodeURIComponent(t)+"="+encodeURIComponent(a)})).join("&"),a=`/library/channel?${t}`;this.$root.$emit("navigate-to",a),this.$router.push(a)}},async activated(){const e=()=>{this.lib.setSearchOption([{label:this.$t("post_title"),value:"post"},{label:this.$t("description"),value:"description"},{label:this.$t("channel_title"),value:"channel"},{label:this.$t("channel_id"),value:"channelID"}])};this.$root.$emit("navigate-to"),e()}},x=j,I=(a("6b08"),a("2877")),S=a("a12b"),E=a("0016"),F=a("d9b2"),q=a("24e8"),z=a("f09f"),R=a("a370"),U=a("4b7e"),Q=a("9c40"),T=a("7f67"),Y=a("eebe"),D=a.n(Y),G=Object(I["a"])(x,o,s,!1,null,"6d614d9f",null);t["default"]=G.exports;D()(G,"components",{QVirtualScroll:S["a"],QIcon:E["a"],QSpinnerIos:F["a"],QDialog:q["a"],QCard:z["a"],QCardSection:R["a"],QCardActions:U["a"],QBtn:Q["a"]}),D()(G,"directives",{ClosePopup:T["a"]})},"6b08":function(e,t,a){"use strict";a("a8e9")},a8e9:function(e,t,a){}}]);