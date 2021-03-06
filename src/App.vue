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
#app[data-theme="defaultDark"] {
  /* Don't forget to change some of these in core/constants.js */
  --color-bg-dark: #17191A; // main bg
  --color-bg-light: #242729;
  --color-font-dark: #5F6D77;
  --color-font-light: #848F97;
  --color-font-main: #eee;

  --color-accent-green: rgb(34, 213, 164);
  --color-accent-red: rgb(213, 34, 34);
  --color-accent-purple: #8E22D5;

  --color-bg-user-coords-input: rgba(255, 255, 255, .04);
  --coords-button-font-color: #000;

  --color-accent-green-fade: fadeout(rgb(34, 213, 164), 60%);
  --color-accent-red-fade: fadeout(rgb(213, 34, 34), 60%);
  --color-accent-purple-fade: fadeout(#8E22D5, 60%);

  --color-accent-green-ultra-fade: fadeout(rgb(34, 213, 164), 80%);
  --color-accent-red-ultra-fade: fadeout(rgb(213, 34, 34), 80%);
  --color-accent-purple-ultra-fade: fadeout(#8E22D5, 80%);
}

// Just for testing
#app[data-theme="defaultLight"] {
  /* Don't forget to change some of these in core/constants.js */
  --color-bg-dark: #bdbbbb;
  --color-bg-light: #dddddd;
  --color-font-dark: #7b8a94;
  --color-font-light: #646e75;
  --color-font-main: rgb(78, 78, 80);

  --color-accent-green: rgb(28, 182, 141);
  --color-accent-red: rgb(168, 26, 26);
  --color-accent-purple: #6c19a3;

  --color-bg-user-coords-input: rgba(255, 255, 255, .04);
  --coords-button-font-color: #000;

  --color-accent-green-fade: fadeout(rgb(34, 213, 164), 60%);
  --color-accent-red-fade: fadeout(rgb(213, 34, 34), 60%);
  --color-accent-purple-fade: fadeout(#8E22D5, 60%);

  --color-accent-green-ultra-fade: fadeout(rgb(34, 213, 164), 80%);
  --color-accent-red-ultra-fade: fadeout(rgb(213, 34, 34), 80%);
  --color-accent-purple-ultra-fade: fadeout(#8E22D5, 80%);
}

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
