(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[8],{"0605":function(t,e,s){"use strict";s("4b3e3")},"26db":function(t,e,s){"use strict";s("f8e6")},"4b3e3":function(t,e,s){},"5ef25":function(t,e,s){"use strict";s("bce7")},"6fc7":function(t,e,s){"use strict";s("731b")},"731b":function(t,e,s){},"8c41":function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"edit-container"},[s("div",{ref:"scrollArea",staticClass:"edit-main flex items-stretch justify-center"},[s("div",{staticClass:"add-channel rounded-borders bg-general q-ma-sm flex justify-center items-center column",staticStyle:{"min-height":"290px"}},[s("div",{staticClass:"add-channel-panel relative-position"},[s("q-btn",{directives:[{name:"intersection",rawName:"v-intersection",value:t.intersect,expression:"intersect"}],staticClass:"add-channel-btn block absolute-left",attrs:{round:"",unelevated:"",color:"primary",icon:"add_circle_outline",size:"24px"},on:{click:t.add}},[s("q-tooltip",[t._v(t._s(t.$t("add_channel")))])],1),s("q-btn",{staticClass:"quick-start block absolute-right",attrs:{round:"",unelevated:"",color:"primary",icon:"add_circle",size:"24px"},on:{click:function(e){t.showQuickStart=!0}}},[s("q-tooltip",[t._v(t._s(t.$t("quick_start_desc")))])],1)],1)]),t._l(t.filteredChannels,(function(e){return s("ChannelCard",{key:e.id,attrs:{title:e.title,description:e.description,image:e.image,id:e.id,soul:e.soul,hidden:e.hidden,followers:t.lib.channelFollowerCount[e.id],editable:!0,hideFollow:""},on:{edit:t.edit,detail:t.showChannelDetail,preview:t.showPreview,"remove-channel":t.removeChannel}})})),s("i"),s("i"),s("i"),s("i"),s("i"),s("i"),s("i"),s("i"),s("ChannelEdit",{attrs:{title:t.modeTitle,show:t.showEdit,channel:t.edittingChannel,rules:{validateChannelTitle:t.validateChannelTitle,validateChannelDesc:t.validateChannelDesc,validateChannelImage:t.validateChannelImage}},on:{close:function(e){t.showEdit=!1},submit:t.submit}}),s("PostEdit",{attrs:{title:t.postModeTitle,show:t.showPostEdit,post:t.edittingPost,rules:{validatePostTitle:t.validatePostTitle,validatePostDesc:t.validatePostDesc,validatePostImage:t.validatePostImage,validatePostUrl:t.validatePostUrl}},on:{close:function(e){t.showPostEdit=!1},submit:t.submitPost}}),s("QuickStart",{attrs:{show:t.showQuickStart},on:{input:function(e){return t.showQuickStart=e}}})],2),s("BackToTop",{attrs:{show:t.showBackToTop},on:{click:t.scrollTop}}),s("q-dialog",{attrs:{"full-width":""},model:{value:t.showPostList,callback:function(e){t.showPostList=e},expression:"showPostList"}},[s("PostList",{attrs:{channel:t.listChannel,rules:{validatePostTitle:t.validatePostTitle,validatePostDesc:t.validatePostDesc,validatePostImage:t.validatePostImage,validatePostUrl:t.validatePostUrl},editable:!0},on:{edit:t.showPostEditor,add:t.showPostAdd,"remove-post":t.removePost}})],1)],1)},a=[],l=(s("e01a"),s("4aad")),o=s("5ea8"),n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("q-dialog",{attrs:{value:t.show},on:{input:t.close}},[t.channel?s("q-card",[s("q-card-section",{staticClass:"q-py-md"},[s("div",{staticClass:"text-h6 text-weight-bold q-my-md"},[t._v(t._s(t.title))])]),s("q-card-section",{staticClass:"q-pt-none column",staticStyle:{width:"560px","max-width":"100%"}},[s("q-input",{attrs:{outlined:"",dense:"","stack-label":"",label:t.$t("channel_title"),rules:[t.rules.validateChannelTitle],placeholder:t.$t("placeholder_channel_title"),debounce:500},nativeOn:{paste:function(t){t.stopPropagation()}},model:{value:t.channelTitle,callback:function(e){t.channelTitle=e},expression:"channelTitle"}}),s("q-input",{staticClass:"q-mt-sm",attrs:{outlined:"",dense:"","stack-label":"",label:t.$t("description"),rules:[t.rules.validateChannelDesc],placeholder:t.$t("placeholder_channel_desc"),debounce:500},nativeOn:{paste:function(t){t.stopPropagation()}},model:{value:t.description,callback:function(e){t.description=e},expression:"description"}}),s("ImageWithPreview",{staticClass:"q-mt-sm",attrs:{label:t.$t("poster"),rules:[t.rules.validateChannelImage]},on:{state:t.updateImageState},model:{value:t.image,callback:function(e){t.image=e},expression:"image"}}),s("q-toggle",{staticStyle:{"margin-top":"-8px"},attrs:{color:"green"},model:{value:t.hidden,callback:function(e){t.hidden=e},expression:"hidden"}},[s("span",[t._v(t._s(t.$t("set_as_private")))]),s("q-tooltip",[t._v(t._s(t.$t("hide_in_explore")))])],1)],1),s("q-card-actions",{staticClass:"q-pb-md q-px-md q-pt-none",attrs:{align:"right"}},[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],staticClass:"q-px-md",attrs:{unelevated:"",color:"general","text-color":"general",label:t.$t("cancel")}}),s("q-btn",{staticClass:"q-px-md",attrs:{unelevated:"",color:"primary","text-color":"primary",label:t.$t("lib_submit")},on:{click:t.submit}})],1)],1):t._e()],1)},r=[],c=s("c65d"),d={name:"ChannelEdit",components:{ImageWithPreview:c["a"]},props:{show:Boolean,channel:Object,title:String,rules:{validateChannelTitle:Function,validateChannelDesc:Function,validateChannelImage:Function}},data(){const t=[{label:this.$t("channel_title"),key:"title",rules:[this.rules.validateChannelTitle],value:""},{label:this.$t("description"),key:"description",rules:[this.rules.validateChannelDesc],value:""},{label:this.$t("preview")+"(url)",key:"image",rules:[this.rules.validateChannelImage],value:""}];return{inputs:t,channelTitle:"",description:"",image:"",isImageLoaded:!1,hidden:!1}},methods:{close(){this.$emit("close")},updateImageState(t){console.log("img state changed",t),this.isImageLoaded=1===t},submit(){if(this.image&&!this.isImageLoaded)return this.$q.dialog({title:"Invalid image",message:"The image url is not reachable.",ok:"Get it"});this.$emit("submit",{title:this.channelTitle,description:this.description,image:this.image,hidden:this.hidden})}},watch:{show(t){t&&this.channel?(this.channelTitle=this.channel.title,this.description=this.channel.description,this.image=this.channel.image,this.channel.hidden?this.hidden=!0:this.hidden=!1):(this.channelTitle="",this.description="",this.image="",this.hidden=!1)}}},h=d,p=s("2877"),u=s("24e8"),m=s("f09f"),b=s("a370"),g=s("27f9"),v=s("9564"),_=s("05c0"),f=s("4b7e"),C=s("9c40"),$=s("7f67"),w=s("eebe"),x=s.n(w),P=Object(p["a"])(h,n,r,!1,null,"18b2d0c5",null),q=P.exports;x()(P,"components",{QDialog:u["a"],QCard:m["a"],QCardSection:b["a"],QInput:g["a"],QToggle:v["a"],QTooltip:_["a"],QCardActions:f["a"],QBtn:C["a"]}),x()(P,"directives",{ClosePopup:$["a"]});var k=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("q-dialog",{attrs:{value:t.show,persistent:""},on:{input:t.close}},[t.post?s("q-card",[s("q-card-section",{staticClass:"row"},[s("div",{staticClass:"text-h6"},[t._v(t._s(t.title))]),s("div",{staticClass:"full-width title-input-container"},[s("q-input",{staticClass:"full-width",attrs:{"bottom-slots":"","stack-label":"",label:t.$t("post_title"),rules:[t.rules.validatePostTitle],placeholder:t.$t("placeholder_post_title"),debounce:500},nativeOn:{paste:function(t){t.stopPropagation()}},scopedSlots:t._u([{key:"hint",fn:function(){return[s("div",{directives:[{name:"show",rawName:"v-show",value:t.titleFromTask,expression:"titleFromTask"}],staticClass:"full-width"},[s("span",{staticClass:"task-prefix"},[t._v(t._s(t.$t("task_title"))+":")]),s("span",{staticClass:"title-from-task q-ml-xs text-grey"},[t._v(t._s(t.titleFromTask))]),s("span",{staticClass:"cursor-pointer q-ml-sm set-title",on:{click:t.setTitleFromTask}},[t._v(t._s(t.$t("set_title")))])])]},proxy:!0}],null,!1,1210891792),model:{value:t.postTitle,callback:function(e){t.postTitle=e},expression:"postTitle"}})],1),s("q-input",{staticClass:"full-width",attrs:{"stack-label":"",label:t.$t("description"),rules:[t.rules.validatePostDesc],placeholder:t.$t("placeholder_post_desc"),debounce:500},nativeOn:{paste:function(t){t.stopPropagation()}},model:{value:t.description,callback:function(e){t.description=e},expression:"description"}}),s("ImageWithPreview",{attrs:{label:t.$t("poster"),rules:[t.rules.validatePostImage]},on:{state:t.updateImageState},model:{value:t.image,callback:function(e){t.image=e},expression:"image"}}),s("div",{staticClass:"full-width row col-12"},[s("q-input",{staticClass:"col-7 q-pr-md",attrs:{label:"Alphabiz URL",rules:[t.rules.validatePostUrl],debounce:500},on:{input:t.inputUrl},nativeOn:{paste:function(t){t.stopPropagation()}},model:{value:t.abUrl,callback:function(e){t.abUrl=e},expression:"abUrl"}}),s("q-select",{staticClass:"col-5",attrs:{filled:"","bottom-slots":"","menu-anchor":"bottom right","menu-self":"top end","menu-offset":[0,0],"popup-content-style":"height: 320px !important","use-input":"",label:t.$t("select_from_tasks"),options:t.taskOptions},on:{input:t.selectTask,filter:t.filterOptions},nativeOn:{paste:function(t){t.stopPropagation()}},scopedSlots:t._u([{key:"hint",fn:function(){return[s("div",{staticClass:"from-magnet",on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.showMagnetInput=!0}}},[t._v("\n              "+t._s(t.$t("import_from_magnet"))+"\n            ")])]},proxy:!0}],null,!1,1979668889),model:{value:t.abSelect,callback:function(e){t.abSelect=e},expression:"abSelect"}})],1),s("q-select",{staticClass:"q-mt-sm",staticStyle:{width:"100%"},attrs:{filled:"",options:t.rateOptions,label:t.$t("film_rate")},model:{value:t.rate,callback:function(e){t.rate=e},expression:"rate"}}),s("q-markup-table",{staticClass:"q-mt-sm full-width",attrs:{bordered:"",flat:"",dense:"","no-data-label":"I didn't find anything for you"}},[s("thead",[s("tr",[s("th",{attrs:{colspan:"3"}},[s("div",{staticClass:"flex items-center full-width"},[s("div",[t._v(t._s(t.$t("subtitle_list"))+" ("+t._s(t.$t("optional"))+")")]),s("q-btn",{staticClass:"q-ml-sm",attrs:{flat:"",round:"",icon:"help_outline",size:"0.7rem"}},[s("q-tooltip",[t._v("Features under development"),s("br"),t._v(t._s(t.$t("only_opensubtitles")))])],1),s("q-btn",{staticClass:"q-mx-xs",attrs:{flat:"",round:"",icon:"add",size:"0.7rem"},on:{click:function(e){return t.editSubtitle()}}},[s("q-tooltip",[t._v(t._s(t.$t("add_subtitles")))])],1)],1)])]),t.subtitleList.length?s("tr",[s("th",{staticClass:"text-left"},[t._v(t._s(t.$t("language")))]),s("th",{staticClass:"text-left"},[t._v(t._s(t.$t("download_link")))]),s("th",{staticClass:"text-center"},[t._v(t._s(t.$t("operations")))])]):t._e()]),s("tbody",t._l(t.subtitleList,(function(e,i){return s("tr",{key:i},[s("td",{staticClass:"text-left"},[t._v(t._s(e.lang))]),s("td",{staticClass:"text-left"},[t._v(t._s(e.url))]),s("td",{staticClass:"text-center"},[s("q-btn",{attrs:{icon:"edit",round:"",flat:"",size:"0.5rem"},on:{click:function(e){return t.editSubtitle(i)}}},[s("q-tooltip",[t._v(t._s(t.$t("lib_edit")))])],1),s("q-btn",{attrs:{icon:"close",color:"red",round:"",flat:"",size:"0.5rem"},on:{click:function(e){return t.modifySubtitleList(i)}}},[s("q-tooltip",[t._v(t._s(t.$t("delete")))])],1)],1)])})),0)])],1),s("q-card-actions",{attrs:{align:"right"}},[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:t.$t("cancel"),color:"grey"}}),s("q-btn",{attrs:{flat:"",label:t.$t("lib_submit"),color:"primary"},on:{click:t.submit}})],1)],1):t._e(),s("q-dialog",{on:{hide:function(e){t.subtitle={}}},model:{value:t.showSubtitleInput,callback:function(e){t.showSubtitleInput=e},expression:"showSubtitleInput"}},[s("q-card",{staticStyle:{width:"480px"}},[s("q-card-section",{staticClass:"full-width"},[s("div",{staticClass:"text-h6"},[t._v(t._s(t.$t("add_subtitle_url")))]),s("q-select",{staticStyle:{width:"200px"},attrs:{dense:"",outlined:"","emit-value":"",label:t.$t("language"),options:t.languageOptions},model:{value:t.subtitle.lang,callback:function(e){t.$set(t.subtitle,"lang",e)},expression:"subtitle.lang"}}),s("q-input",{attrs:{label:t.$t("download_link"),type:"text",placeholder:"https://..."},model:{value:t.subtitle.url,callback:function(e){t.$set(t.subtitle,"url",e)},expression:"subtitle.url"}})],1),s("q-card-actions",{attrs:{align:"right"}},[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",icon:"close",color:"primary"}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",icon:"done"},on:{click:function(e){return t.modifySubtitleList(t.subtitle.index,t.subtitle)}}})],1)],1)],1),s("q-dialog",{on:{hide:function(e){t.magnetInput=""}},model:{value:t.showMagnetInput,callback:function(e){t.showMagnetInput=e},expression:"showMagnetInput"}},[s("q-card",{staticStyle:{width:"480px"}},[s("q-card-section",{staticClass:"full-width"},[s("div",{staticClass:"text-h6"},[t._v(t._s(t.$t("input_magnet_url")))]),s("q-input",{attrs:{type:"text",placeholder:"magnet:?..."},nativeOn:{paste:function(t){t.stopPropagation()}},model:{value:t.magnetInput,callback:function(e){t.magnetInput=e},expression:"magnetInput"}})],1),s("q-card-actions",{attrs:{align:"right"}},[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",icon:"close",color:"primary"}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",icon:"done"},on:{click:t.fromMagnet}})],1)],1)],1)],1)},y=[],I=(s("e9c4"),s("498a"),s("0613")),T=s("20fc"),S=s("6ea7"),U={name:"PostEdit",components:{ImageWithPreview:c["a"]},props:{show:Boolean,post:Object,title:String,rules:{validatePostTitle:Function,validatePostDesc:Function,validatePostImage:Function,validatePostUrl:Function}},data(){const t=[{label:this.$t("rate_g"),value:"G"},{label:this.$t("rate_pg"),value:"PG"},{label:this.$t("rate_pg_13"),value:"PG-13"},{label:this.$t("rate_r"),value:"R"},{label:this.$t("rate_nc_17"),value:"NC-17"}];return{postTitle:"",titleFromTask:"",description:"",image:"",isImageLoaded:!1,abUrl:"",abSelect:null,rateOptions:t,magnetInput:"",showMagnetInput:!1,rate:{label:this.$t("film_rate"),value:""},showSubtitleInput:!1,subtitle:{},languageOptions:Object(S["b"])(),subtitleList:[],taskOptions:[]}},computed:{uploadingTasks(){return I["a"].getters.uploading.map((t=>{var e;const s=t.title.length>28?t.title.substring(0,24)+"...":t.title;return{label:s,title:t.title,value:(null===(e=t.abUrl.split("&"))||void 0===e?void 0:e[0])||t.abUrl}}))}},methods:{filterOptions(t,e){const s=t.toLowerCase();e((()=>{this.taskOptions=this.uploadingTasks.filter((t=>t.label.toLowerCase().includes(s)))}))},close(){this.$emit("close")},setTitleFromTask(){this.postTitle=this.titleFromTask,this.titleFromTask=""},inputUrl(t){this.abSelect&&t!==this.abSelect.value&&(this.abSelect=null,this.titleFromTask="")},selectTask(t){this.abUrl=t.value,this.postTitle?this.titleFromTask=t.title:this.postTitle=t.title},updateImageState(t){console.log("img state changed",t),this.isImageLoaded=1===t},async fromMagnet(){if("string"!==typeof this.magnetInput||!this.magnetInput)return;if(!this.magnetInput.startsWith("magnet"))return this.$q.dialog({title:this.$t("invalid_download_url"),ok:this.$t("ok")});let t=this.magnetInput;if(!t.includes("dn=")){if(!this.postTitle)return this.$q.dialog({message:this.$t("magnet_does_not_have_name"),ok:this.$t("ok")});t+=`&dn=${encodeURIComponent(this.postTitle)}`}const e=await Object(T["a"])(t);if(!e)return this.$q.dialog({title:this.$t("invalid_download_url"),ok:this.$t("ok")});this.abUrl=e},editSubtitle(t){if("number"===typeof t)this.subtitle=JSON.parse(JSON.stringify(this.subtitleList[t])),this.subtitle.index=t;else{if(this.subtitleList.length>=5)return this.$q.notify(this.$t("maximumSubtitleNum_limit"));this.subtitle={index:this.subtitleList.length}}this.showSubtitleInput=!0},modifySubtitleList(t,e){if(console.log("modifySubtitleList",t),e&&"number"===typeof e.index){if(!e.lang||!e.url||""===e.lang||!/https:\/\/www\.opensubtitles\.org.*\/subtitleserve\/sub\/\d+$/gm.test(e.url)&&!/^\d+$/.test(e.url))return this.$q.dialog({title:this.$t("cannot_add_subtitle"),message:this.$t("cannot_add_subtitle_msg")+"."+this.$t("only_opensubtitles"),ok:this.$t("ok")});this.subtitleList[t]=e}else this.subtitleList.splice(t,1)},submit(){if(this.image&&!this.isImageLoaded)return this.$q.dialog({title:"Invalid image",message:"The image url is not reachable.",ok:"Get it"});this.$emit("submit",{title:this.postTitle.trim(),description:this.description.trim(),image:this.image.trim(),rate:this.rate.value,abUrl:this.abUrl.trim(),subtitleList:Object(S["d"])(this.subtitleList)})}},watch:{show(t){if(t&&this.post){if(this.postTitle=this.post.title,this.description=this.post.description,this.image=this.post.image,this.abUrl=this.post.abUrl.includes(":")?this.post.abUrl:decodeURIComponent(this.post.abUrl),this.post.rate){const t=this.rateOptions.find((t=>t.value===this.post.rate));t&&(this.rate={...t})}this.subtitleList=Object(S["c"])(this.post.subtitleList)}else this.postTitle="",this.description="",this.image="",this.abUrl="",this.titleFromTask="",this.abSelect=null,this.rate={label:this.$t("film_rate"),value:""},this.subtitleList=[]}}},Q=U,L=(s("5ef25"),s("ddd8")),F=s("2bb1"),O=s("b498"),D=Object(p["a"])(Q,k,y,!1,null,"4c176204",null),E=D.exports;x()(D,"components",{QDialog:u["a"],QCard:m["a"],QCardSection:b["a"],QInput:g["a"],QSelect:L["a"],QMarkupTable:F["a"],QBtn:C["a"],QTooltip:_["a"],QCardActions:f["a"],QColor:O["a"]}),x()(D,"directives",{ClosePopup:$["a"]});var j=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("q-card",{staticClass:"post-list-card relative-position"},[s("q-card-section",{staticClass:"q-pb-sm flex items-center bg-page",style:{position:"sticky",zIndex:1,top:0}},[s("div",{staticClass:"text-h6 text-bold"},[t._v(t._s(t.channel.title))]),s("q-space"),t.editable?s("q-btn",{staticClass:"q-mx-xs",attrs:{"fab-mini":"",flat:"",icon:"add"},on:{click:t.add}},[s("q-tooltip",[t._v(t._s(t.$t("add_post")))])],1):t._e(),t.editable?s("q-btn",{staticClass:"q-mx-xs",attrs:{"fab-mini":"",flat:"",icon:"file_open"},on:{click:function(e){t.showImport=!0}}},[s("q-tooltip",[t._v(t._s(t.$t("import_data_from_excel")))])],1):t._e(),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],staticClass:"q-ml-xs",attrs:{"fab-mini":"",flat:"",icon:"close"}})],1),s("q-card-section",{staticClass:"q-pt-sm q-pb-none"},[s("div",{staticClass:"description"},[t._v(t._s(t.channel.description))])]),s("q-card-section",[s("q-markup-table",{attrs:{bordered:"",flat:""}},[s("thead",[s("tr",[s("th",{staticClass:"text-left"},[t._v(t._s(t.$t("poster")))]),s("th",{staticClass:"text-left"},[t._v(t._s(t.$t("title")))]),s("th",{staticClass:"text-left"},[t._v(t._s(t.$t("description")))]),s("th",{staticClass:"text-center"},[t._v(t._s(t.$t("film_rate")))]),s("th",{staticClass:"text-center"},[t._v(t._s(t.$t("created_time")))]),s("th",{staticClass:"text-center"},[t._v(t._s(t.$t("operations")))])])]),s("tbody",{staticClass:"post-table"},t._l(t.sortedPosts,(function(e,i){return s("tr",{key:i},[s("td",{staticClass:"text-left"},[s("img",{attrs:{src:e.image,loading:"lazy",width:"64px"}})]),s("td",{staticClass:"text-left post-title"},[t._v(t._s(e.title))]),s("td",{staticClass:"text-left post-desc"},[t._v(t._s(e.description))]),s("td",{staticClass:"text-center"},[t._v(t._s(e.rate))]),s("td",{staticClass:"text-center"},[t._v(t._s(t.stampToString(e.timestamp)))]),s("td",{staticClass:"text-center"},[t.editable?s("q-btn",{attrs:{icon:"edit",round:"",flat:""},on:{click:function(s){return t.edit(e)}}},[s("q-tooltip",[t._v(t._s(t.$t("lib_edit")))])],1):t._e(),t.editable?s("q-btn",{attrs:{icon:"close",color:"red",round:"",flat:""},on:{click:function(s){return t.deletePost(e)}}},[s("q-tooltip",[t._v(t._s(t.$t("delete")))])],1):t._e()],1)])})),0)])],1),s("q-dialog",{attrs:{"content-class":"excel-dialog"},on:{input:t.importDialogChange},model:{value:t.showImport,callback:function(e){t.showImport=e},expression:"showImport"}},[t.excelFile?s("Excel",{attrs:{file:t.excelFile,channelId:t.channel.id,channelPosts:t.posts,propKeys:t.excelProps,rules:t.rules}}):s("q-card",{staticClass:"import-entry"},[s("q-card-section",{staticClass:"row items-center excel-import-dialog"},[s("div",{staticClass:"text-h6 col-12"},[t._v(t._s(t.$t("import_data_from_excel")))]),s("div",{staticClass:"prop-settings col-12"},[s("div",{staticClass:"text-h6"},[t._v("Set excel keys")]),t._l(t.excelProps,(function(e,i){return s("q-input",{key:i,attrs:{"clear-icon":"q-mx-lg",label:e.label},model:{value:e.tableKey,callback:function(s){t.$set(e,"tableKey",s)},expression:"conf.tableKey"}})}))],2),s("q-file",{staticClass:"col-12",attrs:{label:t.$t("open_file"),accept:".xls,.xlsx"},model:{value:t.excelFile,callback:function(e){t.excelFile=e},expression:"excelFile"}})],1),s("q-card-actions",{attrs:{align:"right"}},[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:t.$t("cancel"),color:"primary"}})],1)],1)],1),s("q-inner-loading",{staticClass:"q-pt-xl",attrs:{showing:t.showLoading,label:t.$t("loading")}},[s("q-spinner-gears",{attrs:{size:"50px",color:"primary"}}),s("div",{staticClass:"text-center"},[t._v(t._s(t.$t("lib_from_network")))])],1)],1)},K=[],M=(s("ddb0"),s("826a")),N=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"library-excel"},[s("q-card",{staticClass:"excel-card"},[s("q-card-section",{staticClass:"excel-main"},[s("div",{staticClass:"text-h6"},[t._v("Excel")]),s("q-markup-table",[s("thead",[s("tr",[s("th",{staticClass:"text-left"},[t._v(t._s(t.$t("title")))]),s("th",{staticClass:"text-left"},[t._v(t._s(t.$t("description")))]),s("th",{staticClass:"text-left"},[t._v("Url")]),s("th",{staticClass:"text-left"},[t._v(t._s(t.$t("poster")))]),s("th",{staticClass:"text-left"},[t._v(t._s(t.$t("film_rate")))]),s("th",{staticClass:"operation"})])]),s("tbody",{staticClass:"post-table"},t._l(t.posts,(function(e,i){return s("tr",{key:e.title},[s("td",{staticClass:"text-left post-title",attrs:{title:e.title}},[t._v(t._s(e.title))]),s("td",{staticClass:"text-left post-desc"},[t._v(t._s(e.description))]),s("td",{staticClass:"text-left post-url",attrs:{title:e.abUrl}},[t._v(t._s(e.abUrl))]),s("td",{staticClass:"text-left post-img"},[s("img",{attrs:{src:e.image,width:"24px",loading:"lazy"}})]),s("td",{staticClass:"text-left post-rating"},[t._v(t._s(e.rate))]),s("td",{staticClass:"text-left post-options"},[s("q-btn",{attrs:{dense:"",flat:"",icon:"close",color:"red"},on:{click:function(e){return t.removePost(i)}}},[s("q-tooltip",[t._v(t._s(t.$t("remove")))])],1)],1)])})),0)])],1),s("q-card-actions",{staticClass:"excel-actions q-pb-xs",attrs:{align:"right"}},[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",dense:"",label:t.$t("cancel")}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",dense:"",color:"primary",label:t.$t("lib_submit")},on:{click:t.submit}})],1)],1)],1)},A=[],B=s("25ca"),z={name:"LibraryExcel",props:{file:{type:File,default:()=>null},channelId:{type:String,default:""},channelPosts:{type:Array,default:()=>[]},rules:{validatePostTitle:Function,validatePostDesc:Function,validatePostImage:Function,validatePostUrl:Function},propKeys:{type:Array,default:()=>[{key:"title",label:(void 0).$t("title"),tableKey:"IMDb Rating"},{key:"abUrl",label:"Alphabiz URL",tableKey:"AB-S"},{key:"description",label:(void 0).$t("description"),tableKey:"描述"},{key:"image",label:(void 0).$t("poster"),tableKey:"海报"},{key:"rate",label:(void 0).$t("film_rate"),tableKey:"分级"}]}},data(){return{posts:[]}},methods:{removePost(t){this.posts.splice(t,1)},readFile(t){return new Promise(((e,s)=>{const i=new FileReader;i.onload=t=>{const i=t.target.result;try{const t=B["read"](i);e(t)}catch(t){s(t)}},i.onerror=t=>s(t),i.readAsArrayBuffer(t)}))},async parseXlsx(){console.log("parse xlsx",this.file,B);const t=await this.readFile(this.file);console.log(t),this.posts=[];let e=0,s=0,i=0;this.$q.loading.show();for(const a in t.Sheets){const l=t.Sheets[a],o=B["utils"].sheet_to_json(l);console.log(o),await o.reduce((async(t,a,l)=>{await t;const o={};for(const s of this.propKeys){if(!a[s.tableKey]||!a[s.tableKey].length)return l||console.log("failed",s,s.tableKey,a[s.tableKey]),e++;o[s.key]=a[s.tableKey]}if(this.channelPosts.some((t=>t.title===o.title||t.abUrl===o.abUrl)))return s++;if(o.abUrl&&o.abUrl.startsWith("magnet"))try{o.abUrl=await Object(T["a"])(o.abUrl)}catch(n){console.log("cannot convert abUrl",o.abUrl,n)}if(o.description=o.description.substring(0,299),[this.rules.validatePostTitle(o.title),this.rules.validatePostDesc(o.description),this.rules.validatePostImage(o.image),this.rules.validatePostUrl(o.abUrl)].some((t=>"string"===typeof t)))return console.log("validate error",[o.title,this.rules.validatePostTitle(o.title),o.description,this.rules.validatePostDesc(o.description),o.image,this.rules.validatePostImage(o.image),o.abUrl,this.rules.validatePostUrl(o.abUrl)]),i++;this.posts.push(o)}))}this.$q.loading.hide(),this.$q.dialog({title:this.$t("excel_import_succeded"),message:this.$t("excel_import_success_msg",[this.posts.length,e,s,i])})},submit(){return console.log(this.channelId,l["a"],this.posts),this.channelId?this.posts.length?void l["a"].addPosts(this.posts,this.channelId).then(((...t)=>{console.log("add posts",...t)})):this.$q.notify(this.$t("cannot_find_posts")):this.$q.notify(this.$t("cannot_find_channel"))}},watch:{file(t){console.log("file:",t)}},mounted(){console.log("excel mounted"),this.parseXlsx()},activated(){console.log("excel activated")}},W=z,R=(s("0605"),Object(p["a"])(W,N,A,!1,null,"375c8e81",null)),G=R.exports;x()(R,"components",{QCard:m["a"],QCardSection:b["a"],QMarkupTable:F["a"],QBtn:C["a"],QTooltip:_["a"],QCardActions:f["a"]}),x()(R,"directives",{ClosePopup:$["a"]});const J=t=>("00"+t).slice(-2);var X={props:{channel:Object,editable:Boolean,rules:{validatePostTitle:Function,validatePostDesc:Function,validatePostImage:Function,validatePostUrl:Function}},components:{Excel:G},data(){return{showLoading:!1,showImport:!1,excelFile:null,posts:[],excelProps:[{key:"title",label:this.$t("title"),tableKey:"IMDb Rating"},{key:"abUrl",label:"Alphabiz URL",tableKey:"AB-S"},{key:"description",label:this.$t("description"),tableKey:"描述"},{key:"image",label:this.$t("poster"),tableKey:"海报"},{key:"rate",label:this.$t("film_rate"),tableKey:"分级"}]}},inject:["rootApp"],computed:{sortedPosts(){return[...this.posts].sort(((t,e)=>e.timestamp-t.timestamp))}},methods:{loadPosts(){this.showLoading=!0,console.log("load posts",this.channel.id,this.channel),Object(M["o"])(this.channel.id,!this.editable).then((t=>{this.posts=t,console.log("Got posts",t),this.showLoading=!1}))},edit(t){console.log("edit",t,this.channel),this.$emit("edit",t,this.channel)},add(){this.$emit("add",this.channel)},deletePost(t){this.$emit("remove-post",t.id,this.channel.id)},download(t){this.rootApp.promptDownload(t.abUrl,!0)},stampToString(t){if(isNaN(t))return console.log("stamp is not number",t),"-";const e=new Date(t);return isNaN(e.getFullYear())?(console.log("date is invalid",t,e),"-"):[e.getFullYear(),...[e.getMonth()+1,e.getDate()].map(J)].join("-")+" "+[e.getHours(),e.getMinutes(),e.getSeconds()].map(J).join(":")},importDialogChange(t){t||(this.excelFile=null)}},mounted(){console.log("mounted",this.channel),this.loadPosts()},beforeDestroy(){console.log("destroyed",this.channel),this.channel&&this.channel.id&&Object(M["y"])(this.channel.id)}},Y=X,H=(s("6fc7"),s("2c91")),V=s("7d53"),Z=s("74f7"),tt=s("cf57"),et=Object(p["a"])(Y,j,K,!1,null,"d3d105de",null),st=et.exports;x()(et,"components",{QCard:m["a"],QCardSection:b["a"],QSpace:H["a"],QBtn:C["a"],QTooltip:_["a"],QMarkupTable:F["a"],QDialog:u["a"],QInput:g["a"],QFile:V["a"],QCardActions:f["a"],QInnerLoading:Z["a"],QSpinnerGears:tt["a"],QColor:O["a"]}),x()(et,"directives",{ClosePopup:$["a"]});var it=s("c428"),at=s("0ebe"),lt=s("b4ab"),ot={name:"EditMain",components:{ChannelCard:o["a"],ChannelEdit:q,PostEdit:E,PostList:st,BackToTop:at["a"],QuickStart:lt["a"]},data(){return{current:null,showEdit:!1,edittingChannel:null,mode:"edit",currentId:"",listChannelId:"",edittingPost:null,edittingPostId:"",edittingPostChannelId:"",showPostList:!1,showPostEdit:!1,showBackToTop:!1,showQuickStart:!1,postMode:"edit",lib:l["a"]}},computed:{modeTitle(){return"add"===this.mode?this.$t("add_channel"):this.$t("channel_setting")},postModeTitle(){return"add"===this.postMode?this.$t("add_post"):this.$t("edit_post")},ownedChannels(){return this.lib.ownedChannels.filter((t=>l["a"].channelList.some((e=>e.id===t.id))))},filteredChannels(){const t=l["a"].search.text.toLowerCase(),e=l["a"].search.option.value,s=t=>{switch(e){case"channelID":return t.id;default:return t.title}},i=e=>{var i;return null===(i=s(e))||void 0===i?void 0:i.toLowerCase().includes(t)};return this.ownedChannels.filter(i)},ownedChannelInstances(){return this.lib.ownedChannelInstances},editTitle(){return"edit"===this.mode?this.$t("edit_channel"):this.$t("add_channel")},editPostTitle(){return"edit"===this.postMode?this.$t("edit_post"):this.$t("add_post")},listChannel(){const t=l["a"].ownedChannels.find((t=>t.id===this.listChannelId));return t||{}}},methods:{intersect(t){this.showBackToTop=!t.isIntersecting},scrollTop(){this.$refs.scrollArea.scrollTop=0},edit(t){const e=this.ownedChannels.find((e=>e.id===t));e&&(this.edittingChannel=e,this.currentId=t,this.mode="edit",this.showEdit=!0)},add(){this.edittingChannel={title:"",description:"",image:""},this.mode="add",this.showEdit=!0},validateChannelTitle(t){return t.length>0&&t.length<100||this.$t("validate_channel_title_length")},validateChannelDesc(t){return t.length>9&&t.length<301||this.$t("validate_channel_desc_length")},validateChannelImage(t){return!t||(t.match(/\s/)?this.$t("validate_url_no_space"):(t.startsWith("http://")||t.startsWith("https://"))&&t.length<2048||this.$t("validate_channel_image_url"))},validateChannel(t){return[this.validateChannelTitle(t.title),this.validateChannelDesc(t.description),this.validateChannelImage(t.image)]},editChannel(t){console.log(t,this.currentId);const e=this.validateChannel(t);e.every((t=>!0===t))?(l["a"].editChannel(this.currentId,t).catch((t=>{console.error(t),this.$q.notify("Something went wrong when editing channel")})),this.showEdit=!1):this.$q.dialog({title:this.$t("validate_error"),message:e.filter((t=>!0!==t)).join("; "),ok:"OK"})},addChannel(t){console.log(t);const e=this.validateChannel(t);if(e.every((t=>!0===t))){const e=this.lib.createChannel(t.title,t.description,t.image,t.hidden);console.log(e),this.showEdit=!1,e.then(console.log)}else this.$q.dialog({title:this.$t("validate_error"),message:e.filter((t=>!0!==t)).join("; "),ok:"OK"})},submit(t){return"edit"===this.mode?this.editChannel(t):this.addChannel(t)},showPostEditor(t,e){console.log("show",t,e),this.postMode="edit",this.edittingPostId=t.id,this.edittingPostChannelId=e.id,this.edittingPost={...t},this.showPostEdit=!0},showPostAdd(){this.postMode="add",this.edittingPost={title:"",description:"",image:"",abUrl:""},this.showPostEdit=!0},validatePostTitle(t){return t.length>0&&t.length<100||this.$t("validate_post_title_length")},validatePostDesc(t){return t.length>9&&t.length<301||this.$t("validate_post_desc_length")},validatePostImage(t){return!t||(t.match(/\s/)?this.$t("validate_url_no_space"):(t.startsWith("http://")||t.startsWith("https"))&&t.length<2048||this.$t("validate_post_image_url"))},validatePostUrl(t){if(!t.startsWith("ab://")&&!t.startsWith("alphabiz://"))return this.$t("validate_post_url");const e=Object(it["a"])(t);return 28!==e.length?this.$t("validate_post_url"):t.length<2048||this.$t("validate_post_url_length")},validatePost(t){return t.rate?[this.validatePostTitle(t.title),this.validatePostDesc(t.description),this.validateChannelImage(t.image),this.validatePostUrl(t.abUrl)]:[this.$t("select_a_rate")]},editPost(t){const e=this.validatePost(t);e.every((t=>!0===t))?(console.log("edit",t,this.edittingPostChannelId,this.edittingPostId),l["a"].editPost(this.edittingPostChannelId,this.edittingPostId,t),this.showPostEdit=!1):this.$q.dialog({title:this.$t("validate_error"),message:e.filter((t=>!0!==t)).join("; "),ok:"OK"})},addPost(t){const e=this.validatePost(t);e.every((t=>!0===t))?(console.log("new post to add",t),l["a"].createPost(t,this.edittingPostChannelId),this.showPostEdit=!1):this.$q.dialog({title:this.$t("validate_error"),message:e.filter((t=>!0!==t)).join("; "),ok:"OK"})},submitPost(t){return"edit"===this.postMode?this.editPost(t):this.addPost(t)},removePost(t,e){console.log("remove post",t,e),this.$q.dialog({title:this.$t("remove_post"),message:this.$t("remove_post_confirm"),ok:this.$t("remove"),cancel:this.$t("cancel")}).onOk((()=>{l["a"].removePost(t,e)}))},removeChannel(t){console.log("remove channel by id:",t),this.$q.dialog({title:this.$t("remove_channel"),message:this.$t("remove_channel_confirm"),ok:this.$t("remove"),cancel:this.$t("cancel")}).onOk((()=>{l["a"].removeChannel(t)}))},showChannelDetail(t){this.listChannelId=t,this.edittingPostChannelId=t,this.showPostList=!0},showPreview(t){const e=l["a"].channelList.find((e=>e.id===t));if(!e)return;const s=["id","title","soul"].map((t=>{const s=e[t];return s?encodeURIComponent(t)+"="+encodeURIComponent(s):""})).filter((t=>t)).join("&"),i=`/library/channel?${s}&fromEdit=1&preview=1`;this.$root.$emit("navigate-to",i),this.$router.push(i)},setSearch(){this.lib.setSearchOption([{label:this.$t("title"),value:"channel"},{label:this.$t("channel_id"),value:"channelID"}])}},beforeRouteEnter(t,e,s){s((t=>{e.path.startsWith("/library")&&t.setSearch()}))},mounted(){this.setSearch()},activated(){this.$root.$emit("navigate-to"),this.$root.$emit("navigate-to","/library/edit")}},nt=ot,rt=(s("26db"),s("9748")),ct=Object(p["a"])(nt,i,a,!1,null,"d51cafa4",null);e["default"]=ct.exports;x()(ct,"components",{QBtn:C["a"],QTooltip:_["a"],QDialog:u["a"],QColor:O["a"]}),x()(ct,"directives",{Intersection:rt["a"]})},bce7:function(t,e,s){},f8e6:function(t,e,s){}}]);