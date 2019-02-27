<template>
  <v-layout column>
    <v-flex class="pa-2">
      <v-layout row wrap justify-center align-center>
        <v-btn dark color="teal" v-on:click="clearScore()">
          <v-icon left>fas fa-eraser</v-icon>
          {{$t('score.reset')}}
        </v-btn>
        <v-btn dark color="teal" v-on:click="swapPlayer()">
          <v-icon left>fas fa-exchange-alt</v-icon>
          {{$t('score.swap')}}
        </v-btn>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-divider></v-divider>
    </v-flex>
    <v-flex>
      <v-layout row wrap class="pt-2 pb-2 text-xs-center">
        <v-flex xs6 v-for="(i,index) in 2" :key="'singles'+i">
          <v-layout row wrap justify-center align-center>
            <v-flex xs12 class="playername">
              {{ tournament.player[index].displayName }}
            </v-flex>
            <v-flex xs3 class="score">{{tournament.player[index].score}}</v-flex>
            <v-flex xs3>
              <v-btn large color="primary"
                v-on:click="Rep.Tournament.value.player[index].score += 1">
                <v-icon>fas fa-caret-up</v-icon>
              </v-btn>
              <v-btn large color="error" v-on:click="
                Rep.Tournament.value.player[index].score !==0 ?
                Rep.Tournament.value.player[index].score -= 1 : null">
                  <v-icon>fas fa-caret-down</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-flex xs12 class="pl-3 pr-3">
            <v-layout row wrap justify-center align-center>
              <v-flex xs6 class="pl-2 pr-2">
                <v-autocomplete
                :items="playerlist"
                :label="$t('players.player')+'#'+i"
                v-model="formData.player[index].tag"
                color="black"
                outline
                ></v-autocomplete>
              </v-flex>
              <v-flex xs6 class="pl-2 pr-2">
                <v-text-field
                  :label="$t('players.twitter')"
                  v-model="Rep.Tournament.value.player[index].twitter"
                  outline
                ></v-text-field>
              </v-flex>
              <v-flex xs3>
                <v-checkbox
                  style="margin:0"
                  v-model="formData.player[index].nameSelect"
                  :label="$t('score.use_custom')"
                ></v-checkbox>
              </v-flex>
              <v-flex xs9>
                <v-text-field
                  :label="$t('score.custom_name')+'/'+$t('players.name')"
                  :disabled="!formData.player[index].nameSelect"
                  v-model="formData.player[index].name"
                  outline
                ></v-text-field>
              </v-flex>
              <v-flex xs5 class="pr-1">
                <v-text-field
                  :label="$t('players.prefix')"
                  v-model="formData.player[index].prefix"
                  outline
                ></v-text-field>
              </v-flex>
              <v-flex xs7>
                <v-autocomplete
                :items="countryList"
                :label="$t('players.country')"
                v-model="Rep.Tournament.value.player[index].country"
                outline
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-flex>
    <StockIcon :Rep="Rep" :tournament="tournament" :IconCharaList="IconCharaList"/>
  </v-layout>
</template>

<script>
import StockIcon from '@/components/StockIcon.vue';
import FIGHTERS from '@/data/fighters.json';

