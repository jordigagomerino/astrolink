<template>
  <q-page class="flex justify-start items-start column q-pt-xl">
    <div class="flex column justify-start items-start q-ma-lg" style="width: 50%; margin-left: 25%;">
      <router-link to="/login" class="link">
        <q-icon name="chevron_left" />{{$t('back')}}
      </router-link>
      <h1 class="text-h3" style="margin-top: 10px; margin-bottom: 10px">{{$t('import_with_seed')}}</h1>
      <p class="text-body1">{{$t('enter_your_secret')}}</p>
      <div style="max-width: 300px; width: 100%">
         <q-input v-model="mnemonic" :label="$t('seed_phrase')" type="textarea"  :error-message="error('mnemonic')" :error="$v.mnemonic.$invalid"/>
      <q-input v-model="pass" :label="$t('new_pass')"   type="password" :error-message="error('pass')" :error="$v.pass.$invalid"/>
      <q-input v-model="repass" :label="$t('conf_pass')" class="q-mb-lg" type="password" :error-message="error('repass')" :error="$v.repass.$invalid"/>
      </div>
      <q-checkbox v-model="terms"  class="q-mb-lg" :error-message="error('terms')" :error="$v.terms.$invalid">{{$t('agree')}} <a href="/terms" target="_blank">{{$t('tou')}}</a></q-checkbox>


      <q-btn
        color="primary"
        text-color="white"
        :label="$t('import')"
        size="17px"
        style="width: 200px"
        unelevated
        no-caps
        :disable="$v.$invalid"
      />
    </div>
  </q-page>
</template>

<script>
import StellarHDWallet from 'stellar-hd-wallet'
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
const validMnemonic = (value) => StellarHDWallet.validateMnemonic(value)
export default {
  name: "ImportPage",
  data(){
    return {
      mnemonic: "",
      pass: "",
      repass: "",
      terms: false
    };
  },
  validations: {
    mnemonic: {required, validMnemonic},
    pass: {required, minLength: minLength(8)},
    repass: {required, sameAs: sameAs('pass')},
    terms: {sameAs: sameAs( () => true )}
  },
  methods: {
    error: function (field) {
      if(field === 'mnemonic') {
        if (!this.$v.mnemonic.required) return this.$t('rule.seed_req')
        if (!this.$v.mnemonic.validMnemonic) return this.$t('rule.seed_inv')
      }
      else if(field === 'pass'){
        if (!this.$v.pass.required) return this.$t('rule.pass_req')
        if (!this.$v.pass.minLength) return this.$t('rule.pass_length')
      }
      else if(field === 'repass'){
        if (!this.$v.repass.required) return this.$t('rule.repass_req')
        if (!this.$v.repass.sameAs) return this.$t('rule.repass_same')
      }
      else if(field === 'terms'){
        if (!this.$v.terms.sameAs) return this.$t('rule.accept_terms')
      }
    }
  }
};
</script>
<style lang="stylus">
.link
  color: black
  text-decoration: none
  font-weight: bold
</style>
