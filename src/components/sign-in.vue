<template>
  <a-row>
    <a-col :xl="12" :xs="24">
      <a-popover trigger="click" placement="leftTop" v-model:open="signOutVisible">
        <template #content>
          <a @click="signOut">Log Out</a>
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
      <a-button
        ghost
        v-if="getSignInState == false"
        type="primary"
        size="large"
        @click="signInShower"
        :style="{ padding: '0px 10px', fontSize: '0.8rem', borderRadis: '0' }">
        Sign In
      </a-button>
    </a-col>

    <a-col :xl="12" :xs="0" v-if="getSignInState == false">
      <a-button
        class="ms-2"
        danger
        ghost
        size="large"
        type="primary"
        @click="signUpShower"
        :style="{ padding: '0px 10px', fontSize: '0.8rem', borderRadis: '0' }">
        Sign up
      </a-button>
    </a-col>
  </a-row>

  <a-drawer placement="right" :open="signInVisible" @close="signInOnClose" :headerStyle="{ border: 'none' }">
    <a-spin :spinning="signInSpinning" tip="Just a second..." style="margin-top: 4rem">
      <div class="container-fluid d-flex flex-column justify-content-center">
        <img
          src="../assets/luffy-chilling-gear5-round.png"
          alt="logo"
          class="img-thumbnail mx-auto d-block"
          style="width: 10rem; height: 10rem" />
        <div class="sign-in-panel" v-if="!signUpFormOpen">
          <p class="text-center fs-5 fw-bold mb-4 mt-5">Sign In</p>
          <p v-if="signInAuthErrors.status" class="text-danger fs-6 mx-auto text-center">
            * {{ signInAuthErrors.data }}
          </p>

          <a-form
            class="d-flex justify-content-center flex-column"
            layout="vertical"
            :label-col="{ span: 0, offset: 0 }"
            :wrapper-col="{ span: 0, offset: 0 }"
            :model="signInUser"
            :rules="signInFormRules"
            hideRequiredMark
            @submit.prevent="signIn()"
            @change="signInFormChangeTest">
            <a-form-item class="mt-4" name="username">
              <template #label>
                <p class="fw-bold">Username</p>
              </template>
              <a-input v-model:value="signInUser.username" placeholder=""></a-input>
            </a-form-item>

            <!-- <small v-if="signInValidateErrors.username" class="text-danger mb-2 ms-2">
            * {{ signInValidateErrors.username[0] }}
          </small> -->

            <a-form-item name="password">
              <template #label>
                <p class="fw-bold">Password</p>
              </template>
              <a-input-password v-model:value="signInUser.password" placeholder="Mật khẩu"> </a-input-password>
            </a-form-item>

            <a-form-item name="loginTrouble">
              <router-link :to="{ name: 'forgot-password-page' }">
                <a-button ghost size="small" type="primary" :style="{ border: 0 }"> Trouble loggining in? </a-button>
              </router-link>
            </a-form-item>

            <a-button
              :disabled="signInButtonDisable"
              size="large"
              type="default"
              html-type="submit"
              class="mx-auto align-self-end mt-5"
              :style="{ border: 0 }">
              <i class="fa-solid fa-arrow-right-to-bracket fs-5"></i>
            </a-button>

            <a-button
              ghost
              size="large"
              type="primary"
              class="mx-auto mt-5"
              :style="{ border: 0 }"
              @click.prevent="goToSignUp">
              Don't have an account? Sign up
            </a-button>
          </a-form>
        </div>

        <div class="sign-up-panel" v-if="signUpFormOpen">
          <p class="text-center fs-5 fw-bold mb-4 mt-5">Sign Up</p>

          <a-form
            v-if="signUpFormStep === '1'"
            layout="vertical"
            :model="signUpUser"
            name="signUpForm"
            :rules="signUpFormRules"
            ref="signUpForm1Ref"
            hideRequiredMark
            @change="signUpFormChange()">
            <a-form-item class="mt-4" name="name" hasFeedback>
              <template #label>
                <p class="fw-bold">Name</p>
              </template>
              <a-input v-model:value="signUpUser.name" placeholder=""></a-input>
            </a-form-item>

            <a-form-item name="username" hasFeedback>
              <template #label>
                <p class="fw-bold">Username</p>
              </template>
              <a-input v-model:value="signUpUser.username" placeholder=""></a-input>
            </a-form-item>

            <a-form-item name="password" hasFeedback>
              <template #label>
                <p class="fw-bold">Password</p>
              </template>
              <a-input-password v-model:value="signUpUser.password" placeholder=""></a-input-password>
            </a-form-item>

            <a-form-item name="confirmPassword" hasFeedback>
              <template #label>
                <p class="fw-bold">Confirm password</p>
              </template>
              <a-input-password v-model:value="signUpUser.confirmPassword" placeholder=""></a-input-password>
            </a-form-item>

            <a-form-item>
              <p class="text-center fw-bold mt-4">Step 1 of 3</p>
            </a-form-item>

            <a-form-item class="mt-2">
              <a-row justify="space-between">
                <a-col :span="4">
                  <a-button
                    ghost
                    size="small"
                    type="primary"
                    :style="{ border: 0, fontSize: '0.8rem' }"
                    @click="backToSignIn">
                    Already a PAI user? Sign in
                  </a-button>
                </a-col>

                <a-col :span="4">
                  <a-button size="medium" type="primary" @click.prevent="nextStep1" :style="{ border: 0 }">
                    Next Step
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-form>

          <a-form
            v-if="signUpFormStep === '2'"
            layout="vertical"
            :model="signUpUser"
            name="signUpForm"
            :rules="signUpFormRules"
            ref="signUpForm2Ref"
            hideRequiredMark>
            <a-form-item class="mt-4" name="email" hasFeedback>
              <template #label>
                <p class="fw-bold">Email</p>
              </template>
              <a-input v-model:value="signUpUser.email" placeholder=""></a-input>
            </a-form-item>

            <a-form-item class="mt-2">
              <a-row justify="space-between">
                <a-col :span="4">
                  <a-button ghost size="small" type="primary" :style="{ border: 0, fontSize: '0.8rem' }">
                    <i class="fa-solid fa-chalkboard-user me-2"></i>
                    Use other methods instead
                  </a-button>
                </a-col>

                <a-col :span="4"> </a-col>
              </a-row>
            </a-form-item>

            <a-form-item>
              <p class="text-center fw-bold mt-4">Step {{ signUpFormStep }} of 3</p>
            </a-form-item>

            <a-form-item class="mt-2">
              <a-row justify="space-between">
                <a-col :span="4">
                  <a-button size="medium" type="primary" @click.prevent="backStep1" :style="{ border: 0 }">
                    Back
                  </a-button>
                </a-col>

                <a-col :span="4">
                  <a-button size="medium" type="primary" @click.prevent="nextStep2" :style="{ border: 0 }">
                    Next Step
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-form>

          <a-form
            v-if="signUpFormStep === '3'"
            layout="vertical"
            :model="signUpUser"
            :rules="signUpFormRules"
            ref="signUpForm3Ref"
            hideRequiredMark>
            <!-- <a-form-item class="mt-4">
            <template #label>
              <p class="fw-bold">Date of birth</p>
            </template> -->
            <a-row :gutter="[8, 8]">
              <a-col :span="6">
                <a-form-item name="yearOfBirth">
                  <a-input v-model:value="signUpUser.yearOfBirth" placeholder="Year" :maxlength="4"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="monthOfBirth">
                  <a-select v-model:value="signUpUser.monthOfBirth" :options="monthOptions" placeholder="Month">
                    <template #suffixIcon><CaretDownOutlined /></template>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item name="dayOfBirth">
                  <a-input v-model:value="signUpUser.dayOfBirth" placeholder="Day" :maxlength="2"></a-input>
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item>
              <p class="text-center mt-2" style="font-size: 0.7rem">
                By clicking Sign Up, you are agreeing to Pai’s<a style="display: inline-block"> Terms of Service </a>
                and are acknowledging our <a>Privacy Notice</a> applies.
              </p>
            </a-form-item>

            <a-form-item>
              <p class="text-center fw-bold mt-4">Step {{ signUpFormStep }} of 3</p>
            </a-form-item>

            <a-form-item class="mt-2">
              <a-row justify="space-between">
                <a-col :span="4">
                  <a-button size="medium" type="primary" @click.prevent="backStep2" :style="{ border: 0 }">
                    Back
                  </a-button>
                </a-col>

                <a-col :span="4">
                  <a-button size="medium" type="primary" @click.prevent="signUp" :style="{ border: 0 }">
                    Sign Up
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-form>

          <a-form
            v-if="signUpFormStep === '4'"
            layout="vertical"
            :model="signUpCode"
            :rule="signUpFormRules"
            ref="signUpForm4Ref"
            hideRequiredMark>
            <h2 class="fs-6 fw-bold">Enter your verification code</h2>

            <p class="mb-2">
              We sent a 6-digit code to {{ signUpUser.email }}. Confirm it belongs to you to register user.
            </p>

            <a-card
              v-if="signUpCodeError"
              class="mb-2"
              size="small"
              title="Verification failed"
              :bodyStyle="{ borderBottom: '10px solid var(--error-color)' }"
              style="box-shadow: 0 0.2rem 1.2rem rgba(0, 0, 0, 0.2)">
              <template #extra>
                <i class="fa-solid fa-triangle-exclamation" style="color: var(--error-color)"></i>
              </template>
              <p>Verification failed because provided code doss not match.</p>
            </a-card>

            <a-row :gutter="[8, 8]">
              <a-col :span="4" v-for="(n, i) in 6" :key="i">
                <!-- sao số 0 nó lại không nhận nhỉ? -->
                <a-form-item :name="`${i}`" :rules="[{ validator: validateCode, trigger: ['change'] }]">
                  <a-input
                    ref="inputCode"
                    :maxlength="1"
                    v-model:value="signUpCode[i]"
                    @input="moveToNext($event, i)"
                    @paste="pasteCode($event)"
                    @change="codeChange"
                    style="text-align: center; font-weight: bold" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-button
              ghost
              size="small"
              type="primary"
              :style="{ border: 0, fontSize: '0.8rem' }"
              @click="resendCode"
              :disabled="!!resendCodeTime">
              <i class="fa-regular fa-paper-plane me-1"></i>
              Resend code {{ resendCodeTime }}
            </a-button>

            <a-form-item class="mt-2">
              <a-row justify="end">
                <a-col :span="4">
                  <a-button size="medium" type="primary" @click.prevent="submit" :style="{ border: 0 }">
                    Submit
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </a-spin>
  </a-drawer>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, inject, h } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { userState } from '../stores/user-state';
