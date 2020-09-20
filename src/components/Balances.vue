<template>
  <div id="assets" class="flex justify-start items-start column q-pt-xs" style="width: 93%">
    <q-card flat style="width: 100%" class="q-mt-xs">
      <q-card-section horizontal class="flex row justify-between items-center q-pa-xs">
        <div class="q-ml-xs flex row items-center">
          <div style="width: 35px; height: 35px" class="q-mr-md">
              <img src="~/assets/xlm.png" alt style="width: 35px" />
          </div>

          <div class="flex column justify-start items-start">
            <span class="text-body1">Lumens</span>
            <span class="text-body2">
              XLM
              <span class="text-grey text-subtitle2"></span>
            </span>
          </div>
        </div>

        <div class="flex column justify-end items-end q-mr-xs">
          <span class="text-body1">
            {{
            parseFloat(nativeBalance.balance).toFixed(2)
            }}
          </span>
          <span class="text-body2" v-if="nativeBalance.assetPrice != undefined">
            ${{
            (
            parseFloat(nativeBalance.assetPrice) *
            parseFloat(nativeBalance.balance)
            ).toFixed(2)
            }}
          </span>
          <span class="text-body2" v-else></span>
        </div>
      </q-card-section>
    </q-card>
    <q-card
      flat
      style="width: 100%;"
      class="q-mt-xs"
      v-for="balance in assetBalances"
      :key="balance.asset_code + balance.asset_issuer"
    >
      <q-card-section horizontal class="flex row justify-between items-center q-pa-xs">
        <div class="q-ml-xs flex row items-center">
          <div style="width: 35px; height: 35px" class="q-mr-md">
            <img :src="balance.data.image || ''" alt style="width: 35px" />
          </div>

          <div class="flex column justify-start items-start">
            <span class="text-body1">
              {{
              balance.data.name || "Not Defined"
              }}
            </span>
            <span class="text-body2">
              {{ balance.asset_code }}
              <span class="text-grey text-subtitle2">
                {{
                balance.data.anchor || ""
                }}
              </span>
            </span>
          </div>
        </div>

        <div class="flex column justify-end items-end q-mr-xs">
          <span class="text-body1">{{ parseFloat(balance.balance) }}</span>
          <span class="text-body2">
            ${{
            (
            parseFloat(balance.assetPrice) * parseFloat(balance.balance)
            ).toFixed(2)
            }}
          </span>
        </div>
      </q-card-section>
    </q-card>

    <div style="width: 100%; height: 55px" class="flex row justify-center items-center">
      <q-btn outline no-caps color="primary" :label="$t('add_asset')" />
    </div>
  </div>
</template>

<script>
import StellarSDK from "stellar-sdk";
import toml from "toml";
export default {
  name: "PopupIndex",
  data() {
    return {
      account: {},
      assetBalances: [],
      nativeBalance: {},
      server: null,
      showBalances: false,
    };
  },
  created() {
    this.server = new StellarSDK.Server(this.$store.getters["user/horizon"]);
    this.account = this.$store.getters["user/account"];
    if (this.account == null || this.account == {}) {
      this.$store.dispatch("user/getAccount", 0).then((account) => {
        this.account = account;
        this.loadBalances();
      });
    } else {
      this.loadBalances();
    }
  },
  mounted() {},
  methods: {
    loadBalances() {
      const account = this.account.public;
      new StellarSDK.Server(this.$store.getters["user/horizon"])
        .accounts()
        .accountId(account)
        .call()
        .then((res) => {
          let nativeBalance = res.balances.find(
            (balance) => balance.asset_type == "native"
          );
          let t = this;
          this.getAssetPrice("stellar").then((price) => {
            nativeBalance.assetPrice = price;
            this.nativeBalance = nativeBalance;
          });
          let assetBalances = res.balances;
          let promises = [];
          assetBalances.forEach((balance) => {
            if (balance.asset_type != "native") {
              promises.push(
                new Promise((resolve, reject) => {
                  this.getAssetInfo(
                    balance.asset_issuer,
                    balance.asset_code
                  ).then((data) => {
                    balance.data = data;
                    t.getAssetPrice(balance.data.name).then((price) => {
                      balance.assetPrice = price;
                      resolve(balance);
                    });
                  });
                })
              );
            }
          });

          Promise.all(promises)
            .then((balances) => {
              this.assetBalances = balances;
            })
            .catch(console.log);
        });
    },
    getAssetInfo(assetIssuer, assetCode) {
      return new Promise((resolve, reject) => {
        this.server
          .accounts()
          .accountId(assetIssuer)
          .call()
          .then((res) => {
            let domain = res.home_domain;
            this.$axios
              .get(`https://${domain}/.well-known/stellar.toml`, {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                },
              })
              .then((data) => {
                let parsed = toml
                  .parse(data.data)
                  .CURRENCIES.find(
                    (currency) =>
                      currency.issuer == assetIssuer &&
                      currency.code == assetCode
                  );
                parsed.anchor = domain;
                resolve(parsed);
              });
          });
      });
    },
    getAssetPrice(asset) {
      let to = "usd";
      if (asset == "native") asset = "stellar";
      return new Promise((resolve, reject) => {
        this.$axios
          .get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${asset}&vs_currencies=${to}`
          )
          .then((res) => {
            if (res.data[asset.toLowerCase()] == null) {
              resolve(0.0);
            } else {
              resolve(res.data[asset.toLowerCase()][to]);
            }
          });
      });
    },
  },
};
</script>
