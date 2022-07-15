<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="dataList"
    :pagination="{ itemCount: total, pageSize: queryParams.size }"
  />
</template>

<script setup lang="ts">
import { h, ref, onMounted } from 'vue';
import { getTaskList } from '@/api';
import { DataTableColumns, useMessage, NTag, NButton } from 'naive-ui';
import dayjs from 'dayjs';

const message = useMessage();

type RowData = {
  key: number;
  name: string;
  description: string;
  createDate: string;
};
const columns: DataTableColumns<RowData> = [
  {
    title: '任务名称',
    key: 'name'
  },
  {
    title: '任务描述',
    key: 'description'
  },
  {
    title: '创建时间',
    key: 'createDate',
    render(row) {
      return h('span', null, { default: () => dayjs(row.createDate).format('YYYY年MM月DD日 HH:mm:ss') });
    }
  },
  {
    title: 'Action',
    key: 'actions',
    render(row) {
      return h(
        NButton,
        {
          size: 'small',
          type: 'error',
          onClick: () => {
            message.info('send mail to ' + row.name);
          }
        },
        { default: () => '彻底删除' }
      );
    }
  }
];

const dataList = ref<RowData[]>([]);
const total = ref<number>(0);
const queryParams = ref({
  page: 1,
  size: 10,
  name: '',
  isDelete: true
});

function queryData() {
  getTaskList(queryParams.value).then(res => {
    if (res.code === 10000) {
      dataList.value = res.data.list || [];
      total.value = res.data.total;
    }
  });
}

onMounted(() => {
  queryData();
});
</script>

<style lang="scss" scoped></style>
