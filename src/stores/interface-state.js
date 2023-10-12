import { defineStore } from 'pinia';

export const interfaceState = defineStore('interface', {
  state: () => ({
    toolBoxVisible: false,
    featurePopupVisible: false,
    convertCrsModalVisible: false,
    signInVisible: false,
  }),

  actions: {
    setFeaturePopupVisible(visible) {
      this.featurePopupVisible = visible;
    },
    setConvertCrsModalVisible(visible) {
      this.convertCrsModalVisible = visible;
    },
    setToolBoxVisible(visible) {
      this.toolBoxVisible = visible;
    },
    setSignInVisible(visible) {
      this.signInVisible = visible;
    },
  },

  getters: {
    getFeaturePopupVisible() {
      return this.featurePopupVisible;
    },
    getConvertCrsModalVisible() {
      return this.convertCrsModalVisible;
    },
    getToolBoxVisible() {
      return this.toolBoxVisible;
    },
    getSignInVisible() {
      return this.signInVisible;
    },
  },
});
