const WebTorrent=require("webtorrent"),wtVersion=require("webtorrent/package.json").version,{ipcRenderer:ipcRenderer}=require("electron"),crypto=require("crypto"),fs=require("fs"),path=require("path"),FSChunkStore=require("fs-chunk-store");import{useAlphabizProtocol,useClientEvents}from"./wt-extention.js";import utils from"./webtorrent-utils.js";let info=()=>{},verbose=()=>{};Object.defineProperty(global,"log",{set(e){info=e?console.log:()=>{},console.log("Toggle log",e)}}),Object.defineProperty(global,"verb",{set(e){verbose=e?console.log:()=>{},console.log("Toggle verb",e)}});const warn=console.error;process.env.NODE_ENV;const infoHashes=[],shouldDelete=[],responseTorrentProps=["infoHash","name","paused","length","downloaded","uploaded","ready","waiting","progress","isSeeding","upload","token","completed","origin","path","pending","file","magnetURI","isAutoUpload","createdTime","completedTime","usedTime"],speeder=new Map;let prevTime=Date.now(),deltaTime=1e3;const torrentToJson=e=>utils.torrentToJson(e,deltaTime,speeder),speedLimit=e=>"number"!==typeof e?-1:e>0?parseInt(e):-1,getPublicPath=e=>{if(!e||0===e.length)return"";let t=path.dirname(e[0]);for(let r=1;r<e.length;r++)while(!e[r].includes(t)&&t.length>1)t=path.dirname(t);return t},locked=new Set;window.WEBTORRENT_ANNOUCEMENT=require("create-torrent").announceList.map((e=>e[0]));const VERSION_STR=wtVersion.replace(/\d*./g,(e=>("0"+e%100).slice(-2))).slice(0,4),peerId=Buffer.from(`-AB${VERSION_STR}-${crypto.randomBytes(9).toString("base64")}`);let client=null;const initClient=(e=0)=>{if(e>10)return;if(client&&client.torrents.length)return info("Client is not idle, keep it alive");const t={peerId:peerId},r=parseInt(localStorage.getItem("dhtPort")),o=parseInt(localStorage.getItem("torrentPort"));isNaN(r)||(t.dhtPort=r),isNaN(o)||(t.torrentPort=o);const n=parseInt(localStorage.getItem("maximumConnectionsNum"));isNaN(n)||(t.maxConns=n);const s=parseInt(localStorage.getItem("downloadSpeed")),i=parseInt(localStorage.getItem("uploadSpeed")),d=Number(localStorage.getItem("payedUserShareRate"));t.blocklist=utils.getLocalIPList()||[],info("init client",t),client=new WebTorrent(t),isNaN(s)||client.throttleDownload(s),isNaN(i)||isNaN(d)||client.throttleUpload(i,d),client.on("error",(t=>{warn(t),r&&o&&(e+=1,info("try use difference port"),localStorage.setItem("dhtPort",r+e),localStorage.setItem("torrentPort",o+e),initClient(e)),ipcRenderer.send("webtorrent-client-error",t.message)})),client.on("warning",(e=>{warn(e),ipcRenderer.send("webtorrent-client-warn",e.message)})),client.on("ready",(()=>{ipcRenderer.send("webtorrent-initted")})),window.client=client,useClientEvents(client)},queueTimeout=(e,t)=>{const r=Date.now(),o=()=>{Date.now()-r>=t?e():requestAnimationFrame(o)};requestAnimationFrame(o)};let shouldSendInfo=!0;const updateTorrent=()=>{if(!shouldSendInfo)return queueTimeout(updateTorrent,1e3),info("skip send");verbose("update torrent");const e=Date.now();deltaTime=(e-prevTime)/1e3,prevTime=e;let t=0,r=0;if(client.torrents.length){const e=client.torrents.filter((e=>!shouldDelete.includes(e.infoHash)&&!(e.isAutoUpload&&!e.ready))).map((e=>{e.done||"number"!==typeof e.usedTime||(e.usedTime+=1e3);const o=torrentToJson(e);if(speeder.has(o.infoHash)&&e.ready){const n=speeder.get(o.infoHash);0===n.downloaded?o.downloadSpeed=0:o.downloadSpeed=Math.floor((e.downloaded-n.downloaded)/deltaTime),0===n.uploaded?o.uploadSpeed=0:o.uploadSpeed=Math.floor((e.uploaded-n.uploaded)/deltaTime),t+=o.downloadSpeed,r+=o.uploadSpeed,speeder.set(o.infoHash,{downloaded:e.downloaded,uploaded:e.uploaded})}else o.downloadSpeed=0,o.uploadSpeed=0,speeder.set(o.infoHash,{downloaded:0,uploaded:0});return o}));ipcRenderer.send("webtorrent-torrents",e)}else client.ready&&ipcRenderer.send("webtorrent-torrents",[]);ipcRenderer.send("webtorrent-client-info",{downloadSpeed:t,uploadSpeed:r,progress:client.progress,taskNum:client.torrents.length}),client.torrents.length>50&&(client.maxConns=Math.min(client.maxConns,10)),client.torrents.length>100?(client.maxConns=Math.min(client.maxConns,5),queueTimeout(updateTorrent,2e3)):queueTimeout(updateTorrent,1e3)};queueTimeout(updateTorrent,1e3);const onDone=e=>{if(e.upload)return;e.isSeeding=!0;const t=torrentToJson(e);ipcRenderer.send("webtorrent-done",t),ipcRenderer.send("webtorrent-finish-all-payments",t),e.completedTime||(e.completedTime=Date.now())},onReady=e=>{e.files.forEach((e=>{e.name.match(/^_____padding_file_(.*)____$/)&&console.log("deselect",e.name)}));const t=torrentToJson(e);info("ready",t),ipcRenderer.send("webtorrent-ready",t),0===client.torrents.filter((e=>!e.ready)).length&&info("All torrents are ready")},onMetadata=(e,t)=>{ipcRenderer.send("webtorrent-metadata",e.infoHash),ipcRenderer.send("webtorrent-data",torrentToJson(e))},onWire=(e,t)=>{e.use(useAlphabizProtocol(client,t))},onInfoHash=(e,t,r,o)=>{info("infoHash",e),shouldDelete.includes(e)&&shouldDelete.splice(shouldDelete.indexOf(e),1),infoHashes.includes(e)&&client.get(e)!==t?(info("Destroy tr"),ipcRenderer.send("webtorrent-existed",e),t.destroy()):ipcRenderer.send("webtorrent-infohash",e,{...r,isSeeding:o}),infoHashes.push(e)},addListeners=(e,t={},r=!1)=>{t||(t={}),e.pending=!1,e.removeAllListeners(),e.setMaxListeners(0),info(`Add listeners to torrent ${e.infoHash||e.token||e.origin}`),e.on("done",(()=>onDone(e))),e.on("ready",(()=>onReady(e))),e.on("metadata",(()=>onMetadata(e,t))),e.on("infoHash",(o=>onInfoHash(o,e,t,r))),e.on("warning",(()=>{})),e.on("error",(r=>{info("Torrent error",r,t),ipcRenderer.send("webtorrent-error",torrentToJson(e),r.message)})),e.on("wire",(t=>onWire(t,e)))},addTorrent=(e,t,r)=>{if(t.isSeeding&&1===t.progress)return seedTorrent(e,t.file,t);if(t.infoHash){const e=t.infoHash.match(/btih:([^&]*)/),r=e&&e[1]||t.infoHash;if(r&&client.get(r))return info("exist",client.get(r)),ipcRenderer.send("webtorrent-existed",r)}if(t.origin){if(locked.has(t.origin))return info("origin lock",t.origin),locked.delete(t.origin);locked.add(t.origin)}if(t.token!==t.origin){if(locked.has(t.token))return info("token lock",t.token),info(locked),locked.delete(t.token);locked.add(t.token)}const o=()=>{let o=t.torrentPath&&fs.existsSync(t.torrentPath)?t.torrentPath:fs.existsSync(t.token||t.origin)?t.token||t.origin:t.infoHash;info(o);const n=client.add(o,{path:t.path||t.downloadDirectory,store:FSChunkStore,storeCacheSlots:10,strategy:"sequential",announce:[...t.trackers||[],...WEBTORRENT_ANNOUCEMENT]});n.token=e,n.origin=t.infoHash||t.token||t.origin,n.createdTime=t.createdTime||Date.now(),n.usedTime=t.usedTime||0,addListeners(n,t),n.once("infoHash",(()=>{locked.delete(t.origin),locked.delete(n.infoHash),locked.delete(t.token),r&&r(n)}))};if(client.get(t.infoHash))client.remove(t.infoHash,o);else if(client.torrents.some((t=>t.token===e))){const t=client.torrents.find((t=>t.token===e));if(!t)return o();if(t.infoHash)return r&&r(t);t.once("infoHash",(()=>r&&r(t)))}else o()},stopTorrent=e=>{if(locked.has(e))return;locked.add(e),server&&serverInfoHash===e&&(server.destroy(),server=null,serverInfoHash="");const t=client.get(e);if(t&&(t.isSeeding||t.done)&&(t.completed=!0),t)t.destroy((()=>{locked.delete(e),ipcRenderer.send("webtorrent-stop",e,t.completed)}));else if(locked.delete(e),e){const t=client.torrents.find((t=>t.token===e));t&&t.destroy((()=>{locked.delete(e),ipcRenderer.send("webtorrent-stop",e,t.completed)}))}else ipcRenderer.send("webtorrent-notfound",e);infoHashes.includes(e)&&infoHashes.splice(infoHashes.indexOf(e),1)},deleteTorrent=(e,t)=>{if(locked.has(e))return;locked.add(e),shouldDelete.push(e),server&&serverInfoHash===e&&(server.destroy(),server=null,serverInfoHash="");const r=client.get(e)||client.torrents.find((t=>t.token===e));if(info("delete",e,r,t),r){const o=r.files.length?getPublicPath(r.files.map((e=>e.path))):getPublicPath(r.file||[]);r.destroy({destroyStore:t},(()=>{ipcRenderer.send("webtorrent-delete",r.infoHash||e,o),locked.delete(e);try{client.remove(r.infoHash)}catch(t){}}))}else locked.delete(e),ipcRenderer.send("webtorrent-notfound",e);while(infoHashes.includes(e))infoHashes.splice(infoHashes.indexOf(e),1)},seedTorrent=(e,t,r,o=!1,n=null)=>{if(r.infoHash){if(locked.has(r.infoHash))return;locked.add(r.infoHash)}let s=null;return r.infoHash&&!r.upload&&r.files.length?(console.log("[seed] add torrent"),console.log(r),s=client.add(r.token||r.origin||r.infoHash,{path:r.path||r.downloadDirectory,store:FSChunkStore,storeCacheSlots:10,strategy:"sequential",skipVerify:1===r.progress,announce:[...r.trackers||[],...WEBTORRENT_ANNOUCEMENT]})):r.isSeeding&&r.torrentPath&&fs.existsSync(r.torrentPath)?s=client.add(r.torrentPath,{path:r.path||r.downloadDirectory,store:FSChunkStore,storeCacheSlots:10,skipVerify:!0,announce:[...r.trackers||[],...WEBTORRENT_ANNOUCEMENT]}):r.isSeeding&&r.magnetURI?(s=client.add(r.magnetURI,{path:r.path||r.downloadDirectory,store:FSChunkStore,storeCacheSlots:10,skipVerify:!0,announce:[...r.trackers||[],...WEBTORRENT_ANNOUCEMENT]}),s.upload=!0,s.isSeeding=!0):s=client.seed(t,{...r,store:FSChunkStore,storeCacheSlots:10,skipVerify:!0,announce:[...WEBTORRENT_ANNOUCEMENT]}),info("seedTorrent",r,s,t),r.name&&(s.name=r.name),s.isAutoUpload=o,s.token=e,s.isSeeding=!0,s.upload=!0,s.paused=!1,s.file=t,s.createdTime=r.createdTime||Date.now(),addListeners(s,r,!0),r.infoHash&&s.once("infoHash",(()=>locked.delete(r.infoHash))),s.once("infoHash",(()=>{n&&n()})),s.once("metadata",(()=>{ipcRenderer.send("webtorrent-seed",torrentToJson(s))})),s},getTorrent=()=>{const e=client.torrents.map((e=>torrentToJson(e)));return info(e),ipcRenderer.send("webtorrent-list",e)},setThrottleGroup=({infoHash:e,peerId:t,subId:r,level:o})=>{const n=client.get(e);if(!n)return info("not found",e),ipcRenderer.send("webtorrent-set-throttle",{code:-1,message:"Torrent Not Found"}),null;let s=null,i=null;for(let a of n.wires)if(r?a.remoteSub===r:a.peerId===t){s=a;try{a._setThrottleGroup(o)}catch(d){i={code:-1,message:d.message}}break}return s?i?ipcRenderer.send("webtorrent-set-throttle",i):ipcRenderer.send("webtorrent-set-throttle",{code:0,message:"success"}):ipcRenderer.send("webtorrent-set-throttle",{code:-1,message:"Peer Not Found"}),s},saveTorrentFile=(e,t)=>{const r="webtorrent-save-torrent",o=client.get(e);if(!o)return;if(!o.torrentFile||!o.name)return ipcRenderer.send(r,{code:-1,message:"Torrent Not Ready"});const n=path.resolve(t,`${o.name}.torrent`);fs.writeFileSync(n,o.torrentFile),ipcRenderer.send(r,{code:0,message:"success",infoHash:e,torrentPath:n})};let server=null,serverInfoHash="";const startTorrentServer=e=>{if(info("Start server",e),server){if(serverInfoHash===e.infoHash)return ipcRenderer.send("webtorrent-server-ready",e.infoHash,{token:e.token,port:server.address().port});server.destroy(),server=null,serverInfoHash=""}info("Create server",e),server=e.createServer(),server.listen(0,(()=>{const t=server.address().port,r={token:e.token,port:t};ipcRenderer.send("webtorrent-server-ready",e.infoHash,r);const o=()=>{const t=e.files.map((t=>{let r=[];for(let o=t._startPiece;o<t._endPiece;o++)r.push(null===e.pieces[o]?1:0);return{name:t.name,path:t.path,progress:r}}));ipcRenderer.send("webtorrent-server-progress",e.infoHash,t)};setTimeout(o,1e3);const n=setInterval(o,5e3);server.once("close",(()=>clearInterval(n)))}))},startServer=(e,t)=>{info("start server",e,t);let r=client.get(e);if(!r)return addTorrent(t.token||t.infoHash,t,(()=>startServer(e,t)));r.ready?startTorrentServer(r,t):r.once("ready",(()=>startTorrentServer(r,t)))},stopServer=()=>{server&&(server.destroy(),server=null,serverInfoHash="",info("Destroy server"))};(function(){ipcRenderer.on("add-torrent",((e,t,r)=>addTorrent(t,r))),ipcRenderer.on("stop-torrent",((e,t)=>(info("got stop",t),stopTorrent(t)))),ipcRenderer.on("stop-all-uploading",((e,t)=>{t.forEach((e=>{const t=client.torrents.find((t=>!(!t.infoHash||t.infoHash!==e.infoHash)||!(!t.token||t.token!==e.token)));t&&t.destroy()}))})),ipcRenderer.on("delete-all",((e,t,r,o)=>{shouldSendInfo=!1,console.log("Delete all",t,r,o);const n=client.torrents.filter((e=>{if("all"===t)return!0;const r=e.upload||1===e.progress||e.isSeeding;return"upload"===t?!(!o&&e.isAutoUpload)&&r:!r}));if(!n.length)return void(shouldSendInfo=!0);let s=0;n.forEach((t=>{s++,console.log(t.infoHash),shouldDelete.push(t.infoHash),t.removeAllListeners();try{t.destroy({destroyStore:r},(()=>{shouldDelete.includes(t.infoHash)&&shouldDelete.splice(shouldDelete.indexOf(t.infoHash),1),s--,0===s&&(shouldSendInfo=!0)}))}catch(e){}})),setTimeout((()=>{shouldSendInfo=!0}),2e3)})),ipcRenderer.on("seed-torrent",((e,t)=>{let{file:r,token:o,...n}=t;return r||(r=t.files.map((e=>e.path))),info(t),r.length?(o||(o=Math.random().toString().substr(2)),seedTorrent(o,r,n)):ipcRenderer.send("seed-error")})),ipcRenderer.on("autoupload-files",(async(e,t)=>{info("autoupload files",t),Promise.all(t.map((e=>{if(info("Auto upload",e),!client.torrents.some((t=>t.files.some((t=>t.path===e))||t.file&&t.file.some&&t.file.some((t=>t===e))||t.file===e)))return new Promise((t=>{seedTorrent("autoupload-"+e,e,{},!0,t)}));info(`${e} is already uploaded, skipped`)}))).then((()=>{info("autoupload complete"),ipcRenderer.send("autoupload-complete")})).catch((e=>{ipcRenderer.send("autoupload-complete",e.message||e)}));let r=[];client.torrents.forEach((e=>{e.isAutoUpload&&e.ready&&(e.files.some((e=>t.includes(e.path)))?info(`${e.infoHash} is kept alive`):(info(`${e.infoHash} has been deleted. Destroy`,e.files.map((e=>e.path))),r.push(e)))})),r.forEach((e=>{e.destroy((()=>{ipcRenderer.send("webtorrent-delete",e.infoHash)}))}))})),ipcRenderer.on("start-server",((e,{infoHash:t,conf:r})=>startServer(t,r))),ipcRenderer.on("stop-server",(()=>stopServer())),ipcRenderer.on("delete-torrent",((e,t,r)=>deleteTorrent(t,r))),ipcRenderer.on("pend-torrent",((e,t)=>{const r=client.get(t.infoHash);infoHashes.includes(t.infoHash)&&infoHashes.splice(infoHashes.indexOf(t.infoHash),1),info("Pend",t.infoHash,r),r&&(r.removeAllListeners(),r.destroy(),r.pending=!0,ipcRenderer.send("webtorrent-pending",torrentToJson(r)))})),ipcRenderer.on("set-throttle-group",((e,{infoHash:t,peerId:r,subId:o,level:n})=>{info(t,r,o,n),setThrottleGroup({infoHash:t,peerId:r,subId:o,level:n})})),ipcRenderer.on("save-torrent-file",((e,t,r)=>saveTorrentFile(t,r))),ipcRenderer.on("update-settings",((e,{uploadSpeed:t,downloadSpeed:r,maximumConnectionsNum:o,dhtPort:n,torrentPort:s,payedUserShareRate:i})=>{if(n=parseInt(n),s=parseInt(s),info("Set client",{uploadSpeed:t,downloadSpeed:r,maximumConnectionsNum:o,dhtPort:n,torrentPort:s,payedUserShareRate:i}),i){const e=Number(i)||.7;localStorage.setItem("payedUserShareRate",e.toString())}if(t){const e=speedLimit(t);localStorage.setItem("uploadSpeed",e.toString())}const d=Number(localStorage.getItem("payedUserShareRate"))||.7,a=parseInt(localStorage.getItem("uploadSpeed"));if(isNaN(d)||isNaN(a)||(-1===a?client.throttleUpload(-1):client.throttleUpload(a,d)),r){const e=speedLimit(r);client.throttleDownload(e),localStorage.setItem("downloadSpeed",e.toString())}o&&(client.maxConns=o,localStorage.setItem("maximumConnectionsNum",o.toString()));let l=!1;n&&n!==parseInt(localStorage.getItem("dhtPort"))&&(l=!0,localStorage.setItem("dhtPort",n.toString())),s&&s!==parseInt(localStorage.getItem("torrentPort"))&&(l=!0,localStorage.setItem("torrentPort",s.toString())),l&&location.reload()})),ipcRenderer.on("reset-torrent",(()=>{info("reset"),shouldSendInfo=!1,Promise.all(client.torrents.map((e=>new Promise((t=>{e.removeAllListeners(),e.destroy({destroyStore:!0},t)}))))).then((()=>ipcRenderer.send("webtorrent-reset"))).catch((()=>ipcRenderer.send("webtorrent-reset-error"))).finally((()=>{info("resetted"),client.torrents.length=0,shouldSendInfo=!0}))})),initClient(0),window.addEventListener("error",(e=>(info(e.message||e),!0)))})();