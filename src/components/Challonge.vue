<template>
  <v-layout class="scroll" row>
    <v-flex class="panel--fillheight panel__left" xs4>
      <v-layout row wrap class="panel">
        <v-toolbar dark color="orange darken-4">
          <v-icon>fas fa-key</v-icon>
          <v-toolbar-title class="white--text">
            Challonge - {{$t('import.key')}}
          </v-toolbar-title>
        </v-toolbar>
        <v-flex xs12>
          <v-layout row wrap class="pt-2 pb-2 text-xs-center">
            <v-flex xs10 offset-xs1 class="pt-2 pb-2">
              <a href="https://challonge.com/settings/developer" target="_blank">{{$t('import.developer')}}</a>
              <div style="color:#D32F2F">
                {{$t('import.keywarning')}}
              </div>
            </v-flex>
            <v-flex xs8 offset-xs2>
              <v-text-field
              :append-icon="state.showKey ? 'fas fa-eye-slash' : 'fas fa-eye'"
              :type="state.showKey ? 'text' : 'password'"
              :label="'Challonge '+$t('import.key')"
              v-model="Rep.Setting.value.chkey"
              class="input-group--focused"
              @click:append="state.showKey = !state.showKey"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="panel">
        <v-toolbar dark color="orange darken-4">
          <v-icon>fas fa-calendar-alt</v-icon>
          <v-toolbar-title class="white--text">
            {{$t('import.tournament_challonge_id')}}
          </v-toolbar-title>
        </v-toolbar>
        <v-flex xs12>
          <v-layout row wrap justify-space-around class="pa-2 text-xs-center">
            <v-flex xs12 class="pa-1">
              {{$t('import.tournament_challonge_ex')}}
            </v-flex>
            <v-flex xs12 class="pa-2">
              <v-text-field
              v-model="challonge.tId"
              :label="$t('game.tournament')+' ID'"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn dark color="teal" @click="getChallongePlayer(challonge.tId)"
              :disabled="!challonge.key">
                <v-icon left>fas fa-file-import</v-icon>
                {{$t('import.tournament_import')}}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="panel">
          <v-toolbar dark color="orange darken-4">
            <v-icon>fas fa-calendar-alt</v-icon>
            <v-toolbar-title class="white--text">{{$t('import.my_tournament')}}</v-toolbar-title>
          </v-toolbar>
          <v-flex xs12>
            <v-layout row wrap class="pt-2 pb-2 text-xs-center">
              <v-flex xs12>
                <v-btn dark color="teal" @click="getChallongeTournament()"
                  :disabled="!challonge.key">
                  <v-icon left>fas fa-cloud-download-alt</v-icon>
                  {{$t('import.my_tournament_import')}}
                </v-btn>
              </v-flex>
              <v-flex xs12 v-for="(i,index) in TournamentList" :key="'tm'+index">
                <v-layout row wrap class="text-xs-center justify-center">
                  <v-flex xs12>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs8>
                    <a class="tmtitle" :href="i.url"><div>{{i.name}}</div></a>
                  </v-flex>
                  <v-flex xs4>
                      <v-btn dark color="primary" @click="getChallongePlayer(i.id)">
                        <v-icon>fas fa-file-import</v-icon>
                      </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12>
                <v-btn dark color="blue-grey darken-2"
                  v-if="challonge.tMax!==challonge.tournamentArr.length"
                  v-on:click="challonge.tMax=(challonge.tMax+5>=challonge.tournamentArr.length)?
                              challonge.tournamentArr.length:challonge.tMax+5">
                  {{$t('import.more')}}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
    </v-flex>
    <v-flex class="panel--fillheight panel__right" xs8>
      <v-layout row wrap justify-space-around align-center>
        <v-flex xs3>
          <v-switch
            v-model="state.delete"
            :label="$t('DB.editmode')"
          ></v-switch>
        </v-flex>
        <v-flex xs3>
          <v-btn color="error" :disabled="!state.delete" @click="challonge.playerArr=[]">
            <v-icon left>fas fa-trash-alt</v-icon>
            {{$t('import.delete_all')}}
          </v-btn>
        </v-flex>
        <v-flex xs3>
          <v-btn color="primary" :disabled="!state.delete" @click="addAllToPlayerList()">
            <v-icon left>fas fa-save</v-icon>
            {{$t('import.import_all')}}
          </v-btn>
        </v-flex>
      </v-layout>
      <ul class="players__list">
        <li class="players__card" v-for="(player,index) in challonge.playerArr"
          :key="'challonge-player'+index">
          <PlayerCard :tag="player"
            :player="(playerDB[player])? playerDB[player]:emptyPlayerObj"/>
          <div class="players__save">
            <v-btn flat icon color="white"
              :disabled="(playerlist.indexOf(player) !== -1)"
              @click.stop="addPlayerList(player)">
              <v-icon>fas fa-file-import</v-icon>
            </v-btn>
          </div>
        </li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </v-flex>
  </v-layout>
