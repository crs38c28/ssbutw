<template>
  <v-flex xs12>
    <v-toolbar dark color="primary">
      <v-icon>fas fa-fist-raised</v-icon>
      <v-toolbar-title class="white--text">{{$t('score.stock_icon')}}</v-toolbar-title>
    </v-toolbar>
    <ul class="charaicon"
      v-for="(rd, rdIndex) in formData.icon.round + 1" :key="'round'+rd">
      <v-autocomplete
      :items="IconCharaList"
      :label="$t('game.use')"
      outline hide-details
      v-model="formData.icon.player[0][rdIndex]"
      ></v-autocomplete>
      <v-radio-group  row hide-details style="margin-top:0"
        v-model="formData.icon.winlose[rdIndex]">
        <v-radio
          label="#1"
          color="red darken-2"
          :value="-1"
        ></v-radio>
        <v-radio
          :label="'G'+rd"
          color="black"
          :value="0"
        ></v-radio>
        <v-radio
          label="#2"
          color="blue darken-2"
          :value="1"
        ></v-radio>
      </v-radio-group>
      <v-autocomplete
      :items="IconCharaList"
      :label="$t('game.use')"
      v-model="formData.icon.player[1][rdIndex]"
      outline hide-details
      ></v-autocomplete>
    </ul>
    <v-flex xs12>
      <v-layout row justify-space-around class="pt-2 pb-2 text-xs-center">
        <div>
          <v-btn color="primary" :disabled="formData.icon.round === 4"
            @click.stop="addStockIcon()">
            <v-icon>
              fas fa-plus-square
            </v-icon>
          </v-btn>
          <v-btn color="error" :disabled="formData.icon.round === 0"
            @click.stop="deleteStockIcon()">
            <v-icon>
              fas fa-minus-square
            </v-icon>
          </v-btn>
        </div>
      </v-layout>
    </v-flex>
  </v-flex>
</template>

<script>

export default {
  name: 'StockIcon',
  props: {
    Rep: Object,
    tournament: Object,
    IconCharaList: Array,
  },
  data() {
    return {
      formData: {
        icon: {
          round: 0,
          winlose: [0, 0, 0, 0, 0],
          player: [
            [null, null, null, null, null],
            [null, null, null, null, null],
          ],
        },
      },
    };
  },
  watch: {
    WatchP1StockIcon: function handler(val, oldVal) {
      let equal = true;
      val.forEach((element, index) => {
        if (element !== oldVal[index]) {
          equal = false;
        }
      });
      if (!equal) {
        this.Rep.Tournament.value.player[0].stock_icon = val;
      }
    },
    WatchP2StockIcon: function handler(val, oldVal) {
      let equal = true;
      val.forEach((element, index) => {
        if (element !== oldVal[index]) {
          equal = false;
        }
      });
      if (!equal) {
        this.Rep.Tournament.value.player[1].stock_icon = val;
      }
    },
    ClearSwapDetect: function handler(val, oldVal) {
      if (!val[0] && !oldVal) {
        this.formData.icon.round = 0;
        this.formData.icon.player = [
          [null, null, null, null, null],
          [null, null, null, null, null],
        ];
      } else if ((oldVal[0] === val[1]) && (oldVal[1] === val[0])) {
        this.setStockIcon(this.tournament.player[0].stock_icon,
          this.tournament.player[1].stock_icon);
      }
    },
  },
  computed: {
    ClearSwapDetect() {
      return [this.tournament.player[0].stock_icon[0], this.tournament.player[1].stock_icon[0]];
    },
    WatchP1StockIcon() {
      const ret = [];
      for (let i = 0; i < 5; i += 1) {
        if (this.formData.icon.player[0][i]) {
          switch (this.formData.icon.winlose[i]) {
            case 1:
              ret.push(`-${this.formData.icon.player[0][i]}`);
              break;
            case -1:
              ret.push(`+${this.formData.icon.player[0][i]}`);
              break;
            case 0:
              if (i <= this.formData.icon.round) {
                ret.push(this.formData.icon.player[0][i]);
              } else {
                ret.push(null);
              }
              break;
            default:
              ret.push(null);
              break;
          }
        } else {
          ret.push(null);
        }
      }
      return ret;
    },
    WatchP2StockIcon() {
      const ret = [];
      for (let i = 0; i < 5; i += 1) {
        if (this.formData.icon.player[1][i]) {
          switch (this.formData.icon.winlose[i]) {
            case 1:
              ret.push(`+${this.formData.icon.player[1][i]}`);
              break;
            case -1:
              ret.push(`-${this.formData.icon.player[1][i]}`);
              break;
            case 0:
              if (i <= this.formData.icon.round) {
                ret.push(this.formData.icon.player[1][i]);
              } else {
                ret.push(null);
              }
              break;
            default:
              ret.push(null);
              break;
          }
        } else {
          ret.push(null);
        }
      }
      return ret;
    },
  },
  methods: {
    setStockIcon(P1Value, P2Value) {
      P1Value.forEach((element, index) => {
        if (!element) {
          this.$set(this.formData.icon.player[0], index, null);
          this.$set(this.formData.icon.winlose, index, 0);
        } else if (element[0] === '-') {
          this.$set(this.formData.icon.player[0], index, element.slice(1));
          this.$set(this.formData.icon.winlose, index, 1);
          this.formData.icon.round = index;
        } else if (element[0] === '+') {
          this.$set(this.formData.icon.player[0], index, element.slice(1));
          this.$set(this.formData.icon.winlose, index, -1);
          this.formData.icon.round = index;
        } else {
          this.$set(this.formData.icon.player[0], index, element);
          this.$set(this.formData.icon.winlose, index, 0);
          this.formData.icon.round = index;
        }
      });
      P2Value.forEach((element, index) => {
        if (!element) {
          this.$set(this.formData.icon.player[1], index, null);
        } else if ((element[0] === '-') || (element[0] === '+')) {
          this.$set(this.formData.icon.player[1], index, element.slice(1));
        } else {
          this.$set(this.formData.icon.player[1], index, element);
        }
      });
    },
    addStockIcon() {
      const player1 = this.formData.icon.player[0];
      const player2 = this.formData.icon.player[1];
      player1[this.formData.icon.round + 1] = player1[this.formData.icon.round];
      player2[this.formData.icon.round + 1] = player2[this.formData.icon.round];
      this.$set(this.formData.icon.winlose, this.formData.icon.round + 1, 0);
      this.formData.icon.round += 1;
    },
    deleteStockIcon() {
      this.formData.icon.player[0][this.formData.icon.round] = null;
      this.formData.icon.player[1][this.formData.icon.round] = null;
      this.$set(this.formData.icon.winlose, this.formData.icon.round, 0);
      this.formData.icon.round -= 1;
    },
  },
  created() {
    this.setStockIcon(this.tournament.player[0].stock_icon,
      this.tournament.player[1].stock_icon);
  },
};
</script>
<style lang="scss" scoped>
</style>
