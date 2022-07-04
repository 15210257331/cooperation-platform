<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="dataList"
    :pagination="{itemCount: total, pageSize: queryParams.size }"
  />
</template>

<script setup lang="ts">
import { h, ref, onMounted } from 'vue';
import { userList } from '@/service/api';
import { DataTableColumns, useMessage, NTag, NButton } from 'naive-ui';

const message = useMessage();

type RowData = {
  key: number;
  username: string;
  nickname: string;
  phone: string;
  role: number;
  createDate: string;
};
const columns: DataTableColumns<RowData> = [
  {
    title: '用户名',
    key: 'username'
  },
  {
    title: '昵称',
    key: 'nickname'
  },
  {
    title: '手机号',
    key: 'phone'
  },
  {
    title: '角色',
    key: 'tags',
    render(row) {
      return h(
        NTag,
        {
          style: {
            marginRight: '6px'
          },
          type: 'info',
          bordered: false
        },
        {
          default: () => (row.role === 1 ? '管理员' : '普通用户')
        }
      );
    }
  },
  {
    title: '注册时间',
    key: 'createDate'
  },
  {
    title: 'Action',
    key: 'actions',
    render(row) {
      return h(
        NButton,
        {
          size: 'small',
          onClick: () => {
            message.info('send mail to ' + row.nickname);
          }
        },
        { default: () => '删除' }
      );
    }
  }
];

const dataList = ref<RowData[]>([]);
const total = ref<number>(0);
const queryParams = ref({
  page: 1,
  size: 10,
  name: ''
});

function queryData() {
  userList(queryParams.value).then(res => {
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
