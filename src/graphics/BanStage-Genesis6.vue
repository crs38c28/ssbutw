<template>
  <v-app>
    <v-layout v-if="!state.loading" column>
      <v-flex xs12>
        <transition-group name="list" tag="ul" class="stages">
          <li v-for="(stage, index) in stages.banPick.ban" :key="'st'+index">
            <v-img class="stages__block stages--ban"
              :src="'../pic/stages/'+parseInt(stage)+'.jpg'">
            </v-img>
          </li>
          <li v-for="(stage, index) in stages.banPick.pick" :key="'cp'+index">
            <v-img class="stages__block stages--pick"
              :src="'../pic/stages/'+parseInt(stage)+'.jpg'">
              <div class="stages__name">
                {{ STAGES[parseInt(stage)] }}
              </div>
            </v-img>
          </li>
        </transition-group>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
import { STAGES, STAGES_DEFAULT } from '@/data/constant';
/* global nodecg,NodeCG */

export default {
  name: 'App',
  data() {
    return {
      state: {
        loading: true,
      },
      stages: {},
    };
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
    this.STAGES = STAGES;
    this.Rep = {};
    Object.defineProperty(this.STAGES, '_isVue', { value: true, enumerable: false });
    Object.defineProperty(this.Rep, '_isVue', { value: true, enumerable: false });
    this.Rep.Stages = nodecg.Replicant('stage', {
      defaultValue: STAGES_DEFAULT,
    });
    this.Rep.Stages.on('change', (newValue) => {
      this.stages = JSON.parse(JSON.stringify(newValue));
    });
    this.waitForReplicants();
  },
};
</script>
<style lang="scss" scoped>
  ul{
    padding: 0;
    list-style-type: none;
  }
  #app, body, html{
    width: 1280px;
    height: 720px;
    overflow: hidden;
    background: none;
  }
  .stages {
    width: 100%;
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fit, 200px);
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
      font-size: 1.3rem;
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
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-to {
    opacity: 0;
    transform: translateX(-100px);
  }
</style>
