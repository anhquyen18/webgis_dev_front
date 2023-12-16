<template>
  <a-modal
    v-model:open="modalOpen"
    :maskClosable="false"
    :style="{ width: '20%' }"
    :closable="false"
    @ok="updatePassword">
    <template #title>
      <div class="d-flex">
        <ExclamationCircleOutlined class="fs-4 text-warning" />
        <p class="fw-bold ms-2">Do yout want to change your password?</p>
      </div>
    </template>
  </a-modal>
  <a-form
    :hideRequiredMark="true"
    autocomplete="off"
    layout="vertical"
    ref="formRef"
    name="basic"
    :label-col="{ span: 16, offset: 0 }"
    :wrapper-col="{ xl: { span: 12 }, md: { span: 24 }, xs: { span: 24 } }"
    :model="formState"
    :rules="rules">
    <a-form-item class="mt-4" name="currentPass" has-feedback>
      <template #label>
        <p class="fw-bold">Current password</p>
      </template>
      <a-input :class="{ 'input-error': false }" type="password" size="large" v-model:value="formState.currentPass" />
      <!-- <p style="color: var(--error-color)">Vui lòng nhập mật khẩu</p> -->
    </a-form-item>

    <a-form-item class="mt-4" name="pass" has-feedback>
      <template #label>
        <p class="fw-bold">New password</p>
      </template>
      <a-input type="password" size="large" v-model:value="formState.pass" />
    </a-form-item>
    <a-form-item class="mt-4" name="checkPass" has-feedback>
      <template #label>
        <p class="fw-bold">Repeat new password</p>
      </template>
      <a-input type="password" size="large" v-model:value="formState.checkPass" />
    </a-form-item>

    <a-row justify="left" class="mt-4" align-items="center" :gutter="[0, 8]">
      <a-col :xl="12" :xs="24">
        <a-button type="primary" @click="onSubmit">Set new password</a-button>
      </a-col>
      <a-col :xl="12" :xs="24">
        <a-button type="primary" @click="testVal" danger>Cancel</a-button>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, inject } from 'vue';
import { accountMenu } from '../../../stores/account-menu';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { setCookie, getCookie } from '../../../js/util.js';
import { message } from 'ant-design-vue';

export default defineComponent({
  components: { ExclamationCircleOutlined },
  setup() {
    accountMenu().onSelectedKeys(['account-password']);

    const accountInfo = inject('accountInfo');
    // console.log(accountMenu().selectedKeys);
    const modalOpen = ref(false);
    const formRef = ref();
    const errors = ref({ password: false });
    const formState = reactive({
      id: accountInfo.value['id'],
      currentPass: '',
      pass: '',
      checkPass: '',
    });
    const validateCurrentPass = async (_rule, value) => {
      console.log(errors.value.password);
      if (!errors.value.password) {
        if (value === '') {
          return Promise.reject('Please enter your password!');
        } else {
          return Promise.resolve();
        }
      } else if (errors.value.password) {
        errors.value.password = false;
        return Promise.reject('Wrong password');
      } else {
        return Promise.resolve();
      }
    };
    const validatePass = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('Please enter your password!');
      } else {
        if (formState.checkPass !== '') {
          formRef.value.validateFields('checkPass');
        }
        return Promise.resolve();
      }
    };
    const validatePass2 = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('Please enter your password!');
      } else if (value !== formState.pass) {
        return Promise.reject('Please verify your password!');
      } else {
        return Promise.resolve();
      }
    };

    const rules = {
      currentPass: [
        {
          required: true,
          validator: validateCurrentPass,
          trigger: ['blur', 'change'],
        },
      ],
      pass: [
        {
          required: true,
          validator: validatePass,
          trigger: ['blur', 'change'],
        },
        {
          min: 8,
          message: 'Password contains at least 8 characters!',
          trigger: ['blur', 'change'],
        },
      ],
      checkPass: [
        {
          required: true,
          validator: validatePass2,
          trigger: 'change',
        },
      ],
    };

    const onFinish = (values) => {
      console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          modalOpen.value = true;
        })
        .catch((error) => {
          console.log('error', error);
        });
    };

    return {
      modalOpen,
      formState,
      onFinish,
      onFinishFailed,
      rules,
      onSubmit,
      formRef,
      validatePass,
      validatePass2,
      errors,
    };
  },

  methods: {
    testVal() {
      this.errors.password = true;
    },

    updatePassword() {
      let accessToken = {
        headers: {
          Authorization: `Bearer ${getCookie('accessToken')}`,
        },
      };
      axios
        .post('http://127.0.0.1:8000/api/user-update-password', this.formState, accessToken)
        .then((response) => {
          console.log(response);
          this.modalOpen = false;
          message.success(response.data.success);
          this.formRef.resetFields();
        })
        .catch((error) => {
          console.log(error);
          this.modalOpen = false;
          message.error(error.response.data.error, 3, () => {
            if (error.response.status === 401) location.reload();
            else {
              this.errors.password = true;
              this.formRef
                .validate()
                .then(() => {})
                .catch((error) => {});
            }
          });

          // console.log(this.errors.password);
          // message.error('Cập nhật mật khẩu không thành công!');
          // this.modalOpen = false;
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.input-error {
  border: 1px solid var(--error-color);
}
</style>
