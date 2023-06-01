(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[21],{aa3b:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-page",{staticClass:"bg-black overflow-hidden",staticStyle:{height:"calc(100vh - 50px - var(--appbar-height, 0px))!important",padding:"1px"}},[a("VideoJsPlayer",{ref:"videoJsPlayer",staticClass:"full-width full-height"})],1)},r=[],i=(a("ddb0"),a("2b3d"),a("9861"),a("5319"),a("77d8")),n=a("41ed"),l=a("0613"),o=(a("d9e2"),a("acf9")),c=a.n(o),u=a("1c37"),d=a.n(u);const h=a("9b0f"),p=a("a32b");var y=f;async function f(e){const t=p.dirname(e),a=p.extname(e);let s=p.basename(e);if(s=s.slice(0,s.length-a.length),console.tag("Player","getSubtitleFromFilename").log({dirname:t,basename:s,ext:a}),!h.existsSync(t))throw new Error("dirname not found: "+t);const r=[m(),v()];let i=[];try{const e=h.readdirSync(t);i=await Promise.all(e.map((async e=>{if(!e.startsWith(s))return;const a=r.find((t=>e.endsWith(`.${t.type}`)));if(!a)return;const i=p.join(t,e),n=await h.promises.readFile(i),l=a.convert(n);return console.log("sub","converted",!!l),l?{src:URL.createObjectURL(new Blob([l])),id:e}:void 0}))).then((e=>e.filter((e=>!!e))))}catch(n){console.log(n)}return i}function m(){return{type:"srt",convert(t){const a=c.a.decode(t,d.a.detect(t)).replace(/^{[\\0-9A-Za-z&]*}/gm,"");return e(a)}};function e(e){var a=e.replace(/\r+/g,"");a=a.replace(/^\s+|\s+$/g,"");var s=a.split("\n\n"),r="";if(s.length>0){r+="WEBVTT\n\n";for(var i=0;i<s.length;i+=1)r+=t(s[i])}return r}function t(e){var t="",a=e.split(/\n/);while(a.length>3){for(var s=3;s<a.length;s++)a[2]+="\n"+a[s];a.splice(3,a.length-3)}var r=0;if(!a[0].match(/\d+:\d+:\d+/)&&a[1].match(/\d+:\d+:\d+/)&&(t+=a[0].match(/\w+/)+"\n",r+=1),!a[r].match(/\d+:\d+:\d+/))return"";var i=a[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);return i?(t+=i[1]+":"+i[2]+":"+i[3]+"."+i[4]+" --\x3e "+i[5]+":"+i[6]+":"+i[7]+"."+i[8]+"\n",r+=1,a[r]&&(t+=a[r]+"\n\n"),t):""}}function v(){return{type:"vtt",convert(e){const t=c.a.decode(e,d.a.detect(e)).replace(/^{[\\0-9A-Za-z&]*}/gm,"");return t}}}const g=a("ed08").isElectron();var P={name:"Player",mixins:[w(),b(),S(),$(),R(),x()],activated(){console.tag("Player","$route.params").log(this.$route.params)}};function w(){return{data(){return{player:null}},mounted(){this.player=this.$refs.videoJsPlayer.player},methods:{async setSource(t){console.tag("Player","setSource").log(t),await this.player.promiseReady,await this.player.setSource(t),await e.call(this,t)},play(){this.player.play()},async stop(){this.player.states.isPiP&&this.player.setPiP(!1),this.player.states.isFullscreen&&this.player.setFullscreen(!1),await this.player.stop()},pause(e){e&&(this.player.states.isPiP&&this.player.setPiP(!1),this.player.states.isFullscreen&&this.player.setFullscreen(!1)),this.player.states.isPaused||this.player.pause()},setPiP(e){this.player.setPiP(e)},seek(e){this.player.seek(e)},getCurrentSourceData(){var e,t,a,s;const r=null!==(e=null===(t=this.player)||void 0===t||null===(a=t.states.currentSources)||void 0===a||null===(s=a[0])||void 0===s?void 0:s.src)&&void 0!==e?e:null,i=e=>Array.from(new URL(e).searchParams.entries()).reduce(((e,[t,a])=>({...e,[t]:a})),{});if(!r)return null;const n=this.player.states.currentSources[0];return{url:r,params:i(r),infoHash:n.infoHash}}}};async function e(e){if(g&&e.filename){const t=await y(e.filename);if(console.tag("Player","getSubtitlesFromFilename").log(t),!t)return;t.forEach(((e,t)=>{this.player.addTrack(e),0===t&&this.player.enableTrack(e.id)}))}}}function b(){return{async activated(){var a,s;if("play_source"!==(null===(a=this.$route.params)||void 0===a||null===(s=a.action)||void 0===s?void 0:s.type))return;const r=this.$route.params.action.source;console.tag("Player","mixinSourcePlay").log("src",r.src),r.filename=e(r),r.type=t(r),console.tag("Player","mixinSourcePlay").log("filename",r.filename),console.tag("Player","mixinSourcePlay").log("type",r.type),await this.setSource(r),this.play()}};function e(e){let t;return t=e.src.startsWith("play://")?decodeURI(new URL(e.src).pathname).slice(3):decodeURI(e.src),t}function t(e){return"video/mp4"}}function S(){return{async activated(){var e,t;if("play_file"!==(null===(e=this.$route.params)||void 0===e||null===(t=e.action)||void 0===t?void 0:t.type))return;const a=this.$route.params.action.file;console.tag("Player","mixinFilePlay").log("file",a),await this.setSource({src:URL.createObjectURL(a),type:a.type,file:a}),this.play()}}}function $(){return g||Object(i["a"])()?{async activated(){var t,a;if("play_remote"===(null===(t=this.$route.params)||void 0===t||null===(a=t.action)||void 0===a?void 0:a.type)&&(console.tag("Player","mixinRemotePlay").log("remotePlay",l["a"].state.video.currentVideo.remotePlay),l["a"].state.video.currentVideo.remotePlay)){await l["a"].dispatch("resetRemotePlay");const t=await e.call(this);t&&this.play()}}}:{};async function e(){const e=l["a"].state.video.currentVideo.infoHash,a=this.getCurrentSourceData();if(a&&a.infoHash===e)return;await this.stop();const s=await i.call(this);if(!s)return;const r=o(s,{infoHash:e});try{return await this.setSource(r),r.src.startsWith("http://")&&await t.call(this,r),!0}catch(c){console.tag("Player","error").error(c)}async function i(){const e=e=>new Promise((t=>setTimeout((()=>t(null)),e))),t=await Promise.race([e(1e4),new Promise((e=>{n["ipcRenderer"].once("stream-address",((t,a)=>e(a))),n["ipcRenderer"].send("get-stream-address")}))]);var a;t?(null!==(a=t.filepath)&&void 0!==a||(t.filepath="win32"===process.platform?decodeURI(t.address).replace("play:///","").replace(/\//g,"\\"):decodeURI(t.address).replace("play://","")),console.tag("Player","streamAddress").log(t)):console.tag("Player","streamAddress").tag.red("timeout").log();return t}function o(e,{infoHash:t}){let a=e.address,s=e.filepath;return a.startsWith("play://")&&(a+=`?infoHash=${t}`,s||(s=decodeURI(new URL(a).pathname).slice(3))),"win32"===process.platform&&(s=s.replace(/\//g,"\\")),{src:a,type:null,filename:s,infoHash:t}}}async function t(e){const{src:t}=e;if(!/wait=0$/gm.test(t))return;const a=l["a"].state.setting.videoCacheTime;if(0===a)return;const s=60*a/this.player.states.duration,r=t.replace(/wait=.*/gm,`wait=${s}`),i=this.player.states.currentTime,n=e=>this.player.setSource(e);await n(Object.assign(e,{src:r})),this.seek(i)}}function R(){return{beforeRouteLeave(t,a,s){e.call(this),s()},beforeRouteEnter(e,a,s){s((e=>t.call(e)))},mounted(){const e=()=>"Player"===this.$route.name;this.$watch((()=>{var e;return null===(e=this.player)||void 0===e?void 0:e.states.isPiP}),(t=>{t||this.player.states.isPaused||e()||this.$router.push({name:"Player"})}))}};function e(){var e,t;this.player&&0!==(null!==(e=null===(t=this.player.states.currentSources)||void 0===t?void 0:t.length)&&void 0!==e?e:0)&&(this.player.states.isPaused||this.player.states.isPiP||"object"!==typeof this.player.states.loadingState&&g&&this.setPiP(!0))}function t(){this.player&&this.player.states.isPiP&&this.setPiP(!1)}}function x(){return{inject:["io"],mounted(){this.$amplify.addOnAuthStateChangedListener((async e=>{console.tag("Player","PiP","signedOut").log({authState:e}),"signedOut"===e&&await this.pause(!0)})),(g||Object(i["a"])())&&n["ipcRenderer"].on("pause-player",(()=>this.pause(!0))),this.io.on("server_progress",e.bind(this)),this.io.on("update_subtitleList",t.bind(this)),this.io.on("clear_player",a.bind(this))}};function e(e){var t,a,s,r,i,n;const l=()=>"Player"===this.$route.name;if(!l())return;const o=null!==(t=null===(a=this.player)||void 0===a||null===(s=a.states.currentSources)||void 0===s||null===(r=s[0])||void 0===r?void 0:r.src)&&void 0!==t?t:null;if(!o)return;const c=null!==(i=null===(n=e.find((e=>o.includes(e.name))))||void 0===n?void 0:n.progress)&&void 0!==i?i:null;function u(e){const t=[],a=e.length;let s=e[0],r=1;for(let i=1;i<a;i++)if(e[i]===s&&i<a-1)r+=1;else{if(e[i+1]===s){r+=1;continue}i===a-1&&(r+=1),r&&t.push({color:1===s?"gold":"transparent",length:r/a*100}),s=e[i],r=1}}c&&u(c)}function t(e,t){console.tag("Player","io$update_subtitleList").log({infoHash:e,subtitleList:t})}async function a({status:e,infoHash:t}){var a,s,r,i;const n=null!==(a=null===(s=this.player)||void 0===s||null===(r=s.states.currentSources)||void 0===r||null===(i=r[0])||void 0===i?void 0:i.src)&&void 0!==a?a:null,l=e=>Array.from(new URL(e).searchParams.entries()).reduce(((e,[t,a])=>({...e,[t]:a})),{});if(!n)return;const{infoHash:o}=l(n);async function c(){await this.stop()}o===t&&(/^play:\/\//gm.test(n)&&"paused"===e||(await c.call(this),await new Promise((e=>setTimeout(e,500))),await this.$router.push({name:"Player"}),/^http/gm.test(n)&&this.$q.notify(this.$t("stop_stream_player")),/^play:\/\//gm.test(n)&&this.$q.notify(this.$t("stop_player"))))}}var L=P,U=a("2877"),_=a("9989"),H=a("eebe"),F=a.n(H),j=Object(U["a"])(L,s,r,!1,null,null,null);t["default"]=j.exports;F()(j,"components",{QPage:_["a"]})}}]);