</template>

<script>
import PlayerCard from '@/components/PlayerCard.vue';
/* global nodecg */
export default {
  name: 'Challonge',
  props: {
    Rep: Object,
    playerDB: Object,
    playerlist: Array,
  },
  components: {
    PlayerCard,
  },
  data() {
    return {
      state: {
        delete: false,
        showKey: false,
      },
      challonge: {
        tId: null,
        tMax: 0,
        tournamentArr: [],
        playerArr: [],
        key: null,
      },
    };
  },
  computed: {
    TournamentList() {
      return this.challonge.tournamentArr.slice(0, this.challonge.tMax);
    },
  },
  methods: {
    getChallongeTournament() {
      this.challonge.tMax = 0;
      nodecg.sendMessage('challonge_api', 'tournaments')
        .then((result) => {
          if (result === {}) {
            return;
          }
          console.log(result);
          this.challonge.tournamentArr = [];
          result.forEach((element) => {
            this.challonge.tournamentArr.push({
              name: element.tournament.name,
              id: element.tournament.id,
              url: element.tournament.full_challonge_url,
            });
          });
          // pagination
          this.challonge.tMax = (result.length > 5) ? 5 : result.length;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getChallongePlayer(tId) {
      if (!tId) {
        return;
      }
      nodecg.sendMessage('challonge_api', `tournaments/${tId}/participants`)
        .then((result) => {
          if (result === {}) {
            return;
          }
          if (!result.errors) {
            const playerSet = new Set();
            result.forEach((element) => {
              playerSet.add(element.participant.display_name);
            });
            this.challonge.playerArr = [...playerSet];
            // this.Rep.PlayerList.value = [...playerSet];
          } else {
            [this.error_text] = result.errors;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    addPlayerList(tag) {
      this.playerlist.push(tag);
    },
    addAllToPlayerList() {
      this.challonge.playerArr.forEach((tag) => {
        if (this.playerlist.indexOf(tag) === -1) {
          this.playerlist.push(tag);
        }
      });
      this.Rep.PlayerList.value = this.playerlist;
    },
    RepSetKey(newValue) {
      this.challonge.key = newValue.chkey;
    },
  },
  created() {
    this.Rep.Setting.on('change', this.RepSetKey);
    this.emptyPlayerObj = {
      name: '',
      prefix: '',
      country: null,
      twitter: '',
      fighters: [],
    };
  },
  beforeDestroy() {
    this.Rep.Setting.removeListener('change', this.RepSetKey);
  },
};
</script>

<style lang="scss" scoped>
  .panel{
    background-color: #fafafa;
    &__left{
      background-color: #fafafa;
    }
    &__right{
      background-color: #eee;
    }
    &--fillheight{
      min-height: calc(100vh - 20px);
    }
  }
  .selector{
    &__drop{
      max-width: 250px;
    }
    width: 100%;
    padding: 10px 0;
    display: flex;
    flex-direction: row-reverse;
  }
  .scroll{
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
  }
</style>
