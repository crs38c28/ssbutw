<template>
  <v-app>
    <v-layout class="sidebar" v-if="!state.loading" row
      :class="{'sidebar--active': ScrollLock}">
      <v-flex class="sidebar__content"
        :class="{'sidebar__content--challonge': state.challonge,
                 'sidebar__content--smashgg': state.smashgg}">
        <Challonge v-if="state.challonge" :Rep="Rep" :playerDB="playerDB" :playerlist="playerlist"/>
        <Smashgg v-if="state.smashgg" :Rep="Rep" :playerDB="playerDB" :playerlist="playerlist"/>
      </v-flex>
      <v-flex class="sidebar__btn"
        :class="{'sidebar__btn--active': ScrollLock}"
        @click.stop="state.sidebar=false;">
        <div class="sidebar__icon sidebar__icon--challonge"
          :class="{'sidebar__icon--active': (ScrollLock && state.challonge)}"
          @click.stop="state.sidebar=true;state.challonge=true;state.smashgg=false;">
        </div>
        <div class="sidebar__icon sidebar__icon--smashgg"
          :class="{'sidebar__icon--active': (ScrollLock && state.smashgg)}"
          @click.stop="state.sidebar=true;state.smashgg=true;state.challonge=false;">
        </div>
      </v-flex>
    </v-layout>
    <v-layout v-if="!state.loading" style="padding:10px" justify-space-around wrap>
      <v-flex class="panel--fillheight panel" xs11>
        <div class="pa-2">
          <v-layout row wrap justify-space-around align-center>
            <v-flex xs3>
              <v-switch
                v-model="state.delete"
                :label="$t('DB.editmode')"
              ></v-switch>
            </v-flex>
            <v-flex xs3>
              <v-btn color="error" :disabled="!state.delete" @click="Rep.PlayerList.value=[]">
                <v-icon left>fas fa-trash-alt</v-icon>
                {{$t('import.delete_all')}}
              </v-btn>
            </v-flex>
            <v-flex xs3>
              <v-btn color="primary" :disabled="!state.delete" @click="saveAll">
                <v-icon left>fas fa-save</v-icon>
                {{$t('import.save_all')}}
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
        <v-toolbar dark color="primary">
          <v-icon>fas fa-user</v-icon>
          <v-toolbar-title class="white--text">{{$t('import.player_list')}}</v-toolbar-title>
        </v-toolbar>
        <ul class="players__list">
          <li class="players__list--add">
            <v-form
              ref="form"
              v-model="formData.valid"
              lazy-validation>
              <v-text-field
              v-model="formData.tag"
              :label="$t('players.tag')"
              :rules="formData.tagRules"
              required
              ></v-text-field>
              <v-btn color="info" @click.stop="addPlayer()">
                <v-icon>fas fa-user-plus</v-icon>
              </v-btn>
            </v-form>
          </li>
          <li class="players__card" v-for="player in PlayerList" :key="player.tag">
            <PlayerCard :player="player" :tag="player.tag" :color="player.new? 'red darken-2':null"
                        :stateDelete="state.delete" :deleteFunc="deletePlayer"/>
            <div class="players__save">
              <v-btn flat icon color="white"
                :disabled="!player.new" @click="savePlayer(player.tag)">
                <v-icon v-if="!player.new">fas fa-save</v-icon>
                <v-icon v-if="player.new">far fa-save</v-icon>
              </v-btn>
            </div>
          </li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </v-flex>
      <LocaleSelector/>
    </v-layout>
  </v-app>
</template>

<script>
import PlayerCard from '@/components/PlayerCard.vue';
import LocaleSelector from '@/components/LocaleSelector.vue';
import Challonge from '@/components/Challonge.vue';
import Smashgg from '@/components/Smashgg.vue';
import {
  REP_PLAYERDB_DEFAULT, REP_PLAYERLIST_DEFAULT, REP_SETTING_DEFAULT,
} from '@/data/constant';
/* global nodecg,NodeCG */

