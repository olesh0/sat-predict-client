<template>
  <div
    class="app-modal"
    :class="{ show }"
  >
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="less" scoped>
.app-modal {
  position: fixed;
  top: 0;
  left: 0;

  z-index: 1000;

  width: 100vw;
  height: 100vh;

  background: rgba(0, 0, 0, .5);
  display: flex;

  opacity: 0;
  visibility: hidden;

  transition: all .3s;

  &.show {
    opacity: 1;
    visibility: visible;

    .body {
      transform: scale(1);
    }
  }

  .body {
    transform: scale(.9);

    margin: auto;
    border-radius: 5px;

    min-width: 60vw;
    min-height: 60vh;

    max-width: 90vw;
    max-height: 90vh;

    overflow: auto;
    background: var(--color-bg-dark);

    transition: all .3s;
  }
}
</style>
