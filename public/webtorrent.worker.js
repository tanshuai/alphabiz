(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a
        }
        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];
          return o(n || r)
        }, p, p.exports, r, e, n, t)
      }
      return n[i].exports
    }
    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
    return o
  }
  return r
})()({
  1: [function (require, module) {
    module.exports = event => {
      const {
        request
      } = event, {
        url,
        method,
        headers,
        destination
      } = request;
      return url.includes(self.registration.scope + "webtorrent/") ? url.includes(self.registration.scope + "webtorrent/keepalive/") ? new Response : clients.matchAll({
        type: "window",
        includeUncontrolled: !0
      }).then(clients => new Promise(resolve => {
        for (const client of clients) {
          const messageChannel = new MessageChannel,
            {
              port1,
              port2
            } = messageChannel;
          port1.onmessage = event => {
            resolve([event.data, messageChannel])
          }, client.postMessage({
            url,
            method,
            headers: Object.fromEntries(headers.entries()),
            scope: self.registration.scope,
            destination,
            type: "webtorrent"
          }, [port2])
        }
      })).then(([data, messageChannel]) => {
        if ("STREAM" === data.body || "DOWNLOAD" === data.body) {
          let timeOut = null;
          return new Response(new ReadableStream({
            pull(controller) {
              // console.log(controller)
              return new Promise(resolve => {
                messageChannel.port1.onmessage = event => {
                  // event.data ? controller.enqueue(event.data) : (clearTimeout(timeOut), controller.close(), messageChannel.port1.onmessage = null)
                  if (event.data) controller.enqueue(event.data)
                  else {
                    clearTimeout(timeOut)
                    try {
                      controller.close()
                    } catch (e) {
                      console.log('close error', e)
                    }
                    messageChannel.port1.onmessage = null
                  }
                  return resolve()
                }
                clearTimeout(timeOut)
                if ("STREAM" === data.body) {
                  timeOut = setTimeout(() => {
                    try {
                      controller.close && controller.close()
                    } catch (e) {
                      console.log('Close error', e)
                    }
                    messageChannel.port1.postMessage(!1)
                    messageChannel.port1.onmessage = null
                    resolve()
                  }, 5e3)
                }
                messageChannel.port1.postMessage(!0)
              })
            },
            cancel() {
              messageChannel.port1.postMessage(!1)
            }
          }), data)
        }
        return new Response(data.body, data)
      }).catch(console.error) : null
    }
  }, {}],
  2: [function (require) {
    const fileResponse = require("./worker-server.js");
    self.addEventListener("install", (evt) => {
      evt.waitUntil(self.skipWaiting())
      console.log('[ ServiceWorker ] Installed')
    }), self.addEventListener("fetch", event => {
      // console.log('[ ServiceWorker ] On fetch', event)
      const res = fileResponse(event);
      res && event.respondWith(res)
    }), self.addEventListener("activate", evt => {
      console.log('[ ServiceWorker ] Activated')
      evt.waitUntil(self.clients.claim())
    })
  }, {
    "./worker-server.js": 1
  }]
}, {}, [2]);
