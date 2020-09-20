export default function () {
  return {
    password: "hola", //Temporal,  it will be deleted when the seed is encrypted
    encryptedSeed: null,
    randomPositionedSeed: null,
    accounts: [],
    account: null,
    network: process.env.NETWORK,
    horizon: process.env.HORIZON
  }
}
