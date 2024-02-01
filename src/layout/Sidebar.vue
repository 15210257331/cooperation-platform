<template>
  <div class="sidebar">
    <h3 class="title">My Project</h3>
    <ul class="project-list">
      <li
        v-for="item in projectList"
        :key="item.id"
        :class="['project-item', selectProjectId === item.id && 'active']"
        @click="handleItemClick(item)"
      >
        <IconSelect only-show default="Documents"></IconSelect>
        <div class="name">{{ item.name }}</div>
        <n-icon size="20" :component="EllipsisHorizontal" />
      </li>
      <n-spin v-if="loading" size="large" description="数据加载中" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getProjectList } from '@/api'
import { ProjectType } from '@/interface'
import { useRouter } from 'vue-router'
import { EllipsisHorizontal } from '@vicons/ionicons5'

const router = useRouter()

const projectList = ref<ProjectType[]>([])
const loading = ref<boolean>(false)
queryProjectList()
function queryProjectList(sort = '') {
  loading.value = true
  getProjectList(sort)
    .then(res => {
      if (res.code === 10000) {
        projectList.value = res.data || []
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const selectProjectId = ref<string | undefined>(undefined)
const handleItemClick = (item: ProjectType) => {
  selectProjectId.value = item.id
  router.push(`/task/${item.id}`)
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 240px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  opacity: 0.8;
  margin: 0 24px;
  overflow-x: hidden;
  overflow-y: auto;
  .title {
    font-size: 20px;
    font-weight: 500;
    line-height: 45px;
    padding-left: 32px;
  }
  .project-list {
    overflow: auto;
    padding: 0 18px;
    .project-item {
      margin: 12px 0;
      padding: 4px 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;
      &:hover {
        background-color: rgb(243, 243, 245);
        border-radius: 3px;
      }
      &.active {
        background-color: rgba(24, 160, 88, 0.1);
        color: #18a058;
      }
      .name {
        flex: 1;
        color: black;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}
</style>
