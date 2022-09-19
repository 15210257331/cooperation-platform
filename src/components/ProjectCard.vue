<template>
  <n-card
    style="margin-bottom: 15px; cursor: pointer"
    hoverable
    :style="{ backgroundColor: project.id === projectStore.selectedProject?.id ? '#18a05899' : '' }"
    @click="changeSelectedProject(project.id as number)"
  >
    <div class="project-card">
      <div class="project-icon">
        <n-icon size="20">
          <Documents />
        </n-icon>
      </div>
      <div class="project-info">
        <p>
          {{ project.name }}
          <n-tag type="warning" size="small" round> 10 Tasks </n-tag>
        </p>
        <div class="project-extra">
          <n-icon
            :component="project.star ? StarSharp : StarOutline"
            size="15"
            :color="project.star ? 'rgba(239, 232, 14, 1)' : '#999'"
          />
          <div class="line"></div>
          <span>{{ createDate }}</span>
        </div>
      </div>
      <n-icon class="navigate" size="25" @click="navigare">
        <ArrowForwardCircle />
      </n-icon>
      <n-dropdown style="margin-right: 15px" trigger="hover" :options="options" @select="handleSelect($event)">
        <n-icon size="20">
          <EllipsisHorizontal />
        </n-icon>
      </n-dropdown>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRender } from '@/hooks'
import { EllipsisHorizontal, Documents, TrashBin, ArrowForwardCircle, StarOutline, StarSharp } from '@vicons/ionicons5'
import { ProjectType, useProjectStore } from '@/store'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

const { renderIcon } = useRender()
const router = useRouter()
const projectStore = useProjectStore()

const props = defineProps<{
  project: ProjectType
}>()
const createDate = computed(() => {
  return dayjs(props.project.createDate).format('YYYY年MM月DD日')
})
const options = [
  {
    label: '编辑',
    key: 'edit',
    icon: renderIcon(Documents)
  },
  {
    label: '删除',
    key: 'delete',
    icon: renderIcon(TrashBin)
  }
]

const changeSelectedProject = (projectId: number) => {
  projectStore.changeSelectedProject(projectId)
}
const handleSelect = ($event: any) => {
  console.log($event)
}
const navigare = () => {
  router.push({
    name: 'task'
  })
}
</script>

<style lang="scss" scoped>
.project-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    .navigate {
      display: inline-block;
    }
  }
  .project-icon {
    width: 46px;
    height: 46px;
    border-radius: 23px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(46, 51, 56, 0.05);
    margin-right: 20px;
  }
  .project-info {
    flex: 1;
    p {
      font-weight: 600;
      font-size: 14px;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 5px;
    }
    .project-extra {
      display: flex;
      align-items: center;
      .line {
        margin: 0 6px;
        background-color: #999;
        width: 1.5px;
        height: 10px;
        border-radius: 1px;
        display: inline-block;
        border: none;
      }
      span {
        font-size: 12px;
        color: #999;
        font-weight: 500;
      }
    }
  }
  .navigate {
    margin-right: 18px;
    display: none;
    cursor: pointer;
  }
}
</style>
