<template>
  <div v-if="!state.loading" class="scoreboard hidden">
    <div id="board1"></div>
    <div id="container">
      <div class="score" id="score1"
           :class="getTeam1Color">
        <transition name="fade" mode="out-in">
          <div :key="tournament.player[0].score">
            {{tournament.player[0].score}}
          </div>
        </transition>
      </div>
      <div v-for="(i,index) in 4" :key="'player'+i"
           :id="'player'+i" class="player">
        <div class="player__triangle"
             :class="'player__triangle--'+tournament.player[index].color"></div>
        <div class="player__board"
             :class="'player--'+tournament.player[index].color">
          <div class="player__text">{{playerBoard[index]}}</div>
        </div>
        <div class="player__flag" :class="'player--'+tournament.player[index].color"
          :style="setFlag(index)"></div>
        <div class="player__board--after" :class="'player--'+tournament.player[index].color"></div>
      </div>
      <div class="score" id="score2"
        :class="getTeam2Color">
        <transition name="fade" mode="out-in">
          <div :key="tournament.player[1].score">
            {{tournament.player[1].score}}
          </div>
        </transition>
      </div>
    </div>
    <div id="stage">
      <transition name="fade" mode="out-in">
        <div :key="tournament.progress">
          {{tournament.progress}}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import FLAGS from '@/data/flags.json';
import { TimelineMax, Power2 } from 'gsap/TweenMax';
import {
  REP_TOURNAMENT_DEFAULT,
} from '@/data/constant';
/* global nodecg,NodeCG */

