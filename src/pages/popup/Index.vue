<template>
  <q-page
    class="flex justify-start items-center column no-wrap isBEX"
    style="width: 357px; height: 600px"
  >
    <!--<a href="index.html" target="_blank">ZASASDASD</a>-->
    <input type="hidden" :value="account.public" id="address">
    <q-chip icon="content_copy" class="q-my-lg" clickable @click="copyAddress" color="primary" text-color="white">{{account.public | formatAddress}}</q-chip>
    <div class="action-buttons">
      <q-btn outline no-caps color="primary" :label="$t('send')" style class="q-mr-lg" />
      <q-btn no-caps color="primary" :label="$t('receive')" />
    </div>
    <q-tabs
      style="width: 100%"
      v-model="tab"
      dense
      no-caps
      align="justify"
      class="text-black q-mt-lg"
      :breakpoint="0"
    >
      <q-tab name="assets" :label="$t('assets')" />
      <q-tab name="transactions" :label="$t('transactions')" />
    </q-tabs>
    <balances v-if="tab == 'assets'" />
    <transactions v-if="tab == 'transactions'" />
    <div></div>
  </q-page>
</template>

<script>
import StellarSDK from "stellar-sdk";
import Balances from "./../../components/Balances.vue";
import Transactions from "./../../components/Transactions.vue";
import toml from "toml";
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
    };
  },
  components: {
    Balances,
    Transactions
  },
  created() {},
  mounted() {
    this.account = this.$store.getters["user/account"];
    if (this.account == null || this.account == {}) {
      this.$store
        .dispatch("user/getAccount", 0)
        .then((account) => (this.account = account));
    }
  },
  methods: {
    copyAddress(){
      let e = document.querySelector("#address")
      e.setAttribute('type', 'text')
      e.select()

      try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            e.setAttribute('type', 'hidden')
          } catch (err) {
            e.setAttribute('type', 'hidden')
          }
    },

  },
  filters: {
      formatAddress: function (address){
        if(address == null) return ''
        return address.substr(0, 5)+"..."+address.substr(address.length - 5, address.length)
      }
    },
};
</script>
