<template>
  <app-modal :show="show">
    <div class="settings">
      <div class="header">
        <h1>Settings</h1>

        <button
          @click="$emit('close')"
          class="close-icon"
        >
          <Close />
        </button>
      </div>

      <div class="label">Themes</div>

      <div class="themes">
        <div
          v-for="theme in themesList"
          v-bind:key="theme.name.camelCase"
          class="theme"
          :class="{ selected: userThemeName === theme.name.camelCase }"
          @click="changeTheme(theme.name.camelCase)"
        >
          {{theme.name.default}}
        </div>
      </div>
    </div>
  </app-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import store from '@/store'
import AppModal from '@/components/ui/AppModal.vue'
import Close from '@/assets/icons/Close.vue'

import Themes from '@/assets/themes.json'

export default {
  methods: {
    ...mapActions({
      updateUserTheme: 'ui/updateUserTheme',
    }),
    async changeTheme(themeName) {
      if (themeName === this.userThemeName) return

      try {
        store.commit('ui/setShowPreloader', true)

        await this.updateUserTheme(themeName)
      } catch (e) {
        console.error(e)
      } finally {
        store.commit('ui/setShowPreloader', false)
      }
    },
  },
  computed: {
    ...mapGetters({
      userThemeName: 'ui/userThemeName',
    }),
    themesList() {
      return Themes || []
    },
  },
  components: {
    Close,
    AppModal,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="less" scoped>
.settings {
  padding: 1.8rem;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h1 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 100;
    }

    .close-icon {
      cursor: pointer;
      border: 0;
      background: transparent;
      outline: none;

      svg {
        height: 25px;
        width: 25px;
        fill: var(--color-font-dark);
      }
    }
  }

  .label {
    font-size: 1rem;
    color: var(--color-font-dark);

    margin-top: 20px;
  }

  .themes {
    margin-top: 10px;

    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 15px;

    .theme {
      background: var(--color-bg-light);
      padding: 15px 20px;
      text-align: center;
      border-radius: 5px;
      border: 2px solid transparent;
      cursor: pointer;

      font-size: 1.2rem;
      color: var(--color-font-dark);

      &.selected {
        color: var(--color-font-main);
        border-color: var(--color-accent-green);
      }
    }
  }
}
</style>