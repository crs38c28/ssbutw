<template>
  <div v-if="!state.loading" class="scoreboard">
    <div class="board" id="board__middle"></div>
    <div class="board" id="board__left"></div>
    <div class="board" id="board__right"></div>
    <div class="board" id="board__stock"></div>
    <div id="container" class="hidden">
      <div id="stock">
        <div id="stock1">
          <transition name="fade" mode="out-in">
            <div :key="'P1-4'+tournament.player[0].stock_icon[4]" class="icon"
            :style="StockIcon(tournament.player[0].stock_icon[4])"></div>
          </transition>
          <transition name="fade" mode="out-in">
            <div :key="'P1-3'+tournament.player[0].stock_icon[3]" class="icon"
            :style="StockIcon(tournament.player[0].stock_icon[3])"></div>
          </transition>
          <transition name="fade" mode="out-in">
            <div :key="'P1-2'+tournament.player[0].stock_icon[2]" class="icon"
            :style="StockIcon(tournament.player[0].stock_icon[2])"></div>
          </transition>
          <transition name="fade" mode="out-in">
            <div :key="'P1-1'+tournament.player[0].stock_icon[1]" class="icon"
            :style="StockIcon(tournament.player[0].stock_icon[1])"></div>
          </transition>
          <transition name="fade" mode="out-in">
            <div :key="'P1-0'+tournament.player[0].stock_icon[0]" class="icon"
            :style="StockIcon(tournament.player[0].stock_icon[0])"></div>
          </transition>
        </div>
        <div id="stock2">
          <transition name="fade" mode="out-in">
            <div :key="'P2-0'+tournament.player[1].stock_icon[0]" class="icon"
            :style="StockIcon(tournament.player[1].stock_icon[0])"></div>
          </transition>
          <transition name="fade" mode="out-in">
            <div :key="'P2-1'+tournament.player[1].stock_icon[1]" class="icon"
            :style="StockIcon(tournament.player[1].stock_icon[1])"></div>
          </transition>
          <transition name="fade" mode="out-in">
            <div :key="'P2-2'+tournament.player[1].stock_icon[2]" class="icon"
            :style="StockIcon(tournament.player[1].stock_icon[2])"></div>
          </transition>
          <transition name="fade" mode="out-in">
            <div :key="'P2-3'+tournament.player[1].stock_icon[3]" class="icon"
            :style="StockIcon(tournament.player[1].stock_icon[3])"></div>
          </transition>
          <transition name="fade" mode="out-in">
            <div :key="'P2-4'+tournament.player[1].stock_icon[4]" class="icon"
            :style="StockIcon(tournament.player[1].stock_icon[4])"></div>
          </transition>
        </div>
      </div>
      <div id="score1">
        <transition name="fade" mode="out-in">
          <div class="score" :key="tournament.player[0].score" :style="P1Score">
          </div>
        </transition>
        <div class="score--after" :style="BoScore"></div>
      </div>
      <div id="score2">
        <transition name="fade" mode="out-in">
          <div class="score" :key="tournament.player[1].score" :style="P2Score">
          </div>
        </transition>
        <div class="score--after" :style="BoScore"></div>
      </div>
      <div class="playerboard" id="player1">{{playerBoard[0]}}</div>
      <div class="playerboard" id="player2">{{playerBoard[1]}}</div>
      <div id="stage">
        <transition name="fade" mode="out-in">
          <div :key="tournament.progress">
            {{tournament.progress}}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import FIGHTERS from '@/data/fighters.json';
