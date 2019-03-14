<template>
  <v-app>
    <v-layout v-if="!state.loading" style="padding:10px" column>
      <v-dialog v-model="state.edit" persistent max-width="800">
        <v-card>
          <v-card-title class="headline">
            {{$t('DB.new')}}
          </v-card-title>
          <v-form
            v-model="formData.valid"
            lazy-validation>
            <v-card-text>
              <v-text-field
              v-model="formData.tag"
              :label="$t('players.tag')"
              :rules="formData.tagRules"
              required
              ></v-text-field>
              <v-text-field
              v-model="formData.name"
              :label="$t('players.name')"
              ></v-text-field>
              <v-text-field
              v-model="formData.prefix"
              :label="$t('players.prefix')"
              ></v-text-field>
              <v-text-field
              v-model="formData.twitter"
              :label="$t('players.twitter')"
              ></v-text-field>
              <v-autocomplete
              :items="formData.countryList"
              :label="$t('players.country')"
              item-text="text"
              item-value="value"
              v-model="formData.country"
              ></v-autocomplete>
              <v-layout row wrap justify-space-around align-center>
                <v-flex xs6 v-for="(i,index) in formData.fighters" :key="'chara'+index">
                  <v-layout row wrap justify-space-around align-center>
                    <v-flex xs9>
                      <v-autocomplete
                      :items="CharaList"
                      :label="!!index ? $t('game.use')+(index+1) : $t('game.use')+$t('game.main')"
                      item-text="text"
                      item-value="value"
                      v-model="formData.fighters[index]"
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs2>
                      <v-btn v-if="formData.fighters.length > 1" flat icon color="red lighten-2"
                        @click.stop="formData.fighters.splice(index, 1)">
                        <v-icon>fas fa-user-slash</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs6></v-flex>
                <v-flex class="text-xs-center" xs12>
                  <v-btn color="info" @click.stop="formData.fighters.push('1')">
                    <v-icon left>fas fa-user-plus</v-icon>
                    {{$t('DB.addchara')}}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click.stop="state.edit = false">
                {{$t('keywords.discard')}}
              </v-btn>
              <v-btn color="green darken-1" flat
                    @click.stop="updatePlayer(formData.tag, formData)">
                {{$t('keywords.save')}}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-flex xs12>
        <v-layout row wrap class="panel">
          <v-toolbar dark color="primary">
              <v-icon>fas fa-edit</v-icon>
            <v-toolbar-title class="white--text">{{$t('DB.edit')}}</v-toolbar-title>
          </v-toolbar>
          <v-layout justify-space-around row wrap
            class="pa-2 pt-5 text-xs-center" style="font-size:1.2rem">
            <v-flex xs8>
              <v-text-field
                prepend-icon="fas fa-search"
                v-model="state.search"
                :label="$t('DB.search')"
                placeholder="EX: Zackray"
                outline
                clear-icon="fas fa-times-circle"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs8>
              <v-switch
                v-model="state.delete"
                :label="$t('DB.editmode')"
              ></v-switch>
            </v-flex>
            <v-expansion-panel>
              <v-expansion-panel-content style="background-color:#FAFAFA;">
                <div slot="header">{{$t('DB.importexport')}}</div>
                <v-layout row wrap class="mt-2 mb-2 pa-2 text-xs-center" style="font-size:1.2rem">
                  <v-flex xs12
                    :class="['drag-drop-area', state.dragging ? 'drag-drop-area--enter' : '']"
                    @drop.prevent="dropJsonFile" @dragover.prevent=""
                    @dragenter.prevent="state.dragging = true"
                    @dragend.prevent="state.dragging = false"
                    @dragleave.prevent="state.dragging = false">
                    <v-flex class="drag-drop-area__text" xs12>
                      {{DragDropMsg}}
                    </v-flex>
                    <input type="file" id="uploadInput" accept="application/json"
                            @change="uploadJsonFile($event.target.files[0])">
                    <label class="v-btn theme--light info" style="cursor: pointer;"
                      for="uploadInput">
                      <v-icon left color="white">fas fa-file-import</v-icon>
                      {{$t('DB.importJSON')}}
                    </label>
                  </v-flex>
                  <v-flex xs12>
                    <v-btn color="info" @click.stop="downloadJsonFile()">
                      <v-icon left>fas fa-file-download</v-icon>
                      {{$t('DB.exportJSON')}}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-layout>
        </v-layout>
      </v-flex>
      <ul class="players__list">
        <li class="players__list--add" @click.stop="beforeEditPlayer(null)" >
          <v-icon x-large>fas fa-user-plus</v-icon>
        </li>
        <li v-for="(player, tag) in SearchFilter" :key="tag">
          <PlayerCard :player="player" :tag="tag" :stateDelete="state.delete"
            :editFunc="beforeEditPlayer" :deleteFunc="deletePlayer" :search="state.search"/>
        </li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <v-flex xs12>
        <LocaleSelector/>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
