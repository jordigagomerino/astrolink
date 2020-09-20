import Vue from 'vue'
const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');
/*(async () => {
  const ipfs = await IPFS.create()
const orbitDB = await  OrbitDB.createInstance(ipfs)
const db = await orbitDB.keyvalue('test-db')
console.log(db.address.toString()) //
let x = await db.get("hola")
console.log(x)
Vue.prototype.$db = db
})()

*/