export default {
  name: 'App',
  data() {
    return {
      state: {
        loading: true,
      },
      playerBoard: ['', '', '', ''],
      tl: null,
      tournament: REP_TOURNAMENT_DEFAULT,
    };
  },
  computed: {
    getTeam1Color() {
      return `score--${this.tournament.player[0].color}`;
    },
    getTeam2Color() {
      if (this.tournament.player[0].color === this.tournament.player[1].color) {
        return `score--${this.tournament.player[2].color}`;
      }
      return `score--${this.tournament.player[1].color}`;
    },
  },
  methods: {
    async waitForReplicants() {
      await NodeCG.waitForReplicants(...Object.values(this.Rep));
      this.state.loading = false;
      this.toName();
      this.$nextTick()
        .then(() => {
          this.setInitAnimation();
        });
    },
    setInitAnimation() {
      // initial Animation
      const initTimeLine = new TimelineMax({ pause: true });
      initTimeLine.to('.hidden', 0.8, {
        opacity: 1,
        repeat: 0,
        ease: Power2.Linear,
        delay: 0.6,
        yoyo: false,
      }, 'targetPoint');
      // Loop Animation (name/twitter change)
      const loopTimeLine = new TimelineMax({ repeat: -1 });
      loopTimeLine.to('.player__text', 0.5, {
        opacity: 0,
        repeat: 0,
        delay: 5,
        onComplete: this.toTwitter,
      })
        .to('.player__text', 0.5, {
          opacity: 1,
          repeat: 0,
          delay: 0,
        })
        .to('.player__text', 0.5, {
          opacity: 0,
          repeat: 0,
          delay: 5,
          onComplete: this.toName,
        })
        .to('.player__text', 0.5, {
          opacity: 1,
          repeat: 0,
          delay: 0,
        });
    },
    toTwitter() {
      this.playerBoard = [`＠${this.tournament.player[0].twitter}`,
        `＠${this.tournament.player[1].twitter}`,
        `＠${this.tournament.player[2].twitter}`,
        `＠${this.tournament.player[3].twitter}`];
    },
    toName() {
      this.playerBoard = [this.tournament.player[0].displayName,
        this.tournament.player[1].displayName,
        this.tournament.player[2].displayName,
        this.tournament.player[3].displayName];
    },
    setFlag(val) {
      const bg = `url('../pic/flag/${this.tournament.player[val].country}.svg')`;
      return {
        'background-size': 'cover',
        'background-image': bg,
        'background-repeat': 'no-repeat',
        'background-position': 'center center',
      };
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
    this.Rep.Tournament.on('change', (newValue) => {
      this.tournament = JSON.parse(JSON.stringify(newValue));
    });
  },
  mounted() {
    this.waitForReplicants();
  },
};
</script>
<style lang="scss">
  @font-face {
    font-family: 'Noto Sans TC';
    font-style: normal;
    font-weight: 400;
    src: url('../css/NotoSansTC-Regular.woff') format('woff');
  }
  body {
    font-family: 'Noto Sans TC';
    margin:0;
    overflow: hidden;
  }
  .scoreboard {
    margin:0px;
    background-color: rgba(255, 255, 255, 0);
    background-repeat: no-repeat;
    font-weight: bold;
    font-size: 14 px;
    color:#050505;
    overflow: hidden;
    width:1280px;
    height:48px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
  }

  #board1 {
    position:absolute;
    z-index: 4;
    top:0px;
    left:0px;
    width:1280px;
    height:720px;
  }

  #container {
    position:absolute;
    width: 1280px;
    height: 60px;
    top: 650px;
    z-index: 7;
  }

  .player {
    position: absolute;
    width: 215px;
    height: 60px;
    &__text{
      text-overflow:ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    &__board{
      position: absolute;
      width: 125px;
      height: 20px;
      left: 40px;
      top: 17px;
      font-size: 14px;
      color: #fff;
    }
    &__triangle {
      position: absolute;
      width: 0;
      height: 0;
      top: 17px;
      border-style: solid;
      border-width: 0 0px 20px 40px;
      &--R {
        border-color: transparent transparent #FE3434 transparent;
      }
      &--G {
        border-color: transparent transparent #18B13F transparent;
      }
      &--B {
        border-color: transparent transparent #3477FE transparent;
      }
      &--Y {
        border-color: transparent transparent #EBB00C transparent;
      }
    }
    &__flag {
      position: absolute;
      width: 40px;
      height: 25px;
      background-color: #000000;
      left: 125px;
      top: 37px;
    }
    &__board--after {
      position: absolute;
      width: 10px;
      height: 45px;
      left: 165px;
      top: 17px;
    }
    &--R {
      background-color: #FE3434;
    }
    &--G {
      background-color: #18B13F;
    }
    &--B {
      background-color: #3477FE;
    }
    &--Y {
      background-color: #EBB00C;
    }
  }

  #player1 {
    left: 170px;
  }

  #player2 {
    left: 442px;
  }

  #player3 {
    left: 715px;
  }

  #player4 {
    left: 986px;
  }

  .score{
    position: absolute;
    width:60px;
    height:60px;
    font-size: 40px;
    color: #000;
    text-align: center;
    background-color: #E7E6EA;
    box-shadow: 2px 2px 7px rgba(0, 0, 0, 0.7);
    &--R:after{
      position: absolute;
      content: '';
      width:60px;
      height:8px;
      top:0;
      left:0;
      background-color: #FE3434;
    }
    &--G:after{
      position: absolute;
      content: '';
      width:60px;
      height:8px;
      top:0;
      left:0;
      background-color: #18B13F;
    }
    &--B:after{
      position: absolute;
      content: '';
      width:60px;
      height:8px;
      top:0;
      left:0;
      background-color: #3477FE;
    }
    &--Y:after{
      position: absolute;
      content: '';
      width:60px;
      height:8px;
      top:0;
      left:0;
      background-color: #EBB00C;
    }
  }
  #score1 {
    left: 10px;
  }

  #score2 {
    right: 10px;
  }

  #stage {
    position: absolute;
    z-index: 5;
    width: 200px;
    height: 30px;
    top: 5px;
    left: 540px;
    font-size: 14px;
    font-weight: normal;
    text-align: center;
    text-transform: uppercase;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2E282D;
    opacity: 0.9;
    :before{
      content: '';
      position: absolute;
      left: -20px;
      top: 0px;
      width:20px;
      height:30px;
      background: linear-gradient(to left,rgba($color:#2E282D, $alpha: 1),
        rgba($color: #2E282D, $alpha: 0));
    }
    :after{
      content: '';
      position: absolute;
      right: -20px;
      top: 0px;
      width:20px;
      height:30px;
      background: linear-gradient(to right,rgba($color:#2E282D, $alpha: 1),
        rgba($color: #2E282D, $alpha: 0));
    }
  }

  .hidden {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s ease-in;
  }
  .fade-enter-to {
    opacity: 1;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
