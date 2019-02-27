<template>
  <div v-if="!state.loading" class="scoreboard hidden">
    <div id="board1"></div>
    <div id="container">
      <div id="player1container">
        <div class="score" id="score1">
          <transition name="fade" mode="out-in">
            <div :key="tournament.player[0].score">
              {{tournament.player[0].score}}
            </div>
          </transition>
        </div>
        <div id="triangle1"></div>
        <div class="playerboard" id="player1">
          <div class="playertext">{{playerBoard[0]}}</div>
        </div>
      </div>
      <div id="player2container">
        <div class="score" id="score2">
          <transition name="fade" mode="out-in">
            <div :key="tournament.player[1].score">
              {{tournament.player[1].score}}
            </div>
          </transition>
        </div>
        <div id="triangle2"></div>
        <div class="playerboard" id="player2">
          <div class="playertext">{{playerBoard[1]}}</div>
        </div>
      </div>
    </div>
    <div id="stage">
      <transition name="fade" mode="out-in">
        <div :key="tournament.progress">
          {{tournament.progress}} - BEST OF {{tournament.bo}}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
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
      playerBoard: ['', ''],
      tl: null,
      tournament: REP_TOURNAMENT_DEFAULT,
    };
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
      loopTimeLine.to('.playertext', 0.5, {
        opacity: 0,
        repeat: 0,
        delay: 5,
        onComplete: this.toTwitter,
      })
        .to('.playertext', 0.5, {
          opacity: 1,
          repeat: 0,
          delay: 0,
        })
        .to('.playertext', 0.5, {
          opacity: 0,
          repeat: 0,
          delay: 5,
          onComplete: this.toName,
        })
        .to('.playertext', 0.5, {
          opacity: 1,
          repeat: 0,
          delay: 0,
        });
    },
    toTwitter() {
      this.playerBoard = [`＠${this.tournament.player[0].twitter}`,
        `＠${this.tournament.player[1].twitter}`];
    },
    toName() {
      this.playerBoard = [this.tournament.player[0].displayName,
        this.tournament.player[1].displayName];
    },
  },
  created() {
    this.Rep = {};
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
<style lang="scss" scoped>

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
  width: 780px;
  height: 60px;
  top: 650px;
  left: 250px;
  z-index: 7;
}

#player1container {
  position: absolute;
  width: 215px;
  left: 10px;
  height: 60px;
}

#player2container {
  position: absolute;
  width: 215px;
  left: 504px;
  height: 60px;
}

.playerboard{
  position: absolute;
  width: 125px;
  height: 20px;
  left: 90px;
  top: 17px;
  font-size: 14px;
}

.playertext{
  text-overflow:ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.score{
  position: absolute;
  width:60px;
  height:60px;
  font-size: 40px;
  color: #fff;
  text-align: center;
  text-shadow: 2px 2px 6px #333;
}

#triangle1 {
  position: absolute;
  width: 0;
  height: 0;
  top: 17px;
  left: 56px;
  border-style: solid;
  border-width: 0 0px 20px 34px;
  border-color: transparent transparent #FE3434 transparent;
}

#triangle2 {
  position: absolute;
  width: 0;
  height: 0;
  top: 17px;
  left: 56px;
  border-style: solid;
  border-width: 0 0px 20px 34px;
  border-color: transparent transparent #3477FE transparent;
}

#player1 {
  background-color: #FE3434;
  color: #fff;
}

#player2 {
  background-color: #3477FE;
  color: #fff;
}

#stage {
  position: absolute;
  z-index: 5;
  width: 320px;
  height: 30px;
  top: 5px;
  left: 480px;
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
  border-radius: 3px;
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
