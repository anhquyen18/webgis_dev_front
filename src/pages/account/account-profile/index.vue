<template>
  <a-spin tip="Loading..." :spinning="profileSpinning">
    <a-form
      autocomplete="off"
      layout="vertical"
      ref="formRef"
      name="basic"
      :label-col="{ span: 16, offset: 0 }"
      :wrapper-col="{ span: 16, offset: 0 }"
      :model="accountInfo"
      :rules="rules"
      hideRequiredMark>
      <a-form-item class="mt-4">
        <template #label>
          <p class="fw-bold">ID</p>
        </template>
        <p>{{ accountInfo.id }}</p>
      </a-form-item>

      <a-form-item class="mt-4" name="username">
        <template #label>
          <p class="fw-bold">Tên đăng nhập</p>
        </template>
        <a-input size="large" v-model:value="accountInfo.username" />
      </a-form-item>

      <a-form-item class="mt-4" name="name">
        <template #label>
          <p class="fw-bold">Tên</p>
        </template>
        <a-input size="large" v-model:value="accountInfo.name" />
      </a-form-item>

      <a-form-item class="mt-4" name="email" has-feedback>
        <template #label>
          <p class="fw-bold">Email</p>
        </template>
        <a-input size="large" v-model:value="accountInfo.email" />
      </a-form-item>

      <a-form-item class="mt-4">
        <template #label>
          <p class="fw-bold">Mật khẩu</p>
        </template>
        <a-input size="large" disabled />
      </a-form-item>

      <a-form-item class="mt-4">
        <template #label>
          <p class="fw-bold">Chức vụ</p>
        </template>
        <a-select
          size="large"
          style="width: 100%"
          v-model:value="accountInfo.department_id"
          :options="departments"
          :field-names="{ label: 'name', value: 'id' }"
          disabled>
        </a-select>
      </a-form-item>

      <!-- <a-form-item class="mt-4">
      <template #label>
        <p class="fw-bold">Giới tính</p>
      </template>
      <a-select
        size="large"
        style="width: 100%"
        v-model:value="formState.gender"
        :options="genderSelectData.map((gender) => ({ value: gender }))">
      </a-select>
    </a-form-item>

    <a-form-item class="mt-4" name="birthday">
      <template #label>
        <p class="fw-bold">Ngày sinh</p>
      </template>
      <a-date-picker
        size="large"
        format="DD/MM/YYYY"
        valueFormat="DD/MM/YYYY"
        style="width: 100%"
        v-model:value="formState.birthday"
        placeholder="" />
    </a-form-item>

    <a-form-item class="mt-4">
      <template #label>
        <p class="fw-bold">Quốc gia</p>
      </template>
      <a-select
        size="large"
        v-model:value="formState.region"
        show-search
        placeholder="Chọn quốc gia"
        style="width: 100%"
        :options="countryList"
        :filter-option="filterOption"></a-select>
    </a-form-item> -->

      <a-row justify="left" class="mt-4">
        <a-col :span="6">
          <a-button type="primary" @click="onSubmit">Lưu thay đổi</a-button>
        </a-col>
        <a-col :span="6">
          <a-button type="primary" danger>Cancel</a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, inject } from 'vue';
