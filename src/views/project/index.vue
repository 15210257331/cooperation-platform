<template>
  <div class="dashboard">
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
        <n-dropdown trigger="hover" :options="orderOptions" @select="handleOrderOptionChange">
          <n-button icon-placement="right" text style="margin-right: 20px">
            <template #icon>
              <n-icon :component="ChevronDown" />
            </template>
            {{ selectOrderType }}
          </n-button>
        </n-dropdown>
        <n-dropdown trigger="hover" :options="options" @select="handleSelect">
          <n-icon size="20" :component="showType === 'card' ? Apps : ReorderFour"> </n-icon>
        </n-dropdown>
      </template>
      <ProjectList
        v-if="showType === 'card'"
        :data="projectList"
        @update-project="handleUpdateProject"
        @delete-project="removeProject"
        @click-project="clickProject"
      />
      <n-data-table v-if="showType === 'list'" :columns="columns" :data="projectList" striped />
      <div v-if="projectList.length === 0" class="empty">
        <n-empty></n-empty>
      </div>
    </SectionTitle>
  </div>
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
        <n-form-item label="背景图:" path="cover">
          <UploadFile v-model:url="formValue.cover" title="点击上传" />
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
          <n-button type="primary" @click="handleSubmit"> 确认 </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store'
import { computed, ref, h } from 'vue'
import { useDialog, useMessage, FormInst, DataTableColumns, NButton, NImage, NSpace, NIcon } from 'naive-ui'
import { Apps, ReorderFour, StarSharp, StarOutline, Close, ChevronDown } from '@vicons/ionicons5'
import ProjectList from './components/ProjectList.vue'
import { useProjectStore } from '@/store'
import { ProjectType } from '@/interface'
import dayjs from 'dayjs'
import img from '../../assets/images/login-back.jpg'
import { useRouter } from 'vue-router'
import { useRender } from '@/hooks'
import SectionTitle from '@/components/SectionArea.vue'
import CreateCard from '@/components/CreateCard.vue'
import IconSelect from '@/components/IconSelect.vue'
import UploadFile from '@/components/UploadFile.vue'
import { getProjectList, deleteProject, updateProject, createProject } from '@/api'

const appStore = useAppStore()
const dialog = useDialog()
const projectStore = useProjectStore()
const message = useMessage()
const router = useRouter()
const { renderIcon } = useRender()

const showModal = ref<boolean>(false)
const showType = ref<string>('card')
const formRef = ref<FormInst | null>(null)
const selectOrderType = ref<string>('打开时间排序')
const formValue = ref({
  id: null,
  name: '',
  icon: '',
  cover: '',
  type: 1
})
const columns: DataTableColumns<ProjectType> = [
  {
    title: '项目封面',
    key: 'name',
    align: 'center',
    render(row) {
      return h(NImage, {
        width: '50',
        src: row.cover
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
            type: 'primary',
            onClick: () => {
              clickProject(row)
            }
          },
          { default: () => '详情' }
        ),
        h(
          NButton,
          {
            quaternary: true,
            size: 'small',
            type: 'info',
            onClick: () => {
              handleUpdateProject(row)
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
              removeProject(row)
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
const orderOptions = [
  {
    type: 'group',
    label: '排序类型',
    key: 'sort',
    children: [
      {
        label: '创建时间排序',
        key: '1'
      },
      {
        label: '打开时间排序',
        key: '2'
      },
      {
        label: '名称排序',
        key: '3'
      }
    ]
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
const rules = {
  name: {
    required: true,
    message: '请输入项目名称',
    trigger: 'blur'
  },
  icon: {
    required: true,
    message: '请选择项目icon'
  },
  type: {
    required: true,
    message: '请选择项目类型'
  }
}

const projectList = ref([])

queryProjectList()

function queryProjectList() {
  getProjectList().then(res => {
    if (res.code === 10000) {
      projectList.value = res.data || []
      console.log(projectList)
    }
  })
}

function handleSelect(key: string) {
  showType.value = key
}
function handleOrderOptionChange(key: string, option: any) {
  selectOrderType.value = option.label
}
function handleShortcutClick(type: number) {
  // 新建任务
  if (type === 1) {
    showModal.value = true
  }
}
function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async errors => {
    if (!errors) {
      if (formValue.value.id !== null) {
        updateProject(formValue.value).then(res => {
          if (res.code === 10000) {
            message.success('操作成功')
            showModal.value = false
            queryProjectList()
          }
        })
      } else {
        createProject(formValue.value).then(res => {
          if (res.code === 10000) {
            message.success('项目创建成功')
            showModal.value = false
            queryProjectList()
          }
        })
      }
    }
  })
}
function handleUpdateProject($event: ProjectType) {
  resetForm()
  showModal.value = true
  formValue.value = {
    id: $event.id as any,
    name: $event.name,
    icon: $event.icon,
    cover: $event.cover,
    type: $event.type
  }
}
function clickProject($event: ProjectType) {
  router.push({
    name: 'task'
  })
  projectStore.setCurrentProject($event)
}
function removeProject($event: ProjectType) {
  const id = $event.id
  dialog.warning({
    title: '警告',
    content: '你确定删除当前项目吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      deleteProject(id as number).then(res => {
        if (res.code === 10000) {
          message.success('项目删除成功！')
        }
      })
    },
    onNegativeClick: () => {}
  })
}
function resetForm() {
  formRef.value?.restoreValidation()
  formValue.value = {
    id: null,
    name: '',
    cover: '',
    icon: '',
    type: 1
  }
}
</script>

<style lang="scss" scoped>
.n-layout-content {
  // background-color: #f3f5f7;
  height: calc(100% - 55px);
  margin-top: 10px;
  padding: 25px;
}
header {
  height: 65px;
  //   border-bottom: 1px solid #ccc;
  background-color: white;
  text-align: center;
  ul {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
