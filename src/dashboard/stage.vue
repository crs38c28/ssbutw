<template>
  <v-app>
    <v-layout v-if="!state.loading" style="padding:10px" column>
      <v-flex class="panel" xs12>
        <v-expansion-panel>
          <v-expansion-panel-content style="background-color:#FAFAFA;">
            <div slot="header">{{ $t('keywords.config') }}</div>
            <v-layout row wrap justify-space-around
              class="mt-2 mb-2 pa-2 text-xs-center" style="font-size:1.2rem">
              <v-flex xs9>
                <v-text-field
                v-model="formData.stageParam"
                label="EX: 1h-44h-40h-3h-39h_62h-42h-85h-19h-79h-37h"
                required
                ></v-text-field>
                <div>
                  <a href="https://bans.page/" target="_blank">{{$t('stages.banspage')}}</a>
                </div>
                <v-btn @click.stop="setStages()" color="primary">
                  <v-icon left>fas fa-map-marked-alt</v-icon>
                  {{ $t('stages.set') }}
                </v-btn>
              </v-flex>
              <v-flex xs4>
                <v-btn @click.stop="formData.gridSize+=25;" color="primary">
                  <v-icon>fas fa-search-plus</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs4 style="line-height:48px; verticle-align:middle;">
                Size:{{formData.gridSize}}
              </v-flex>
              <v-flex xs4>
                <v-btn @click.stop="formData.gridSize-=25;" color="error">
                  <v-icon>fas fa-search-minus</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <ul class="stages" :style="ResizeGrid">
          <li v-for="(stage, index) in stages.st" :key="'st'+index">
            <v-img class="stages__block" :class="{
              'stages--ban': stages.banPick.ban.indexOf(stage) !== -1,
              'stages--pick': stages.banPick.pick.indexOf(stage) !== -1,
              }"
              :src="'../pic/stages/'+parseInt(stage)+'.jpg'"
              @click.stop="banPick('st',stage)">
              <div class="stages__name">
                {{ STAGES[parseInt(stage)] }}
              </div>
            </v-img>
          </li>
          <li v-for="(stage, index) in stages.cp" :key="'cp'+index">
            <v-img class="stages__block" :class="{
              'stages--ban': stages.banPick.ban.indexOf(stage) !== -1,
              'stages--pick': stages.banPick.pick.indexOf(stage) !== -1,
              }" v-if="stages.counterPick"
              @click.stop="banPick('cp',stage)"
              :src="'../pic/stages/'+parseInt(stage)+'.jpg'">
              <div class="stages__name">
                {{ STAGES[parseInt(stage)] }}
              </div>
            </v-img>
          </li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </v-flex>
      <v-flex xs12>
        <LocaleSelector/>
      </v-flex>
    </v-layout>
    <v-layout row class="buttons">
      <v-btn fab dark large color="blue"
        @click.stop="Rep.Stages.value.counterPick=!stages.counterPick;resetStage();">
        <div v-if="!stages.counterPick">{{ $t('stages.starter') }}</div>
        <div v-if="stages.counterPick">{{ $t('stages.counter') }}</div>
      </v-btn>
      <v-btn fab dark large color="red"
        @click.stop="resetStage()">
        <v-icon>fas fa-redo</v-icon>
      </v-btn>
      <div class="hint">{{ BanPickHint }}</div>
    </v-layout>
  </v-app>
</template>

<script>
import LocaleSelector from '@/components/LocaleSelector.vue';
import { STAGES, STAGES_JP, STAGES_DEFAULT } from '@/data/constant';
/* global nodecg,NodeCG */

