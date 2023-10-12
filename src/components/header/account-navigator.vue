<template>
  <!-- <a-dropdown :style="{ backgroundColor: 'red' }" trigger="click">
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">Tài khoản</a-menu-item>
        <a-menu-item key="2">Đăng xuất</a-menu-item>
      </a-menu>
    </template> -->

  <a-popover v-model:open="visible" trigger="hover">
    <template #content>
      <div class="d-flex flex-column">
        <router-link :to="{ name: 'account-page' }">
          <a-button @click="accountClick" :style="{ backgroundColor: 'transparent', border: 'none' }">
            <p class="fw-bold">Tài khoản</p>
          </a-button>
        </router-link>

        <a-divider type="horizontal" style="background-color: grey" />
        <a-button @click="signOut" :style="{ backgroundColor: 'transparent', border: 'none' }">
          <p class="fw-bold">Đăng xuất</p>
        </a-button>
      </div>
    </template>

    <a-button ghost :style="{ height: '2.6rem', backgroundColor: 'transparent', border: 'none' }">
      <div class="d-flex align-items-center">
        <i class="fa-regular fa-circle-user fs-2 me-2"></i>
        <p class="me-2 fw-bold">Tài khoản</p>
        <i class="fa-solid fa-chevron-down"></i>
      </div>
    </a-button>
  </a-popover>

  <!-- </a-dropdown> -->
</template>

<script>
import { defineComponent, ref } from 'vue';
import { accountMenu } from '../../stores/account-menu';
import { userState } from '../../stores/user-state';

export default defineComponent({
  setup() {
    const visible = ref(false);
    return {
      visible,
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
        window.sessionStorage.removeItem('accessToken');
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
