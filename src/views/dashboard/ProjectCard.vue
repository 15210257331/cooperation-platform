<template>
  <n-card
    class="project-card"
    :title="project.name"
    size="small"
    hoverable
    :segmented="{
      content: true,
      footer: 'soft'
    }"
    @click="handleClick"
  >
    <template #header-extra>
      <n-dropdown style="margin-right: 15px" trigger="hover" :options="options" @select="handleSelect($event)">
        <n-icon size="20">
          <EllipsisHorizontal />
        </n-icon>
      </n-dropdown>
    </template>
    <div class="project-cover"></div>
    <template #action>
      <div class="project-footer">
        <span>{{ formatDate(project.createDate) }}</span>
        <n-icon
          size="17"
          :component="project.type === 2 ? StarSharp : StarOutline"
          :color="project.type === 2 ? '#efe80eff' : '#999'"
        />
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { StarSharp, StarOutline, Documents, TrashBin, EllipsisHorizontal } from '@vicons/ionicons5'
import { useRender } from '@/hooks'
import dayjs from 'dayjs'
import { ProjectType } from '@/interface'

const { renderIcon } = useRender()

const props = defineProps<{
  project: ProjectType
}>()
const emit = defineEmits(['updateProject', 'deleteProject', 'clickProject'])

const options = [
  {
    label: '修改信息',
    key: 'edit',
    icon: renderIcon(Documents)
  },
  {
    label: '删除项目',
    key: 'delete',
    icon: renderIcon(TrashBin)
  }
]

function handleClick() {
  emit('clickProject', props.project)
}
const handleSelect = ($event: any) => {
  console.log($event)
  if ($event === 'edit') {
    emit('updateProject', props.project)
  } else if ($event === 'delete') {
    emit('deleteProject', props.project)
  }
}
function formatDate(value: any) {
  return dayjs(value).format('YYYY年MM月DD日')
}
</script>

<style lang="scss" scoped>
.project-card {
  width: 240px;
  height: 280px;
  background-color: white;
  border-radius: 10px;
  margin: 0 15px 15px 0;
  cursor: pointer;
  .project-cover {
    width: 100%;
    height: 100%;
    background-image: url('../../assets/images/login-back.jpg');
    background-size: cover;
  }
  .project-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      font-size: 12px;
      color: #999;
      font-weight: 500;
    }
  }
}
</style>
