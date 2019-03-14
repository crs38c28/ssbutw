<template>
  <div v-if="!state.loading">
    <div id="board3">
        <div id="intInfo1">
          <transition name="fade" mode="out-in">
            <div :key="tournament.event">
              {{tournament.event}}
            </div>
          </transition>
        </div>
        <div id="intInfo2">
          <transition name="fade" mode="out-in">
            <div :key="tournament.location">
              {{tournament.location}}
            </div>
          </transition>
        </div>
    </div>
    <div id="board2"></div>
    <div id="board1"></div>
    <div id="board4"></div>
  </div>
</template>

<script>
import { TweenMax, Power2 } from 'gsap/TweenMax';
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
  methods: {
    async waitForReplicants() {
      await NodeCG.waitForReplicants(...Object.values(this.Rep));
      this.state.loading = false;
      this.$nextTick()
        .then(() => {
          this.setInitAnimation();
        });
    },
    setInitAnimation() {
      // initial Animation
      TweenMax.from('#board1', 0.8, {
        left: '-200px',
        repeat: 0,
        ease: Power2.easeOut,
        delay: 0,
        yoyo: false,
      });
      TweenMax.from('#board2', 1.5, {
        left: '-500px',
        repeat: 0,
        ease: Power2.easeOut,
        delay: 0,
        yoyo: false,
      });
      TweenMax.from('#board3', 1.5, {
        left: '-1000px',
        repeat: 0,
        ease: Power2.easeOut,
        delay: 0,
        yoyo: false,
      });
      TweenMax.from('#board4', 3, {
        opacity: 0,
        repeat: 0,
        ease: Power2.easeIn,
        delay: 0,
        yoyo: false,
      });
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

  #board1 {
    position:absolute;
    top:0px;
    left:0px;
    width:1280px;
    height:720px;
    background-image:url('../pic/score-board/HIROSUMA/interval/int_01.png');
  }

  #board2 {
    position:absolute;
    top:0px;
    left:0px;
    width:1280px;
    height:720px;
    background-image:url('../pic/score-board/HIROSUMA/interval/int_02.png');
  }

  #board3 {
    position:absolute;
    top:0px;
    left:0px;
    width:1280px;
    height:720px;
    background-image:url('../pic/score-board/HIROSUMA/interval/int_03.png');
  }

  #board4 {
    position:absolute;
    top:0px;
    left:0px;
    width:1280px;
    height:720px;
    background-image:url('../pic/score-board/HIROSUMA/interval/int_04.png');
  }

  #intInfo1 {
    position:absolute;
    left:556px;
    top:570px;
    width: 100%;
    max-width: 800px;
    padding:0px;
    font-size:33px;
    font-weight: 700;
    text-align: left;
    color:#ff310f;

    text-shadow:
      #FFF 2px 0px,  #FFF -2px 0px,
      #FFF 0px -2px, #FFF 0px 2px,
      #FFF 2px 2px , #FFF -2px 2px,
      #FFF 2px -2px, #FFF -2px -2px,
      #FFF 1px 2px,  #FFF -1px 2px,
      #FFF 1px -2px, #FFF -1px -2px,
      #FFF 2px 1px,  #FFF -2px 1px,
      #FFF 2px -1px, #FFF -2px -1px;

    letter-spacing: -1px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  #intInfo2 {
    position:absolute;
    left:516px;
    top:603px;
    width:100%;
    max-width: 800px;
    font-size:33px;
    font-weight: 700;
    text-align:left;
    color:#FFF;

    text-shadow:
      #000 2px 0px,  #000 -2px 0px,
      #000 0px -2px, #000 0px 2px,
      #000 2px 2px , #000 -2px 2px,
      #000 2px -2px, #000 -2px -2px,
      #000 1px 2px,  #000 -1px 2px,
      #000 1px -2px, #000 -1px -2px,
      #000 2px 1px,  #000 -2px 1px,
      #000 2px -1px, #000 -2px -1px;

    letter-spacing: -1px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @keyframes marquee {
    from { transform:translate(0); }
    to  {  transform:translate(-100%); }
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
