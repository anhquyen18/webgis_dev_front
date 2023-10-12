import { defineStore } from 'pinia';

export const dataState = defineStore('data-state', {
  state: () => ({
    excludeRoads: [],
  }),

  actions: {
    setExcludeRoads(data) {
      this.excludeRoads = data;
    },
  },

  getters: {
    getExcludeRoads() {
      return this.excludeRoads;
    },
  },
});
