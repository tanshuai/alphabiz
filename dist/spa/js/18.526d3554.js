(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[18],{3660:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"library-index"},[a("div",{staticClass:"library-inner-container"},[a("VirtualScrollGrid",{staticClass:"library-grid",attrs:{virtualScrollSliceRow:30,itemWidth:560,itemHeight:473,gutter:8,itemsSize:e.searchFilteredPosts.length,itemsFn:function(t,a){return e.itemsFn(t,a-t)}},on:{"virtual-scroll":function(t){var a=t.from;return e.scrollIndex=a||0}},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.item;return[a("PostCard",{key:s.id,attrs:{post:s},on:{preview:function(t){return e.showPreview=t},follow:e.unfollow,"to-channel":e.toChannelPage}})]}},{key:"after",fn:function(t){var s=t.column,n=t.mod;return[a("div",{directives:[{name:"intersection",rawName:"v-intersection",value:function(t){return e.fetchNext(t,Math.max(Math.ceil(10/s),2)*s+(n?s-n:0))},expression:"(entry) => fetchNext(entry, (Math.max(Math.ceil(10 / column), 2) * column) + (mod ? column - mod : 0))"}],staticClass:"rounded-borders bg-page column justify-center items-center",class:e.searchFilteredPosts.length?"q-mb-sm q-pa-md":"",style:e.searchFilteredPosts.length?{}:{height:"calc(100vh - var(--header-height) - var(--appbar-height) - 8px)"}},["loaded"!==e.loaderState||e.searchFilteredPosts.length?"loaded"===e.loaderState?a("div",[a("q-icon",{attrs:{name:"check_circle_outline",size:"1.2rem"}}),a("span",{staticClass:"q-ml-sm"},[e._v(e._s(e.$t("got_all_post")))])],1):[a("div",[a("q-spinner-ios",{attrs:{size:"1.2rem",color:"general"}}),a("span",{staticClass:"q-ml-sm"},[e._v(e._s(e.$t("loading"))+"...")])],1),e.searchFilteredPosts.length?e._e():a("div",{staticClass:"q-mt-sm"},[e._v(e._s(e.$t("lib_from_network")))])]:a("div",[a("q-icon",{attrs:{name:"error_outline",size:"1.2rem"}}),a("span",{staticClass:"q-ml-sm"},[e._v(e._s(e.$t("credit_no_data")))])],1)],2)]}}])}),e._e()],1),e._e(),a("BackToTop",{attrs:{show:e.scrollIndex>0||e.showBackToTop},on:{click:e.handleBackToTop}}),a("SearchChannel",{attrs:{higher:e.scrollIndex>0||e.showBackToTop}}),a("q-dialog",{model:{value:e.showPreview,callback:function(t){e.showPreview=t},expression:"showPreview"}},[a("q-card",{staticClass:"image-preview-card"},[a("q-card-section",{staticClass:"q-pa-none"},[a("img",{staticClass:"preview-image",attrs:{src:e.previewImage}})]),a("q-card-actions",{staticClass:"q-pa-none",staticStyle:{position:"absolute",bottom:"0",right:"0"},attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",padding:"none",size:"20px",icon:"close",color:"grey"}})],1)],1)],1)],1)},n=[],i=(a("e01a"),a("4aad")),o=a("2de9"),r=a("0ebe"),l=a("ed08"),c=a("6277"),d=a("309c"),h=a("e64e"),u=a("decc"),p=a("3013"),v=a("bae3"),m={name:"LibraryIndex",components:{PostCard:o["a"],SearchChannel:c["a"],BackToTop:r["a"]},mixins:[d["c"],d["a"],d["b"],h["a"],Object(u["a"])("index"),p["a"]],data(){return{isElectron:Object(l["isElectron"])(),active:!1,scrollIndex:0,lib:i["a"]}},computed:{followingChannels(){var e,t;const a=(null===(e=i["a"].userData)||void 0===e?void 0:e.blockChannels)||[],s=(null===(t=i["a"].userData)||void 0===t?void 0:t.blockUsers)||[];return i["a"].followingChannels.filter((e=>!i["a"].isBannedChannel(e)&&(!a.includes(e.id)&&!s.includes(e.creator))))},filteredPosts(){return Object.values(this.loadedPosts).filter((e=>!i["a"].isBannedPost(e))).filter((e=>i["a"].isValidRate(e.rate||"G")))},searchFilteredPosts(){console.log("search index");const e=this.searchText.toLowerCase(),t=i["a"].search.option.value,a=e=>{var a;switch(t){case"channel":return null===(a=e.channel)||void 0===a?void 0:a.title;case"channelID":return e.channel.id;case"description":return e.description;default:return e.title}},s=t=>{var s;return Object(v["a"])(null===(s=a(t))||void 0===s?void 0:s.toLowerCase()).includes(Object(v["a"])(e))};return this.filteredPosts.filter(s)}},methods:{async fetchNext({isIntersecting:e},t=10){e&&await this.loader$loadPostsNext({count:t})},itemsFn(e=0,t=5){return this.searchFilteredPosts.slice(e,e+t)},async unfollow(e){const t=this.$alphabiz.dialog({title:this.$t("unfollow"),message:this.$t("unfollow_confirm"),ok:this.$t("unfollow"),cancel:this.$t("cancel")}),a=await t.promise("ok");if(!a)return;const s=await i["a"].unfollowChannel(e);console.log("unfollowed",e,s)},toChannelPage(e){console.log("to",e);const t=["id","title"].map((t=>{const a=e[t];return encodeURIComponent(t)+"="+encodeURIComponent(a)})).join("&"),a=`/library/channel?${t}`;this.$root.$emit("navigate-to",a),this.$router.push(a)}},async activated(){this.active=!0;const e=()=>{this.lib.setSearchOption([{label:this.$t("post_title"),value:"post"},{label:this.$t("description"),value:"description"},{label:this.$t("channel_title"),value:"channel"},{label:this.$t("channel_id"),value:"channelID"}])};this.$root.$emit("navigate-to"),e()},deactivated(){this.active=!1},watch:{"searchFilteredPosts.length"(e,t){t||!e||this.active||this.$router.push("/library")},searchText(e){e&&this.active&&this.handleBackToTop()}}},f=m,b=(a("81f6"),a("2877")),g=a("0016"),w=a("d9b2"),C=a("eaac"),_=a("6b1d"),P=a("eb85"),x=a("3b16"),$=a("a12b"),k=a("24e8"),y=a("f09f"),q=a("a370"),S=a("4b7e"),T=a("9c40"),I=a("9748"),Q=a("7f67"),F=a("eebe"),B=a.n(F),j=Object(b["a"])(f,s,n,!1,null,null,null);t["default"]=j.exports;B()(j,"components",{QIcon:g["a"],QSpinnerIos:w["a"],QTable:C["a"],QLinearProgress:_["a"],QSeparator:P["a"],QPagination:x["a"],QVirtualScroll:$["a"],QDialog:k["a"],QCard:y["a"],QCardSection:q["a"],QCardActions:S["a"],QBtn:T["a"]}),B()(j,"directives",{Intersection:I["a"],ClosePopup:Q["a"]})},"63ce":function(e,t,a){},"81f6":function(e,t,a){"use strict";a("63ce")}}]);