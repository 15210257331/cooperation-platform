<template>
  <n-space vertical>
    <SectionArea title="基本信息">
      <UserInfo></UserInfo>
    </SectionArea>
    <SectionTitle title="快捷操作">
      <CreateCard
        v-for="item in shortcutActionList"
        :key="item.title"
        :icon="item.icon"
        :title="item.title"
        :type="item.type"
        @card:click="handleShortcutClick(item.type)"
      />
    </SectionTitle>
    <SectionTitle title="我的项目" :sub-title="'(共' + projectList.length + '个项目)'">
      <template #action>
        <n-dropdown trigger="hover" :options="options" @select="handleSelect">
          <n-icon size="20" color="black" :component="showType === 'card' ? Apps : ReorderFour"> </n-icon>
        </n-dropdown>
      </template>
      <template v-if="showType === 'card'">
        <ProjectCard
          v-for="item in projectList"
          :key="item.id"
          :project="item"
          @update-project="updateProject"
          @delete-project="deleteProject"
          @click-project="clickProject"
        ></ProjectCard>
      </template>
      <n-data-table v-if="showType === 'list'" :columns="columns" :data="projectList" striped />
    </SectionTitle>
  </n-space>
  <!-- 新增项目弹窗 -->
  <n-modal v-model:show="showModal">
    <n-card
      :segmented="{
        content: true,
        footer: true
      }"
      style="width: 620px"
      :title="'新增任务'"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button quaternary circle>
          <template #icon>
            <n-icon size="20" @click="showModal = false">
              <Close />
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-form ref="formRef" label-placement="left" :label-width="80" :model="formValue" :rules="rules">
        <n-form-item label="项目名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="输入姓名" />
        </n-form-item>
        <n-form-item label="项目icon" path="icon">
          <IconSelect v-model="formValue.icon"></IconSelect>
        </n-form-item>
        <n-form-item label="项目类型" path="type">
          <n-radio-group v-model:value="formValue.type" name="type">
            <n-space>
              <n-radio :value="1"> 普通 </n-radio>
              <n-radio :value="2"> 星标 </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space horizontal style="float: right">
          <n-button tertiary @click="showModal = false"> 取消 </n-button>
          <n-button type="primary" @click="handleValidateClick"> 确认 </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref, h } from 'vue'
import { useDialog, useMessage, FormInst, DataTableColumns, NButton, NImage, NSpace, NIcon } from 'naive-ui'
import { Apps, ReorderFour, StarSharp, StarOutline,Close } from '@vicons/ionicons5'
import ProjectCard from './ProjectCard.vue'
import { useProjectStore } from '@/store'
import { ProjectType } from '@/interface'
import dayjs from 'dayjs'
import img from '../../assets/images/login-back.jpg'
import { useRouter } from 'vue-router'
import { useRender } from '@/hooks'
import SectionTitle from '@/components/SectionArea.vue'
import CreateCard from '@/components/CreateCard.vue'
import UserInfo from './UserInfo.vue'
import SectionArea from '@/components/SectionArea.vue'

const dialog = useDialog()
const projectStore = useProjectStore()
const message = useMessage()
const router = useRouter()
const { renderIcon } = useRender()

const showModal = ref<boolean>(false)
const showType = ref<string>('card')
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  id: null,
  name: '',
  icon: '',
  type: 1
})
const columns: DataTableColumns<ProjectType> = [
  {
    title: '项目封面',
    key: 'name',
    align: 'center',
    render(row) {
      return h(NImage, {
        width: '25',
        src: img
      })
    }
  },
  {
    title: '项目名称',
    key: 'name',
    align: 'center'
  },
  {
    title: '是否标星',
    key: 'type',
    align: 'center',
    render(row) {
      return h(NIcon, {
        component: row.type === 2 ? StarSharp : StarOutline,
        color: row.type === 2 ? '#efe80eff' : '#999'
      })
    }
  },
  {
    title: '创建时间',
    key: 'createDate',
    align: 'center',
    render(row) {
      return h('span', null, { default: () => dayjs(row.createDate).format('YYYY年MM月DD日 HH:mm:ss') })
    }
  },
  {
    title: '操作',
    align: 'center',
    key: 'actions',
    render(row) {
      return [
        h(
          NButton,
          {
            quaternary: true,
            size: 'small',
            type: 'info',
            onClick: () => {
              updateProject(row)
            }
          },
          { default: () => '编辑' }
        ),
        h(
          NButton,
          {
            quaternary: true,
            size: 'small',
            type: 'error',
            onClick: () => {
              deleteProject(row)
            }
          },
          { default: () => '删除' }
        )
      ]
    }
  }
]
const options = [
  {
    label: '卡片模式',
    key: 'card',
    icon: renderIcon(Apps)
  },
  {
    label: '列表模式',
    key: 'list',
    icon: renderIcon(ReorderFour)
  }
]
const shortcutActionList = [
  {
    title: '新增项目',
    icon: 'https://lhcdn.lanhuapp.com/dashboard/production/assets/dc_prj.8ef4ddf0.svg',
    type: 1
  },
  {
    title: '新建任务',
    icon: 'https://lhcdn.lanhuapp.com/dashboard/production/assets/master_go.529dd3fa.svg',
    type: 2
  },
  {
    title: '文档',
    icon: 'https://lhcdn.lanhuapp.com/dashboard/production/assets/ts_doc.58db84fd.svg',
    type: 3
  }
]
const projectList = computed(() => projectStore.projectList)

function handleSelect(key: string) {
  showType.value = key
}
function handleShortcutClick(type: number) {
  // 新建任务
  if (type === 1) {
    showModal.value = true
  }
}

function updateProject($event: ProjectType) {
  // reset()
  showModal.value = true
  formValue.value = {
    id: $event.id as any,
    name: $event.name,
    icon: $event.icon,
    type: $event.type
  }
}
function clickProject($event: ProjectType) {
  projectStore.changeSelectedProject($event.id as number)
  router.push({
    name: 'task'
  })
}
function deleteProject($event: ProjectType) {
  const id = $event.id
  dialog.warning({
    title: '警告',
    content: '你确定删除当前项目吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      await projectStore.deleteProject(id as number)
      message.success('项目已删除！')
    },
    onNegativeClick: () => {}
  })
}
</script>

<style scoped lang="scss"></style>