import OPTIONS from '@/data/rules.json';
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
  computed: {
    BoScore() {
      const bg = `url('../pic/score-board/UMEBURA/bo${this.tournament.bo}-0.png')`;
      return {
        'background-size': 'contain',
        'background-image': bg,
        'background-repeat': 'no-repeat',
        'background-position': 'center center',
      };
    },
    P1Score() {
      const bg = `url('../pic/score-board/UMEBURA/bo${this.tournament.bo}-${this.tournament.player[0].score}.png')`;
      return {
        'background-size': 'contain',
        'background-image': bg,
        'background-repeat': 'no-repeat',
        'background-position': 'center center',
      };
    },
    P2Score() {
      const bg = `url('../pic/score-board/UMEBURA/bo${this.tournament.bo}-${this.tournament.player[1].score}.png')`;
      return {
        'background-size': 'contain',
        'background-image': bg,
        'background-repeat': 'no-repeat',
        'background-position': 'center center',
      };
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
    StockIcon(value) {
      let bg = null;
      if (!value) {
        return {};
      }
      if (value[0] === '-') {
        bg = `url('../pic/stock-icons/${this.FIGHTERS[value.slice(1)].file}.svg')`;
        return {
          'background-size': 'contain',
          'background-image': bg,
          'background-repeat': 'no-repeat',
          'background-position': 'center center',
          opacity: 0.5,
        };
      }
      if (value[0] === '+') {
        bg = `url('../pic/stock-icons/${this.FIGHTERS[value.slice(1)].file}.svg')`;
        return {
          'background-size': 'contain',
          'background-image': bg,
          'background-repeat': 'no-repeat',
          'background-position': 'center center',
        };
      }
      bg = `url('../pic/stock-icons/${this.FIGHTERS[value].file}.svg')`;
      return {
        'background-size': 'contain',
        'background-image': bg,
        'background-repeat': 'no-repeat',
        'background-position': 'center center',
      };
    },
    setInitAnimation() {
      // initial Animation
      const initTimeLine = new TimelineMax({ pause: true });
      initTimeLine.to('#board__middle', 0.2, {
        top: '0px',
        repeat: 0,
        ease: Power2.Linear,
        delay: 0,
        yoyo: false,
      })
        .to('#board__left', 0.2, {
          top: '0px',
          repeat: 0,
          ease: Power2.Linear,
          delay: 0,
          yoyo: false,
        }, 'targetPoint')
        .to('#board__right', 0.2, {
          top: '0px',
          repeat: 0,
          ease: Power2.Linear,
          delay: 0,
          yoyo: false,
        }, 'targetPoint')
        .to('#board__stock', 0.2, {
          top: '0px',
          repeat: 0,
          ease: Power2.Linear,
          delay: 0,
          yoyo: false,
        })
        .to('.hidden', 0.8, {
          opacity: 1,
          repeat: 0,
          ease: Power2.Linear,
          delay: 0.1,
          yoyo: false,
        });
      // Loop Animation (name/twitter change)
      const loopTimeLine = new TimelineMax({ repeat: -1 });
      loopTimeLine.to('.playerboard', 0.5, {
        opacity: 0,
        repeat: 0,
        delay: 5,
        onComplete: this.toTwitter,
      })
        .to('.playerboard', 0.5, {
          opacity: 1,
          repeat: 0,
          delay: 0,
        })
        .to('.playerboard', 0.5, {
          opacity: 0,
          repeat: 0,
          delay: 5,
          onComplete: this.toName,
        })
        .to('.playerboard', 0.5, {
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
    this.OPTIONS = OPTIONS;
    this.FIGHTERS = FIGHTERS;
    this.Rep = {};
    Object.defineProperty(this.OPTIONS, '_isVue', { value: true, enumerable: false });
    Object.defineProperty(this.FIGHTERS, '_isVue', { value: true, enumerable: false });
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

  #container {
    width:1280px;
    height:48px;
    position: absolute;
    top:0;
    left:0;
    z-index: 7;
  }

  .board{
    width:1280px;
    height:720px;
    background-repeat: no-repeat;
    position:absolute;
  }

  #board{
    &__middle {
      z-index: 4;
      top:-50px;
      left:0px;
      background-image:url('../pic/score-board/UMEBURA/Scoreboard01.png');
    }
    &__left {
      z-index: 3;
      top:-50px;
      background-image:url('../pic/score-board/UMEBURA/Scoreboard03.png');
    }
    &__right {
      z-index: 3;
      top:-50px;
      background-image:url('../pic/score-board/UMEBURA/Scoreboard04.png');
    }
    &__stock {
      z-index: 2;
      top:-50px;
      background-image:url('../pic/score-board/HIROSUMA/stock_board.png');
    }
  }

  #score1 {
    position: absolute;
    z-index: 5;
    width: 52px;
    height: 25px;
    left: 503px;
    top: 4px;
    text-align: center;
    font-size: 25px;
    color: #fff;
  }

  #score2 {
    position: absolute;
    z-index: 5;
    width: 52px;
    height: 25px;
    right: 507px;
    top: 4px;
    text-align: center;
    font-size: 25px;
    color: #fff;
    transform: scaleX(-1);
  }

  #player1 {
    position: absolute;
    z-index: 5;
    width: 230px;
    height: 30px;
    left: 280px;
    font-size: 18px;
    color: #fff;
    text-align: center;
    text-overflow:ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  #player2 {
    position: absolute;
    z-index: 5;
    width: 230px;
    height: 30px;
    right: 280px;
    font-size: 18px;
    color: #fff;
    text-align: center;
    text-overflow:ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  #stage {
    position: absolute;
    z-index: 5;
    width: 180px;
    height: 30px;
    top: 5px;
    left: 550px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    color: #fff;
  }

  #stock {
    position: absolute;
    width: 1064px;
    height: 30px;
    left: 108px;
  }

  #stock1 {
    position: absolute;
    width: 156px;
    height: 30px;
    left: 0px;
    display: flex;
    justify-content: space-around;
  }

  #stock2 {
    position: absolute;
    width: 156px;
    height: 30px;
    right: 0px;
    display: flex;
    justify-content: space-around;
  }

  .icon {
    width: 30px;
    height: 30px;
    filter: drop-shadow( 3px 3px rgba(0, 0, 0, .9));
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
  .score{
    position : absolute;
    width: 52px;
    height: 29px;
    z-index:7;
    &--after{
      z-index:6;
      width: 52px;
      height: 29px;
      position: absolute;
      top: 0;
    }
  }
</style>
