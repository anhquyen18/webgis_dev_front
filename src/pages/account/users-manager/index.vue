<template>
  <a-spin :spinning="usersManagerSpinning" tip="Just a minute...">
    <a-table
      ref="table"
      :columns="columns"
      :data-source="data.data"
      :pagination="{
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
        showSizeChanger: true,
        total: data.total,
        onChange: (page, pageSize) => pageChange(page, pageSize),
        onShowSizeChange: (current, size) => pageChange(current, size),
      }">
      <template #headerCell="{ column }">
        <i :class="column.icon" class="me-1"></i>
        <span> {{ column.title }} </span>
      </template>

      <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
        <div v-if="column.key === 'name'" style="padding: 8px">
          <a-input
            ref="nameSearchInput"
            v-model:value="searchList[0]"
            :placeholder="`Search ${column.dataIndex}`"
            style="width: 100%; margin-bottom: 8px; display: block"
            @pressEnter="handleSearch()" />
          <a-row>
            <a-col :span="16">
              <a-button
                type="primary"
                size="small"
                style="margin-right: 8px; width: 80%"
                @click="handleSearch()"
                :disabled="searchList[0] === ''">
                <template #icon><SearchOutlined /></template>
                Search
              </a-button>
            </a-col>
            <a-col :span="8">
              <a-button size="small" @click="handleReset(0)" :disabled="searchList[0] === ''"> Reset </a-button>
            </a-col>
          </a-row>
        </div>

        <div v-if="column.key === 'email'" style="padding: 8px">
          <a-input
            ref="nameSearchInput"
            v-model:value="searchList[2]"
            :placeholder="`Search ${column.dataIndex}`"
            style="width: 100%; margin-bottom: 8px; display: block"
            @pressEnter="handleSearch()" />
          <a-row>
            <a-col :span="16">
              <a-button
                type="primary"
                size="small"
                style="margin-right: 8px; width: 80%"
                @click="handleSearch()"
                :disabled="searchList[2] === ''">
                <template #icon><SearchOutlined /></template>
                Search
              </a-button>
            </a-col>
            <a-col :span="8">
              <a-button size="small" @click="handleReset(2)" :disabled="searchList[2] === ''"> Reset </a-button>
            </a-col>
          </a-row>
        </div>

        <div v-if="column.key === 'department'" style="padding: 8px">
          <a-checkbox-group
            v-model:value="searchList[3]"
            :options="departmentOptions"
            style="display: flex; flex-direction: column"></a-checkbox-group>
          <a-row>
            <a-col :span="16">
              <a-button
                type="primary"
                size="small"
                style="margin-right: 8px; width: 80%"
                @click="handleSearch()"
                :disabled="!searchList[3].length > 0">
                <template #icon><SearchOutlined /></template>
                Search
              </a-button>
            </a-col>
            <a-col :span="8">
              <a-button size="small" @click="handleReset(3)" :disabled="!searchList[3].length > 0"> Reset </a-button>
            </a-col>
          </a-row>
        </div>

        <div v-if="column.key === 'status'" style="padding: 8px">
          <a-checkbox-group
            v-model:value="searchList[4]"
            :options="statusOptions"
            style="display: flex; flex-direction: column"></a-checkbox-group>
          <a-row>
            <a-col :span="16">
              <a-button
                type="primary"
                size="small"
                style="margin-right: 8px; width: 80%"
                @click="handleSearch()"
                :disabled="!searchList[4].length > 0">
                <template #icon><SearchOutlined /></template>
                Search
              </a-button>
            </a-col>
            <a-col :span="8">
              <a-button size="small" @click="handleReset(4)" :disabled="!searchList[4].length > 0"> Reset </a-button>
            </a-col>
          </a-row>
        </div>
      </template>

      <template #customFilterIcon="{ column }">
        <SearchOutlined v-if="column.key === 'name'" :style="{ color: searchList[0] ? '#108ee9' : undefined }" />
        <SearchOutlined v-if="column.key === 'email'" :style="{ color: searchList[2] ? '#108ee9' : undefined }" />
        <SearchOutlined
          v-if="column.key === 'department'"
          :style="{ color: searchList[3].length > 0 ? '#108ee9' : undefined }" />
        <SearchOutlined
          v-if="column.key === 'status'"
          :style="{ color: searchList[4].length > 0 ? '#108ee9' : undefined }" />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a>
            {{ record.name }}
          </a>
        </template>
        <template v-else-if="column.key === 'status'">
          <span>
            <a-tag
              :color="record.status === 'Hoạt động' ? 'success' : record.status === 'Hạn chế' ? 'warning' : 'error'">
              {{ record.status.toUpperCase() }}
            </a-tag>
          </span>
        </template>
      </template>
    </a-table>
  </a-spin>
</template>

