<template>
  <q-page class="flex justify-start items-center column no-wrap isBEX" style="width: 357px; height: 600px;">
    <div v-if="renderData != null" class="q-mt-xl flex column justify-start align-center" style="width: 100%; height: 100%;">
      <div class="web_data flex column justify-center align-center" style="width: 80%; margin-left: 10%">
        <div class="web_img flex row justify-center">
          <img :src="renderData.img" :alt="renderData.name" style="width: 150px; height: 150px">
        </div>
        <div class="render_name text-center text-h5 q-mt-xs">
          {{renderData.name}}
        </div>
        <div class="q-mt-md">
          <span class="text-body1">Allow {{renderData.origin}} to:</span>
          <ul style="list-style: none">
            <li class="text-body2 text-bold">View the address of your account.</li>
          </ul>
        </div>
      </div>

      <div class="buttons q-mt-xl q-pb-md fixed-bottom flex row justify-between" style="width: 100%;">
        <q-separator class="q-mb-md"/>
        <q-btn :disable="!commited" flat no-caps color="negative" label="Cancel"  class="q-ml-md" size="lg" style="width: 150px" @click="rejected"/>
        <q-btn :disable="!commited" no-caps unelevated color="primary" label="Connect" class="q-mr-md" size="lg" style="width: 150px" @click="successful"/>
      </div>
    </div>
    <div v-else>
      Loading ...
    </div>


  </q-page>
</template>

<script>
import StellarSDK from "stellar-sdk";
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
      showCall: false,
      renderData: null,
      commited: false
    };
  },
  created() {
    //Render trigger
    this.$q.bex.send("vue.astrolink.LOGIN.intent.SUCCESSFUL", null)
    this.$q.bex.on('bh.astrolink.LOGIN.render', this.render);
    this.$q.bex.on('bh.astrolink.LOGIN.commit', this.commit);
  },
  mounted() {
   this.$store.dispatch("user/getAccount", 0).then((account) => {
        this.account = account
   });


  },
  methods: {
    render(event){
      this.renderData = event.data.data
      this.$q.bex.send("vue.astrolink.LOGIN.render.SUCCESSFUL", null)
    },
    commit(event){
      this.commited = true
    },
    successful(){
      this.$q.bex.send("vue.astrolink.LOGIN.COMPLETED", this.account)
    },
    rejected(){
      this.$q.bex.send("vue.astrolink.LOGIN.REJECTED", null)
    }
  }
};
</script>
