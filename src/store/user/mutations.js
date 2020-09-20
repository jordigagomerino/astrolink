
export function updatePassword (state, password) {
  state.password = password
}

export function updateEncryptedSeed (state, encryptedSeed) {
  localStorage.setItem("encrypted_seed", encryptedSeed)
  state.encryptedSeed = encryptedSeed
}

export function updateRandomPositionedSeed (state, randomSeed) {
  state.randomPositionedSeed = randomSeed
}

export function updateAccount (state, {account, position}) {
    state.accounts[position] = account
    localStorage.setItem("accounts", JSON.stringify(state.accounts))
}

export function updateAccounts (state, accounts) {
  state.accounts = accounts
  localStorage.setItem("accounts", JSON.stringify(state.accounts))
}

export function setAccount(state, account){
  state.account = account
}
