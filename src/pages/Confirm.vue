<template>
  <q-page class="flex justify-start items-start column q-pt-xl">
    <div
      class="flex column justify-start items-start q-ma-lg"
      style="width: 50%; margin-left: 25%;"
    >
      <router-link to="/generate" class="link">
        <q-icon name="chevron_left" />{{$t('back')}}
      </router-link>
      <h1
        class="text-h3"
        style="margin-top: 10px; margin-bottom: 10px"
      >{{$t('confirm_phrase')}}</h1>
      <p class="text-body1">{{$t('please_select')}}</p>
      <q-card flat bordered style="width: 75%; height: 20vh" class="q-mb-lg">
        <q-card-section>
          <div>
            <q-btn
              class="q-mr-md"
              color="primary"
              text-color="black"
              :label="word"
              size="17px"
              style="width: 130px"
              no-caps
              flat
              outlined
              v-for="word in confirmedSeed"
              :key="word"
            />
          </div>
        </q-card-section>
      </q-card>
      <div class="q-mb-lg">
        <div class="flex justify-start row wrap" style="width: 70%;">
           <q-btn
              class="q-mr-md"
              color="primary"
              text-color="black"
              :label="word"
              size="17px"
              style="width: 130px"
              no-caps
              flat
              outlined
              v-for="word in randomSeedWords"
              :key="word"
              @click="addToConfirmed(word)"
            />
        </div>
      </div>
      <q-btn
        color="primary"
        text-color="white"
        :label="$t('finish')"
        size="17px"
        style="width: 200px"
        unelevated
        no-caps
        :disabled="!confirmed"
        @click="$router.push('/account')"
      />
    </div>
  </q-page>
</template>

<script>
import StellarHDWallet from "stellar-hd-wallet";
export default {
  name: "ConfirmPage",
  data(){
    return {
      randomSeedWords: [],
      confirmedSeed: [],
      confirmed: false
    }
  },
  created() {
    this.randomSeedWords = this.$store.getters["user/randomPositionedSeed"]
  },
  methods: {
    addToConfirmed(word){
      if(!this.confirmedSeed.includes(word)) this.confirmedSeed.push(word)
      if(this.confirmedSeed.length === this.randomSeedWords.length) {
        this.confirmSeed()
      }
    },
    confirmSeed(){
      let seedString = this.confirmedSeed.join(" ")
      if(!StellarHDWallet.validateMnemonic(seedString)){
        this.confirmedSeed = []
        return;
      }
      const wallet = StellarHDWallet.fromMnemonic(seedString)
      this.$store.dispatch("user/getAccount", 0).then((account) => {
        if(wallet.getPublicKey(0) == account.public){
        this.confirmed = true
        return;
      }
      else {
        this.confirmedSeed = []
        return;
      }
      })

    }

  }
};
</script>
<style lang="stylus">
.link {
  color: black;
  text-decoration: none;
  font-weight: bold;
}
</style>