export default {
  name: 'App',
  components: {
    LocaleSelector,
  },
  data() {
    return {
      state: {
        loading: true,
        banNumber: 0,
      },
      formData: {
        stageParam: '',
        stageRegex: new RegExp('^([0-9]+h?)$'),
        gridSize: 200,
      },
      stages: {},
    };
  },
  watch: {
    '$i18n.locale': function handel(newValue) {
      if (newValue === 'ja_JP') {
        this.STAGES = STAGES_JP;
        this.resetStage();
      } else {
        this.STAGES = STAGES;
        this.resetStage();
      }
    },
  },
  computed: {
    ResizeGrid() {
      return {
        'grid-template-columns': `repeat(auto-fit, minmax(${this.formData.gridSize}px,1fr))`,
      };
    },
    BanPickHint() {
      if (!this.stages.counterPick) {
        switch (this.state.banNumber) {
          case 0:
            return this.$t('stages.ban_1', ['1', '1']);
          case 1:
            return this.$t('stages.ban_2', ['2', '2', '2']);
          case 2:
            return this.$t('stages.ban_2', ['2', '2', '1']);
          case 3:
            return this.$t('stages.ban_1', ['1', '1']);
          default:
            return '';
        }
      } else {
        switch (this.state.banNumber) {
          case 0:
            return this.$t('stages.ban_2', ['1', '2', '2']);
          case 1:
            return this.$t('stages.ban_2', ['1', '2', '1']);
          case 2:
            return this.$t('stages.pick_1', ['2', '1']);
          default:
            return '';
        }
      }
    },
  },
  methods: {
    async waitForReplicants() {
      await NodeCG.waitForReplicants(...Object.values(this.Rep));
      this.state.loading = false;
    },
    setStages() {
      const stages = this.formData.stageParam;
      const st = stages.split('_')[0].split('-');
      const cp = stages.split('_')[1].split('-');
      if (st.every(x => this.formData.stageRegex.test(x))
        && cp.every(x => this.formData.stageRegex.test(x))) {
        this.Rep.Stages.value.st = st;
        this.Rep.Stages.value.cp = cp;
      }
    },
    banPick(category, stage) {
      if (this.stages.banPick.ban.indexOf(stage) !== -1) {
        return;
      }
      if (!(this.stages.counterPick) && category === 'st') {
        this.state.banNumber += 1;
        if (this.state.banNumber < 4) {
          this.Rep.Stages.value.banPick.ban.push(stage);
        } else if (this.state.banNumber === 4) {
          this.stages.banPick.ban.push(stage);
          this.Rep.Stages.value.banPick.ban.push(stage);
          this.stages.st.forEach((element) => {
            if (this.stages.banPick.ban.indexOf(element) === -1) {
              this.Rep.Stages.value.banPick.pick.push(element);
            }
          });
        }
      } else if (this.stages.counterPick) {
        this.state.banNumber += 1;
        if (this.state.banNumber <= 2) {
          this.Rep.Stages.value.banPick.ban.push(stage);
        } else if (this.state.banNumber === 3) {
          this.Rep.Stages.value.banPick.pick.push(stage);
        }
      }
    },
    resetStage() {
      this.state.banNumber = 0;
      this.Rep.Stages.value.banPick = {
        ban: [],
        pick: [],
      };
    },
  },
  created() {
    this.STAGES = STAGES;
    this.Rep = {};
    Object.defineProperty(this.STAGES, '_isVue', { value: true, enumerable: false });
    Object.defineProperty(this.Rep, '_isVue', { value: true, enumerable: false });
    this.Rep.Stages = nodecg.Replicant('stage', {
      defaultValue: STAGES_DEFAULT,
    });
    this.Rep.Stages.on('change', (newValue, oldValue) => {
      this.stages = JSON.parse(JSON.stringify(newValue));
      this.state.banNumber = this.stages.banPick.ban.length + this.stages.banPick.pick.length;
      if (!oldValue) {
        this.resetStage();
      }
    });
    this.waitForReplicants();
  },
};
</script>
<style lang="scss" scoped>
  @font-face {
    font-family: 'Noto Sans TC';
    font-style: normal;
    font-weight: 400;
    src: url('../css/NotoSansTC-Regular.woff') format('woff');
  }
  ul{
    padding: 0;
    list-style-type: none;
  }
  #app{
    font-family: 'Noto Sans TC';
    background-color: #dedede;
  }
  .stages {
    width: 100%;
    min-height: 90vh;
    display: grid;
    grid-gap: 1rem;
    padding: 10px;
    &__block{
      position: relative;
      border-radius: 5px;
    }
    &__name{
      position: absolute;
      width: 100%;
      bottom:0;
      left:0;
      text-align: center;
      font-size: 2rem;
      color: white;
      font-weight: bold;
      text-shadow: 0px 0px 5px #000;
      pointer-events: none;
    }
    &__block:before{
      position: absolute;
      transition: all 1s;
      content:" ";
      background-repeat: no-repeat;
      background-size: 50% 50%;
      background-position: 50% 50%;
      top:0;
      left:0;
      width:100%;
      height:100%;
      z-index:2;
    }
    &--ban:before{
      background-image: url(../pic/stages/ban.svg);
      background-color: rgba($color: #FE3434, $alpha: 0.4);
    }
    &--pick:before{
      background-image: url(../pic/stages/pick.svg);
      background-color: rgba($color: #3577FF, $alpha: 0.4);
    }
  }
  .panel{
    background-color: #fafafa;
  }
  .buttons{
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .hint{
    background: rgba($color: #000000, $alpha: 0.8);
    color: white;
    font-weight: bold;
    font-size: 2.5rem;
    line-height: 84px;
    vertical-align: middle;
    pointer-events: none;
  }
</style>
