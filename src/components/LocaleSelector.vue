<template>
  <div v-if="!state.loading" class="selector">
    <div class="selector__drop">
      <v-select
        :items="langs"
        :label="$t('keywords.language')"
        outline
        hide-details
        v-model="selectedLang"
        @change="loadLanguageAsync"
      ></v-select>
    </div>
  </div>
</template>

<script>
import { LANGUAGE_LIST, REP_SETTING_DEFAULT } from '@/data/constant';
/* global nodecg, NodeCG */
export default {
  name: 'LocaleSelector',
  data() {
    return {
      state: {
        loading: true,
      },
      loadedLanguages: ['zh_Hant_TW', 'en_US'],
      selectedLang: this.$i18n.locale,
      langs: LANGUAGE_LIST,
    };
  },
  methods: {
    async waitForReplicants() {
      await NodeCG.waitForReplicants(this.Rep);
      this.state.loading = false;
    },
    setI18nLanguage(lang) {
      this.$i18n.locale = lang;
      return lang;
    },
    async loadLanguageAsync(lang) {
      this.Rep.value.lang = lang;
      this.selectedLang = lang;
      if (!this.loadedLanguages.includes(lang)) {
        return import(/* webpackChunkName: "lang-[request]" */ `@/lang/${lang}`).then((msgs) => {
          this.$i18n.setLocaleMessage(lang, msgs.default);
          this.loadedLanguages.push(lang);
          return this.setI18nLanguage(lang);
        });
      }
      return Promise.resolve(this.setI18nLanguage(lang));
    },
  },
  created() {
    this.Rep = nodecg.Replicant('setting', {
      defaultValue: REP_SETTING_DEFAULT,
    });
    this.Rep.on('change', (newValue) => {
      this.loadLanguageAsync(newValue.lang);
      this.selectedLang = newValue.lang;
    });
    this.waitForReplicants();
  },
};
</script>

<style lang="scss" scoped>
  .selector{
    &__drop{
      max-width: 250px;
    }
    width: 100%;
    padding: 10px 0;
    display: flex;
    flex-direction: row-reverse;
  }
</style>
