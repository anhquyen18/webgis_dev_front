<template>
  <a-spin tip="Loading..." size="large" :spinning="accountSpinning">
    <a-layout style="max-width: 100vw; height: 100vh">
      <a-layout-header v-if="!accountSpinning" class="header" style="max-height: 9vh; padding: 0">
        <a-row style="height: 100%">
          <a-col :span="3" :style="{ height: '100%', display: 'flex', alignItems: 'center' }">
            <a-button
              ghost
              class="ms-4"
              shape="circle"
              size="large"
              :style="{ backgroundColor: 'transparent', border: '0' }"
              @click="() => (collapsed = !collapsed)">
              <i class="fa-solid fa-bars"></i>
            </a-button>
            <img src="../assets/luffy-chilling-gear5-round.png" alt="logo" style="width: 5rem; height: 5rem" />
            <p class="text-white fw-bold fs-4">WAREC</p>
          </a-col>
          <a-col
            :offset="16"
            :span="5"
            :style="{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
            <router-link :to="{ name: 'home-page' }">
              <a-button ghost type="default" :style="headerButton">
                <p class="fw-bold">Trang chủ</p>
              </a-button>
            </router-link>

            <a-button ghost type="default" :style="headerButton">
              <p class="fw-bold">Hỗ trợ</p>
            </a-button>
            <a-divider type="vertical" style="background-color: white; height: 2rem" />
            <AccountNavigator></AccountNavigator>
          </a-col>
        </a-row>
      </a-layout-header>

      <a-layout v-if="!accountSpinning">
        <a-layout-sider
          v-model:collapsed="collapsed"
          :trigger="null"
          breakpoint="lg"
          collapsedWidth="0"
          width="250"
          @breakpoint="onBreakpoint"
          style="height: 100%; overflow: hidden">
          <a-menu
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            style="margin-top: 2rem"
            mode="inline"
            theme="dark"
            @select="test">
            <a-menu-item key="account-profile">
              <router-link :to="{ name: 'account-profile' }">
                <i class="fa-regular fa-user me-2"></i>
                <span>Thông tin tài khoản</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="account-password">
              <router-link :to="{ name: 'account-password' }">
                <i class="fa-solid fa-lock me-2"></i>
                <span>Thay đổi mật khẩu</span>
              </router-link>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout style="padding: 0; background-color: var(--dark-theme-color)">
          <a-layout-content
            :class="{ 'content-border': !collapsed }"
            :style="{ padding: '24px', margin: 0, minHeight: '280px', overflow: 'auto', backgroundColor: '#fff' }">
            <div style="overflow-y: auto">
              <router-view></router-view>
            </div>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </a-spin>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, provide } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import AccountNavigator from '../components/header/account-navigator.vue';
import { storeToRefs } from 'pinia';
import { accountMenu } from '../stores/account-menu.js';
import { userState } from '../stores/user-state';
import { setCookie, getCookie } from '../js/util';

export default defineComponent({
  components: {
    AccountNavigator,
  },
  setup() {
    let that = this;
    const store = accountMenu();
    const { selectedKeys, openKeys } = store;
    const collapsed = ref(false);
    const headerButton = { height: '2rem', backgroundColor: 'transparent', border: 'none' };

    const accountInfo = ref({});
    provide('accountInfo', accountInfo);

    const accountSpinning = ref(true);
    const profileSpinning = ref(false);
    provide('profileSpinning', profileSpinning);

    let accessToken = {
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    };
    let data = useRoute().params;
    const redirect = () => {
      useRouter().push('/');
    };

    const getSignedIn = () => {
      axios
        .post('http://127.0.0.1:8000/api/signed-in', data, accessToken)
        .then((response) => {
          if (response) {
            accountInfo.value = response.data.user;
            userState().onAuthentication();
            accountSpinning.value = false;
            // console.log(response.data);
            // console.log(response.data.geoserverAccount);
          }
        })
        .catch((error) => {
          console.log(error);
          window.location.href = '/';
          // console.log(useRouter());
          // that.$router.push({ name: 'home-page' });/
        });
    };
    getSignedIn();

    // getUserSignIn();
    // console.log('anhquyen');
    const onBreakpoint = (broken) => {
      // console.log(broken);
    };

    return { ...storeToRefs(store), headerButton, onBreakpoint, collapsed, accountSpinning, profileSpinning };
  },
  data() {
    return {
      contentBorder: {
        borderRadius: '0.6rem 0',
      },
    };
  },
  methods: {
    test() {
      console.log(this.openKeys);
    },
  },
});
</script>

<style lang="scss">
.content-border {
  border-radius: 0.6rem 0;
}
</style>
