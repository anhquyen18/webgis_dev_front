import { defineStore } from 'pinia';

export const userState = defineStore('signInId', {
  state: () => ({
    signInState: false,
    geoserverAccount: {},
  }),

  actions: {
    // onAuthentication(geoserverAccount) {
    //   this.signInState = true;
    //   this.geoserverAccount = geoserverAccount[0];
    // },
    onAuthentication() {
      this.signInState = true;
    },
    onLogOut() {
      this.signInState = false;
    },
  },

  getters: {
    getSignInState() {
      return this.signInState;
    },
    getGeoserverAccount() {
      return this.geoserverAccount;
    },
  },
});
