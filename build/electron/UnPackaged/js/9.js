(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[9],{"544d":function(t,e,s){"use strict";s("7f35")},"7f35":function(t,e,s){},d37d:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("q-page",{staticStyle:{padding:"0",margin:"0"},attrs:{padding:""}},[s("div",{staticStyle:{padding:"0",margin:"0",height:"calc(100vh - 83px)"},attrs:{id:"player-container",lang:t.lang}},[s("input",{ref:"file",staticStyle:{display:"none"},attrs:{id:"media-file-upload",type:"file","data-cy":"file-input"},on:{input:t.change}}),s("input",{ref:"subtitle",staticStyle:{display:"none"},attrs:{type:"file",accept:".srt,.vtt"},on:{input:t.manualAddSubtitle}}),s("div",{staticStyle:{height:"100%"},attrs:{id:"video-container"}},[s("div",{staticClass:"container"},[s("video",{ref:"video",staticClass:"video-js vjs-default-skin vjs-16-9 vjs-big-play-centered vjs-fluid",staticStyle:{height:"100%"},attrs:{crossorigin:"anonymous",id:"my-video"}})]),s("div",{directives:[{name:"show",rawName:"v-show",value:t.isAudio,expression:"isAudio"}],staticClass:"audio-info-container"},[s("p",{staticClass:"info"},[t._v("This is an audio file")]),s("img",{attrs:{src:"favicon.ico",alt:"favicon",width:"60px"}})])])]),s("div",{directives:[{name:"show",rawName:"v-show",value:t.showSplash,expression:"showSplash"}],attrs:{id:"video-splash"}},[s("div",{staticClass:"loading"},[s("q-circular-progress",{staticClass:"q-ma-md",attrs:{indeterminate:"",size:"24px",color:"primary"}}),s("p",[t._v(t._s(t.videoLoadingHint))])],1)])])},i=[],r=(s("5319"),s("ddb0"),s("2b3d"),s("9861"),s("f0e2")),n=(s("fda2"),s("4e68"),s("3708")),o=s.n(n),l=(s("7f10"),s("6922")),d=s.n(l);const c=s("9b0f"),u=s("a32b");function h(t){if(console.log(t.path||t),!c.existsSync(t.path||t))return[];const e=u.dirname(t.path),s=u.extname(t.path),a=t.name.substring(0,t.name.lastIndexOf("."));console.log(e,a,s);const i=v(e,a),r=m(e,i),n=b(e,a),o=g(e,n);return[...r,...o]}function p(t){if(!c.existsSync(t))return[];const e=u.dirname(t.path),s=t.name.substring(0,t.name.lastIndexOf(".")),a=y(e,s);return f(e,a)}function y(t,e){let s;try{s=c.readdirSync(t),s=s.filter((t=>t.startsWith(e)&&t.endsWith(".ass")))}catch(a){console.log(a)}return s}function f(t,e){const s=[];try{e.forEach(((e,a,i)=>{i[a]=t+"/"+e;const r=c.readFileSync(i[a],"utf-8"),n=u.extname(e.substring(0,e.lastIndexOf("."))).substring(1);s.push({src:URL.createObjectURL(new Blob([r])),label:n})}))}catch(a){console.log(a)}return console.log(s),s}function g(t,e){const s=[];try{e.forEach(((e,a,i)=>{i[a]=t+"/"+e;const r=c.readFileSync(i[a],"utf-8"),n=u.extname(e.substring(0,e.lastIndexOf("."))).substring(1);s.push({src:URL.createObjectURL(new Blob([S(r)])),label:n})}))}catch(a){console.log(a)}return console.log(s),s}function m(t,e){const s=[];try{e.forEach(((e,a,i)=>{i[a]=t+"/"+e;const r=c.readFileSync(i[a],"utf-8"),n=u.extname(e.substring(0,e.lastIndexOf("."))).substring(1);s.push({src:URL.createObjectURL(new Blob([r])),label:n})}))}catch(a){console.log(a)}return console.log(s),s}function v(t,e){let s;try{s=c.readdirSync(t),s=s.filter((t=>t.startsWith(e)&&t.endsWith(".vtt")))}catch(a){console.log(a)}return s}function b(t,e){let s;try{s=c.readdirSync(t),s=s.filter((t=>t.startsWith(e)&&t.endsWith(".srt")))}catch(a){console.log(a)}return s}function S(t){var e=t.replace(/\r+/g,"");e=e.replace(/^\s+|\s+$/g,"");var s=e.split("\n\n"),a="";if(s.length>0){a+="WEBVTT\n\n";for(var i=0;i<s.length;i+=1)a+=w(s[i])}return a}function w(t){var e="",s=t.split(/\n/);while(s.length>3){for(var a=3;a<s.length;a++)s[2]+="\n"+s[a];s.splice(3,s.length-3)}var i=0;if(!s[0].match(/\d+:\d+:\d+/)&&s[1].match(/\d+:\d+:\d+/)&&(e+=s[0].match(/\w+/)+"\n",i+=1),!s[i].match(/\d+:\d+:\d+/))return"";var r=s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);return r?(e+=r[1]+":"+r[2]+":"+r[3]+"."+r[4]+" --\x3e "+r[5]+":"+r[6]+":"+r[7]+"."+r[8]+"\n",i+=1,s[i]&&(e+=s[i]+"\n\n"),e):""}s("5898");const x=s("ed08").isElectron();function T(t){if(!x||"string"!==typeof t)return t;const e=s("a32b"),a=e.basename(t);return{name:a,path:t}}var P=s("0613");const B=s("ed08").isElectron();let k=null,C=null;B&&(k=s("34bb").remote,C=s("34bb").ipcRenderer),window.videojs=r["default"],window.libjass=o.a,s("d80d"),s("01a0"),s("8d5e"),function(){const t=r["default"].getComponent("Button");r["default"].registerComponent("FileButton",r["default"].extend(t,{constructor:function(){t.apply(this,arguments);const e=arguments[1];this._text=e.text||"Open File...",this.el_.innerHTML=`<span class="open" title="${this._text}"></span>`}})),r["default"].registerComponent("SubsButton",r["default"].extend(t,{constructor:function(){t.apply(this,arguments);const e=arguments[1];this._text=e.text||"Add subtitles...",this.el_.innerHTML=`<span class="subs" title="${this._text}"></span>`}}));const e=r["default"].getComponent("MenuItem");r["default"].registerComponent("AddSubButton",r["default"].extend(e,{constructor:function(){e.apply(this,arguments);const t=arguments[1];this._text=t.text||"Add subtitles...",this.el_.innerHTML+=`<span>${this._text}</span>`}}))}();var $={name:"Player",inject:["rootApp","io"],data(){return{sb:[],player:null,pipStatus:!1,subsBtn:null,progressInterval:null,progress:0,videoLoadingHint:"",showSplash:!1,isAudio:!1}},computed:{lang(){const t=P["a"].state.setting.language?P["a"].state.setting.language.value:"en-US";return this.player&&this.player.language(t),t}},methods:{splashShow(){this.showSplash=!0},splashHide(){this.showSplash=!1},openFile(){this.$refs.file.click()},async addSubtitle(t,e){var s;let a=t;if("string"===typeof t){if(t.startsWith("blob:"))return;a=t.startsWith("play://")?T(t.replace("play://","")):T(t)}if(e||(e=(null===(s=a)||void 0===s?void 0:s.name)||""),!B){const t=e.match(/\.[^.]+$/)[0];if(!t)return;if(![".srt",".vtt"].includes(t.toLowerCase()))return;const s=".vtt"===t.toLowerCase();return this.player.ass({subtitles:[]}),new Promise((t=>{const i=new FileReader;i.onload=a=>{const i=s?a.target.result:S(a.target.result);this.player.addRemoteTextTrack({src:URL.createObjectURL(new Blob([i])),kind:"captions",label:e},!0),this.subsBtn.addClass("hidden"),t()},i.readAsText(a)}))}console.log("sub",a,e);let i=!1;await Promise.all(h(a).map((t=>(i=!0,new Promise((s=>{setTimeout((()=>{this.player.addRemoteTextTrack({kind:"captions",label:t.label||e,src:t.src},!0),s()}))})))))),this.player.ass({subtitles:[]}),p(a).forEach((t=>{i=!0,this.player.ass().addSubtitle(t.src,t.label||e)})),i&&this.subsBtn.addClass("hidden");const r=this.player.textTracks();r&&r[0]&&(r[0].mode="showing")},async manualAddSubtitle(t){const e=t.target.files;if(!e.length)return;const s=e[0];await this.addSubtitle(s,s.name);let a=-1;const i=this.player.textTracks();setTimeout((()=>{for(let t=0;t<i.length;t++)i[t].label===s.name&&(a=t),i[t].mode="disabled";-1!==a&&(i[a].mode="showing"),this.appendAddSubBtn(),t.target.value=""}),500)},appendAddSubBtn(){if(!B)return;const t=this;setTimeout((()=>{const e=this.player.controlBar.subsCapsButton,s=e.menu.children();if(!s)return;if(s.some((t=>"AddSubButton"===t.name_)))return;const a=e.menu.addChild("AddSubButton",{text:t.$t("add_subtitles")},2);a.addClass("add-sub-btn"),a.on("click",(()=>this.$refs.subtitle.click()))}),1e3)},async updatePlayer(t){if(!t)return;this.player||await this.loadPlayer();let e="string"===typeof t?t:URL.createObjectURL(t);console.log(t,e),P["a"].dispatch("currentVideoUrl",e),e.startsWith("play://")&&(e+=`?infoHash=${P["a"].state.video.currentVideo.infoHash}`),console.log("src",this.player),this.player.src([{src:e,type:"video/mp4"}]),B&&this.subsBtn.removeClass("hidden"),this.$refs.subtitle.value="";var s=this.player.remoteTextTracks(),a=s.length;for(let n=a-1;n>=0;n--)this.player.removeRemoteTextTrack(s[n]);if(await this.addSubtitle(t,t.name),!k||!k.splayerx)return this.appendAddSubBtn();const i=k.splayerx,r=t.path;i.getMediaInfo(r,(t=>{const{streams:e}=JSON.parse(t),s=e.filter((t=>"subtitle"===t.codec_type));let a=!1;i.stopExtractSubtitles();const n=(t,e)=>{if(!t[e])return void this.appendAddSubBtn();const{index:s,tags:o}=t[e];if(!o)return n(t,e+1);let l="";const d=c=>{i.extractSubtitles(r,s,c,!0,10,((s,i,r,c)=>{if(r)return console.log(o),n(t,e+1);c&&(l+=c.toString("utf8")),"EOF"===s?(l.length&&(console.log(l),this.player.ass().addSubtitle(URL.createObjectURL(new Blob([l])),o.title)),a||(a=!0,this.subsBtn.addClass("hidden")),n(t,e+1)):d(i)}))};d(0)};n(s,0)}))},change(t){console.log("Open Media File: "+t.target.files[0].name),0!==t.target.files.length&&(this.updatePlayer(t.target.files[0]),setTimeout((()=>{this.player.play(),this.$refs.file.value=null}),500))},loadPlayer(t=!1){let e=()=>{};const s=new Promise((t=>{e=t}));if(r["default"].getPlayer("my-video")&&!t)return void(this.player=r["default"].getPlayer("my-video"));if(t){Object(r["default"])("my-video")&&Object(r["default"])("my-video").dispose();const t=document.querySelector("#video-container .container");t&&(t.innerHTML='<video\n            crossorigin="anonymous"\n            id="my-video"\n            class="video-js vjs-default-skin vjs-16-9 vjs-big-play-centered vjs-fluid"\n            ref="video"\n            style="height:100%"\n          ></video>')}if(this.player=Object(r["default"])("my-video",{plugins:{hotkeys:d.a},autoplay:!0,preload:"auto",controls:!0,controlBar:{volumePanel:{inline:!1},subtitlesButton:!1}},(()=>{e()})),this.player.on("change",(()=>{console.log("changed")})),this.player.on("ready",(()=>{const t=P["a"].state.video.currentVideo.remotePlay;t&&B?(this.splashShow(),this.videoLoadingHint=this.$t("waiting_for_torrent"),C.send("get-stream-address"),C.once("stream-address",((t,e)=>{this.splashHide(),this.videoLoadingHint="";const{address:s}=e;console.log("Stream play",e,s),P["a"].dispatch("currentVideoUrl",s);try{this.player.src([{src:s,type:"video/mp4"}]);const t=()=>{console.log("start playing"),this.player.currentTime(P["a"].state.video.currentVideo.currentTime),P["a"].dispatch("resetRemotePlay"),this.player.off("play",t)};this.player.on("play",t),this.player.play()}catch(t){console.log("src err",t),this.player.currentTime(P["a"].state.video.currentVideo.currentTime),P["a"].dispatch("resetRemotePlay")}}))):this.splashHide()})),this.player.on("play",(()=>{this.splashHide(),P["a"].dispatch("updateVideoStatus",!0)})),this.player.on("pause",(()=>{P["a"].dispatch("updateVideoStatus",!1)})),this.player.on("leavepictureinpicture",(()=>{P["a"].dispatch("updateVideoPIPStatus",!1),this.pipStatus=!1,this.$router.push("/player"),setTimeout((()=>this.player.play()),500)})),this.player.on("enterpictureinpicture",(()=>{P["a"].dispatch("updateVideoPIPStatus",!0),this.pipStatus=!0,setTimeout((()=>this.player.play()),500)})),this.player.on("error",(()=>{this.splashHide();const t=this.player.languages()[this.player.language()],e=t&&t[this.player.error_.message]||this.player.error_.message;this.$q.notify(e),P["a"].dispatch("currentVideoUrl",null),this.loadPlayer(!0)})),this.player.textTracks().on("change",(()=>{const t=this.player.textTracks();let e=!1;setTimeout((()=>{for(const s in t)if(t[s]&&"showing"===t[s].mode){e=!0;break}e||(this.player.ass().current_track=void 0)}),200)})),P["a"].state.video.currentVideo.url&&!P["a"].state.video.currentVideo.remotePlay){let t=P["a"].state.video.currentVideo.url;t.startsWith("play://")&&(t+=`?infoHash=${P["a"].state.video.currentVideo.infoHash}`),this.player.src([{src:t,type:"video/mp4"}]),this.splashHide(),this.player.currentTime(P["a"].state.video.currentVideo.currentTime)}this.fileList||this.player.bigPlayButton.on("click",this.openFile);const a=this.player.controlBar.addChild("FileButton",{text:this.$t("open_file")},1);return a.on("click",this.openFile),this.subsBtn=this.player.controlBar.addChild("SubsButton",{text:this.$t("add_subtitles")},14),this.subsBtn.on("click",(()=>this.$refs.subtitle.click())),P["a"].dispatch("updateVideoPIPStatus",!1),s},updateProgress(t){if(t){let e=document.querySelector("#download-progress");if(!e){const t=document.querySelector(".vjs-progress-holder");if(!t)return;e=t.appendChild(document.createElement("div")),e.id="download-progress"}e.style.background=t.reduce(((t,e)=>t+`, ${e.color} 0%, ${e.color} ${e.length}, ${e.color} 0%`),"linear-gradient(90deg")+", transparent 0%)"}}},updated(){this.loadPlayer()},activated(){P["a"].state.video.currentVideo.remotePlay?this.loadPlayer(!0):(P["a"].state.video.currentVideo.shouldReset&&(P["a"].state.video.currentVideo.shouldReset=!1,this.loadPlayer(!0)),this.loadPlayer()),this.io.on("server_progress",(t=>{if("/player"!==this.$router.currentRoute.path)return;const e=t.find((t=>{var e;return null===(e=P["a"].state.video.currentVideo)||void 0===e?void 0:e.url.includes(t.name)}));if(e&&e.progress){const t=[],s=e.progress.length;let a=e.progress[0],i=1;for(let r=1;r<s;r++)if(e.progress[r]===a&&r<s-1)i+=1;else{if(e.progress[r+1]===a){i+=1;continue}r===s-1&&(i+=1),i&&t.push({color:1===a?"gold":"transparent",length:i/s*100+"%"}),a=e.progress[r],i=1}this.updateProgress(t)}}))},mounted(){this.loadPlayer(!0)},watch:{"$store.state.video.currentVideo.url"(t,e){t&&t!==e&&this.updatePlayer(t)}},beforeDestroy(){P["a"].dispatch("currentVideoCurrentTime",this.player.currentTime()),this&&this.player&&this.player.dispose(),clearInterval(this.progressInterval)},created(){window.addEventListener("error",(t=>{console.log("Uncaught global error",t.message,"\nThis has no effect to app and can be ignore"),this.splashHide()}))}},_=$,j=(s("544d"),s("2877")),L=s("9989"),V=s("58ea"),R=s("eebe"),H=s.n(R),O=Object(j["a"])(_,a,i,!1,null,null,null);e["default"]=O.exports;H()(O,"components",{QPage:L["a"],QCircularProgress:V["a"]})}}]);