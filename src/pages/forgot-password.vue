<template>
  <a-spin :spinning="recoverySpinning" tip="Just a second..." size="large">
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
      <a-layout-content style="padding: 50px; background-color: black; color: white; height: 91vh; max-height: 91vh">
        <a-row justify="center">
          <a-col :xl="8" :md="16" :xs="24">
            <div v-if="!finishForm" class="d-flex flex-column">
              <h1 class="fs-4">Getting back into your Pai account</h1>
              <p v-if="recoveryFormStep === '1'" class="fs-5 mt-3">Tell us some information about your account.</p>
              <p v-if="recoveryFormStep === '2'" class="fs-5 mt-3">
                Next, give us the Pai username you're having trouble with.
              </p>
              <!-- v-if="recoveryFormStep === '2'" -->
              <a-card
                v-if="recoveryFormError.doNotMatch"
                class="mt-3"
                size="small"
                :bordered="false"
                :bodyStyle="{ padding: '5px 30px', borderBottom: '5px solid var(--error-color)' }"
                :headStyle="{ padding: '10px 30px 0px 30px', borderBottom: 'none' }"
                style="
                  box-shadow: 0 0.2rem 1.2rem rgba(0, 0, 0, 0.2);
                  background-color: var(--secondary-background-color2);
                  color: grey;
                  border: 1px solid var(--error-color);
                ">
                <template #title>
                  <p style="text-wrap: wrap; color: white">
                    That Username and {{ recoveryUser.type }} ({{ recoveryUser.emailOrNumber }}) don’t match.
                  </p>
                </template>
                <template #extra>
                  <i class="fa-solid fa-triangle-exclamation fs-4" style="color: var(--error-color)"></i>
                </template>
                <p>Verification failed because provided code doss not match.</p>
              </a-card>

              <a-form
                layout="vertical"
                :model="recoveryUser"
                name="recoveryForm"
                :rules="recoveryFormRules"
                ref="recoveryFormRef"
                hideRequiredMark>
                <a-form-item class="mt-4" name="emailOrNumber" hasFeedback>
                  <template #label v-if="recoveryFormStep === '1'">
                    <p class="fw-bold text-white">Enter your email or phone number</p>
                    <a-tooltip
                      color="var(--secondary-background-color2)"
                      placement="right"
                      :overlayInnerStyle="{ padding: '10px' }">
                      <i class="fa-solid fa-circle-info ms-2 me-1" style="color: grey"></i>
                      <template #title>
                        Using a phone number to reset password is a beta feature. Learn more in this
                        <a>help article</a>
                      </template>
                    </a-tooltip>
                  </template>
                  <template #label v-if="recoveryFormStep === '2'">
                    <p class="fw-bold text-white">{{ recoveryUser.type }}</p>
                  </template>
                  <a-input
                    v-if="recoveryFormStep === '1'"
                    v-model:value="recoveryUser.emailOrNumber"
                    placeholder=""></a-input>
                  <a-row v-if="recoveryFormStep === '2'" :wrap="true" align="middle">
                    <a-col :span="18">
                      <div style="width: 100%; word-wrap: break-word">
                        <p style="color: grey; font-size: 1.3rem; font-weight: bold">
                          {{ recoveryUser.emailOrNumber }}
                        </p>
                      </div>
                    </a-col>

                    <a-col :offset="1" :span="4">
                      <a-button
                        class="ms-2"
                        type="default"
                        @click.prevent="backToStep1"
                        ghost
                        :style="{ backgroundColor: 'transparent', border: 'none' }">
                        <EditOutlined class="fs-4"></EditOutlined>
                      </a-button>
                    </a-col>
                  </a-row>
                </a-form-item>

                <a-form-item v-if="recoveryFormStep === '1'" class="mt-4">
                  <a-button
                    :disabled="continueDisabled"
                    type="primary"
                    @click.prevent="nextStep2"
                    :style="{ border: 0 }">
                    Continue
                  </a-button>
                </a-form-item>

                <a-form-item v-if="recoveryFormStep === '2'" class="mt-4" name="username" hasFeedback>
                  <template #label> <p class="fw-bold text-white">Enter your username</p> </template>
                  <a-input v-model:value="recoveryUser.username" placeholder="" @change="usernameChange"></a-input>
                </a-form-item>

                <a-form-item v-if="recoveryFormStep === '2'" class="mt-4">
                  <a-row justify="center">
                    <a-col :span="12" :xs="13" :lg="12">
                      <a-button
                        :disabled="sendLinkDisabled"
                        type="primary"
                        @click.prevent="sendLink"
                        :style="{ border: 0 }">
                        Send My Password Reset Link
                      </a-button>
                    </a-col>
                    <a-col :span="12">
                      <a-button
                        :disabled="sendLinkDisabled"
                        type="default"
                        @click.prevent="forgotUsername"
                        :style="{ border: 0 }">
                        I Don't Know My Username
                      </a-button>
                    </a-col>
                  </a-row>
                </a-form-item>
              </a-form>
            </div>
            <div v-else-if="finishForm" style="word-wrap: break-word">
              <h1 class="fs-4">Check your email</h1>
              <p class="fs-5 mt-3">Please go to your</p>
              <p class="fs-5 mt-3">{{ recoveryUser.emailOrNumber }} {{ recoveryUser.type }} to reset your password.</p>
              <p class="fs-5 mt-3 mb-3">
                It could take a few minutes to appear, and be sure to check any spam and promotional folders, just in
                case!
              </p>

              <a-row justify="left">
                <a-button type="primary" @click.prevent="startOver" :style="{ border: 0 }"> Start Over </a-button>
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
import { EditOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';

export default defineComponent({
  components: {
    EditOutlined,
  },
  beforeRouteEnter(to, from, next) {
    // document.title = 'Forgot Password';
    next();
  },

  setup() {
    // console.log('anhquyendeptraivcl@gmail.com');
    const recoverySpinning = ref(false);
    const recoveryFormError = ref({
      doNotMatch: false,
    });
    const recoveryFormStep = ref('1');
    const recoveryFormRef = ref();
    const recoveryUser = ref({
      emailOrNumber: '',
      username: '',
      type: '',
    });
    const emailAndNumberValidator = async (_rule, value) => {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
      const phoneNumberRegex = /^\d{10}$/;
      const phoneNumberRegex1 = /^\d{11}$/;
      const numberRegex = /[^0-9]/;
      if (!value) {
        continueDisabled.value = true;
        return Promise.reject('Please enter your email or phone number!');
      } else if (phoneNumberRegex.test(value) || phoneNumberRegex1.test(value)) {
        recoveryUser.value.type = 'Phone number';
        continueDisabled.value = false;
        return Promise.resolve();
      } else if (emailRegex.test(value)) {
        recoveryUser.value.type = 'Email';
        continueDisabled.value = false;
        return Promise.resolve();
      } else {
        continueDisabled.value = true;
        return Promise.reject('Invalid email or phone number');
      }
    };

    const usernameValidator = async (_rule, value) => {
      if (recoveryFormError.value.doNotMatch) {
        sendLinkDisabled.value = true;
        return Promise.reject('');
      } else if (!value) {
        sendLinkDisabled.value = true;
        return Promise.reject('Please enter your username!');
      } else {
        recoveryFormError.value.doNotMatch = false;
        sendLinkDisabled.value = false;
        return Promise.resolve();
      }
    };
    const recoveryFormRules = {
      emailOrNumber: [
        {
          validator: emailAndNumberValidator,
          trigger: 'change',
        },
      ],
      username: [
        {
          validator: usernameValidator,
          trigger: 'change',
        },
      ],
    };
    const continueDisabled = ref(true);
    const sendLinkDisabled = ref(true);
    const finishForm = ref(false);
    return {
      recoverySpinning,
      recoveryFormError,
      recoveryFormStep,
      recoveryFormRef,
      recoveryUser,
      recoveryFormRules,
      continueDisabled,
      sendLinkDisabled,
      finishForm,
    };
  },
  computed: {},
  data() {
    return {};
  },
  methods: {
    nextStep2() {
      console.log(this.useRouter);
      this.recoveryFormRef
        .validate(['email'])
        .then((response) => {
          this.recoveryFormStep = '2';
        })
        .catch((error) => {});
    },
    backToStep1() {
      this.recoveryFormStep = '1';
      this.recoveryFormError.doNotMatch = false;
    },
    sendLink() {
      this.recoverySpinning = true;
      this.recoveryFormRef
        .validate()
        .then((response) => {
          axios
            .post('http://127.0.0.1:8000/api/send-email-reset-password', this.recoveryUser)
            .then((response) => {
              if (response) {
                console.log(response);
                this.recoverySpinning = false;
                this.finishForm = true;
                message.success(response.data.success, 4);
              }
            })
            .catch((error) => {
              console.log(error);
              this.recoverySpinning = false;

              if (error.response.data.doNotMatch) this.recoveryFormError.doNotMatch = true;
              message.error('Somethings go wrong, please try again later!');
              this.recoveryFormRef.validate();
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    usernameChange() {
      this.recoveryFormError.doNotMatch = false;
    },
    forgotUsername() {},

    startOver() {
      // this.finishForm = false;
      // this.recoveryUser.value = {
      //   emailOrNumber: '',
      //   username: '',
      //   type: '',
      // };
      window.location.reload();
    },
  },

  mounted() {},
});
</script>
