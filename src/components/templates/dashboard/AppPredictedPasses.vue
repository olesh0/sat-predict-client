<template>
  <div class="app-predicted-passes">
    <div class="header">
      <div class="title">
        <h2>Next scheduled satellite passes</h2>

        <Refresh
          @click="refresh"
          class="refresh-button"
        />
      </div>

      <div
        class="selected-cat"
        @click="setShowSelectSection"
      >{{category}}</div>
    </div>

    <div class="passes-list">
      <app-sattelite-pass
        v-for="(pass, index) in passes.filter((_, index) => index < MAX_ITEMS)"
        v-bind:key="index"
        :info="pass"
        class="app-sattelite-pass"
        :isSelected="selectedPass === index"
        @click="setSelectedPass(pass, index)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import store from '@/store'

import AppSattelitePass from '@/components/templates/dashboard/AppSattelitePass.vue'
import Refresh from '@/assets/icons/Refresh.vue'

export default {
  data() {
    return {
      selectedPass: null,
      MAX_ITEMS: 100,
    }
  },
  methods: {
    ...mapActions({
      predictPassesForSection: 'sattelites/getPredictedPasses',
    }),
    async refresh() {
      const { category: sectionName } = this

      store.commit('ui/setShowPreloader', true)
      store.commit('ui/setShowSelectSection', false)

      await this.predictPassesForSection({ section: sectionName, force: true })

      setTimeout(() => store.commit('ui/setShowPreloader', false), 500)
    },
    setSelectedPass(pass, index) {
      store.commit('sattelites/setSelectedPass', pass)
      this.selectedPass = index
    },
    setShowSelectSection() {
      store.commit('ui/setShowSelectSection', !this.showSelectSection)
    },
  },
  watch: {
    passes() {
      this.selectedPass = null
    }
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
    Refresh,
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

    .title {
      display: flex;
      align-items: center;

      h2 {
        font-size: 1.5rem;
        margin: 0;
        font-weight: 100;
      }

      .refresh-button {
        margin-left: 15px;
        cursor: pointer;

        transform: scale(0.85);
        transition: all .15s;

        &:hover {
          transform: scale(1.1) rotate(180deg);
        }
      }
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
