<template>
  <q-page class="flex justify-start items-start row q-pt-xl">
    <div
      class="flex column justify-start items-start q-ma-lg"
      style="width: 25%; margin-left: 28%;"
    >
      <h1 class="text-h3" style="margin-top: 10px; margin-bottom: 10px">{{$t('sbp')}}</h1>
      <p class="text-body1">{{$t('your_secret_expl')}}</p>
      <p class="text-body1">
        <b>{{$t('warning')}}</b>
        {{$t('warning_save_expl')}}
      </p>
      <q-card flat bordered>
        <q-card-section class="text-h5 text-center">{{seed}}</q-card-section>
      </q-card>
      <div class="flex row q-mt-lg" style="width: 100%;">
        <q-btn
          class="q-mr-lg"
          color="primary"
          text-color="black"
          :label="$t('remind_me')"
          size="17px"
          style="width: 200px"
          unelevated
          no-caps
          flat
          @click="remindMe"
        />
        <q-btn
          color="primary"
          text-color="white"
          :label="$t('next')"
          size="17px"
          style="width: 200px"
          unelevated
          no-caps
          @click="$router.push('/confirm')"
        />
      </div>
    </div>

    <div class="flex column justify-start items-start q-ma-lg q-mt-xl" style="width: 15%;">
      <p class="text-body1">
        {{$t('tips')}}:
        <br />
        <br />
        {{$t('store_this')}}
        <br />
        <br />
        {{$t('write_this')}}
        <br />
        <br />
        {{$t('memorize_this')}}
      </p>
    </div>
  </q-page>
</template>

<script>
import StellarHDWallet from "stellar-hd-wallet";
import * as aes256 from "aes256";

export default {
  name: "ConfirmPage",
  data() {
    return {
      seed: "",
    };
  },
  mounted() {
    this.seed = this.generateSeed();
    let pass = this.$store.getters["user/password"];
    let encrypted = aes256.encrypt(pass, this.seed);
    pass = null;
    this.$store.commit("user/updateEncryptedSeed", encrypted);
    this.$store.commit("user/updatePassword", pass);
    let array = this.seed.split(" ");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    this.$store.commit("user/updateRandomPositionedSeed", array)
    const wallet = StellarHDWallet.fromMnemonic(this.seed)
    let account = {
      id: 0,
      name: "Account 1",
      public: wallet.getPublicKey(0),
    }
    this.$store.commit("user/updateAccount", {account, position: 0})

  },
  methods: {
    generateSeed: function () {
      return StellarHDWallet.generateMnemonic({ entropyBits: 128 }); // 128 -> 12 / 160 -> 18 / 224 -> 21 / null -> 24 /
    },
    remindMe: function () {
      this.$router.push("/account");
    },
  },
};
</script>
<style lang="stylus">
.link {
  color: black;
  text-decoration: none;
  font-weight: bold;
}
</style>
