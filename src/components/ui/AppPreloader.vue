<template>
  <div
    class="app-preloader"
    :class="{ show }"
  >
    <div class="preloader">
      <div class="round round1"></div>
      <div class="round round2"></div>
      <div class="round round3"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      show: 'ui/showPreloader',
    }),
  },
}
</script>

<style lang="less" scoped>
@preloader-size: 150px;

.app-preloader {
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, .4);

  display: flex;

  opacity: 0;
  visibility: hidden;

  transition: all .3s;

  &.show {
    opacity: 1;
    visibility: visible;
  }

  .preloader {
    margin: auto;
    width: @preloader-size;
    height: @preloader-size;

    position: relative;

    .red {
      border-color: #D52222;
    }

    .green {
      border-color: #22D5A4;
    }

    .purple {
      border-color: #8E22D5;
    }

    @keyframes spinner {
      0%, 100% {
        transform: rotate(360deg);
      }

      50% {
        transform: rotate(0deg);
      }
    }

    .round {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 3px solid transparent;

      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      margin: auto;

      &.round1 {
        .purple();

        width: 90%;
        height: 90%;
        border-left-color: transparent;
        animation: 1.5s spinner .3s infinite;
      }

      &.round2 {
        .green();

        width: 70%;
        height: 70%;
        border-right-color: transparent;
        animation: 1.5s spinner .6s infinite;
      }

      &.round3 {
        .red();

        width: 50%;
        height: 50%;
        border-bottom-color: transparent;
        animation: 1.5s spinner 0s infinite;
      }
    }
  }
}
</style>
