<template>
  <q-layout view="hHh lpR fFf" class="isBex" style="max-width: 357px; max-height: 600px;">
    <q-header elevated class="bg-white text-black">
      <q-toolbar>
        <q-avatar>
          <img src="~/assets/astrolink-logo-full.svg" />
        </q-avatar>
        <q-space />
        <q-btn-dropdown color="primary" flat :label="accountSelected.name">
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="onAccountClick(account.id)"
              v-for="account in accounts"
              :key="account.public"
            >
              <q-item-section>
                <q-item-label>{{account.name}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="createAccount">
              <q-item-section>
                <q-item-label>Create Account</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <!--<q-select v-model="selectedNetwork" :options="networks" rounded  style="padding: 0px" behavior="menu" transition-show="jump-up" transition-hide="jump-up">
          <template v-slot:prepend>
            <q-icon name="public" />
          </template>


        </q-select>-->
        <q-space />
        <q-avatar>
          <img :src="'data:image/png;base64,' + avatar" />
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" overlay behavior="mobile" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view :account="accountSelected"/>
    </q-page-container>
  </q-layout>
</template>

<script>
import Identicon from "identicon.js";
export default {
  name: "PopupLayout",
  components: {},
  data() {
    return {
      left: false,
      networks: ["Public Network", "Test Network", "Custom Network"],
      accountSelected: { name: "Account", public: null },
      accounts: [],
      avatar: "",
    };
  },
  created() {
    if (localStorage.getItem("encrypted_seed") == null) {
      window.open("index.html#/initialize", "_blank");
    } else {
      this.$store.dispatch("user/getAccount", 0).then((account) => {
        this.avatar = this.generateAvatar(account.public);
        this.accountSelected = account;
        this.$store.commit("user/setAccount", account);
      });

      this.$store.dispatch("user/getAccounts").then((accounts) => {
        this.accounts = accounts;

      });
    }
  },
  methods: {
    onAccountClick(accountNum) {
      this.$store.dispatch("user/getAccount", accountNum).then((account) => {
         this.$store.commit("user/setAccount", account);
        this.accountSelected = account
      });
      this.avatar = this.generateAvatar(this.accountSelected.public);
    },
    createAccount() {},
    generateAvatar(data) {
      let options = {
        foreground: [0, 0, 0, 255], // rgba black
        background: [255, 255, 255, 255], // rgba white
        margin: 0, // 0% margin
        size: 420, // 420px square
        format: "png", // use SVG instead of PNG
      };
      return new Identicon(data, options).toString();
    },
  },
};
</script>