export default {
  name: 'App',
  components: {
    PlayerCard,
    LocaleSelector,
    Challonge,
    Smashgg,
  },
  data() {
    return {
      state: {
        delete: false,
        showKey: false,
        loading: true,
        challonge: false,
        smashgg: false,
        sidebar: false,
      },
      formData: {
        valid: true,
        tagRules: [
          v => !!v || this.$t('DB.nameRuleNull'),
          v => !(this.playerlist.indexOf(v) !== -1) || this.$t('DB.nameRuleExist'),
        ],
        tag: null,
      },
      playerlist: [],
      playerDB: {},
    };
  },
  watch: {
    ScrollLock(newValue) {
      if (newValue) {
        document.documentElement.classList.add('scroll-lock');
      } else {
        document.documentElement.classList.remove('scroll-lock');
      }
    },
  },
  computed: {
    ScrollLock() {
      return this.state.sidebar;
    },
    PlayerList() {
      const playerArr = [];
      const emptyObj = {
        new: true,
        name: '',
        team: '',
        country: this.CurrentLanguage,
        twitter: '',
        fighters: ['1'],
      };
      this.playerlist.forEach((element) => {
        if (!this.playerDB[element]) {
          playerArr.push({
            tag: element,
            ...emptyObj,
          });
        } else {
          playerArr.unshift({
            tag: element,
            ...this.playerDB[element],
          });
        }
      });
      return playerArr;
    },
    CurrentLanguage() {
      switch (this.$i18n.locale) {
        case 'zh_Hant_TW':
          return 'TW';
        case 'ja_JP':
          return 'JP';
        default:
          return 'US';
      }
    },
  },
  methods: {
    async waitForReplicants() {
      await NodeCG.waitForReplicants(...Object.values(this.Rep));
      this.state.loading = false;
    },
    addPlayer() {
      this.formData.valid = this.$refs.form.validate();
      if (!this.formData.valid) {
        return;
      }
      this.playerlist.push(this.formData.tag);
      this.Rep.PlayerList.value = this.playerlist;
      this.formData.tag = '';
      this.$refs.form.resetValidation();
    },
    deletePlayer(tag) {
      const index = this.playerlist.indexOf(tag);
      if (index !== -1) {
        this.playerlist.splice(index, 1);
        this.Rep.PlayerList.value = this.playerlist;
      }
    },
    savePlayer(tag) {
      this.Rep.PlayerDB.value[tag] = {
        name: '',
        team: '',
        country: this.CurrentLanguage,
        twitter: '',
        fighters: ['1'],
      };
    },
    saveAll() {
      const playerObj = {};
      const emptyObj = {
        name: '',
        team: '',
        country: '',
        twitter: '',
        fighters: ['1'],
      };
      this.playerlist.forEach((element) => {
        if (!this.playerDB[element]) {
          playerObj[element] = {
            ...emptyObj,
          };
        }
      });
      this.Rep.PlayerDB.value = {
        ...this.playerDB,
        ...playerObj,
      };
    },
  },
  created() {
    this.Rep = {};
    Object.defineProperty(this.Rep, '_isVue', { value: true, enumerable: false });
    this.Rep.PlayerDB = nodecg.Replicant('playerDB', {
      defaultValue: REP_PLAYERDB_DEFAULT,
    });
    this.Rep.PlayerList = nodecg.Replicant('playerlist', {
      defaultValue: REP_PLAYERLIST_DEFAULT,
    });
    this.Rep.PlayerDB.on('change', (newValue) => {
      this.playerDB = JSON.parse(JSON.stringify(newValue));
    });
    this.Rep.PlayerList.on('change', (newValue) => {
      this.playerlist = JSON.parse(JSON.stringify(newValue));
    });
    this.Rep.Setting = nodecg.Replicant('setting', {
      defaultValue: REP_SETTING_DEFAULT,
    });
    console.log(this.Rep.Setting);
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
  #app{
    font-family: 'Noto Sans TC';
    background-color: #dedede;
  }
  .panel{
    background-color: #fafafa;
    &__left{
      background-color: #fafafa;
    }
    &__right{
      background-color: #eee;
    }
    &--fillheight{
      min-height: 100vh;
    }
  }
  .model__content{
    height: 80vh;
    overflow-y: scroll;
  }
  .sidebar{
    position: fixed;
    z-index: 100;
    width: 100%;
    left: -93%;
    height: 100%;
    pointer-events: none;
    &__content{
      width: 93%;
      pointer-events: auto;
      padding: 10px;
      overflow-y: scroll;
      &::-webkit-scrollbar{
        height: 4px;
        width: 5px;
        background: #444;
        opacity: .3;
      }
      &::-webkit-scrollbar-button{
        display: none;
      }
      &::-webkit-scrollbar-piece{
        background: #eee;
      }
      &::-webkit-scrollbar-thumb{
        background: #666;
      }
      background-color:#272A33;
      &--smashgg{
        background-color: #FBFBFB;
      }
      &--challonge{
        background-color:#272A33;
      }
    }
    &__btn{
      padding-top:5px;
      width: 7%;
      &--active{
        background: rgba($color: #000, $alpha: 0.5);
        cursor: pointer;
        pointer-events: auto;
      }
    }
    &__icon{
      width: 64px;
      height: 64px;
      margin-bottom: 5px;
      border-radius: 0 10px 10px 0;
      cursor: pointer;
      &--challonge{
        background-color: #272A33;
        background-image: url(../pic/dashboard/challonge.svg);
        background-size: 80% 80%;
        background-position: center center;
      }
      &--smashgg{
        background-color:#FBFBFB;
        background-image: url(../pic/dashboard/smashgg.svg);
        background-size: 80% 80%;
        background-position: center center;
      }
      &--active{
        pointer-events: none;
      }
      pointer-events: auto;
    }
    &--active{
      transform: translateX(93%);
    }
  }
</style>
<style lang="scss">
  ul{
    padding: 0;
    list-style-type: none;
  }
  .scroll-lock {
    overflow: hidden;
  }
  .players{
    &__list{
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px,1fr));
      grid-gap: 1rem;
      padding: 10px;
      &--add{
        display: flex;
        align-items: center;
        justify-content: center;
        border: #1976D2 3px dashed;
        padding: 10px;
      }
    }
    &__title{
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &__info{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &__card{
      position: relative;
    }
    &__save{
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
</style>
