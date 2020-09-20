// Hooks added here have a bridge allowing communication between the BEX Background Script and the BEX Content Script.
// Note: Events sent from this background script using `bridge.send` can be `listen`'d for by all client BEX bridges for this BEX

// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/background-hooks

export default function attachBackgroundHooks (bridge, allActiveConnections) {
  bridge.on('storage.get', event => {
    const payload = event.data
    if (payload.key === null) {
      chrome.storage.local.get(null, r => {
        const result = []

        // Group the items up into an array to take advantage of the bridge's chunk splitting.
        for (const itemKey in r) {
          result.push(r[itemKey])
        }
        bridge.send(event.eventResponseKey, result)
      })
    } else {
      chrome.storage.local.get([payload.key], r => {
        bridge.send(event.eventResponseKey, r[payload.key])
      })
    }
  })

  bridge.on('storage.set', event => {
    const payload = event.data
    chrome.storage.local.set({ [payload.key]: payload.data }, () => {
      bridge.send(event.eventResponseKey, payload.data)
    })
  })

  bridge.on('storage.remove', event => {
    const payload = event.data
    chrome.storage.local.remove(payload.key, () => {
      bridge.send(event.eventResponseKey, payload.data)
    })
  })


  //Vue - content hook pipes
  bridge.on('ch.astrolink.LOGIN.intent', event => {
    chrome.windows.create({url: "www/index.html#/popup/login", type: "popup", width: 357, height: 600});
  })

  bridge.on('ch.astrolink.OPERATION.intent', event => {
    chrome.windows.create({url: "www/index.html#/popup/operation", type: "popup", width: 357, height: 600});
  })

  //Vue - content-hook pipes
  //From content-hook
  bridge.on('ch.astrolink.LOGIN.render', event => {
    bridge.send('bh.astrolink.LOGIN.render', event)
  })
  bridge.on('ch.astrolink.OPERATION.render', event => {
    bridge.send('bh.astrolink.OPERATION.render', event)
  })
  bridge.on('ch.astrolink.LOGIN.commit', event => {
    bridge.send('bh.astrolink.LOGIN.commit', event)
  })
  bridge.on('ch.astrolink.OPERATION.commit', event => {
    bridge.send('bh.astrolink.OPERATION.commit', event)
  })
  //From Vue
  bridge.on('vue.astrolink.LOGIN.intent.SUCCESSFUL', event => {
    bridge.send('bh.astrolink.LOGIN.intent.SUCCESSFUL', event)
  })
  bridge.on('vue.astrolink.OPERATION.intent.SUCCESSFUL', event => {
    bridge.send('bh.astrolink.OPERATION.intent.SUCCESSFUL', event)
  })

  bridge.on('vue.astrolink.LOGIN.render.SUCCESSFUL', event => {
    bridge.send('bh.astrolink.LOGIN.render.SUCCESSFUL', event)
  })
  bridge.on('vue.astrolink.OPERATION.render.SUCCESSFUL', event => {
    bridge.send('bh.astrolink.OPERATION.render.SUCCESSFUL', event)
  })

  bridge.on('vue.astrolink.LOGIN.intent.FAILURE', event => {
    bridge.send('bh.astrolink.LOGIN.intent.FAILURE', event)
  })
  bridge.on('vue.astrolink.OPERATION.intent.FAILURE', event => {
    bridge.send('bh.astrolink.OPERATION.intent.FAILURE', event)
  })

  bridge.on('vue.astrolink.LOGIN.render.FAILURE', event => {
    bridge.send('bh.astrolink.LOGIN.render.FAILURE', event)
  })
  bridge.on('vue.astrolink.OPERATION.render.FAILURE', event => {
    bridge.send('bh.astrolink.OPERATION.render.FAILURE', event)
  })

  bridge.on('vue.astrolink.LOGIN.COMPLETED', event => {
    bridge.send('bh.astrolink.LOGIN.COMPLETED', event)
  })
  bridge.on('vue.astrolink.OPERATION.COMPLETED', event => {
    bridge.send('bh.astrolink.OPERATION.COMPLETED', event)
  })

  bridge.on('vue.astrolink.LOGIN.REJECTED', event => {
    bridge.send('bh.astrolink.LOGIN.REJECTED', event)
  })
  bridge.on('vue.astrolink.OPERATION.REJECTED', event => {
    bridge.send('bh.astrolink.OPERATION.REJECTED', event)
  })


  /*
  // EXAMPLES
  // Listen to a message from the client
  bridge.on('test', d => {
    console.log(d)
  })

  // Send a message to the client based on something happening.
  chrome.tabs.onCreated.addListener(tab => {
    bridge.send('browserTabCreated', { tab })
  })

  // Send a message to the client based on something happening.
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      bridge.send('browserTabUpdated', { tab, changeInfo })
    }
  })
   */
}
