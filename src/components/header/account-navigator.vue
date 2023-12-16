<template>
  <!-- <a-dropdown :style="{ backgroundColor: 'red' }" trigger="click">
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">Tài khoản</a-menu-item>
        <a-menu-item key="2">Đăng xuất</a-menu-item>
      </a-menu>
    </template> -->

  <a-popover
    overlayClassName="account-navigator-tooltip"
    v-model:open="visible"
    trigger="hover"
    placement="bottomRight"
    class="account-navigator-tooltip">
    <template #content>
      <div class="d-flex flex-column">
        <router-link :to="{ name: 'account-page' }">
          <a-button @click="accountClick" :style="{ backgroundColor: 'transparent', border: 'none' }">
            <p class="fw-bold">Account</p>
          </a-button>
        </router-link>

        <a-divider type="horizontal" style="background-color: grey" />
        <a-button @click="signOut" :style="{ backgroundColor: 'transparent', border: 'none' }">
          <p class="fw-bold">Log Out</p>
        </a-button>
      </div>
    </template>

    <a-button ghost :style="{ height: '2.6rem', backgroundColor: 'transparent', border: 'none' }" class="me-2">
      <div class="d-flex align-items-center">
        <i class="fa-regular fa-circle-user fs-2 me-2"></i>
        <p class="me-2 fw-bold">{{ accountName }}</p>
        <i class="fa-solid fa-chevron-down"></i>
      </div>
    </a-button>
  </a-popover>

  <!-- </a-dropdown> -->
</template>

<script>
import { defineComponent, ref, inject } from 'vue';
import { accountMenu } from '../../stores/account-menu';
import { userState } from '../../stores/user-state';
import { setCookie, getCookie } from '../../js/util.js';

export default defineComponent({
  setup() {
    const visible = ref(false);
    const accountInfo = inject('accountInfo');

    const accountName = accountInfo.value['name'];
    return {
      visible,
      accountName,
    };
  },
  computed: {},
  methods: {
    testSomethings() {
      // console.log(this.map);
    },
    accountClick() {
      accountMenu().selectedKeys = [];
    },
    signOut() {
      if (userState().getSignInState === true) {
        userState().onLogOut();
        setCookie('accessToken', '');
        setCookie('user', '');
        this.$router.push({ name: 'home-page' });
      }
    },
  },

  mounted() {
    // const mapStore = mapState();
    // const { getMap, setMap } = mapStore;
    // console.log(mapState().getMap);
  },
});
</script>

<style lang="scss">
.account-navigator-tooltip {
  // padding: 100px;
}
// .ant-popover .ant-popover-arrow {
//   display: none !important;
// }
.ant-popover .ant-popover-inner {
  background-color: var(--secondary-background-color) !important;
  // color=""
}

.ant-popover .ant-popover-arrow {
  &::after {
    background-color: var(--secondary-background-color) !important;
  }
  &::before {
    background-color: var(--secondary-background-color) !important;
  }
}
</style>
