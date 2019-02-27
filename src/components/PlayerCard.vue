<template>
  <v-card height="100%" :color="color?color:'blue darken-2'" class="white--text">
    <v-layout column fill-height align-content-space-between>
      <v-layout row>
        <v-flex xs3 v-if="(player.fighters.length!==0) && FIGHTERS[player.fighters[0]]">
          <v-img
            :src="'../pic/stock-icons/' + FIGHTERS[player.fighters[0]].file + '.svg'"
            height="125px"
            contain
          ></v-img>
        </v-flex>
        <v-flex xs3 v-else>
          <v-img
            :src="'../pic/stock-icons/null.svg'"
            height="125px"
            contain
          ></v-img>
        </v-flex>
        <v-flex xs9>
          <v-card-title primary-title>
            <v-flex xs12>
              <div class="headline players__info" :title="tag">
                {{player.prefix}}{{player.prefix ? '｜': ''}}{{tag}}
              </div>
              <span class="players__info">{{ `${player.name}
                ${(player.country)? '('+player.country+')':''}` }}</span>
              <v-flex xs12>
                <v-icon color="white" small>fab fa-twitter</v-icon>
                <span class="players__info">
                  {{ ' ' +`${(player.twitter)? player.twitter:''}` }}
                </span>
              </v-flex>
            </v-flex>
          </v-card-title>
        </v-flex>
      </v-layout>
      <div>
        <v-divider v-if="editFunc || stateDelete" dark></v-divider>
        <v-card-actions v-if="editFunc || (deleteFunc && stateDelete)">
          <v-btn v-if="editFunc" flat dark @click.stop="editFunc(tag)">
            <v-icon>fas fa-edit</v-icon>
          </v-btn>
          <v-btn v-if="deleteFunc && stateDelete" color="error"
            @click.stop="deleteFunc(tag)">
            <v-icon>fas fa-trash-alt</v-icon>
          </v-btn>
        </v-card-actions>
      </div>
    </v-layout>
  </v-card>
</template>

<script>
import FIGHTERS from '@/data/fighters.json';

export default {
  name: 'PlayerCard',
  props: {
    player: Object,
    tag: String,
    color: String,
    editFunc: Function,
    deleteFunc: Function,
    stateDelete: Boolean,
  },
  data() {
    return {
      FIGHTERS,
    };
  },
};
</script>
<style lang="scss" scoped>
  .players{
    &__info{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
