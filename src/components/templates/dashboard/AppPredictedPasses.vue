<template>
  <div class="app-predicted-passes">
    <div class="header">
      <h2>Next scheduled satellite passes</h2>

      <div
        class="selected-cat"
        @click="setShowSelectSection"
      >{{category}}</div>
    </div>

    <div class="passes-list">
      <app-sattelite-pass
        v-for="(pass, index) in passes"
        v-bind:key="index"
        :info="pass"
        class="app-sattelite-pass"
        :listNumber="index"
        @click="setSelectedPass(pass)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'

import AppSattelitePass from '@/components/templates/dashboard/AppSattelitePass.vue'

export default {
  methods: {
    setSelectedPass(pass) {
      store.commit('sattelites/setSelectedPass', pass)
    },
    setShowSelectSection() {
      console.log('setshow', this.showSelectSection)

      store.commit('ui/setShowSelectSection', !this.showSelectSection)
    },
  },
  computed: {
    ...mapGetters({
      category: 'sattelites/category',
      passes: 'sattelites/passes',
      showSelectSection: 'ui/showSelectSection',
    }),
  },
  components: {
    AppSattelitePass,
  },
}
</script>

<style lang="less" scoped>
.app-predicted-passes {
  .header {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: 20px;
    align-items: center;

    h2 {
      font-size: 1.5rem;
      margin: 0;
      font-weight: 100;
    }

    .selected-cat {
      font-size: 1rem;
      font-weight: 100;
      color: #5F6D77;
      cursor: pointer;
    }
  }

  .passes-list {
    margin-top: 20px;
    overflow: auto;
    max-height: 47vh;

    .app-sattelite-pass {
      margin-bottom: 10px;
    }
  }
}
</style>
