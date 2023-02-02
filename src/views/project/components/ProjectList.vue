<template>
  <n-card
    v-for="item in data"
    :key="item.id"
    class="project-card"
    :title="item.name"
    size="small"
    hoverable
    :segmented="{
      content: true,
      footer: 'soft'
    }"
    @click="handleClick(item)"
  >
    <template #header-extra>
      <n-dropdown style="margin-right: 15px" trigger="hover" :options="options" @select="handleSelect($event, item)">
        <n-icon size="20">
          <EllipsisHorizontal />
        </n-icon>
      </n-dropdown>
    </template>
    <div class="project-cover">
      <img :src="item.cover" alt="" />
    </div>
    <template #action>
      <div class="project-footer">
        <span>{{ formatDate(item.createDate) }}</span>
        <n-icon
          size="17"
          :component="item.type === 2 ? StarSharp : StarOutline"
          :color="item.type === 2 ? '#efe80eff' : '#999'"
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
  data: Array<ProjectType>
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

function handleClick(project: ProjectType) {
  emit('clickProject', project)
}
const handleSelect = ($event: any, project: ProjectType) => {
  console.log($event)
  if ($event === 'edit') {
    emit('updateProject', project)
  } else if ($event === 'delete') {
    emit('deleteProject', project)
  }
}
function formatDate(value: any) {
  return dayjs(value).format('YYYY年MM月DD日 HH:mm:ss')
}
</script>

<style lang="scss" scoped>
.project-card {
  width: 240px;
  border-radius: 10px;
  margin: 0 15px 15px 0;
  cursor: pointer;
  .project-cover {
    img {
      width: 100%;
      height: 160px;
    }
    // background-image: url('../../assets/images/login-back.jpg');
    // background-size: cover;
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
