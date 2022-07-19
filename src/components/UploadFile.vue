<template>
  <n-space :align="'center'">
    <n-avatar :size="45" round :src="showUrl" />
    <n-upload
      :action="action"
      :show-file-list="false"
      :name="'file'"
      :headers="{
        Authorization: `Bearer ${token}`
      }"
      :data="{
        'other-data': 'some other data'
      }"
      :custom-request="customRequest"
    >
      <n-button>重新上传</n-button>
    </n-upload>
  </n-space>
</template>

<script setup lang="ts">
import { uploadFile } from '@/api';
import { UploadCustomRequestOptions } from 'naive-ui';
import { computed, ref } from 'vue';

interface Props {
  url: string;
}
const props = defineProps<Props>();

interface Emits {
  (e: 'update:url', val: string): void;
}
const emit = defineEmits<Emits>();

const token = localStorage.getItem('token');
const action = import.meta.env.VITE_APP_BASE_API + '/api/file/upload';

const showUrl = computed({
  get() {
    return props.url;
  },
  set(val: string) {
    emit('update:url', val);
  }
});

function customRequest({
  file,
  data,
  headers,
  withCredentials,
  action,
  onFinish,
  onError,
  onProgress
}: UploadCustomRequestOptions) {
  const formData = new FormData();
  if (data) {
    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof UploadCustomRequestOptions['data']]);
    });
  }
  formData.append('file', file.file as File);
  uploadFile(formData).then(res => {
    console.log(res);
    if (res.code === 10000) {
      showUrl.value = res.data.url;
    }
  });
}
</script>

<style lang="scss" scoped></style>
