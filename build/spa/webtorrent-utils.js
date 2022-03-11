const path=require("path"),responseTorrentProps=["infoHash","name","paused","length","downloaded","uploaded","ready","waiting","progress","isSeeding","upload","token","completed","origin","path","pending","file","magnetURI","isAutoUpload","createdTime","completedTime","usedTime"],torrentToJson=(e,o,d)=>{const a={};return responseTorrentProps.forEach((o=>{a[o]=e[o]})),a.done=e.downloaded>=e.length,a.download=1!==e.progress&&!e.upload,a.upload=e.upload,a.recieved=e.received,a.files=e.files?e.files.map((o=>({name:o.name,path:path.resolve(e.path,o.path),progress:o.progress>0?o.progress:0}))).filter((e=>!e.name.match(/^_____padding_file_(.*)____$/))):[],e.timeRemaining&&(a.timeRemaining=e.timeRemaining),e.metadata&&(a.hasMetadata=!0),e.numPeers&&(a.peersNum=e.numPeers),a.connections=[],e.wires.forEach((e=>{let r="low";e._uploadThrottle._group===client.throttleGroups.mid&&(r="mid"),e._uploadThrottle._group===client.throttleGroups.high&&(r="high");let t=0,s=0;if(d.has(e._debugId)){const a=d.get(e._debugId);t=(e.downloaded-a.downloaded)/o,s=(e.uploaded-a.uploaded)/o}d.set(e._debugId,{downloaded:e.downloaded,uploaded:e.uploaded}),a.connections.push({id:e.peerId,address:e.remoteAddress,isAbPeer:e._is_alphabiz_peer_,hasMeta:e.remote_has_meta,uploadSpeed:s,downloadSpeed:t,user:e.remoteUser,subId:e.remoteSub,transactions:e.transactions,remoteGroup:e.remoteGroup,downloaded:e.downloaded,level:r})})),a.connections.sort(((e,o)=>e.address&&e.address.localeCompare?e.address.localeCompare(o.address):0)),a};export default{torrentToJson:torrentToJson};