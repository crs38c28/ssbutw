<template>
  <v-app>
    <v-layout v-if="!state.loading" style="padding:10px" row wrap>
      <v-flex xs8 class="pr-1">
        <v-layout row wrap class="panel">
          <v-toolbar dark color="primary">
            <v-icon>fas fa-gamepad</v-icon>
            <v-toolbar-title class="white--text">
              {{$t('score.scoreboard')}}
            </v-toolbar-title>
          </v-toolbar>
          <Singles v-if="tournament.playerCount===2"
            :countryList="countryList" :Rep="Rep" :tournament="tournament"
            :playerlist="playerlist" :playerDB="playerDB"/>
          <Doubles v-if="tournament.playerCount===4"
            :countryList="countryList" :Rep="Rep" :tournament="tournament"
            :playerlist="playerlist" :playerDB="playerDB"/>
        </v-layout>
      </v-flex>
      <v-flex xs4 class="pl-1">
        <v-layout row wrap class="panel">
          <v-toolbar dark color="primary">
              <v-icon>fas fa-gamepad</v-icon>
            <v-toolbar-title class="white--text">{{$t('score.info')}}</v-toolbar-title>
          </v-toolbar>
          <v-layout row wrap class="pt-2 pb-2 text-xs-center" style="font-size:1.2rem">
            <v-flex xs12>
              {{$t('score.tournament_name')}}: {{tournament.event}}
            </v-flex>
            <v-flex xs12>
              {{$t('score.tournament_progress')}}: {{tournament.progress}}
            </v-flex>
            <v-flex xs12>
              BEST OF {{tournament.bo}}
            </v-flex>
          </v-layout>
        </v-layout>
        <RuleSetting :Rep="Rep" :tournament="tournament"/>
        <v-expansion-panel>
          <v-expansion-panel-content style="background-color:#FAFAFA;">
            <div slot="header">Replicant Data</div>
            <div class="pa-2">
              {{tournament}}
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12>
        <LocaleSelector/>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
import Singles from '@/components/Singles.vue';
import Doubles from '@/components/Doubles.vue';
import RuleSetting from '@/components/RuleSetting.vue';
import LocaleSelector from '@/components/LocaleSelector.vue';
import FLAGS from '@/data/flags.json';

import {
  REP_TOURNAMENT_DEFAULT, REP_PLAYERDB_DEFAULT, REP_PLAYERLIST_DEFAULT,
} from '@/data/constant';
/* global nodecg,NodeCG */

export default {
  name: 'App',
  components: {
    RuleSetting,
    Singles,
    Doubles,
    LocaleSelector,
  },
  data() {
    return {
      state: {
        loading: true,
      },
      countryList: [],
      playerDB: {},
      playerlist: [],
      tournament: {},
    };
  },
  watch: {
  },
  computed: {
  },
  methods: {
    async waitForReplicants() {
      await NodeCG.waitForReplicants(...Object.values(this.Rep));
      this.state.loading = false;
    },
  },
  created() {
    this.FLAGS = FLAGS;
    this.Rep = {};
    Object.defineProperty(this.FLAGS, '_isVue', { value: true, enumerable: false });
    Object.defineProperty(this.Rep, '_isVue', { value: true, enumerable: false });
    this.Rep.Tournament = nodecg.Replicant('tournament', {
      defaultValue: REP_TOURNAMENT_DEFAULT,
    });
    this.Rep.PlayerList = nodecg.Replicant('playerlist', {
      defaultValue: REP_PLAYERLIST_DEFAULT,
    });
    this.Rep.PlayerDB = nodecg.Replicant('playerDB', {
      defaultValue: REP_PLAYERDB_DEFAULT,
    });
    this.Rep.PlayerDB.on('change', (newValue) => {
      this.playerDB = JSON.parse(JSON.stringify(newValue));
    });
    this.Rep.Tournament.on('change', (newValue) => {
      this.tournament = JSON.parse(JSON.stringify(newValue));
    });
    this.Rep.PlayerList.on('change', (newValue) => {
      this.playerlist = newValue;
    });
    this.waitForReplicants();
    // Set Country Select Items
    this.countryList.push({ text: 'NULL', value: null });
    Object.entries(this.FLAGS).forEach(([flag, country]) => {
      this.countryList.push({ text: `${country} (${flag})`, value: flag });
    });
  },
};
</script>

<style>
  ul{
    padding: 0;
    list-style-type: none;
  }
  #app{
    background-color: #dedede;
  }
  .panel{
    background-color: #fafafa;
  }
  .playername{
    height: 2rem;
    font-size: 2rem;
  }
  .score{
    font-size: 7rem;
  }
  .charaselect{
    width: 20%;
  }
  .charaicon{
    width: 100%;
    padding: 10px 5px 0 5px;
    display: grid;
    grid-template-columns: 1fr 250px 1fr;
    grid-gap: 10px;
    justify-items: center;
    align-items: center;
  }
  .deletename{
    font-size:1.5rem;
  }
</style>