import { accountMenu } from '../../../stores/account-menu';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  components: {},
  setup() {
    const profileSpinning = inject('profileSpinning');
    profileSpinning.value = true;
    // tạo một request để lấy dữ liệu từ server
    accountMenu().onSelectedKeys(['account-profile']);
    const route = useRoute();
    const router = useRouter();

    const genderSelectData = ['chưa được chọn', 'Nam', 'Nữ', 'Khác', 'Không thích chọn'];
    const countryList = [
      { label: 'Albania', value: 'AL' },
      { label: 'Åland Islands', value: 'AX' },
      { label: 'Algeria', value: 'DZ' },
      { label: 'American Samoa', value: 'AS' },
      { label: 'Andorra', value: 'AD' },
      { label: 'Angola', value: 'AO' },
      { label: 'Anguilla', value: 'AI' },
      { label: 'Antarctica', value: 'AQ' },
      { label: 'Antigua and Barbuda', value: 'AG' },
      { label: 'Argentina', value: 'AR' },
      { label: 'Armenia', value: 'AM' },
      { label: 'Aruba', value: 'AW' },
      { label: 'Australia', value: 'AU' },
      { label: 'Austria', value: 'AT' },
      { label: 'Azerbaijan', value: 'AZ' },
      { label: 'Bahamas (the)', value: 'BS' },
      { label: 'Bahrain', value: 'BH' },
      { label: 'Bangladesh', value: 'BD' },
      { label: 'Barbados', value: 'BB' },
      { label: 'Belarus', value: 'BY' },
      { label: 'Belgium', value: 'BE' },
      { label: 'Belize', value: 'BZ' },
      { label: 'Benin', value: 'BJ' },
      { label: 'Bermuda', value: 'BM' },
      { label: 'Bhutan', value: 'BT' },
      { label: 'Bolivia (Plurinational State of)', value: 'BO' },
      { label: 'Bonaire, Sint Eustatius and Saba', value: 'BQ' },
      { label: 'Bosnia and Herzegovina', value: 'BA' },
      { label: 'Botswana', value: 'BW' },
      { label: 'Bouvet Island', value: 'BV' },
      { label: 'Brazil', value: 'BR' },
      { label: 'British Indian Ocean Territory (the)', value: 'IO' },
      { label: 'Brunei Darussalam', value: 'BN' },
      { label: 'Bulgaria', value: 'BG' },
      { label: 'Burkina Faso', value: 'BF' },
      { label: 'Burundi', value: 'BI' },
      { label: 'Cabo Verde', value: 'CV' },
      { label: 'Cambodia', value: 'KH' },
      { label: 'Cameroon', value: 'CM' },
      { label: 'Canada', value: 'CA' },
      { label: 'Cayman Islands (the)', value: 'KY' },
      { label: 'Central African Republic (the)', value: 'CF' },
      { label: 'Chad', value: 'TD' },
      { label: 'Chile', value: 'CL' },
      { label: 'China', value: 'CN' },
      { label: 'Christmas Island', value: 'CX' },
      { label: 'Cocos (Keeling) Islands (the)', value: 'CC' },
      { label: 'Colombia', value: 'CO' },
      { label: 'Comoros (the)', value: 'KM' },
      { label: 'Congo (the Democratic Republic of the)', value: 'CD' },
      { label: 'Congo (the)', value: 'CG' },
      { label: 'Cook Islands (the)', value: 'CK' },
      { label: 'Costa Rica', value: 'CR' },
      { label: 'Croatia', value: 'HR' },
      { label: 'Cuba', value: 'CU' },
      { label: 'Curaçao', value: 'CW' },
      { label: 'Cyprus', value: 'CY' },
      { label: 'Czechia', value: 'CZ' },
      { label: "Côte d'Ivoire", value: 'CI' },
      { label: 'Denmark', value: 'DK' },
      { label: 'Djibouti', value: 'DJ' },
      { label: 'Dominica', value: 'DM' },
      { label: 'Dominican Republic (the)', value: 'DO' },
      { label: 'Ecuador', value: 'EC' },
      { label: 'Egypt', value: 'EG' },
      { label: 'El Salvador', value: 'SV' },
      { label: 'Equatorial Guinea', value: 'GQ' },
      { label: 'Eritrea', value: 'ER' },
      { label: 'Estonia', value: 'EE' },
      { label: 'Eswatini', value: 'SZ' },
      { label: 'Ethiopia', value: 'ET' },
      { label: 'Falkland Islands (the) [Malvinas]', value: 'FK' },
      { label: 'Faroe Islands (the)', value: 'FO' },
      { label: 'Fiji', value: 'FJ' },
      { label: 'Finland', value: 'FI' },
      { label: 'France', value: 'FR' },
      { label: 'French Guiana', value: 'GF' },
      { label: 'French Polynesia', value: 'PF' },
      { label: 'French Southern Territories (the)', value: 'TF' },
      { label: 'Gabon', value: 'GA' },
      { label: 'Gambia (the)', value: 'GM' },
      { label: 'Georgia', value: 'GE' },
      { label: 'Germany', value: 'DE' },
      { label: 'Ghana', value: 'GH' },
      { label: 'Gibraltar', value: 'GI' },
      { label: 'Greece', value: 'GR' },
      { label: 'Greenland', value: 'GL' },
      { label: 'Grenada', value: 'GD' },
      { label: 'Guadeloupe', value: 'GP' },
      { label: 'Guam', value: 'GU' },
      { label: 'Guatemala', value: 'GT' },
      { label: 'Guernsey', value: 'GG' },
      { label: 'Guinea', value: 'GN' },
      { label: 'Guinea-Bissau', value: 'GW' },
      { label: 'Guyana', value: 'GY' },
      { label: 'Haiti', value: 'HT' },
      { label: 'Heard Island and McDonald Islands', value: 'HM' },
      { label: 'Holy See (the)', value: 'VA' },
      { label: 'Honduras', value: 'HN' },
      { label: 'Hong Kong', value: 'HK' },
      { label: 'Hungary', value: 'HU' },
      { label: 'Iceland', value: 'IS' },
      { label: 'India', value: 'IN' },
      { label: 'Indonesia', value: 'ID' },
      { label: 'Iran (Islamic Republic of)', value: 'IR' },
      { label: 'Iraq', value: 'IQ' },
      { label: 'Ireland', value: 'IE' },
      { label: 'Isle of Man', value: 'IM' },
      { label: 'Israel', value: 'IL' },
      { label: 'Italy', value: 'IT' },
      { label: 'Jamaica', value: 'JM' },
      { label: 'Japan', value: 'JP' },
      { label: 'Jersey', value: 'JE' },
      { label: 'Jordan', value: 'JO' },
      { label: 'Kazakhstan', value: 'KZ' },
      { label: 'Kenya', value: 'KE' },
      { label: 'Kiribati', value: 'KI' },
      { label: "Korea (the Democratic People's Republic of)", value: 'KP' },
      { label: 'Korea (the Republic of)', value: 'KR' },
      { label: 'Kuwait', value: 'KW' },
      { label: 'Kyrgyzstan', value: 'KG' },
      { label: "Lao People's Democratic Republic (the)", value: 'LA' },
      { label: 'Latvia', value: 'LV' },
      { label: 'Lebanon', value: 'LB' },
      { label: 'Lesotho', value: 'LS' },
      { label: 'Liberia', value: 'LR' },
      { label: 'Libya', value: 'LY' },
      { label: 'Liechtenstein', value: 'LI' },
      { label: 'Lithuania', value: 'LT' },
      { label: 'Luxembourg', value: 'LU' },
      { label: 'Macao', value: 'MO' },
      { label: 'Madagascar', value: 'MG' },
      { label: 'Malawi', value: 'MW' },
      { label: 'Malaysia', value: 'MY' },
      { label: 'Maldives', value: 'MV' },
      { label: 'Mali', value: 'ML' },
      { label: 'Malta', value: 'MT' },
      { label: 'Marshall Islands (the)', value: 'MH' },
      { label: 'Martinique', value: 'MQ' },
      { label: 'Mauritania', value: 'MR' },
      { label: 'Mauritius', value: 'MU' },
      { label: 'Mayotte', value: 'YT' },
      { label: 'Mexico', value: 'MX' },
      { label: 'Micronesia (Federated States of)', value: 'FM' },
      { label: 'Moldova (the Republic of)', value: 'MD' },
      { label: 'Monaco', value: 'MC' },
      { label: 'Mongolia', value: 'MN' },
      { label: 'Montenegro', value: 'ME' },
      { label: 'Montserrat', value: 'MS' },
      { label: 'Morocco', value: 'MA' },
      { label: 'Mozambique', value: 'MZ' },
      { label: 'Myanmar', value: 'MM' },
      { label: 'Namibia', value: 'NA' },
      { label: 'Nauru', value: 'NR' },
      { label: 'Nepal', value: 'NP' },
      { label: 'Netherlands (the)', value: 'NL' },
      { label: 'New Caledonia', value: 'NC' },
      { label: 'New Zealand', value: 'NZ' },
      { label: 'Nicaragua', value: 'NI' },
      { label: 'Niger (the)', value: 'NE' },
      { label: 'Nigeria', value: 'NG' },
      { label: 'Niue', value: 'NU' },
      { label: 'Norfolk Island', value: 'NF' },
      { label: 'Northern Mariana Islands (the)', value: 'MP' },
      { label: 'Norway', value: 'NO' },
      { label: 'Oman', value: 'OM' },
      { label: 'Pakistan', value: 'PK' },
      { label: 'Palau', value: 'PW' },
      { label: 'Palestine, State of', value: 'PS' },
      { label: 'Panama', value: 'PA' },
      { label: 'Papua New Guinea', value: 'PG' },
      { label: 'Paraguay', value: 'PY' },
      { label: 'Peru', value: 'PE' },
      { label: 'Philippines (the)', value: 'PH' },
      { label: 'Pitcairn', value: 'PN' },
      { label: 'Poland', value: 'PL' },
      { label: 'Portugal', value: 'PT' },
      { label: 'Puerto Rico', value: 'PR' },
      { label: 'Qatar', value: 'QA' },
      { label: 'Republic of North Macedonia', value: 'MK' },
      { label: 'Romania', value: 'RO' },
      { label: 'Russian Federation (the)', value: 'RU' },
      { label: 'Rwanda', value: 'RW' },
      { label: 'Réunion', value: 'RE' },
      { label: 'Saint Barthélemy', value: 'BL' },
      { label: 'Saint Helena, Ascension and Tristan da Cunha', value: 'SH' },
      { label: 'Saint Kitts and Nevis', value: 'KN' },
      { label: 'Saint Lucia', value: 'LC' },
      { label: 'Saint Martin (French part)', value: 'MF' },
      { label: 'Saint Pierre and Miquelon', value: 'PM' },
      { label: 'Saint Vincent and the Grenadines', value: 'VC' },
      { label: 'Samoa', value: 'WS' },
      { label: 'San Marino', value: 'SM' },
      { label: 'Sao Tome and Principe', value: 'ST' },
      { label: 'Saudi Arabia', value: 'SA' },
      { label: 'Senegal', value: 'SN' },
      { label: 'Serbia', value: 'RS' },
      { label: 'Seychelles', value: 'SC' },
      { label: 'Sierra Leone', value: 'SL' },
      { label: 'Singapore', value: 'SG' },
      { label: 'Sint Maarten (Dutch part)', value: 'SX' },
      { label: 'Slovakia', value: 'SK' },
      { label: 'Slovenia', value: 'SI' },
      { label: 'Solomon Islands', value: 'SB' },
      { label: 'Somalia', value: 'SO' },
      { label: 'South Africa', value: 'ZA' },
      { label: 'South Georgia and the South Sandwich Islands', value: 'GS' },
      { label: 'South Sudan', value: 'SS' },
      { label: 'Spain', value: 'ES' },
      { label: 'Sri Lanka', value: 'LK' },
      { label: 'Sudan (the)', value: 'SD' },
      { label: 'Suriname', value: 'SR' },
      { label: 'Svalbard and Jan Mayen', value: 'SJ' },
      { label: 'Sweden', value: 'SE' },
      { label: 'Switzerland', value: 'CH' },
      { label: 'Syrian Arab Republic', value: 'SY' },
      { label: 'Taiwan (Province of China)', value: 'TW' },
      { label: 'Tajikistan', value: 'TJ' },
      { label: 'Tanzania, United Republic of', value: 'TZ' },
      { label: 'Thailand', value: 'TH' },
      { label: 'Timor-Leste', value: 'TL' },
      { label: 'Togo', value: 'TG' },
      { label: 'Tokelau', value: 'TK' },
      { label: 'Tonga', value: 'TO' },
      { label: 'Trinidad and Tobago', value: 'TT' },
      { label: 'Tunisia', value: 'TN' },
      { label: 'Turkey', value: 'TR' },
      { label: 'Turkmenistan', value: 'TM' },
      { label: 'Turks and Caicos Islands (the)', value: 'TC' },
      { label: 'Tuvalu', value: 'TV' },
      { label: 'Uganda', value: 'UG' },
      { label: 'Ukraine', value: 'UA' },
      { label: 'United Arab Emirates (the)', value: 'AE' },
      { label: 'United Kingdom of Great Britain and Northern Ireland (the)', value: 'GB' },
      { label: 'United States Minor Outlying Islands (the)', value: 'UM' },
      { label: 'United States of America (the)', value: 'US' },
      { label: 'Uruguay', value: 'UY' },
      { label: 'Uzbekistan', value: 'UZ' },
      { label: 'Vanuatu', value: 'VU' },
      { label: 'Venezuela (Bolivarian Republic of)', value: 'VE' },
      { label: 'Viet Nam', value: 'VN' },
      { label: 'Virgin Islands (British)', value: 'VG' },
      { label: 'Virgin Islands (U.S.)', value: 'VI' },
      { label: 'Wallis and Futuna', value: 'WF' },
      { label: 'Western Sahara', value: 'EH' },
      { label: 'Yemen', value: 'YE' },
      { label: 'Zambia', value: 'ZM' },
      { label: 'Zimbabwe', value: 'ZW' },
    ];
    const filterOption = (input, option) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    const departments = ref([]);
    const getDeparments = () => {
      axios
        .get('http://127.0.0.1:8000/api/get-departments')
        .then((response) => {
          if (response) {
            departments.value = response.data;
            profileSpinning.value = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getDeparments();
    // email: 'anhquyendeptraivcl@gmail.com',

    // const formState = reactive({
    //   email: '',
    // });
    const formRef = ref();
    const formState = reactive({
      email: 'anhquyendeptraivcl@gmail.com',
      gender: genderSelectData[0],
      birthday: '18/09/2000',
      region: 'VN',
      name: 'Anh Quyền đẹp trai',
    });
    const accountInfo = inject('accountInfo');

    const rules = {
      email: [
        {
          required: true,
          type: 'email',
          message: 'Vui lòng nhập địa chỉ email!',
          trigger: 'change',
        },
      ],
      username: [
        {
          required: true,
          message: 'Vui lòng nhập tên đăng nhập!',
          trigger: 'change',
        },
      ],
      // birthday: [
      //   {
      //     required: true,
      //     message: 'Vui lòng chọn ngày sinh!',
      //     trigger: 'change',
      //   },
      // ],
    };

    const testVal = ref('');

    const onFinish = (values) => {
      console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
    const onSubmit = () => {
      console.log(route.params.accountId);
      // formRef.value
      //   .validate()
      //   .then(() => {
      //     console.log('values', formState, toRaw(formState));
      //   })
      //   .catch((error) => {
      //     console.log('error', error);
      //   });
    };

    return {
      genderSelectData,
      countryList,
      filterOption,
      formState,
      onFinish,
      onFinishFailed,
      testVal,
      rules,
      onSubmit,
      formRef,
      accountInfo,
      departments,
      profileSpinning,
    };
  },

  data() {
    return {
      // departments: [],
    };
  },

  methods: {
    test(val) {
      console.log(val);
      console.log(this.formState.email);
    },

    getDeparments() {
      axios
        .get('http://127.0.0.1:8000/api/get-departments')
        .then((response) => {
          if (response) {
            this.departments = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  mounted() {
    // this.getDeparments();
  },
});
</script>

<style lang="scss"></style>
