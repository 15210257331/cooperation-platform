<template>
  <n-modal v-model:show="show">
    <n-card
      :segmented="{
        content: true,
        footer: true
      }"
      style="width: 620px"
      title="个人信息"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button quaternary circle>
          <template #icon>
            <n-icon size="20" @click="handleClose">
              <Close />
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-form ref="formRef" :label-placement="'left'" :label-width="'auto'" :model="userStore.userInfo" :rules="rules">
        <n-form-item label="头像:" path="nickname">
          <n-avatar :size="48" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
          <n-upload
            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            :headers="{
              'naive-info': 'hello!'
            }"
            :data="{
              'naive-data': 'cool! naive!'
            }"
          >
            <n-button>上传文件</n-button>
          </n-upload>
        </n-form-item>
        <n-form-item label="昵称:" path="nickname">
          <n-input v-model:value="userStore.userInfo.nickname" placeholder="昵称" />
        </n-form-item>
        <n-form-item label="用户名:" path="username">
          <n-input v-model:value="userStore.userInfo.username" placeholder="用户名" />
        </n-form-item>
        <n-form-item label="手机号:" path="phone">
          <n-input v-model:value="userStore.userInfo.phone" placeholder="手机号" />
        </n-form-item>
        <n-form-item label="个人简介:" path="intro">
          <n-input v-model:value="userStore.userInfo.intro" type="textarea" placeholder="个人简介" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space horizontal style="float: right">
          <n-button tertiary @click="handleClose"> 取消 </n-button>
          <n-button type="primary" @click="handleSubmit"> 确认 </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore, UserInfoType } from '@/store';
import { Close } from '@vicons/ionicons5';
interface Props {
  /** 弹窗显隐 */
  value: boolean;
}
const props = defineProps<Props>();

interface Emits {
  (e: 'update:value', val: boolean): void;
}
const emit = defineEmits<Emits>();

const userStore = useUserStore();
const formValue = ref<UserInfoType>();
const show = computed({
  get() {
    return props.value;
  },
  set(val: boolean) {
    emit('update:value', val);
  }
});
const rules = {};
onMounted(() => {
  formValue.value = {
    id: userStore.userInfo.id,
    username: userStore.userInfo.username,
    nickname: userStore.userInfo.nickname,
    phone: userStore.userInfo.phone,
    avatar: userStore.userInfo.avatar,
    role: userStore.userInfo.role,
    intro: userStore.userInfo.intro
  };
});
function handleSubmit() {}
function handleClose() {
  show.value = false;
}
</script>

<style lang="scss" scoped></style>
