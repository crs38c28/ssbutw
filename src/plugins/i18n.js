import Vue from 'vue';
import VueI18n from 'vue-i18n';
import langTW from '@/lang/zh_Hant_TW.json';
import langEN from '@/lang/en_US.json';

Vue.use(VueI18n);

const messages = {
  en_US: langEN,
  zh_Hant_TW: langTW,
};

const i18n = new VueI18n({
  locale: 'zh_Hant_TW',
  fallbackLocale: 'en_US',
  messages,
});

export default i18n;
