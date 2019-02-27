<template>
  <v-layout column>
    <v-flex class="pa-2">
      <v-layout row wrap justify-center align-center>
        <v-btn dark color="teal" v-on:click="clearScore()">
          <v-icon left>fas fa-eraser</v-icon>
          {{$t('score.reset')}}
        </v-btn>
        <v-flex xs12>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs8>
          <draggable v-model="formData.player">
            <transition-group name="draggable" class="layout row wrap justify-center align-center">
              <v-flex xs3 v-for="(player, index) in formData.player" :key="'player'+index"
                :class="'bgcolor--'+tournament.player[index].color" class="swap">
                <span class="swap__text">[{{ tournament.player[index].displayName }}]</span>
              </v-flex>
            </transition-group>
          </draggable>
        </v-flex>
        <v-flex xs8 class="pt-1">
          <v-layout row wrap justify-center align-center>
            <v-flex xs3 v-for="(i,index) in 4" :key="'player-color'+index"
              :class="'bgcolor--'+tournament.player[index].color">
              <v-select
                :items="COLOR"
                :label="$t('score.color')"
                v-model="Rep.Tournament.value.player[index].color"
                hide-details
                outline
              ></v-select>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-divider></v-divider>
    </v-flex>
    <v-flex>
      <v-layout row wrap class="pt-2 pb-2 text-xs-center">
        <v-flex xs6 v-for="(i,index) in 2" :key="'doubles-score'+index">
          <v-layout row wrap justify-center align-center>
            <v-flex xs12 class="playername">
              Team #{{getTeamColor(index)}}
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
        </v-flex>
        <v-flex xs6 v-for="(i,index) in 4" :key="'doubles-player'+index" class="pa-3"
          :class="'bgcolor--'+tournament.player[index].color">
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
            <v-flex xs8>
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
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import FIGHTERS from '@/data/fighters.json';
import { COLOR_DEFAULT } from '@/data/constant';
import draggable from 'vuedraggable';

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
    draggable,
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
        },
        {
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
    WatchP3Select: function handler(val) {
      this.fillPlayerData(2, val);
    },
    WatchP4Select: function handler(val) {
      this.fillPlayerData(3, val);
    },
    WatchP1Name: function handler(val) {
      this.Rep.Tournament.value.player[0].displayName = val;
    },
    WatchP2Name: function handler(val) {
      this.Rep.Tournament.value.player[1].displayName = val;
    },
    WatchP3Name: function handler(val) {
      this.Rep.Tournament.value.player[2].displayName = val;
    },
    WatchP4Name: function handler(val) {
      this.Rep.Tournament.value.player[3].displayName = val;
    },
  },
  computed: {
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
      return ret;
    },
    WatchP3Name() {
      const player = this.formData.player[2];
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
    WatchP4Name() {
      const player = this.formData.player[3];
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
    WatchP1Select() {
      return this.formData.player[0].tag;
    },
    WatchP2Select() {
      return this.formData.player[1].tag;
    },
    WatchP3Select() {
      return this.formData.player[2].tag;
    },
    WatchP4Select() {
      return this.formData.player[3].tag;
    },
  },
  methods: {
    getTeamColor(index) {
      if (index === 0) {
        return this.tournament.player[0].color;
      }
      if (this.tournament.player[0].color === this.tournament.player[1].color) {
        return this.tournament.player[2].color;
      }
      return this.tournament.player[1].color;
    },
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
        player.name = this.playerDB[tag].name;
        player.prefix = this.playerDB[tag].prefix;
        this.Rep.Tournament.value.player[index].twitter = this.playerDB[tag].twitter;
        this.Rep.Tournament.value.player[index].country = this.playerDB[tag].country;
        this.Rep.Tournament.value.player[index].displayName = this.ShowPlayerName(index);
      } else {
        player.name = '';
        player.prefix = '';
        this.Rep.Tournament.value.player[index].twitter = '';
        this.Rep.Tournament.value.player[index].country = '';
        this.Rep.Tournament.value.player[index].displayName = this.ShowPlayerName(index);
      }
    },
    clearScore() {
      this.Rep.Tournament.value.player[0].score = 0;
      this.Rep.Tournament.value.player[1].score = 0;
      this.Rep.Tournament.value.player[2].score = 0;
      this.Rep.Tournament.value.player[3].score = 0;
    },
  },
  created() {
    this.COLOR = COLOR_DEFAULT;
    this.FIGHTERS = FIGHTERS;
    Object.defineProperty(this.FIGHTERS, '_isVue', { value: true, enumerable: false });
    Object.defineProperty(this.COLOR, '_isVue', { value: true, enumerable: false });
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
  .bgcolor{
    &--R{
      background-color: rgba($color: #FE3434, $alpha: 0.3);
    }
    &--G{
      background-color: rgba($color: #18B13F, $alpha: 0.3);
    }
    &--B{
      background-color: rgba($color: #3477FE, $alpha: 0.3);
    }
    &--Y{
      background-color: rgba($color: #EBB00C, $alpha: 0.3);
    }
  }
  .draggable-move {
    transition: transform 1s;
  }
  .swap{
    border: solid 1px;
    padding: 20px 10px;
    font-size: 1rem;
    line-height: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: move;
    &__text{
      pointer-events: none;
    }
  }
</style>