<script>
import { message } from 'ant-design-vue';
import { defineComponent, ref, reactive, toRefs, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { accountMenu } from '../../../stores/account-menu';
import { getCookie } from '../../../js/util.js';
import { paginationConfig } from 'ant-design-vue/es/pagination';
import { SearchOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  components: {
    SearchOutlined,
  },
  beforeRouteEnter(to, from, next) {
    next((data) => {
      if (!data.accountInfo.department_id === 3) {
        data.$router.push({ name: 'account-page', id: data.accountInfo.id });
        message.warning('You are not allow to get in.');
      }
    });
  },

  setup() {
    const usersManagerSpinning = ref(true);
    const accountInfo = inject('accountInfo');
    accountMenu().onSelectedKeys(['account-users-manager']);
    const table = ref();
    const nameSearchInput = ref();
    const searchList = ref(['', '', '', [], [], '']);
    const searchColumns = ref(['name', 'birthday', 'email', 'department_id', 'status_id', 'geoserver_account_id']);
    const currentPageSize = ref(10);
    const currentPage = ref(1);
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        icon: '',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        icon: 'fa-regular fa-user',
        customFilterDropdown: true,
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              // nameSearchInput.value.focus();
            }, 100);
          }
        },
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Birthday',
        dataIndex: 'birthday',
        key: 'birthday',
        icon: 'fa-solid fa-cake-candles',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        icon: 'fa-regular fa-envelope',
        customFilterDropdown: true,
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              // nameSearchInput.value.focus();
            }, 100);
          }
        },
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        icon: 'fa-solid fa-briefcase',
        customFilterDropdown: true,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        icon: 'fa-regular fa-address-card',
        customFilterDropdown: true,
      },
      {
        title: 'Geoserver',
        dataIndex: 'geoserver_account_id',
        key: 'geoserver',
        icon: 'fa-solid fa-globe',
      },
    ];

    const data = ref({});
    let accessToken = {
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    };
    const pageChange = (page, pageSize) => {
      usersManagerSpinning.value = true;
      currentPage.value = page;
      currentPageSize.value = pageSize;
      axios
        .post(
          `http://127.0.0.1:8000/api/get-users-manager?page=${page}`,
          { pageSize: pageSize, searchList: searchList.value, searchColumns: searchColumns.value },
          accessToken
        )
        .then((response) => {
          console.log(response);
          data.value = response.data;
          usersManagerSpinning.value = false;
        })
        .catch((error) => {
          console.log(error);
          usersManagerSpinning.value = false;
          message.error('Somethings get wrong, please try again later.');
        });
    };
    pageChange(1, 10);

    const departmentOptions = ref({});
    axios
      .get('http://127.0.0.1:8000/api/get-departments')
      .then((response) => {
        if (response) {
          departmentOptions.value = response.data;
          // console.log(departmentOptions.value);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    const statusOptions = ref({});
    axios
      .get('http://127.0.0.1:8000/api/get-user-status')
      .then((response) => {
        if (response) {
          statusOptions.value = response.data;

          console.log(statusOptions.value);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // const data = [
    //   {
    //     key: '1',
    //     name: 'John Brown',
    //     age: 32,
    //     address: 'New York No. 1 Lake Park',
    //     tags: ['nice', 'developer'],
    //   },
    //   {
    //     key: '2',
    //     name: 'Jim Green',
    //     age: 42,
    //     address: 'London No. 1 Lake Park',
    //     tags: ['loser'],
    //   },
    //   {
    //     key: '3',
    //     name: 'Joe Black',
    //     age: 32,
    //     address: 'Sidney No. 1 Lake Park',
    //     tags: ['cool', 'teacher'],
    //   },
    // ];

    // current: current,
    //     pageSize: pageSize,
    //     showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
    //     showSizeChanger: true,
    //     total: data.total,
    //     onChange: (page, pageSize) => pageChange(page, pageSize),
    //     onShowSizeChange: (current, size) => sizeChange(current, size),

    const paginationConfig = ref({
      current: 1,
      pageSize: 10,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
      showSizeChanger: true,
      total: data.value.total,
      onChange: (page, pageSize) => pageChange(page, pageSize),
      onShowSizeChange: (current, size) => pageChange(current, size),
    });

    return {
      usersManagerSpinning,
      table,
      data,
      columns,
      accountInfo,
      paginationConfig,
      accessToken,
      nameSearchInput,
      searchList,
      searchColumns,
      currentPageSize,
      currentPage,
      pageChange,
      paginationConfig,
      departmentOptions,
      statusOptions,
    };
  },

  methods: {
    test() {
      console.log(this.searchList[3]);
    },
    handleSearch() {
      this.pageChange(this.currentPage, this.currentPageSize);
    },
    handleReset(v) {
      // if( typeof this.searchList[v] === 'string')
      //  typeof this.searchList[v] === 'string' ? ''
      // console.log(typeof this.searchList[v] === 'string');
      typeof this.searchList[v] === 'string' ? (this.searchList[v] = '') : (this.searchList[v] = []);
      this.pageChange(this.currentPage, this.currentPageSize);
    },
  },
});
</script>

<style lang="scss" scoped></style>
