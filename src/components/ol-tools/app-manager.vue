<template>
  <a-popover trigger="click" placement="bottomRight" :arrowPointAtCenter="true">
    <template #content>
      <div style="width: 300px" class="p-1">
        <div class="row mb-3">
          <div
            class="user-app col-4 d-flex flex-column align-items-center p-2"
            @mouseenter="addTextTruncate"
            @mouseleave="removeTextTruncate">
            <router-link
              :to="{
                name: 'account-page',
                params: { accountId: user.id },
              }">
              <a-button type="primary" shape="circle" size="large" class="xl-button mb-2" @click="testLogData">
                <i class="fa-solid fa-people-group mt-1"></i>
              </a-button>
            </router-link>
            <!-- <a-button type="primary" shape="circle" size="large" class="xl-button mb-2" @click="testLogData">
              <i class="fa-solid fa-people-group mt-1"></i>
            </a-button> -->
            <span class="user-app__name">
              <p class="text-center p-2 text-truncate">Quản lý tài khoản</p>
            </span>
          </div>
          <div
            class="user-app col-4 d-flex flex-column align-items-center p-2"
            @mouseenter="addTextTruncate"
            @mouseleave="removeTextTruncate">
            <a-button type="primary" shape="circle" size="large" class="xl-button mb-2">
              <i class="fa-solid fa-house-chimney mt-1"></i>
            </a-button>
            <span class="user-app__name">
              <p class="text-center p-2 text-truncate">Quản lý dữ liệu hộ dân sử dụng nước</p>
            </span>
          </div>
          <div
            class="user-app col-4 d-flex flex-column align-items-center p-2"
            @mouseenter="addTextTruncate"
            @mouseleave="removeTextTruncate">
            <a-button type="primary" shape="circle" size="large" class="xl-button mb-2">
              <i class="fa-solid fa-earth-asia mt-1"></i>
            </a-button>
            <span class="user-app__name">
              <p class="text-center p-2 text-truncate">Quản lý dữ liệu số hoá lên bản đồ GIS</p>
            </span>
          </div>
        </div>
        <div class="row mb-3">
          <div
            class="user-app col-4 d-flex flex-column align-items-center p-2"
            @mouseenter="addTextTruncate"
            @mouseleave="removeTextTruncate">
            <a-button type="primary" shape="circle" size="large" class="xl-button mb-2">
              <i class="fa-solid fa-clock-rotate-left mt-1"></i>
            </a-button>
            <span class="user-app__name">
              <p class="text-center p-2 text-truncate">Nhật ký sử dụng</p>
            </span>
          </div>
        </div>
      </div>
    </template>
    <a-button ghost class="me-4" size="small" shape="circle" style="border: 0">
      <i class="fa-regular fa-rectangle-list" style="font-size: large"></i>
    </a-button>
  </a-popover>
</template>

<script>
import { defineComponent, ref, inject } from 'vue';

export default defineComponent({
  setup() {
    const user = inject('userData');
    return {
      user,
    };
  },
  data() {
    return {
      toolHover: true,
    };
  },
  methods: {
    addTextTruncate(event) {
      event.target.getElementsByTagName('p')[0].classList.toggle('text-truncate');
    },
    removeTextTruncate(event) {
      event.target.getElementsByTagName('p')[0].classList.toggle('text-truncate');
    },
    testLogData() {},
  },
});
</script>

<style lang="scss">
.xl-button {
  width: 2rem;
  height: 2rem;
  & i {
    font-size: 1rem;
  }
}

.user-app {
  position: relative;
  &:hover {
    background-color: #c8dfea;
    border-radius: 5px;
    & p {
      background-color: #c8dfea;
      border-radius: 5px;
    }
  }
}

.user-app__name {
  & p {
    position: absolute;
    top: 3.5rem;
    left: 0;
    z-index: 5000;
    width: 100%;
  }
}
</style>
