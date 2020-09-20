<template>
  <q-page
    class="flex justify-start items-center column no-wrap isBEX"
    style="width: 357px; height: 600px;"
  >
    <div
      v-if="renderData != null"
      class="q-mt-xl flex column justify-start align-center"
      style="width: 100%; height: 100%;"
    >
      <div
        class="operation_data flex column justify-center align-center"
        style="width: 80%; margin-left: 10%"
      >
        <div
          class="operation flex row justify-start align-center"
          v-for="(operation, index) in renderData._operations"
          :key="index"
        >
          <div v-if="operation.type == 'payment'">
            <span>Pay {{operation.amount}} {{operation.asset.code}} to {{operation.destination.substr(0, 4)}}</span>
          </div>
          <div v-if="operation.type == 'changeTrust'">
            <span>Change trust {{operation.line.code}} from {{operation.line.issuer.substr(0, 4)}} with limit {{operation.limit}}</span>
          </div>
          <div v-if="operation.type == 'allowTrust'">
            <span>Allow trust {{operation.assetCode}} from {{operation.source.substr(0, 4)}} to {{operation.trustor.substr(0, 4)}}</span>
          </div>
          <div v-if="operation.type == 'manageSellOffer'">
            <span>Sell {{operation.amount}} {{operation.selling.code}} for {{parseFloat(operation.price)*parseFloat(operation.amount).toFixed(7)}} {{operation.buying.code}} at {{parseFloat(operation.price).toFixed(7)}}</span>
          </div>
          <div v-if="operation.type == 'manageBuyOffer'">
            <span>Buy {{operation.buyAmount}} {{operation.buying.code}} for {{parseFloat(operation.price)*parseFloat(operation.buyAmount).toFixed(7)}} {{operation.selling.code}} at {{parseFloat(operation.price).toFixed(7)}}</span>
          </div>
        </div>
      </div>

      <div
        class="buttons q-mt-xl q-pb-md fixed-bottom flex row justify-between"
        style="width: 100%;"
        v-if="!confirmPassword"
      >
        <q-separator class="q-mb-md" />
        <q-btn
          :disable="!commited"
          flat
          no-caps
          color="negative"
          label="Cancel"
          class="q-ml-md"
          size="lg"
          style="width: 150px"
          @click="rejected"
        />
        <q-btn
          :disable="!commited"
          no-caps
          unelevated
          color="primary"
          label="Confirm"
          class="q-mr-md"
          size="lg"
          style="width: 150px"
          @click="successful"
        />
      </div>
      <div
        class="buttons q-mt-xl q-pb-md fixed-bottom flex row justify-between"
        style="width: 100%;"
        v-if="confirmPassword"
      >
        <q-separator class="q-mb-md" />
        <q-btn
          :disable="!validPassword"
          flat
          no-caps
          color="negative"
          label="Cancel"
          class="q-ml-md"
          size="lg"
          style="width: 150px"
          @click="rejected"
        />
        <q-btn
          :disable="!validPassword"
          no-caps
          unelevated
          color="primary"
          label="Sign and Send"
          class="q-mr-md"
          size="lg"
          style="width: 150px"
          @click="successful"
        />
      </div>
    </div>
    <div v-else>Loading ...</div>
  </q-page>
</template>

<script>
import StellarSDK from "stellar-sdk";
import toml from "toml";
import StellarHDWallet from "stellar-hd-wallet";
import * as aes256 from "aes256";

export default {
  name: "PopupIndex",
  data() {
    return {
      account: {},
      tab: "assets",
      assetBalances: [],
      nativeBalance: {},
      server: null,
      showBalances: false,
      showCall: false,
      renderData: null,
      commited: false,
      confirmPassword: false
    };
  },
  created() {
    //Render trigger

    this.$q.bex.send("vue.astrolink.OPERATION.intent.SUCCESSFUL", null);
    this.$q.bex.on("bh.astrolink.OPERATION.render", this.render);
    this.$q.bex.on("bh.astrolink.OPERATION.commit", this.commit);
  },
  mounted() {
    this.$store.dispatch("user/getAccount", 0).then((account) => {
      this.account = account;
      //this.signAndSubmitTransaction(xdrn);
    });
  },
  methods: {
    render(event) {
      let transaction = StellarSDK.TransactionBuilder.fromXDR(
        event.data.xdr,
        this.$store.getters["user/network"]
      );
      this.renderData = transaction;
      this.$q.bex.send("vue.astrolink.OPERATION.render.SUCCESSFUL", null);
    },
    commit(event) {
      this.commited = true;
    },
    successful() {
      this.$q.bex.send("vue.astrolink.OPERATION.COMPLETED", this.account);
    },
    rejected() {
      this.$q.bex.send("vue.astrolink.OPERATION.REJECTED", null);
    },
    signAndSubmitTransaction(xdr, password) {
      this.$store.dispatch("user/getEncryptedSeed").then((seed) => {
        let seedDecrypted = aes256.decrypt(password, seed);
        let account = StellarSDK.Keypair.fromSecret(
          StellarHDWallet.fromMnemonic(seedDecrypted).getSecret(this.account.id)
        );
        let server = new StellarSDK.Server(
          this.$store.getters["user/horizon"]
        );
        let transaction = StellarSDK.TransactionBuilder.fromXDR(
          xdr,
          this.$store.getters["user/network"]
        );
        transaction.sign(account);
        server
          .submitTransaction(transaction)
          .then(console.log)
          .catch(console.log);
      });
    },
  },
};
</script>
