(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[15],{"163f":function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"library-explore"},[s("div",{staticClass:"library-inner-container"},[s("VirtualScrollGrid",{staticClass:"library-grid",attrs:{virtualScrollSliceRow:30,itemWidth:560,itemHeight:473,gutter:8,itemsSize:e.searchFilteredPosts.length,itemsFn:function(t,s){return e.itemsFn(t,s-t)}},on:{"virtual-scroll":function(t){var s=t.from;return e.scrollIndex=s||0}},scopedSlots:e._u([{key:"default",fn:function(t){var i=t.item;return[s("PostCard",{key:i.id,attrs:{followable:"",post:i,disableFollow:e.loadingNext},on:{preview:e.showPreviewImage,follow:e.follow,"to-channel":e.toChannelPage}})]}},{key:"after",fn:function(t){var i=t.mod,a=t.column;return[s("div",{directives:[{name:"intersection",rawName:"v-intersection",value:function(t){return e.shouldLoading(t,Math.max(Math.ceil(10/a),2)*a+(i?a-i:0))},expression:"(entry) => shouldLoading(entry, (Math.max(Math.ceil(10 / column), 2) * column) + (mod ? column - mod : 0))"}],staticClass:"rounded-borders bg-page column justify-center items-center",class:e.searchFilteredPosts.length?"q-mb-sm q-pa-md":"",style:e.searchFilteredPosts.length?{}:{height:"calc(100vh - var(--header-height) - var(--appbar-height) - 8px)"}},[e.searchFilteredPosts.length||e.loadingPosts||!e.loadedAll?e.loadedAll&&!e.loadingPosts?s("div",[s("q-icon",{attrs:{name:"check_circle_outline",size:"1.2rem"}}),s("span",{staticClass:"q-ml-sm"},[e._v(e._s(e.$t("got_all_post")))])],1):[s("div",[s("q-spinner-ios",{attrs:{size:"1.2rem",color:"general"}}),s("span",{staticClass:"q-ml-sm"},[e._v(e._s(e.$t("loading"))+"...")])],1),e.searchFilteredPosts.length?e._e():s("div",{staticClass:"q-mt-sm"},[e._v(e._s(e.$t("lib_from_network")))])]:s("div",[s("q-icon",{attrs:{name:"error_outline",size:"1.2rem"}}),s("span",{staticClass:"q-ml-sm"},[e._v(e._s(e.$t("credit_no_data")))])],1)],2)]}}])}),e._e()],1),e._e(),s("BackToTop",{attrs:{show:e.scrollIndex>0||e.showBackToTop},on:{click:e.handleBackToTop}}),s("SearchChannel",{attrs:{higher:e.scrollIndex>0||e.showBackToTop}}),e.allPosts.length||e.loadingPosts?e._e():s("div",{staticClass:"no-data"},[s("q-btn",{staticClass:"no-data-btn",attrs:{round:"",color:"primary",icon:"arrow_forward",size:"24px"},on:{click:e.goToFollowing}},[s("q-tooltip",[e._v(e._s(e.$t("no_recommend"))+" "+e._s(e.$t("lib_following")))])],1)],1),s("q-dialog",{model:{value:e.showPreview,callback:function(t){e.showPreview=t},expression:"showPreview"}},[s("q-card",{staticClass:"image-preview-card"},[s("q-card-section",{staticClass:"q-pa-none"},[s("img",{staticClass:"preview-image",attrs:{src:e.previewImage}})]),s("q-card-actions",{staticClass:"q-pa-none",staticStyle:{position:"absolute",bottom:"0",right:"0"},attrs:{align:"right"}},[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",padding:"none",size:"20px",icon:"close",color:"grey"}})],1)],1)],1),s("Loading",{attrs:{value:e.loadingPosts&&!e.filteredPosts.length}})],1)},a=[],o=(s("ddb0"),s("4aad")),l=s("2de9"),n=s("0ebe"),r=s("ab9a"),d=s("6277"),h=s("997a"),c=s("ed08"),u=s("e64e"),g=s("decc"),p=s("3013"),m={name:"LibraryExplore",components:{PostCard:l["a"],BackToTop:n["a"],SearchChannel:d["a"],Loading:r["a"]},mixins:[u["a"],Object(g["a"])("explore"),p["a"]],data(){return{isElectron:Object(c["isElectron"])(),active:!1,showPreview:!1,previewImage:"",loadingPosts:!1,loadTimer:null,allPosts:[],loadingNext:!1,loadedAll:!0,loadedChannels:[],loadedPostIds:[],scrollIndex:0,loadingIntersecting:!1,loadStartTime:Date.now(),lib:o["a"]}},computed:{nonFollowingChannels(){const e=this.lib.followingChannels.map((e=>e.id)),t=this.lib.userData.blockChannels,s=this.lib.userData.blockUsers;return this.lib.channelList.filter((i=>!t.includes(null===i||void 0===i?void 0:i.id)&&(!s.includes(null===i||void 0===i?void 0:i.creator)&&!e.includes(null===i||void 0===i?void 0:i.id)))).filter((e=>e))},filteredPosts(){return this.allPosts.filter((e=>o["a"].isValidRate(e.rate||"G")))},searchFilteredPosts(){const e=this.searchText.toLowerCase(),t=o["a"].search.option.value,s=e=>{switch(t){case"channel":return e.channel.title;case"channelID":return e.channel.id;default:return e.title}},i=i=>{var a,o;if(!i||!i.title)return!1;if(!e)return!0;const l=null===(a=s(i))||void 0===a?void 0:a.toLowerCase();return"channelID"===t&&e===l||(null===(o=i.channel)||void 0===o||!o.hidden)&&l.includes(e)};console.time("filter");const a=this.filteredPosts.filter(i);return console.timeEnd("filter"),a},allPostToFetch(){const e=[];return this.loadedChannels.forEach((({channel:t,ids:s})=>{s.forEach((s=>{this.loadedPostIds.includes(s)||e.push({channel:t,postId:s})}))})),e}},methods:{onScroll(e){this.scrollIndex=e.index},itemsFn(e=0,t=5){return Object(h["a"])("vitem",e,t),this.searchFilteredPosts.slice(e,e+t)},shouldLoading(e,t){this.loadingIntersecting=e.isIntersecting,e.isIntersecting&&this.loadNext(t)},async loadNext(e=24){if(!this.active)return!1;if(this.loadingNext)return;this.loadingNext=!0;const t=this.allPostToFetch.slice(0,e).sort(((e,t)=>e.postId&&t.postId?e.postId.localeCompare(t.postId):0));if(Object(h["a"])("Load Next",t),!t.length)return this.loadingNext=!1,this.loadedAll=!0,void setTimeout((()=>{Object(h["a"])("try load more"),this.loadPostList()}),3e3);this.loadedAll=!1;const s=await Promise.all(t.map((async({channel:e,postId:t},s)=>(await new Promise((e=>setTimeout(e,Math.floor(Math.random()*s*500)))),{channel:e,post:await o["a"].getPostById(e.id,t,!0)}))));Object(h["a"])("fetch results",s),s.forEach((({channel:e,post:t})=>{var s;t&&"object"===typeof t&&(e.hidden&&e.creator!==(null===(s=o["a"].user.is)||void 0===s?void 0:s.pub)||(t.channel=e,this.allPosts.push(t)))})),this.loadedPostIds.push(...t.map((e=>e.postId))),this.loadingNext=!1,setTimeout((()=>{Object(h["a"])("should load next",this.loadingIntersecting),this.loadingIntersecting&&this.loadNext()}),200)},loadPostList(){if(!this.active)return;if(this.loadStartTime+15e3<Date.now())return void(this.loadingPosts=!1);if(this.loadingPosts)return;this.loadingPosts=!0,Object(h["a"])("load all",this.nonFollowingChannels);for(let t=0;t<this.loadedChannels.length;t++)this.nonFollowingChannels.some((e=>e.id===this.loadedChannels[t].channel.id))||this.loadedChannels.splice(t--,1);const e=this.nonFollowingChannels.filter((e=>!(!e.title||!e.id)&&!this.loadedChannels.find((t=>t.channel.id===e.id))));Promise.all(e.map((async(e,t)=>(await new Promise((e=>setTimeout(e,t*Math.floor(500*Math.random())))),o["a"].getChannelPostIds(e.id,!0).then((t=>{const s=this.loadedChannels.find((t=>t.channel.id===e.id));if(Object(h["a"])("[Explore] get channel post ids",e.id,t,!s),s?t.forEach((e=>{s.ids.includes(e)||s.ids.push(e)})):this.loadedChannels.push({channel:e,ids:t}),this.active&&!this.allPosts.length){if(this.loadedChannels.length<3&&this.nonFollowingChannels.length>2)return;this.loadNext()}})))))).then((()=>{if(this.allPosts.length)this.loadingPosts=!1;else{if(!this.active)return;setTimeout((()=>{this.loadingPosts=!1,this.allPosts.length||this.loadPostList()}),2e3)}this.active&&this.loadingIntersecting&&this.loadNext()}))},prune(){const e=this.nonFollowingChannels.map((e=>e.id));for(let i=0;i<this.loadedChannels.length;i++)e.includes(this.loadedChannels[i].channel.id)||this.loadedChannels.splice(i--,1);const t=this.loadedChannels.reduce(((e,t)=>(t.ids&&e.push(...t.ids),e)),[]);for(let i=0;i<this.allPosts.length;i++){var s;const a=this.loadedPostIds.findIndex((e=>this.allPosts[i].id===e));e.includes(null===(s=this.allPosts[i].channel)||void 0===s?void 0:s.id)&&t.includes(this.allPosts[i].id)||(this.allPosts.splice(i--,1),-1!==a&&this.loadedPostIds.splice(a,1))}for(let i=0;i<this.loadedPostIds.length;i++)this.allPosts.find((e=>e.id===this.loadedPostIds[i]))||this.loadedPostIds.splice(i--,1)},showPreviewImage(e){this.previewImage=e,this.showPreview=!0},toChannelPage(e){Object(h["a"])("to",e);const t=["id","title"].map((t=>{const s=e[t];return encodeURIComponent(t)+"="+encodeURIComponent(s)})).join("&"),s=`/library/channel?${t}`;this.$root.$emit("navigate-to",s),this.$router.push(s)},follow(e){this.lib.followChannel(e).then((t=>{Object(h["a"])("followed",e,t)}))},goToFollowing(){this.$router.push("/library/following")},setSearch(){this.lib.setSearchOption([{label:this.$t("post_title"),value:"post"},{label:this.$t("channel_title"),value:"channel"},{label:this.$t("channel_id"),value:"channelID"}])}},activated(){this.active=!0,this.prune(),this.$root.$emit("navigate-to"),this.$root.$emit("navigate-to","/library/explore"),this.loadStartTime=Date.now(),this.loadPostList();const e=this;"explore"in window||Object.defineProperty(window,"explore",{get(){return e.loadedChannels}})},deactivated(){this.active=!1},mounted(){this.loadPostList(),this.setSearch()},watch:{nonFollowingChannels(e,t){if(e.length!==t.length){for(let t=0;t<this.loadedChannels.length;t++)e.some((e=>e.id===this.loadedChannels[t].channel.id))||this.loadedChannels.splice(t--,1);this.loadPostList()}},"lib.search.text"(e){this.isActive&&(this.searchText=e)},loadingPosts(e){console.log("change loading",e),e||this.active||this.$router.push("/library/explore")},"searchFilteredPosts.length"(e,t){t||!e||this.active||(console.log("change length"),this.$router.push("/library/explore"))}},beforeRouteEnter(e,t,s){s((e=>{t.path.startsWith("/library")&&e.setSearch()}))},beforeRouteLeave(e,t,s){clearTimeout(this.loadTimer),s()}},v=m,f=(s("c052"),s("2877")),P=s("0016"),w=s("d9b2"),b=s("eaac"),C=s("6b1d"),I=s("eb85"),x=s("3b16"),_=s("a12b"),T=s("9c40"),y=s("05c0"),F=s("74f7"),S=s("cf57"),$=s("24e8"),L=s("f09f"),q=s("a370"),k=s("4b7e"),j=s("9748"),Q=s("7f67"),N=s("eebe"),O=s.n(N),E=Object(f["a"])(v,i,a,!1,null,"efa8bb7c",null);t["default"]=E.exports;O()(E,"components",{QIcon:P["a"],QSpinnerIos:w["a"],QTable:b["a"],QLinearProgress:C["a"],QSeparator:I["a"],QPagination:x["a"],QVirtualScroll:_["a"],QBtn:T["a"],QTooltip:y["a"],QInnerLoading:F["a"],QSpinnerGears:S["a"],QDialog:$["a"],QCard:L["a"],QCardSection:q["a"],QCardActions:k["a"]}),O()(E,"directives",{Intersection:j["a"],ClosePopup:Q["a"]})},aacc:function(e,t,s){},c052:function(e,t,s){"use strict";s("aacc")}}]);