<template>
  <div id="app">
    <router-view/>

    <app-preloader />
  </div>
</template>

<script>
import AppPreloader from '@/components/ui/AppPreloader.vue'

export default {
  name: 'app',
  components: {
    AppPreloader,
  },
}
</script>

<style lang="less">
:root {
  /* Don't forget to change some of these in core/constants.js */
  --color-bg-dark: #000;
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

  background: #17191A;
  color: #EEE;

  font: 22px 'Orbitron', Tahoma, Arial;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
