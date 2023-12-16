<template>
  <a-spin tip="Loading..." size="large" :spinning="accountSpinning">
    <a-layout style="max-width: 100vw; height: 100vh">
      <a-layout-header
        v-if="!accountSpinning"
        class="header"
        style="max-height: 9vh; padding: 0; background-color: var(--dark1-theme-color)">
        <a-row justify="space-between" style="height: 100%">
          <a-col :span="4" :style="{ height: '100%', display: 'flex', alignItems: 'center' }">
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
            <p class="fw-bold fs-4" style="color: darkgray"></p>
          </a-col>

          <a-col :span="4" :style="{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'right' }">
            <a-col :xl="{ span: 24 }" :md="{ span: 24 }" :xs="{ span: 0 }">
              <div style="display: flex; align-items: center; justify-content: right">
                <router-link :to="{ name: 'home-page' }">
                  <a-button ghost type="default" :style="headerButton">
                    <p class="fw-bold">Home</p>
                  </a-button>
                </router-link>

                <a-button ghost type="default" :style="headerButton">
                  <p class="fw-bold">Support</p>
                </a-button>
              </div>
            </a-col>
            <!-- <a-divider type="vertical" style="background-color: white; height: 2rem" /> -->
            <AccountNavigator></AccountNavigator>
          </a-col>
        </a-row>
      </a-layout-header>

      <a-layout v-if="!accountSpinning">
        <a-layout-sider
          v-model:collapsed="collapsed"
          :trigger="null"
          breakpoint="xl"
          collapsedWidth="0"
          @breakpoint="onBreakpoint"
          ref="sider"
          style="height: 100%; overflow: hidden">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            style="margin-top: 2rem"
            mode="inline"
            theme="dark"
            @select="test">
            <a-menu-item key="account-profile">
              <router-link :to="{ name: 'account-profile' }">
                <i class="fa-regular fa-user me-2"></i>
                <span>Edit profile</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="account-password">
              <router-link :to="{ name: 'account-password' }">
                <i class="fa-solid fa-lock me-2"></i>
                <span>Change password</span>
              </router-link>
            </a-menu-item>
            <a-menu-item v-if="accountInfo.department_id === 3" key="account-users-manager">
              <router-link :to="{ name: 'account-users-manager' }">
                <i class="fa-solid fa-building-user me-2"></i>
                <span>Users manager</span>
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
import { defineComponent, ref, reactive, toRefs, provide, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import AccountNavigator from '../components/header/account-navigator.vue';
import { storeToRefs } from 'pinia';
import { accountMenu } from '../stores/account-menu.js';
import { userState } from '../stores/user-state';
import { setCookie, getCookie } from '../js/util';
import { message } from 'ant-design-vue';
import Profile from '../pages/account/profile/index.vue';

export default defineComponent({
  components: {
    AccountNavigator,
  },

  beforeRouteEnter(to, from, next) {
    if (getCookie('accessToken') === '') {
      message.error('Please sign in!');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      // Cái này cho vào route rồi mới xử lý xác thực
      // Nếu chưa xác thực được thì không cho vào thì nên để next then
      // layout ẩn then accountSpin nên nếu chưa xác thực xong thì cũng chẳng hiện background
      // chỉ hiện mỗi loading spin
      // còn ở home thì cho hiển thị giao diện ở background
      // vì ở không cần bảo mật thông tin
      next((data) => {
        const getSignedIn = () => {
          axios
            .post(
              'http://127.0.0.1:8000/api/signed-in',
              { accountId: to.params.accountId },
              {
                headers: {
                  Authorization: `Bearer ${getCookie('accessToken')}`,
                },
              }
            )
            .then((response) => {
              if (response) {
                userState().onAuthentication();
                setCookie('user', JSON.stringify(response.data.user));
                data.accountSpinning = false;
                data.accountInfo = JSON.parse(getCookie('user'));
              }
            })
            .catch((error) => {
              console.log(error);
              setCookie('accessToken', '');
              setCookie('user', '');
              message.error(error.response.data.error);
              setTimeout(() => {
                window.location.href = '/';
              }, 1000);
            });
        };
        getSignedIn();
      });
    }
  },

  setup() {
    let that = this;
    const router = useRouter();
    const store = accountMenu();
    // const { selectedKeys, openKeys } = store;
    const collapsed = ref(false);
    const headerButton = { height: '2rem', backgroundColor: 'transparent', border: 'none' };

    const accountInfo = ref('');
    provide('accountInfo', accountInfo);

    const accountSpinning = ref(true);
    const profileSpinning = ref(false);
    provide('profileSpinning', profileSpinning);

    let data = useRoute().params;
    const redirect = () => {
      useRouter().push('/');
    };

    const onBreakpoint = (broken) => {
      // console.log(broken);
    };

    return {
      ...storeToRefs(store),
      headerButton,
      onBreakpoint,
      collapsed,
      accountSpinning,
      profileSpinning,
      accountInfo,
    };
  },
  data() {
    return {
      contentBorder: {
        borderRadius: '0.6rem 0',
      },
    };
  },
  methods: {
    test(value) {
      // console.log(this.selectedKeys);
      // console.log(value);
    },
  },
});
</script>

<style lang="scss"></style>
