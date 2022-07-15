<template>
  <n-breadcrumb style="flex: 1; margin-left: 10px">
    <n-breadcrumb-item v-for="breadcrumb in breadcrumbs" :key="breadcrumb.name">
      <n-icon :component="breadcrumb.icon" /> {{ breadcrumb.title }}</n-breadcrumb-item
    >
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { Component, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  AlbumsSharp,
  SunnyOutline,
  Sunny,
  ListSharp,
  ExpandSharp,
  Settings,
  PersonCircleOutline as UserIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon
} from '@vicons/ionicons5';

interface BreadcrumbType {
  title: string;
  icon: Component;
  name: string;
}
const route = useRoute();
const breadcrumbs = computed(() => {
  let arr: Array<BreadcrumbType> = [];
  route.matched.map((item: any) => {
    arr.push({
      title: item.meta.title,
      icon: AlbumsSharp,
      name: item.meta.name
    });
  });
  return arr as Array<BreadcrumbType>;
});
</script>

<style lang="scss" scoped></style>
