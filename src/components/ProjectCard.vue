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
          <!-- <n-tag type="warning" size="small" round> 10 Tasks </n-tag> -->
        </p>
        <span>{{ createDate }}</span>
      </div>
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
import { EllipsisHorizontal, Documents, TrashBin} from '@vicons/ionicons5'
import { useProjectStore } from '@/store'
import { ProjectType } from '@/interface'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

const { renderIcon } = useRender()
const router = useRouter()
const projectStore = useProjectStore()

const props = defineProps<{
  project: ProjectType
}>()
const emit = defineEmits(['updateProject', 'deleteProject'])
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
  if ($event === 'edit') {
    emit('updateProject', props.project)
  } else if ($event === 'delete') {
    emit('deleteProject', props.project)
  }
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
    }
    span {
      font-size: 12px;
      color: #999;
      font-weight: 500;
    }
  }
}
</style>
