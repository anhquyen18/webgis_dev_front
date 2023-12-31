import { defineStore } from 'pinia';

export const accountMenu = defineStore('accountMenuId', {
  state: () => ({
    selectedKeys: [],
    openKeys: [],
  }),

  actions: {
    onSelectedKeys(data) {
      this.selectedKeys = data;
    },
    onOpenKeys(data) {
      this.openKeys = data;
    },
  },
});