import { storeToRefs } from 'pinia';
import { interfaceState } from '../stores/interface-state';
import { setCookie, getCookie } from '../js/util';
import { CaretDownOutlined, LoadingOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    CaretDownOutlined,
    LoadingOutlined,
  },
  setup() {
    const homeSpinning = inject('homeSpinning');
    const signInSpinning = ref(false);
    const route = useRoute();
    const router = useRouter();
    const store = interfaceState();
    const userStore = userState();

    const { signInVisible } = store;
    const { signInState } = userStore;
    const signInButtonDisable = ref(false);
    const signInValidateErrors = ref({});
    const signInAuthErrors = ref({});
    const signInUser = ref({
      username: 'chutichaq18',
      password: 'anhquyen11',
    });

    const signUpForm1Ref = ref();
    const signUpForm2Ref = ref();
    const signUpForm3Ref = ref();
    const signUpForm4Ref = ref();
    const signUpFormStep = ref('1');
    const signUpFormOpen = ref(false);
    const signUpError = ref({
      username: '',
    });
    const signUpUser = ref({
      name: 'Trần Anh Quyền',
      username: 'anhquyen123123',
      email: 'anhquyendeptraivcl@gmail.com',
      password: 'anhquyen123',
      confirmPassword: 'anhquyen123',
      yearOfBirth: '2000',
      monthOfBirth: '9',
      dayOfBirth: '18',
    });
    const signUpCode = ref(['', '', '', '', '', '']);
    const signUpCodeError = ref(false);
    // const signUpCode = ref();
    const monthOptions = ref([
      // {
      //   value: '0',
      //   label: 'Month',
      //   disabled: true,
      // },
      {
        value: '1',
        label: 'January',
      },
      {
        value: '2',
        label: 'February',
      },
      {
        value: '3',
        label: 'March',
      },
      {
        value: '4',
        label: 'April',
      },
      {
        value: '5',
        label: 'May',
      },
      {
        value: '6',
        label: 'June',
      },
      {
        value: '7',
        label: 'July',
      },
      {
        value: '8',
        label: 'August',
      },
      {
        value: '9',
        label: 'September',
      },
      {
        value: '10',
        label: 'October',
      },
      {
        value: '11',
        label: 'November',
      },
      {
        value: '12',
        label: 'December',
      },
    ]);

    const signOutVisible = ref(false);

    const user = inject('userData');

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

    const signInShower = () => {
      signUpFormOpen.value = false;
      if (signInState === false) {
        store.setSignInVisible(true);
      }
    };

    const signUpShower = () => {
      signUpFormOpen.value = true;
      signUpFormStep.value = '1';
      if (signInState === false) {
        store.setSignInVisible(true);
      }
    };

    const signInOnClose = () => {
      store.setSignInVisible(false);
    };

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
        .post('http://127.0.0.1:8000/api/sign-in', signInUser.value)
        .then((response) => {
          setCookie('accessToken', response.data.token);
          setCookie('user', JSON.stringify(response.data.user));
          message.success('Sign in successfully!');
          userStore.onAuthentication();

          user.value = JSON.parse(getCookie('user'));
          store.setSignInVisible(false);

          console.log(response.data);
          homeSpinning.value = false;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == 400) signInAuthErrors.value = error.response;
          else if (error.response.status == 422) signInValidateErrors.value = error.response.data.errors;
          message.error('Sign failed, please try again!');
          homeSpinning.value = false;
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

    const validateSignIn = async (_rule, value) => {
      if (signInUser.value.username === '' || signInUser.value.password === '') {
        signInButtonDisable.value = true;
      } else {
        signInButtonDisable.value = false;
      }
    };

    const signInFormRules = {
      username: [
        {
          required: true,
          // message: 'Please enter your username!',
          validator: validateSignIn,
          trigger: 'change',
        },
      ],
      password: [
        {
          required: true,
          // message: 'Please enter your name!',
          validator: validateSignIn,
          trigger: 'change',
        },
      ],
    };

    const validateWhiteSpace = async (_rule, value) => {
      // await apiCall(value);
    };

    let debounceTimer;
    const validateSignUpUsername = async (_rule, value) => {
      clearTimeout(debounceTimer);
      const alphanumericRegex = /^[a-zA-Z0-9]+$/;
      if (value) {
        if (value.length < 10) {
          return Promise.reject('Username must be greater than 10 characters!');
        } else if (value.length >= 40) {
          return Promise.reject('Username must be no more than 40 characters!');
        } else if (!alphanumericRegex.test(value)) {
          return Promise.reject('Username must only contain alphanumeric characters!');
        } else {
          return new Promise((resolve, reject) => {
            debounceTimer = setTimeout(() => {
              // This function will be called after 1 second of inactivity
              // console.log('Debounced input changed:', value);
              axios
                .post('http://127.0.0.1:8000/api/check-username', signUpUser.value)
                .then((response) => {
                  console.log(response);
                  resolve();
                })
                .catch((error) => {
                  console.log(error);
                  reject(error.response.data.errors['username']);
                });
              // You can perform your desired action here.
            }, 1000); // 1000ms (1 second) delay
          });
        }
      }
    };

    const validatePass = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('Please enter your password!');
      } else {
        if (signUpUser.value.password !== '') {
          signUpForm1Ref.value.validateFields('confirmPassword');
        }
        return Promise.resolve();
      }
    };

    const validatePass2 = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('Please enter confirm password!');
      } else if (value !== signUpUser.value.password) {
        return Promise.reject('Please verify your password!');
      } else {
        return Promise.resolve();
      }
    };

    const validateDay = async (_rule, value) => {
      if (!value) {
        return Promise.reject('Invalid');
      } else {
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
          return Promise.reject('Invalid');
        } else if (numericValue < 1 || numericValue > 31) {
          return Promise.reject('Invalid');
        } else {
          return Promise.resolve;
        }
      }
    };

    const validateYear = async (_rule, value) => {
      if (!value) {
        return Promise.reject('Invalid');
      } else {
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
          return Promise.reject('Invalid');
        } else if (value.length !== 4 || numericValue < 1000 || numericValue > 9999) {
          return Promise.reject('Invalid');
        } else {
          return Promise.resolve;
        }
      }
    };

    const validateCode = async (_rule, value) => {
      // console.log(value, signUpCode);
      if (!value) {
        return Promise.reject('');
      } else {
        if (signUpCodeError.value) {
          // console.log(signUpCodeError.value);
          return Promise.reject('');
        } else {
          // signUpCodeError.value = false;
          return Promise.resolve();
        }
      }
    };

    const signUpFormRules = {
      // tên ở rule phải trùng với tên các thành phần ở SignUpUser
      name: [
        {
          required: true,
          message: 'Please enter name!',
          // validator: validateSignIn,
          trigger: 'change',
        },
      ],
      username: [
        {
          required: true,
          message: 'Please enter username!',
          // validator: validateSignIn,
          trigger: 'change',
        },
        {
          validator: validateSignUpUsername,
          trigger: 'change',
        },
      ],
      password: [
        {
          validator: validatePass,
          trigger: 'change',
        },
        {
          min: 8,
          message: 'Password must be at least 8 characters long',
          trigger: 'change',
        },
      ],
      confirmPassword: [
        {
          validator: validatePass2,
          trigger: 'change',
        },
      ],
      email: [
        {
          type: 'email',
          message: 'Invalid email, please try again!',
          trigger: 'change',
        },
      ],
      dayOfBirth: [
        {
          validator: validateDay,
          trigger: 'change',
        },
      ],
      monthOfBirth: [
        {
          required: true,
          message: 'Invalid',
          trigger: 'change',
        },
      ],
      yearOfBirth: [
        {
          validator: validateYear,
          trigger: 'change',
        },
      ],
    };
    return {
      signInSpinning,
      ...storeToRefs(store),
      ...storeToRefs(userStore),
      signInShower,
      signUpShower,
      signInOnClose,
      signInButtonDisable,
      signInUser,
      signIn,
      buttonType,
      signInValidateErrors,
      signInAuthErrors,
      signOut,
      signOutVisible,
      signUpUser,
      signInFormRules,
      signUpFormRules,
      signUpForm1Ref,
      signUpForm2Ref,
      signUpForm3Ref,
      signUpForm4Ref,
      signUpFormStep,
      signUpFormOpen,
      signUpCode,
      signUpCodeError,
      monthOptions,
      validateCode,
    };
  },
  props: ['homeSignInState'],
  data() {
    return {
      resendCodeTime: '',
    };
  },
  created() {
    // console.log(this.homeSignInState); //prints out an empty string
    // console.log(this.signInState + ' sign in');
  },

  methods: {
    signInFormChangeTest() {
      // console.log('anhquyendeptrai');
    },

    signUpFormChange() {
      // console.log('anhquyendeptrai');
    },

    signUp() {
      this.signInSpinning = true;
      axios
        .post('http://127.0.0.1:8000/api/sign-up', this.signUpUser)
        .then((response) => {
          console.log(response);
          this.signInSpinning = false;
          this.signUpFormStep = '4';
          this.resendCodeTiming();
        })
        .catch((error) => {
          console.log(error);
        });
      this.signUpForm3Ref
        .validate()
        .then(() => {
          // console.log('success');
        })
        .catch((error) => {});
    },

    backToSignIn() {
      this.signUpFormOpen = false;
    },

    goToSignUp() {
      this.signUpFormOpen = true;
    },

    backStep1() {
      this.signUpFormStep = '1';
    },

    backStep2() {
      this.signUpFormStep = '2';
    },

    nextStep1() {
      this.signUpForm1Ref
        .validate()
        .then(() => {
          // console.log('success');
          this.signUpFormStep = '2';
        })
        .catch((error) => {
          // console.log('anhquyen');
        });
    },

    nextStep2() {
      this.signUpForm2Ref
        .validate()
        .then(() => {
          // console.log('success');
          this.signUpFormStep = '3';
        })
        .catch((error) => {
          // console.log('anhquyen');
        });
    },

    submit() {
      // console.log(this.signUpForm4Ref.getFieldsValue());
      this.signUpForm4Ref
        .validateFields()
        .then(() => {
          this.signInSpinning = true;
          axios
            .post('http://127.0.0.1:8000/api/insert-signup-user', {
              code: this.signUpCode,
              username: this.signUpUser.username,
            })
            .then((response) => {
              console.log(response);
              message.success(response.data.success);
              this.signInVisible = false;
              this.signInSpinning = false;
              this.signUpFormOpen = false;
              this.signUpFormStep = '1';
            })
            .catch((error) => {
              console.log(error);
              message.error(error.response.data.error);
              if (error.response.status == 422) this.signUpCodeError = true;
              this.signUpForm4Ref.validateFields();
              this.signInSpinning = false;
            });
        })
        .catch((error) => {
          // console.log('anhquyen');
          // this.signInSpinning = false;
        });
    },

    moveToNext(event, index) {
      let nextIndex = Number(index) + 1;
      let preIndex = Number(index) - 1;
      // console.log(this.$refs.inputCode[nextIndex].input.input.value);
      // this.$refs.inputCode[nextIndex].value.length;
      if (event.target.value.length === event.target.maxLength) {
        if (index < 5 && !this.$refs.inputCode[nextIndex].input.input.value.length)
          this.$refs.inputCode[nextIndex].focus();
      } else if (event.target.value.length === 0) {
        if (index > 0) this.$refs.inputCode[preIndex].focus();
      } else {
      }
    },

    pasteCode(event) {
      event.preventDefault();
      // this.signUpForm4Ref.validateFields();
      // this.signUpForm4Ref.clearValidate();
      const text = event.clipboardData.getData('text/plain');
      const digits = text.match(/\d/g);
      if (digits && digits.length === 6) {
        this.signUpCodeError = false;
        this.signUpForm4Ref.clearValidate();
        this.signUpCode = digits;
        // this.codeChange();
      }
    },

    codeChange() {
      this.signUpCodeError = false;
      this.signUpForm4Ref.validateFields();
    },

    resendCodeTiming() {
      this.resendCodeTime = 60;
      let that = this;
      // console.log(this.resendCodeTime - 1);
      let inter = setInterval(function () {
        that.resendCodeTime = that.resendCodeTime - 1;
        // console.log(this.resendCodeTime);

        if (that.resendCodeTime <= 0) {
          that.resendCodeTime = '';
          clearInterval(inter);
        }
      }, 1000);
    },

    resendCode() {
      // this.resendCodeTiming();
      this.resendCodeTiming();
      axios
        .post('http://127.0.0.1:8000/api/sign-up', this.signUpUser)
        .then((response) => {
          console.log(response);
          this.signUpFormStep = '4';
        })
        .catch((error) => {
          console.log(error);
          message.error(error);
        });
    },
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

<style lang="scss">
.ant-card-head {
  background-color: var(--secondary-background-color) !important;
}
.ant-card-body {
  background-color: var(--secondary-background-color) !important;
}
</style>
