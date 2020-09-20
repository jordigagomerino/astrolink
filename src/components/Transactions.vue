<template>
  <div id="transactions" class="flex justify-start items-start column q-pt-xs" style="width: 93%">
    <q-card flat style="width: 100%" class="q-mt-xs">
      <q-card-section
        horizontal
        class="flex row justify-between items-center q-pa-xs"
        v-for="transaction in transactions"
        :key="transaction.id"
        @click="openOperation(transaction.id)"
      >
        <div class="q-ml-xs flex row items-center">
          <div style="width: 35px; height: 35px" class="q-mr-md">
            <img
              :src="transaction.asset != undefined? transaction.asset.image: '~/assets/xlm.png'"
              alt
              style="width: 35px"
            />
          </div>
          <div class="flex column justify-start items-start">
            <span
              class="text-body1"
            >{{getName(transaction.type, transaction.type == 'payment'?(transaction.from == account.public?true: false) :null)}}</span>
            <span class="text-body2">
              {{transaction.created_at | formatDate}}
              <span class="text-grey text-subtitle2"></span>
            </span>
          </div>
        </div>

        <div class="flex column justify-end items-end q-mr-xs" v-if="transaction.type == 'payment'">
          <span
            class="text-body1"
          >{{transaction.from == account.public?'-': '+'}} {{transaction.amount}}</span>
          <span
            class="text-body2"
          >${{(parseFloat(transaction.assetPrice)*parseFloat(transaction.amount)).toFixed(2)}}</span>
        </div>
      </q-card-section>
    </q-card>
    <div style="width: 100%; height: 55px" class="flex row justify-center items-center">
      <q-btn outline no-caps color="primary" :label="$t('more')" @click="loadMoreTransactions()"/>
    </div>
  </div>
</template>

<script>
import StellarSDK from "stellar-sdk";
import toml from "toml";
import moment from "moment";
export default {
  name: "PopupTransactions",
  data() {
    return {
      account: {},
      server: null,
      cursor: null,
      transactions: [],
    };
  },
  created() {
    this.server = new StellarSDK.Server(this.$store.getters["user/horizon"]);
    this.account = this.$store.getters["user/account"];
    if (this.account == null || this.account == {}) {
      this.$store.dispatch("user/getAccount", 0).then((account) => {
        this.account = account;
        this.loadTransactions();
      });
    } else {
      this.loadTransactions();
    }
  },
  mounted() {},
  filters: {
    formatDate: (date) => {
      return moment(date).format("D, MMM of YYYY HH:mm");
    },
  },
  methods: {
    openOperation(id){
      window.open(`https://lumenscan.io/ops/${id}`)
    },
    getName(type, send) {
      if (send != null) {
        if (send) {
          return this.$t(`operations.${type}.to`)
        }
        else {
          return this.$t(`operations.${type}.from`)
        }
      } else {
        return this.$t(`operations.${type}`);
      }
    },
    loadTransactions() {
      const account = this.account.public;
      new StellarSDK.Server(this.$store.getters["user/horizon"])
        .operations()
        .forAccount(account)
        .limit(10)
        .order("desc")
        .call()
        .then((res) => {
          this.cursor = res;
          this.processTransactions(res).then((ops) => {
            this.transactions = this.transactions.concat(ops);
          });
        });
    },
    loadMoreTransactions() {
      this.cursor.next().then((res) => {
        this.cursor = res;
        this.processTransactions(res).then((ops) => {
          this.transactions = this.transactions.concat(ops);
        });
      });
    },
    processTransactions(txs) {
      return new Promise((resolve, reject) => {
        let operations = txs.records;
        let promises = [];
        operations.forEach((op) => {
          promises.push(
            new Promise((resolve, reject) => {
              if (op.type != "payment") resolve(op);
              else if (op.asset_type == "native") {
                this.getAssetPrice("native", op.created_at).then((res) => {
                  op.assetPrice = res;
                  resolve(op);
                });
              } else {
                this.getAssetInfo(op.asset_issuer, op.asset_code).then(
                  (data) => {
                    let asset = data;
                    this.getAssetPrice(asset.name, op.created_at).then(
                      (res) => {
                        op.assetPrice = res;
                        op.asset = asset;
                        resolve(op);
                      }
                    );
                  }
                );
              }
            })
          );
        });
        Promise.all(promises).then(resolve).catch(reject);
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
    getAssetPrice(asset, date) {
      let to = "usd";
      if (asset == "native") asset = "stellar";
      return new Promise((resolve, reject) => {
        this.$axios
          .get(
            `https://api.coingecko.com/api/v3/coins/${asset.toLowerCase()}/history?date=${moment(
              date
            ).format("DD-MM-YYYY")}`
          )
          .then((res) => {
            if (res.data.market_data.current_price[to] == null) {
              resolve(0.0);
            } else {
              resolve(res.data.market_data.current_price[to]);
            }
          });
      });
    },
  },
};
</script>
