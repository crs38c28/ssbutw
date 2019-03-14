<template>
  <div v-if="!state.loading">
    <div id="board">
      <div id="bg"></div>
      <div id="cobgL"></div>
      <div id="cobgR"></div>
      <transition name="fade" mode="out-in">
        <div id="charaL" :key="P1" :style="P1chara"></div>
      </transition>
      <transition name="fade" mode="out-in">
        <div id="charaR" :key="P2" :style="P2chara"></div>
      </transition>
      <div id="coL"></div>
      <div id="coR"></div>
      <div id="boardtop">
        <transition name="fade" mode="out-in">
          <div id="pName1" :key="tournament.player[0].displayName">
            {{tournament.player[0].displayName}}
          </div>
        </transition>
        <transition name="fade" mode="out-in">
          <div id="pName2" :key="tournament.player[1].displayName">
            {{tournament.player[1].displayName}}
          </div>
        </transition>
        <transition name="fade" mode="out-in">
          <div id="number">
            {{TournamentNumber}}
          </div>
        </transition>
        <div id="date">
          {{nowDate}}
        </div>
        <transition name="fade" mode="out-in">
          <div id="place" :key="tournament.location">
            {{tournament.location}}
          </div>
        </transition>
        <transition name="fade" mode="out-in">
          <div id="bracket" :key="tournament.progress">
            {{tournament.progress}}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
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
      tournament: REP_TOURNAMENT_DEFAULT,
    };
  },
  computed: {
    nowDate() {
      const date = new Date();
      const d = (`0${date.getDate()}`).slice(-2);
      const m = (`0${date.getMonth() + 1}`).slice(-2);
      const y = date.getFullYear();
      return `${y}/${m}/${d}`;
    },
    P1() {
      let P1 = 0;
      for (let i = 4; i >= 0; i -= 1) {
        if (this.tournament.player[0].stock_icon[i] !== null) {
          if (this.tournament.player[0].stock_icon[i][0] === '-'
            || this.tournament.player[0].stock_icon[i][0] === '+') {
            P1 = this.tournament.player[0].stock_icon[i].slice(1);
          } else {
            P1 = this.tournament.player[0].stock_icon[i];
          }
          break;
        }
      }
      return P1;
    },
    P2() {
      let P2 = 0;
      for (let i = 4; i >= 0; i -= 1) {
        if (this.tournament.player[1].stock_icon[i] !== null) {
          if (this.tournament.player[1].stock_icon[i][0] === '-'
            || this.tournament.player[1].stock_icon[i][0] === '+') {
            P2 = this.tournament.player[1].stock_icon[i].slice(1);
          } else {
            P2 = this.tournament.player[1].stock_icon[i];
          }
          break;
        }
      }
      return P2;
    },
    P1chara() {
      const bg = `url('../pic/score-board/HIROSUMA/standings/${this.P1}.png')`;
      return {
        'background-image': bg,
        'background-repeat': 'no-repeat',
        'background-position': 'left center',
      };
    },
    P2chara() {
      const bg = `url('../pic/score-board/HIROSUMA/standings/${this.P2}.png')`;
      return {
        'background-image': bg,
        'background-repeat': 'no-repeat',
        'background-position': 'left center',
      };
    },
    TournamentNumber() {
      const ret = this.tournament.event.match('#[0-9]*$');
      if (ret.length > 0) {
        return ret[0];
      }
      return '';
    },
  },
  methods: {
    async waitForReplicants() {
      await NodeCG.waitForReplicants(...Object.values(this.Rep));
      this.state.loading = false;
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
<style lang="scss">
  body {
    margin:0px;
    background-color: rgba(0, 0, 0, 0);
    font-family: 'Noto Sans CJK JP Heavy','OmePlus P Gothic medium',
      '07鉄瓶ゴシック','なごみ極細ゴシック 特細','JFドットM+H12','ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro',
      Arial,'メイリオ', Meiryo, Osaka, 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif;
    color:#FFFFFF;
    word-break: break-all;
  }

  #board {
    position:absolute;
    top:0px;
    left:0px;
    width:1280px;
    height:720px;
    background-image:url('../pic/score-board/HIROSUMA/thumbnail/BG.png');
  }

  #pName1 {
    position:absolute;
    left:0px;
    top:6px;
    width: 100%;
    max-width: 622px;
    padding:0px;
    font-size:56px;
    text-align: center;
    color:#FFF;
    letter-spacing: -5px;
    transform: skewY(-2.2deg);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #pName2 {
    position:absolute;
    right:0px;
    top:6px;
    width: 100%;
    max-width: 622px;
    padding:0px;
    font-size:56px;
    font-weight: 700;
    text-align: center;
    color:#FFF;
    letter-spacing: -5px;
    transform: skewY(-2.2deg);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #bg{
    position:absolute;
    width:1280px;
    height:720px;
    left: 0px;
    top: 0px;
  }
  #cobgL{
    position:absolute;
    width:640px;
    height:720px;
    left: 0px;
    top: 0px;
    background-image: url(../pic/score-board/HIROSUMA/thumbnail/1Pcolor.png);
  }
  #cobgR{
    position:absolute;
    width:640px;
    height:720px;
    left: 640px;
    top: 0px;
    transform: scale(-1, 1);
    background-image: url(../pic/score-board/HIROSUMA/thumbnail/2Pcolor.png);
  }
  #charaL{
    position:absolute;
    width:640px;
    height:720px;
    left: 0px;
    top: 0px;
  }
  #charaR{
    position:absolute;
    width:640px;
    height:720px;
    left: 640px;
    top: 0px;
    transform: scale(-1, 1);
  }
  #coL{
    position:absolute;
    width:640px;
    height:720px;
    left: 0px;
    top: 0px;
    background-image: url(../pic/score-board/HIROSUMA/thumbnail/1P.png);
  }
  #coR{
    position:absolute;
    width:640px;
    height:720px;
    left: 640px;
    top: 0px;
    background-image: url(../pic/score-board/HIROSUMA/thumbnail/2P.png);
  }

  #pScore1 {
    position:absolute;
    left:505px;
    top:2px;
    width:60px;
    font-size:26px;
    text-align:center;
    color:#FFF;
  }

  #pScore2 {
    position:absolute;
    right:509px;
    top:2px;
    width:60px;
    font-size:26px;
    text-align:center;
    color:#FFF;
  }

  #Info {
    position:absolute;
    left:556px;
    top:8px;
    width: 100%;
    max-width: 165px;
    padding:0px;
    font-size:16px;
    font-weight: 400;
    text-align: center;
    color:#FFF;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #number {
    position:absolute;
    left:0px;
    top:680px;
    width: 100%;
    max-width: 250px;
    padding:0px;
    font-size:30px;
    font-weight: 700;
    text-align: center;
    color:#FFF;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow:
        black 2px 0px,  black -2px 0px,
        black 0px -2px, black 0px 2px,
        black 2px 2px , black -2px 2px,
        black 2px -2px, black -2px -2px,
        black 1px 2px,  black -1px 2px,
        black 1px -2px, black -1px -2px,
        black 2px 1px,  black -2px 1px,
        black 2px -1px, black -2px -1px;

  }

  #date {
    position:absolute;
    left:247px;
    top:672px;
    width: 100%;
    max-width: 380px;
    max-height: 48px;

    padding:0px;
    font-size:35px;
    font-weight: 700;
    text-align: right;
    color:#FFF;

    margin:  0px -10px;
    padding: 0px 10px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow:
      black 5px 0px,  black -5px 0px,
      black 0px -5px, black 0px 5px,
      black 5px 5px , black -5px 5px,
      black 5px -5px, black -5px -5px,
      black 2.5px 5px,  black -2.5px 5px,
      black 2.5px -5px, black -2.5px -5px,
      black 5px 2.5px,  black -5px 2.5px,
      black 5px -2.5px, black -5px -2.5px;
  }
  #place {
    position:absolute;;
    left:640px;
    top:672px;
    width: 100%;
    max-width: 393px;
    max-height: 48px;
    padding:0px;
    font-size:35px;
    font-weight: 700;
    text-align: left;
    color:#FFF;
    padding: 0px 10px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow:
      black 5px 0px,  black -5px 0px,
      black 0px -5px, black 0px 5px,
      black 5px 5px , black -5px 5px,
      black 5px -5px, black -5px -5px,
      black 2.5px 5px,  black -2.5px 5px,
      black 2.5px -5px, black -2.5px -5px,
      black 5px 2.5px,  black -5px 2.5px,
      black 5px -2.5px, black -5px -2.5px;
  }

  #bracket {
    position:absolute;
    left: 247px;
    top:578px;
    width: 100%;
    max-width: 786px;
    padding:0px;
    font-size:74px;
    text-align: center;
    color:#FFF;

    letter-spacing: 0px;

    text-shadow:
      black 5px 0px,  black -5px 0px,
      black 0px -5px, black 0px 5px,
      black 5px 5px , black -5px 5px,
      black 5px -5px, black -5px -5px,
      black 2.5px 5px,  black -2.5px 5px,
      black 2.5px -5px, black -2.5px -5px,
      black 5px 2.5px,  black -5px 2.5px,
      black 5px -2.5px, black -5px -2.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #bracket_type {
    position:absolute;
    left: 247px;
    top:578px;
    width: 100%;
    max-width: 786px;
    padding:0px;
    font-size:74px;
    text-align: center;
    color:#FFF;

    letter-spacing: 0px;

    text-shadow:
      black 5px 0px,  black -5px 0px,
      black 0px -5px, black 0px 5px,
      black 5px 5px , black -5px 5px,
      black 5px -5px, black -5px -5px,
      black 2.5px 5px,  black -2.5px 5px,
      black 2.5px -5px, black -2.5px -5px,
      black 5px 2.5px,  black -5px 2.5px,
      black 5px -2.5px, black -5px -2.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #contest {
    color: #FFFFFF;
    position:absolute;
    left:560;
    top:0px;
    width:160px;
    font-size:15px;
    text-align:center;
  }

  #round {
    color: #FFFFFF;
    position:absolute;
    left:560px;
    top:15px;
    width:160px;
    font-size:15px;
    text-align:center;
  }

  #boardtop {
    position:absolute;
    top:0px;
    left:0px;
    width:1280px;
    height:720px;
    background-image:url('../pic/score-board/HIROSUMA/thumbnail/BGtop.png');
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