export default {
  name: 'Singles',
  props: {
    Rep: Object,
    tournament: Object,
    countryList: Array,
    playerlist: Array,
    playerDB: Object,
  },
  components: {
    StockIcon,
  },
  data() {
    return {
      formData: {
        player: [{
          nameSelect: false,
          tag: '',
          name: '',
          prefix: '',
        },
        {
          nameSelect: false,
          tag: '',
          name: '',
          prefix: '',
        }],
      },
    };
  },
  watch: {
    WatchP1Select: function handler(val) {
      this.fillPlayerData(0, val);
    },
    WatchP2Select: function handler(val) {
      this.fillPlayerData(1, val);
    },
    WatchP1Name: function handler(val) {
      this.Rep.Tournament.value.player[0].displayName = val;
    },
    WatchP2Name: function handler(val) {
      this.Rep.Tournament.value.player[1].displayName = val;
    },
  },
  computed: {
    IconCharaList() {
      return this.genCharaList(this.formData.player[0].tag, this.formData.player[1].tag);
    },
    WatchP1Name() {
      const player = this.formData.player[0];
      let ret = '';
      if (player.prefix) {
        ret += player.prefix;
        ret += '｜';
      }
      if (!player.nameSelect) {
        ret += player.tag;
      } else {
        ret += player.name;
      }
      switch (this.tournament.final) {
        case 2:
        case 3:
          ret += ' [L]';
          break;
        case 1:
        default:
          break;
      }
      return ret;
    },
    WatchP2Name() {
      const player = this.formData.player[1];
      let ret = '';
      if (player.prefix) {
        ret += player.prefix;
        ret += '｜';
      }
      if (!player.nameSelect) {
        ret += player.tag;
      } else {
        ret += player.name;
      }
      switch (this.tournament.final) {
        case 1:
        case 3:
          ret += ' [L]';
          break;
        case 2:
        default:
          break;
      }
      return ret;
    },
    WatchP1Select() {
      return this.formData.player[0].tag;
    },
    WatchP2Select() {
      return this.formData.player[1].tag;
    },
  },
  methods: {
    ShowPlayerName(index) {
      const player = this.formData.player[index];
      let ret = '';
      if (player.prefix) {
        ret += player.prefix;
        ret += '｜';
      }
      if (!player.nameSelect) {
        ret += player.tag;
      } else {
        ret += player.name;
      }
      return ret;
    },
    fillPlayerData(index, tag) {
      const player = this.formData.player[index];
      if (this.playerDB[tag]) {
        player.nameSelect = false;
        player.name = this.playerDB[tag].name;
        player.prefix = this.playerDB[tag].prefix;
        this.Rep.Tournament.value.player[index].twitter = this.playerDB[tag].twitter;
        this.Rep.Tournament.value.player[index].country = this.playerDB[tag].country;
        this.Rep.Tournament.value.player[index].displayName = this.ShowPlayerName(index);
      } else {
        player.nameSelect = false;
        player.name = '';
        player.prefix = '';
        this.Rep.Tournament.value.player[index].twitter = '';
        this.Rep.Tournament.value.player[index].country = '';
        this.Rep.Tournament.value.player[index].displayName = this.ShowPlayerName(index);
      }
    },
    winnerLoserSide(index) {
      switch (this.tournament.final) {
        case 1:
          if (index === 1) {
            return ' [L]';
          }
          return '';
        case 2:
          if (index === 1) {
            return '';
          }
          return ' [L]';
        case 3:
          return ' [L]';
        default:
          break;
      }
      return '';
    },
    genCharaList(P1tag, P2tag) {
      const arr = [];
      let playercharaArr = [];
      let playerchara = null;
      if (this.playerDB[P1tag] && this.playerDB[P1tag].fighters.length !== 0) {
        playercharaArr = [...this.playerDB[P1tag].fighters];
      }
      if (this.playerDB[P2tag] && this.playerDB[P2tag].fighters.length !== 0) {
        playercharaArr = [...playercharaArr, ...this.playerDB[P2tag].fighters];
      }
      if (playercharaArr.length > 0) {
        playerchara = new Set(playercharaArr);
      }
      arr.push({ text: 'NULL', value: null });
      Object.entries(this.FIGHTERS).forEach(([id]) => {
        if (this.$i18n.locale === 'zh_Hant_TW' || this.$i18n.locale === 'ja_JP') {
          // add English name
          if (playerchara && playerchara.has(id)) {
            arr.unshift({ text: `${this.$t(`fighters.${id}.name`)} (${this.$i18n.messages.en_US.fighters[id].name})`, value: id });
          } else {
            arr.push({ text: `${this.$t(`fighters.${id}.name`)} (${this.$i18n.messages.en_US.fighters[id].name})`, value: id });
          }
        } else if (playerchara && playerchara.has(id)) {
          arr.unshift({ text: `${this.$t(`fighters.${id}.name`)}`, value: id });
        } else {
          arr.push({ text: `${this.$t(`fighters.${id}.name`)}`, value: id });
        }
      });
      return arr;
    },
    clearScore() {
      this.Rep.Tournament.value.player[0].score = 0;
      this.Rep.Tournament.value.player[1].score = 0;
      this.Rep.Tournament.value.player[0].stock_icon = [null, null, null, null, null];
      this.Rep.Tournament.value.player[1].stock_icon = [null, null, null, null, null];
    },
    swapPlayer() {
      [this.Rep.Tournament.value.player[0],
        this.Rep.Tournament.value.player[1]] = [this.Rep.Tournament.value.player[1],
        this.Rep.Tournament.value.player[0]];
      [this.formData.player[0],
        this.formData.player[1]] = [this.formData.player[1], this.formData.player[0]];
      if (this.Rep.Tournament.value.final === 1) {
        this.Rep.Tournament.value.final = 2;
      } else if (this.Rep.Tournament.value.final === 2) {
        this.Rep.Tournament.value.final = 1;
      }
    },
  },
  created() {
    this.FIGHTERS = FIGHTERS;
    Object.defineProperty(this.FIGHTERS, '_isVue', { value: true, enumerable: false });
    this.tournament.player.forEach((element, index) => {
      if (element.displayName !== '') {
        this.formData.player[index].nameSelect = true;
        this.formData.player[index].name = element.displayName;
      }
    });
  },
};
</script>
<style lang="scss" scoped>
</style>
