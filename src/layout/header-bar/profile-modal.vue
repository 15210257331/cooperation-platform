<template>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    title="用户信息"
    positive-text="关闭"
    @after-leave="handleClose"
  >
    <div style="width: 600px;">
      <div>
        <span>用户名:{{ userStore.userInfo.username }}</span>
      </div>
      <div>
        <span>昵称:{{ userStore.userInfo.username }}</span>
      </div>
      <div>
        <span>角色：{{ userStore.userInfo.role }}</span>
      </div>
      <div>
        <span>电话：{{ userStore.userInfo.phone }}</span>
      </div>
      <div>
        <span>介绍：{{ userStore.userInfo.intro }}</span>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store';
interface Props {
  /** 弹窗显隐 */
  value: boolean;
}
interface Emits {
  (e: 'update:value', val: boolean): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const userStore = useUserStore();

const showModal = computed({
  get() {
    return props.value;
  },
  set(val: boolean) {
    emit('update:value', val);
  }
});

function handleClose() {
  showModal.value = false;
}
</script>

<style lang="scss" scoped></style>
