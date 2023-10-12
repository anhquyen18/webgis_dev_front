<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#1c8092',
        sizeStep: 4,
        sizeUnit: 2,
        borderRadius: 8,
        wireframe: false,
      },
    }">
    <router-view></router-view>
  </a-config-provider>
</template>
