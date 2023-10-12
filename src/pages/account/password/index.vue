<template>
  <a-form
    :hideRequiredMark="true"
    autocomplete="off"
    layout="vertical"
    ref="formRef"
    name="basic"
    :label-col="{ span: 16, offset: 0 }"
    :wrapper-col="{ span: 16, offset: 0 }"
    :model="formState"
    :rules="rules">
    <a-form-item class="mt-4" name="currentPass" has-feedback>
      <template #label>
        <p class="fw-bold">Mật khẩu hiện tại</p>
      </template>
      <a-input :class="{ 'input-error': false }" type="password" size="large" v-model:value="formState.currentPass" />
      <!-- <p style="color: var(--error-color)">Vui lòng nhập mật khẩu</p> -->
    </a-form-item>

    <a-form-item class="mt-4" name="pass" has-feedback>
      <template #label>
        <p class="fw-bold">Mật khẩu mới</p>
      </template>
      <a-input type="password" size="large" v-model:value="formState.pass" />
    </a-form-item>
    <a-form-item class="mt-4" name="checkPass" has-feedback>
      <template #label>
        <p class="fw-bold">Nhập lại mật khẩu mới</p>
      </template>
      <a-input type="password" size="large" v-model:value="formState.checkPass" />
    </a-form-item>

    <a-row justify="left" class="mt-4">
      <a-col :span="6">
        <a-button type="primary" @click="onSubmit">Lưu thay đổi</a-button>
      </a-col>
      <a-col :span="6">
        <a-button type="primary" @click="testVal" danger>Cancel</a-button>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue';
import { accountMenu } from '../../../stores/account-menu';

export default defineComponent({
  components: {},
  setup() {
    accountMenu().onSelectedKeys(['account-password']);
    // console.log(accountMenu().selectedKeys);

    const formRef = ref();
    const errors = ref({ password: false });
    const formState = reactive({
      currentPass: '',
      pass: '',
      checkPass: '',
    });
    const validateCurrentPass = async (_rule, value) => {
      console.log(errors.value.password);
      if (!errors.value.password) {
        if (value === '') {
          return Promise.reject('Vui lòng nhập mật khẩu');
        } else {
          return Promise.resolve();
        }
      } else if (errors.value.password) {
        errors.value.password = false;
        return Promise.reject('Mật khẩu không chính xác');
      } else {
        return Promise.resolve();
      }
    };
    const validatePass = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('Vui lòng nhập mật khẩu');
      } else {
        if (formState.checkPass !== '') {
          formRef.value.validateFields('checkPass');
        }
        return Promise.resolve();
      }
    };
    const validatePass2 = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('Vui lòng nhập mật khẩu');
      } else if (value !== formState.pass) {
        return Promise.reject('Mật khẩu không trùng khớp');
      } else {
        return Promise.resolve();
      }
    };

    const rules = {
      currentPass: [
        {
          required: true,
          validator: validateCurrentPass,
          trigger: 'change',
        },
      ],
      pass: [
        {
          required: true,
          validator: validatePass,
          trigger: 'change',
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
      // formRef.value
      //   .validate()
      //   .then(() => {
      //     // console.log(formRef.value);
      //     // validateCurrentPass();
      //     // formRef.value.clearValicate('checkPass');
      //   })
      //   .catch((error) => {
      //     console.log('error', error);
      //     formRef.value.clearValidate('pass');
      //   });
      formRef.value.validate('currentPass');
    };

    return {
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
  },
});
</script>

<style lang="scss" scoped>
.input-error {
  border: 1px solid var(--error-color);
}
</style>
