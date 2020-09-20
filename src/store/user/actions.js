export function getEncryptedSeed(context){
  let seed = context.getters["encryptedSeed"]
  if(seed == null){
    seed = localStorage.getItem("encrypted_seed")
    context.commit("updateEncryptedSeed", seed)
  }
  return seed
}

export function getAccounts(context) {
  let accounts = context.getters.accounts
  if(accounts.length == 0){
    accounts = JSON.parse(localStorage.getItem("accounts"))
    context.commit("updateAccounts", accounts)
  }
  return accounts

}

export function getAccount(context, index) {
  let accounts = context.getters.accounts
  if(accounts.length == 0){
    accounts = JSON.parse(localStorage.getItem("accounts"))
    context.commit("updateAccounts", accounts)
  }
  return accounts[index]
}