import PlayerCard from '@/components/PlayerCard.vue';
import LocaleSelector from '@/components/LocaleSelector.vue';
import FIGHTERS from '@/data/fighters.json';
import FLAGS from '@/data/flags.json';
import {
  STATUS_DROP_WAIT, STATUS_DROP_IMPORT, STATUS_DROP_ERROR, STATUS_DROP_SUCCESS,
  REP_PLAYERDB_DEFAULT,
} from '@/data/constant';
import { saveAs } from 'file-saver';
/* global nodecg,NodeCG */

export default {
  name: 'App',
  components: {
    PlayerCard,
    LocaleSelector,
  },
  data() {
    return {
      state: {
        loading: true,
        selectedItem: null,
        edit: false,
        delete: false,
        dragging: false,
        search: '',
        dragDropState: STATUS_DROP_WAIT,
      },
      // drop-down list value
      formData: {
        valid: true,
        tagRules: [
          v => !!v || this.$t('DB.nameRuleNull'),
          v => !((v !== this.state.selectedItem) && (this.Rep.PlayerDB.value[this.formData.tag])) || this.$t('DB.nameRuleExist'),
        ],
        tag: '',
        name: '',
        prefix: '',
        country: '',
        twitter: '',
        fighters: [],
        countryList: [],
      },
      // user selected value
      playerDB: {},
    };
  },
  computed: {
    SearchFilter() {
      if (!this.state.search) {
        return this.playerDB;
      }
      const filtered = Object.keys(this.playerDB)
        .filter(key => this.playerDB[key].name
          .toLowerCase().includes(this.state.search.toLowerCase())
        || key.toLowerCase().includes(this.state.search.toLowerCase()))
        .reduce((obj, key) => ({
          ...obj,
          [key]: this.playerDB[key],
        }), {});
      return filtered;
    },
    CharaList() {
      const arr = [];
      Object.entries(this.FIGHTERS).forEach(([id]) => {
        if (this.$i18n.locale === 'zh_Hant_TW' || this.$i18n.locale === 'ja_JP') {
          // add English name
          arr.push({ text: `${this.$t(`fighters.${id}.name`)} (${this.$i18n.messages.en_US.fighters[id].name})`, value: id });
        } else {
          arr.push({ text: `${this.$t(`fighters.${id}.name`)}`, value: id });
        }
      });
      return arr;
    },
    DragDropMsg() {
      let ret;
      switch (this.state.dragDropState) {
        case STATUS_DROP_SUCCESS:
          ret = this.$t('DB.successMessage');
          break;
        case STATUS_DROP_ERROR:
          ret = this.$t('DB.errorMessage');
          break;
        case STATUS_DROP_IMPORT:
          ret = `${this.$t('keywords.import')}...`;
          break;
        case STATUS_DROP_WAIT:
        default:
          ret = this.$t('DB.dropMessage');
          break;
      }
      return ret;
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
    beforeEditPlayer(tag) {
      this.state.selectedItem = tag;
      this.formData.tag = tag;
      if (tag) {
        this.formData.name = this.playerDB[tag].name;
        this.formData.prefix = this.playerDB[tag].prefix;
        this.formData.country = this.playerDB[tag].country;
        this.formData.twitter = this.playerDB[tag].twitter;
        this.formData.fighters = [...this.playerDB[tag].fighters];
      } else {
        this.formData.name = '';
        this.formData.prefix = '';
        this.formData.twitter = '';
        this.formData.fighters = ['1'];
        this.formData.country = this.CurrentLanguage;
      }
      this.state.edit = true;
    },
    updatePlayer(tag, data) {
      if (this.state.edit && !this.formData.valid) {
        // validation
        return;
      }
      if (this.state.edit && (this.state.selectedItem !== tag)) {
        // tag being changed! delete old tag data
        this.deletePlayer(this.state.selectedItem);
      }
      if (!this.Rep.PlayerDB.value[tag]) {
        this.Rep.PlayerDB.value[tag] = {
          name: data.name || '',
          prefix: data.prefix || '',
          country: data.country,
          twitter: data.twitter || '',
          fighters: data.fighters || ['1'],
        };
      } else {
        this.Rep.PlayerDB.value[tag].name = data.name || '';
        this.Rep.PlayerDB.value[tag].prefix = data.prefix || '';
        this.Rep.PlayerDB.value[tag].country = data.country;
        this.Rep.PlayerDB.value[tag].twitter = data.twitter || '';
        this.Rep.PlayerDB.value[tag].fighters = data.fighters || ['1'];
      }
      this.state.edit = false;
    },
    deletePlayer(id) {
      try {
        delete this.Rep.PlayerDB.value[id];
      } catch (error) {
        // console.log(error);
      }
    },
    importJsonData(playerJsonList) {
      Object.entries(playerJsonList).forEach(([id, data]) => {
        try {
          this.updatePlayer(id, data);
        } catch (error) {
          console.error(error);
        }
      });
    },
    downloadJsonFile() {
      const json = JSON.stringify(this.playerDB, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      saveAs(blob, 'playerDB.json');
    },
    uploadJsonFile(file) {
      const fr = new FileReader();
      fr.onload = this.readJson;
      fr.readAsText(file);
    },
    readJson(event) {
      let data;
      try {
        data = JSON.parse(event.target.result);
        this.state.dragDropState = STATUS_DROP_SUCCESS;
      } catch (error) {
        console.log(error);
        this.state.dragDropState = STATUS_DROP_ERROR;
        return;
      }
      this.importJsonData(data);
    },
    dropJsonFile(event) {
      this.state.dragging = false;
      if (event.dataTransfer.files.length <= 0) {
        return;
      }
      this.state.dragDropState = STATUS_DROP_IMPORT;
      this.uploadJsonFile(event.dataTransfer.files[0]);
    },
  },
  created() {
    this.FIGHTERS = FIGHTERS;
    this.FLAGS = FLAGS;
    this.Rep = {};
    Object.defineProperty(this.FIGHTERS, '_isVue', { value: true, enumerable: false });
    Object.defineProperty(this.FLAGS, '_isVue', { value: true, enumerable: false });
    Object.defineProperty(this.Rep, '_isVue', { value: true, enumerable: false });
    this.Rep.PlayerDB = nodecg.Replicant('playerDB', {
      defaultValue: REP_PLAYERDB_DEFAULT,
    });
    this.Rep.PlayerDB.on('change', (newValue) => {
      this.playerDB = JSON.parse(JSON.stringify(newValue));
    });
    this.waitForReplicants();
    this.formData.countryList.push({ text: 'NULL', value: null });
    Object.entries(this.FLAGS).forEach(([flag, country]) => {
      this.formData.countryList.push({ text: `${country} (${flag})`, value: flag });
    });
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
  #uploadInput{
    display: none;
  }
  .panel{
    background-color: #fafafa;
  }
  .drag-drop-area{
    &--enter{
      background-color: #555;
    }
    &__text{
      pointer-events: none;
    }
    padding: 8%;
    border: #1976D2 5px dashed;
  }
  .players{
    &__list{
      &--add{
        display: flex;
        align-items: center;
        justify-content: center;
        border: #1976D2 3px dashed;
        cursor: pointer;
        padding: 20px;
        &:hover{
          background-color: #eee;
        }
      }
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px,1fr));
      grid-gap: 1rem;
      padding: 10px;
      background-color: #fafafa;
    }
  }
</style>
