<template>
  <div class="app-predicted-passes">
    <h2>Next scheduled satellite passes</h2>

    <div class="passes-list">
      <app-sattelite-pass
        v-for="i in 25"
        v-bind:key="i"
        class="app-sattelite-pass"
        :listNumber="i"
      />
    </div>
  </div>
</template>

<script>
import AppSattelitePass from '@/components/templates/dashboard/AppSattelitePass.vue'

export default {
  components: {
    AppSattelitePass,
  },
}
</script>

<style lang="less" scoped>
.app-predicted-passes {
  h2 {
    font-size: 1.5rem;
    margin: 0;
    font-weight: 100;
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