<template>
<v-layout row wrap class="panel">
  <v-toolbar dark color="primary">
      <v-icon>fas fa-gamepad</v-icon>
    <v-toolbar-title class="white--text">{{$t('score.rule')}}</v-toolbar-title>
  </v-toolbar>
  <v-layout row wrap class="pt-2 pb-2 text-xs-center" justify-space-around>
    <v-flex xs10>
      <v-text-field
      v-model="formData.tournament_name"
      :label="$t('score.tournament_name')"
      ></v-text-field>
    </v-flex>
    <v-flex xs6 class="pl-2 pr-2">
      <v-select
        :items="OPTIONS.playerCount"
        :label="$t('score.tournament_progress')"
        v-model="formData.playerCount"
      ></v-select>
    </v-flex>
    <v-flex xs12>
      <v-divider></v-divider>
    </v-flex>
    <v-flex xs3>
      <v-checkbox
        v-model="formData.progress_custom"
        :label="$t('score.use_custom')"
      ></v-checkbox>
    </v-flex>
    <v-flex xs8>
      <v-text-field
      v-model="formData.tournament_progress"
      :disabled="!formData.progress_custom"
      :label="$t('score.tournament_progress')"
      ></v-text-field>
    </v-flex>
    <v-flex xs6 class="pl-2 pr-2">
      <v-select
        :items="OPTIONS.winloselist"
        :label="$t('score.winlose')"
        :disabled="(formData.progress===OPTIONS.FINAL)||formData.progress_custom"
        v-model="formData.winlose"
      ></v-select>
    </v-flex>
    <v-flex xs6 class="pl-2 pr-2">
      <v-select
        :items="OPTIONS.progresslist"
        :disabled="formData.progress_custom"
        :label="$t('score.tournament_progress')"
        v-model="formData.progress"
      ></v-select>
    </v-flex>
    <v-flex xs10 offset-xs1>
      <v-select
        :items="OPTIONS.finallist"
        :label="$t('score.gf_loser')"
        :disabled="(formData.progress!==OPTIONS.FINAL)||(formData.progress_custom)"
        v-model="formData.final"
      ></v-select>
    </v-flex>
    <v-flex xs12>
      <v-divider></v-divider>
    </v-flex>
    <v-flex xs10 offset-xs1>
      <v-select
        :items="OPTIONS.bolist"
        label="BEST OF __"
        v-model="formData.bo"
      ></v-select>
    </v-flex>
    <v-flex xs12>
      <v-btn dark color="teal" v-on:click="updateRule()">
        <v-icon left>fas fa-sync-alt</v-icon>
        {{$t('score.update')}}
      </v-btn>
    </v-flex>
  </v-layout>
</v-layout>
</template>

<script>
import OPTIONS from '@/data/rules.json';

export default {
  name: 'RuleSetting',
  props: {
    Rep: Object,
    tournament: Object,
  },
  data() {
    return {
      formData: {
        winlose: 0,
        final: 0,
        playerCount: 0,
        progress_custom: false,
        progress: 0,
        bo: 3,
        tournament_name: '',
        tournament_progress: '',
      },
    };
  },
  methods: {
    updateRule() {
      let tmpProgress = '';
      this.Rep.Tournament.value.event = this.formData.tournament_name;
      this.Rep.Tournament.value.playerCount = this.formData.playerCount;
      if (this.formData.progress_custom) {
        this.Rep.Tournament.value.progress = this.formData.tournament_progress;
        this.Rep.Tournament.value.final = 0;
      } else {
        if ((this.formData.winlose !== 0) && ((this.formData.progress !== this.OPTIONS.FINAL))) {
          tmpProgress += this.OPTIONS.winloselist.find(
            x => x.value === this.formData.winlose,
          ).text;
          tmpProgress += ' ';
        }
        if (this.formData.progress !== 0) {
          tmpProgress += this.OPTIONS.progresslist.find(
            x => x.value === this.formData.progress,
          ).text;
        }
        this.Rep.Tournament.value.progress = tmpProgress;
        if (this.formData.progress === this.OPTIONS.FINAL) {
          this.Rep.Tournament.value.final = this.formData.final;
        } else {
          this.Rep.Tournament.value.final = 0;
        }
        this.Rep.Tournament.value.bo = this.formData.bo;
      }
    },
  },
  created() {
    this.OPTIONS = OPTIONS;
    Object.defineProperty(this.OPTIONS, '_isVue', { value: true, enumerable: false });
    this.formData.tournament_name = this.tournament.event;
    this.formData.playerCount = this.tournament.playerCount;
  },
};
</script>

<style lang="scss" scoped>
</style>
