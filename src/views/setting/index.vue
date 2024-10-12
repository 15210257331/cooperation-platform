<template>
  <div class="setting-wrap" :style="{ backgroundColor: appStore.darkTheme ? 'rgba(255, 255, 255, 0.12)' : '#f9f9f9' }">
    <div class="header">
      <n-tabs type="bar">
        <n-tab v-for="item in tabs" :key="item.value" :name="item.value">{{ item.title }}</n-tab>
      </n-tabs>
      <n-input size="small" placeholder="搜索..." style="width: 280px">
        <template #prefix>
          <n-icon :component="Search" />
        </template>
      </n-input>
    </div>
    <div class="content">
      <div v-for="item in list" :key="item.id" class="classify">
        <div class="classify-header">
          <n-icon :component="MenuSharp" :size="18" />
          <span>{{ item.classify }}</span>
          <n-icon :component="EllipsisHorizontal" :size="18" />
        </div>
        <div class="classify-content">
          <CardItem v-for="sonItem in item.content" :key="sonItem.id" :data="sonItem" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, MenuSharp, EllipsisHorizontal, Notifications } from '@vicons/ionicons5'
import { useAppStore } from '@/store'
import { ref } from 'vue'
import CardItem from './components/CardItem.vue'

const appStore = useAppStore()

const tabs = ref<Array<any>>([
  {
    title: '全部',
    value: 'all'
  },
  {
    title: '假勤',
    value: '1'
  },
  {
    title: '申请',
    value: '2'
  },
  {
    title: '请假',
    value: '3'
  },
  {
    title: '大学',
    value: '4'
  },
  {
    title: '菜谱',
    value: '5'
  },
  {
    title: '阿基米德',
    value: '6'
  }
])

const list = ref<Array<any>>([
  {
    classify: '假勤',
    id: '1',
    content: [
      {
        id: '11',
        name: '请假申请',
        description: '签到打卡'
      },
      {
        id: '12',
        name: '签到',
        description: '签到打卡'
      },
      {
        id: '13',
        name: '签到',
        description: '签到打卡'
      },
      {
        id: '14',
        name: '签到',
        description: '签到打卡'
      },
      {
        id: '15',
        name: '签到',
        description: '签到打卡'
      },
      {
        id: '16',
        name: '签到',
        description: '签到打卡'
      }
    ]
  },
  {
    classify: '假勤',
    id: '1',
    content: [
      {
        id: '11',
        name: '请假申请',
        description: '签到打卡'
      },
      {
        id: '12',
        name: '签到',
        description: '签到打卡'
      },
      {
        id: '13',
        name: '签到',
        description: '签到打卡'
      },
      {
        id: '14',
        name: '签到',
        description: '签到打卡'
      },
      {
        id: '15',
        name: '签到',
        description: '签到打卡'
      },
      {
        id: '16',
        name: '签到',
        description: '签到打卡'
      }
    ]
  },
  {
    classify: '假勤',
    id: '1',
    content: [
      {
        id: '11',
        name: '请假申请',
        description: '签到打卡'
      },
      {
        id: '12',
        name: '签到',
        description: '签到打卡'
      },
      {
        id: '13',
        name: '签到',
        description: '签到打卡'
      },
      {
        id: '14',
        name: '签到',
        description: '签到打卡'
      },
      {
        id: '15',
        name: '签到',
        description: '签到打卡'
      },
      {
        id: '16',
        name: '签到',
        description: '签到打卡'
      }
    ]
  }
])
</script>

<style lang="scss" scoped>
.setting-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    background-color: white;
  }
  .content {
    width: 100%;
    flex: 1;
    overflow: auto;
    .classify {
      .classify-header {
        display: flex;
        align-items: center;
        padding: 12px 16px 0px 16px;
        span {
          flex: 1;
          font-size: 16px;
          margin-left: 8px;
          font-weight: 500;
        }
      }
      .classify-content {
        display: flex;
        flex-wrap: wrap;
        padding: 12px 16px 0px 16px;
      }
    }
  }
}
</style>
