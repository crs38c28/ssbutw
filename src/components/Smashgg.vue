<template>
  <v-layout class="scroll" row>
    <v-flex class="panel--fillheight panel__left" xs4>
      <v-layout row wrap class="panel">
        <v-toolbar dark color="red darken-3">
          <v-icon>fas fa-key</v-icon>
          <v-toolbar-title class="white--text">
            Smashgg - {{$t('import.key')}}
          </v-toolbar-title>
        </v-toolbar>
        <v-flex xs12>
          <v-layout row wrap class="pt-2 pb-2 text-xs-center">
            <v-flex xs10 offset-xs1 class="pt-2 pb-2">
              <a href="https://smash.gg/admin/profile/developer" target="_blank">{{$t('import.developer')}}</a>
              <div style="color:#D32F2F">
                {{$t('import.keywarning')}}
              </div>
            </v-flex>
            <v-flex xs8 offset-xs2>
              <v-text-field
              :append-icon="state.showKey ? 'fas fa-eye-slash' : 'fas fa-eye'"
              :type="state.showKey ? 'text' : 'password'"
              :label="'Smash.gg '+$t('import.key')"
              v-model="Rep.Setting.value.sggkey"
              class="input-group--focused"
              @click:append="state.showKey = !state.showKey"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="panel">
        <v-toolbar dark color="red darken-3">
          <v-icon>fas fa-calendar-alt</v-icon>
          <v-toolbar-title class="white--text">
            {{$t('import.tournament_smashgg_slug')}}
          </v-toolbar-title>
        </v-toolbar>
        <v-flex xs12>
          <v-layout row wrap justify-space-around class="pa-2 text-xs-center">
            <v-flex xs12 class="pa-1">
              {{$t('import.tournament_smashgg_ex')}}
            </v-flex>
            <v-flex xs12 class="pa-2">
              <v-text-field
              v-model="smashgg.url"
              :rules="urlRules"
              :label="$t('game.tournament')+' URL'"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn dark color="teal" @click.stop="getSmashggPhase(smashgg.url)"
              :disabled="!smashgg.key">
                <v-icon left>fas fa-file-import</v-icon>
                {{$t('import.tournament_import')}}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="panel">
          <v-toolbar dark color="red darken-3">
            <v-icon>fas fa-calendar-alt</v-icon>
            <v-toolbar-title class="white--text">{{$t('import.bracket_list')}}</v-toolbar-title>
          </v-toolbar>
          <v-flex xs12>
            <v-expansion-panel dark>
              <v-expansion-panel-content
                v-for="(phase, id) in smashgg.phases"
                :key="'phase'+id"
                >
                <div class="bracketlist__text" slot="header">
                  {{phase.name}} ({{phase.groupCount}})
                </div>
                <v-layout row wrap v-for="(bracket,index) in phase.bracket"
                  :key="id+'bracket'+index"
                  class="bracketlist">
                  <v-flex xs8 class="bracketlist__text">Pool {{bracket.displayIdentifier}}</v-flex>
                  <v-flex xs4>
                    <v-btn dark @click.stop="getSmashggPlayer(bracket.id)">
                      <v-icon>fas fa-file-import</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-expansion-panel-content>
            </v-expansion-panel>
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
          <v-btn color="error" :disabled="!state.delete" @click.stop="smashgg.playerArr=[]">
            <v-icon left>fas fa-trash-alt</v-icon>
            {{$t('import.delete_all')}}
          </v-btn>
        </v-flex>
        <v-flex xs3>
          <v-btn color="primary" :disabled="!state.delete" @click.stop="addAllToPlayerList()">
            <v-icon left>fas fa-save</v-icon>
            {{$t('import.import_all')}}
          </v-btn>
        </v-flex>
      </v-layout>
      <ul class="players__list">
        <li class="players__card" v-for="(player,index) in smashgg.playerArr"
          :key="'smashgg-player'+index">
          <PlayerCard :tag="player"
            :player="(playerDB[player])? playerDB[player]:smashgg.playerData[player]"/>
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
  name: 'Smashgg',
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
      urlRules: [
        v => (this.urlRegexTest(v)) || this.$t('import.urlRuleError'),
      ],
      smashgg: {
        url: null,
        playerArr: [],
        playerData: {},
        phases: {},
        key: null,
      },
    };
  },
  computed: {
    TournamentList() {
      return [];
    },
  },
  methods: {
    urlRegexTest(url) {
      /* eslint no-useless-escape: 0 */
      const regex = new RegExp('https?:\/\/smash\.gg\/tournament\/([-a-zA-Z0-9]*)\/events\/([-a-zA-Z0-9]*)');
      return regex.test(url);
    },
    getSmashggPhase(url) {
      /* eslint no-useless-escape: 0 */
      const regex = new RegExp('https?:\/\/smash\.gg\/tournament\/([-a-zA-Z0-9]*)\/events\/([-a-zA-Z0-9]*)');
      const regexArr = regex.exec(url);
      if ((!regexArr) || (regexArr.length !== 3)) {
        return;
      }
      this.smashgg.phases = {};
      nodecg.sendMessage('smashgg_phase', `tournament/${regexArr[1]}/event/${regexArr[2]}`)
        .then((result) => {
          if (result === {}) {
            return;
          }
          result.data.event.phases.forEach((element) => {
            this.$set(this.smashgg.phases, element.id, {
              name: element.name,
              groupCount: element.groupCount,
              bracket: element.phaseGroups.nodes,
            });
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getSmashggPlayer(bracketId) {
      if (!bracketId) {
        return;
      }
      nodecg.sendMessage('smashgg_players', bracketId)
        .then((result) => {
          console.log(result);
          if (result === {}) {
            return;
          }
          if (!result.errors) {
            const playerSet = new Set();
            result.data.phaseGroup.seeds.nodes.forEach((seed) => {
              if (!seed.players) {
                return;
              }
              seed.players.forEach((player) => {
                playerSet.add(player.gamerTag);
                /**
                  country in smashgg is wierd...
                  some poeple are 'US' some are 'United States'
                  and need to map into country code instead of country name.
                */
                this.smashgg.playerData[player.gamerTag] = {
                  country: null,
                  tag: player.gamerTag,
                  name: '',
                  prefix: player.prefix || '',
                  twitter: player.twitterHandle || '',
                  fighters: [],
                };
              });
            });
            this.smashgg.playerArr = [...playerSet];
          } else {
            [this.error_text] = result.errors;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    addPlayerList(tag) {
      if ((!this.playerDB[tag]) && (this.smashgg.playerData[tag])) {
        this.Rep.PlayerDB.value[tag] = {
          name: '',
          prefix: this.smashgg.playerData[tag].prefix,
          country: null,
          twitter: this.smashgg.playerData[tag].twitter,
          fighters: ['1'],
        };
      } else {
        this.Rep.PlayerDB.value[tag].prefix = this.smashgg.playerData[tag].prefix;
        this.Rep.PlayerDB.value[tag].twitter = this.smashgg.playerData[tag].twitter;
      }
      this.playerlist.push(tag);
      this.Rep.PlayerList.value = this.playerlist;
    },
    addAllToPlayerList() {
      const playerObj = {};
      this.smashgg.playerArr.forEach((tag) => {
        if (this.playerlist.indexOf(tag) === -1) {
          if ((!this.playerDB[tag]) && (this.smashgg.playerData[tag])) {
            playerObj[tag] = {
              name: '',
              prefix: this.smashgg.playerData[tag].prefix,
              country: null,
              twitter: this.smashgg.playerData[tag].twitter,
              fighters: ['1'],
            };
          } else {
            this.Rep.PlayerDB.value[tag].prefix = this.smashgg.playerData[tag].prefix;
            this.Rep.PlayerDB.value[tag].twitter = this.smashgg.playerData[tag].twitter;
          }
          this.playerlist.push(tag);
        }
      });
      this.Rep.PlayerList.value = this.playerlist;
      this.Rep.PlayerDB.value = {
        ...this.playerDB,
        ...playerObj,
      };
    },
    RepSetKey(newValue) {
      this.smashgg.key = newValue.sggkey;
    },
  },
  created() {
    this.Rep.Setting.on('change', this.RepSetKey);
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
  .bracketlist{
    border-width: 1px 0 0 0;
    border-style: solid;
    border-color: #999;
    background-color: #555;
    &__text{
      text-align: center;
      vertical-align: middle;
      font-size: 1.5rem;
      line-height: 48px;
    }
  }
  .playerlist{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px,1fr));
    grid-gap: 1rem;
    padding: 10px;
  }
</style>
