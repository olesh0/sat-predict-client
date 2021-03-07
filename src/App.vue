<template>
  <div
    id="app"
    :data-theme="userThemeName"
  >
    <router-view />

    <app-preloader />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { DEFAULT_USER_THEME } from '@/core/constants'
import AppPreloader from '@/components/ui/AppPreloader.vue'

export default {
  methods: {
    ...mapActions({
      getUserThemeData: 'ui/getUserThemeData',
    }),
  },
  computed: {
    ...mapGetters({
      userThemeName: 'ui/userThemeName',
    }),
    userTheme() {
      return this.userThemeName || DEFAULT_USER_THEME
    },
  },
  async created() {
    try {
      const userTheme = await this.getUserThemeData()

      console.log(userTheme)
    } catch (e) {
      console.error(e)
    }
  },
  components: {
    AppPreloader,
  },
  name: 'app',
}
</script>

<style lang="less">
// Importing dark themes
@import url('./themes/dark/default-dark.less');
@import url('./themes/dark/spacegray.less');

// Importing light themes
@import url('./themes/light/default-light.less');

/* latin */
@font-face {
  font-family: 'Orbitron';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(./assets/orbitron/orbitron.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* latin */
@font-face {
  font-family: 'Orbitron';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(./assets/orbitron/orbitron.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
}

body, #app {
  width: 100vw;
  height: 100vh;

  padding: 0;
  margin: 0;

  /* Let's pretend it's a native app */
  cursor: default;
  user-select: none;

  background: var(--color-bg-dark);
  color: var(--color-font-main);

  font: 22px 'Orbitron', Tahoma, Arial;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
