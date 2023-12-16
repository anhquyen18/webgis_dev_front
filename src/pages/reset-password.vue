<template>
  <a-spin :spinning="resetSpinning" tip="Just a second..." size="large">
    <a-layout class="layout" style="max-height: 100vh; max-width: 100vw">
      <a-layout-header style="height: 9vh; max-height: 9vh; padding: 0; box-shadow: 0 0rem 1.2rem 0 rgba(0, 0, 0, 0.8)">
        <!-- <img src="../../../assets/" alt="logo" style="width: 5rem; height: 5rem" /> -->
        <a-row style="height: 100%">
          <router-link :to="{ name: 'home-page' }">
            <a-col :span="3" :style="{ height: '100%', display: 'flex', alignItems: 'center' }">
              <img src="../assets/luffy-chilling-gear5-round.png" alt="logo" style="width: 5rem; height: 5rem" />
              <p class="fw-bold fs-4" style="color: darkgray">Pai</p>
            </a-col>
          </router-link>
        </a-row>
      </a-layout-header>
      <a-layout-content
        style="
          padding: 50px;
          background-color: black;
          color: white;
          height: 91vh;
          max-height: 91vh;
          overflow: hidden;
          justify-content: center;
        ">
        <a-row justify="center">
          <a-col :xl="8" :md="16" :xs="24">
            <div class="d-flex flex-column">
              <h1 class="fs-4">Reset password</h1>

              <a-form
                layout="vertical"
                :model="resetUser"
                name="resetForm"
                :rules="resetFormRules"
                ref="resetFormRef"
                hideRequiredMark>
                <a-form-item class="mt-4" name="password" hasFeedback>
                  <template #label>
                    <p class="fw-bold text-white">New Password</p>
                  </template>
                  <a-input-password v-model:value="resetUser.password"></a-input-password>
                </a-form-item>

                <a-form-item class="mt-4" name="confirmPassword" hasFeedback>
                  <template #label>
                    <p class="fw-bold text-white">Confirm Password</p>
                  </template>
                  <a-input-password v-model:value="resetUser.confirmPassword"></a-input-password>
                </a-form-item>
              </a-form>

              <a-row class="mt-4" justify="left">
                <a-button
                  :disabled="resetDisabled"
                  type="primary"
                  @click.prevent="reset"
                  :style="{ border: 0, width: '20%' }">
                  Reset
                </a-button>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </a-spin>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
export default defineComponent({
  beforeRouteEnter(to, from, next) {
    axios;
    // .post('http://127.0.0.1:8000/api/reset-password', { token: to.params.token })
    to.meta.title = 'Reset Password';
    axios
      .post('http://127.0.0.1:8000/api/check-reset-link', { token: to.params.token })
      .then((response) => {
        console.log(response);
        next();
      })
      .catch((error) => {
        console.log(error);
        next('/');
        message.error(error.response.data.error, 3);
      });
  },
  setup() {
    const resetSpinning = ref(false);
    const resetFormRef = ref();
    const resetUser = ref({
      password: 'anhquyen11',
      confirmPassword: 'anhquyen11',
    });

    const validatePass = async (_rule, value) => {
      if (value === '') {
        resetDisabled.value = true;
        return Promise.reject('Please enter your password!');
      } else {
        if (resetUser.value.confirmPassword !== '') {
          resetFormRef.value.validateFields('confirmPassword');
        }
        // resetDisabled.value = false;
        return Promise.resolve();
      }
    };
    const validatePass2 = async (_rule, value) => {
      if (value === '') {
        resetDisabled.value = true;
        return Promise.reject('Please enter your password!');
      } else if (value !== resetUser.value.password) {
        resetDisabled.value = true;
        return Promise.reject('Please verify your password!');
      } else {
        resetDisabled.value = false;
        return Promise.resolve();
      }
    };

    const resetFormRules = {
      password: [
        {
          required: true,
          validator: validatePass,
          trigger: 'change',
        },
        {
          min: 8,
          message: 'Password contains at least 8 characters!',
          trigger: 'change',
        },
      ],
      confirmPassword: [
        {
          required: true,
          validator: validatePass2,
          trigger: 'change',
        },
      ],
    };
    const resetDisabled = ref(true);
    return {
      resetSpinning,
      resetFormRef,
      resetUser,
      resetFormRules,
      resetDisabled,
    };
  },
  computed: {},
  data() {
    return {};
  },
  methods: {
    reset() {
      this.resetFormRef
        .validate()
        .then((response) => {
          axios
            .post('http://127.0.0.1:8000/api/reset-password', {
              token: this.$route.params.token,
              password: this.resetUser.password,
            })
            .then((response) => {
              console.log(response);
              message.success(response.data.success, 3);
              this.$router.push({ name: 'home-page' });
            })
            .catch((error) => {
              console.log(error);
              message.error(error.response.data.error, 3);
              this.$router.push({ name: 'home-page' });
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  mounted() {},
});
</script>
