<template>
  <div class="d-flex">
    <a-popover trigger="click" placement="leftTop" v-model:open="signOutVisible">
      <template #content>
        <a @click="signOut">Đăng xuất</a>
      </template>
      <a-button
        ghost
        v-if="getSignInState == true"
        :type="buttonType"
        shape="circle"
        size="large"
        :style="{ border: 0 }">
        <i class="fa-solid fa-user-group"></i>
      </a-button>
    </a-popover>

    <a-tooltip placement="left" color="grey">
      <template #title>Đăng nhập</template>
      <a-button
        ghost
        v-if="getSignInState == false"
        :type="buttonType"
        shape="circle"
        size="large"
        @click="signInShower"
        :style="{ border: 0 }">
        <i class="fa-solid fa-right-to-bracket" :style="{ border: 0 }"></i>
      </a-button>
    </a-tooltip>
  </div>

  <a-drawer placement="right" :closable="false" :open="signInVisible" @close="signInOnClose">
    <div class="container-fluid d-flex flex-column justify-content-center">
      <img
        src="../assets/luffy-chilling-gear5-round.png"
        alt="logo"
        class="img-thumbnail mx-auto d-block"
        style="width: 10rem; height: 10rem" />
      <p class="text-center fs-5 fw-bold mb-4 mt-5">Đăng nhập</p>
      <p v-if="signInAuthErrors.status" class="text-danger fs-6 mx-auto text-center">* {{ signInAuthErrors.data }}</p>

      <a-form class="d-flex justify-content-center flex-column" @submit.prevent="signIn()">
        <a-input
          v-model:value="username"
          placeholder="Tài khoản"
          class="w-100 mb-1"
          :class="{
            'input-danger': signInValidateErrors.username,
          }"
          allowClear>
          <template #prefix>
            <i class="fa-regular fa-user me-1"></i>
          </template>
        </a-input>
        <small v-if="signInValidateErrors.username" class="text-danger mb-2 ms-2"
          >* {{ signInValidateErrors.username[0] }}</small
        >
        <a-input-password
          v-model:value="password"
          placeholder="Mật khẩu"
          class="w-100 mb-1"
          :class="{
            'input-danger': signInValidateErrors.password,
          }"
          allowClear>
          <template #prefix>
            <i class="fa-solid fa-key me-1"></i>
          </template>
        </a-input-password>
        <small v-if="signInValidateErrors.password" class="text-danger ms-2">
          * {{ signInValidateErrors.password[0] }}
        </small>
        <a-form-item name="remember">
          <a-checkbox v-model:checked="rememberPassword">Lưu đăng nhập</a-checkbox>
        </a-form-item>

        <a-button
          size="large"
          type="default"
          html-type="submit"
          class="mx-auto align-self-end mt-5"
          :style="{ border: 0 }">
          <i class="fa-solid fa-arrow-right-to-bracket fs-5"></i>
        </a-button>

        <a-button size="large" type="link" class="mx-auto mt-5 text-muted">Không thể đăng nhập? </a-button>
      </a-form>
    </div>
  </a-drawer>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { userState } from '../stores/user-state';
import { storeToRefs } from 'pinia';
import { interfaceState } from '../stores/interface-state';
import { setCookie, getCookie } from '../js/util';

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = interfaceState();
    const { signInVisible } = store;
    const userStore = userState();
    const { signInState } = userStore;
    const state = reactive({
      rememberPassword: false,
    });
    let accessToken = {
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    };

    const getSignedIn = () => {
      axios
        .get('http://127.0.0.1:8000/api/signed-in', accessToken)
        .then((response) => {
          if (response) {
            userStore.onAuthentication();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const signOutVisible = ref(false);
    const signInValidateErrors = ref({});
    const signInAuthErrors = ref({});
    const signInShower = () => {
      if (signInState === false) {
        store.setSignInVisible(true);
      }
    };
    const user = inject('userData');
    const homeSpinning = inject('homeSpinning');
    const signInOnClose = () => {
      store.setSignInVisible(false);
    };
    const signInUser = reactive({
      username: 'anhquyendeptraivcl',
      password: 'admin',
    });
    const onFinish = () => {
      console.log('open');
    };
    const onFinishFailed = () => {
      console.log('close');
    };

    const signIn = () => {
      getUserSignIn();
    };
    var buttonType = ref('default');

    const getUserSignIn = () => {
      homeSpinning.value = true;
      axios
        .post('http://127.0.0.1:8000/api/sign-in', signInUser)
        .then((response) => {
          setCookie('accessToken', response.data.token);
          setCookie('user', JSON.stringify(response.data.user));
          message.success('Đăng nhập thành công');
          userStore.onAuthentication();

          user.value = response.data.user[0];
          console.log(user.value);
          store.setSignInVisible(false);

          console.log(response.data);
          homeSpinning.value = false;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == 400) signInAuthErrors.value = error.response;
          else if (error.response.status == 422) signInValidateErrors.value = error.response.data.errors;
        });
    };

    const signOut = () => {
      if (userState().getSignInState === true) {
        signOutVisible.value = false;
        setCookie('accessToken', '');
        setCookie('user', '');
        location.reload();
      }
    };

    return {
      ...storeToRefs(store),
      ...storeToRefs(userStore),
      signInShower,
      signInOnClose,
      ...toRefs(signInUser),
      ...toRefs(state),
      signIn,
      buttonType,
      signInValidateErrors,
      signInAuthErrors,
      signOut,
      signOutVisible,
    };
  },
  props: ['homeSignInState'],
  created() {
    // console.log(this.homeSignInState); //prints out an empty string
    // console.log(this.signInState + ' sign in');
  },

  computed: {
    getSignInState: function () {
      return userState().getSignInState;
    },
    getGeoserverAccount: function () {
      return userState().getGeoserverAccount;
    },
  },

  mounted() {
    // this.state.signInState = this.userState().getSignInState;
    // console.log(this.signInState);
    // console.log(userState().getSignInState);
    // this.signInState = userState().getSignInState;
  },
});
</script>
