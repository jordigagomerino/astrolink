// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
let Bridge = null
export default function attachContentHooks(bridge) {
  /**
   * When the drawer is toggled set the iFrame height to take the whole page.
   * Reset when the drawer is closed.
   */
  /*bridge.on('bex.toggle.iframe', event => {
    const payload = event.data
    if (payload.open) {
      setIFrameDimensions('100%', '300px')
    } else {
      resetIFrame()
    }
    bridge.send(event.eventResponseKey)
  })*/

  bridge.on('test.event', event => {
    console.log(event)
  })

  Bridge = bridge


    window.addEventListener("message", function (event) {
      if (event.source != window)
        return;
        if(event.data.scope == "astrolink.LOGIN.intent"){
          bridge.send('ch.astrolink.LOGIN.intent', event)
        }
        else if(event.data.scope == "astrolink.OPERATION.intent"){
          bridge.send('ch.astrolink.OPERATION.intent', event)
        }
        else if(event.data.scope == "astrolink.LOGIN.render"){
          event.data.origin = event.origin
          bridge.send('ch.astrolink.LOGIN.render', event.data)
        }
        else if(event.data.scope == "astrolink.OPERATION.render"){
          bridge.send('ch.astrolink.OPERATION.render', event)
        }
        else if(event.data.scope == "astrolink.LOGIN.commit"){
          bridge.send('ch.astrolink.LOGIN.commit', event)
        }
        else if(event.data.scope == "astrolink.OPERATION.commit"){
          bridge.send('ch.astrolink.OPERATION.commit', event)
        }
    });

    bridge.on('bh.astrolink.LOGIN.intent.SUCCESSFUL', event => {
      window.postMessage(event)
    })
    bridge.on('bh.astrolink.OPERATION.intent.SUCCESSFUL', event => {
      window.postMessage(event)
    })

    bridge.on('bh.astrolink.LOGIN.render.SUCCESSFUL', event => {
      window.postMessage(event)
    })
    bridge.on('bh.astrolink.OPERATION.render.SUCCESSFUL', event => {
      window.postMessage(event)
    })

    bridge.on('bh.astrolink.LOGIN.intent.FAILURE', event => {
      window.postMessage(event)
    })
    bridge.on('bh.astrolink.OPERATION.intent.FAILURE', event => {
      window.postMessage(event)
    })

    bridge.on('bh.astrolink.LOGIN.render.FAILURE', event => {
      window.postMessage(event)
    })
    bridge.on('bh.astrolink.OPERATION.render.FAILURE', event => {
      window.postMessage(event)
    })

    bridge.on('bh.astrolink.LOGIN.COMPLETED', event => {
      window.postMessage(event)
    })
    bridge.on('bh.astrolink.OPERATION.COMPLETED', event => {
      window.postMessage(event)
    })

    bridge.on('bh.astrolink.LOGIN.REJECTED', event => {
      window.postMessage(event)
    })
    bridge.on('bh.astrolink.OPERATION.REJECTED', event => {
      window.postMessage(event)
    })




      //Web have to

     // window.postMessage({scope: "astrolink.LOGIN.intent"}, "*")
     // window.postMessage({scope: "astrolink.LOGIN.intent", img: "https://via.placeholder.com/150", name: "tewsti"}, "*")
     // window.postMessage({scope: "astrolink.LOGIN.commit"}, "*")

}
/*
function addElWithClass(tag, className, container) {
  const item = document.createElement(tag)
  item.className = className
  container.append(item)
  return item
}

function addElWithId(tag, idName, container) {
  const item = document.createElement(tag)
  item.id = idName
  container.append(item)
  return item
}*/


