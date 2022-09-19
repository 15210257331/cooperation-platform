<template>
  <n-card
    size="small"
    title="项目列表"
    :segmented="{
      content: true
    }"
    :content-style="{ padding: '10px' }"
  >
    <template #header-extra>
      <n-button secondary circle type="success" size="tiny" @click="showModal = true">
        <template #icon>
          <n-icon><AddCircle /></n-icon>
        </template>
      </n-button>
    </template>
    <Empty v-if="projectList.length === 0" />
    <div v-else style="height: 500px; padding: 0 10px 0 5px; overflow: auto">
      <ProjectCard
        v-for="item in projectList"
        :key="item.id"
        :project="item"
        @update-project="updateProject($event)"
        @delete-project="deleteProject($event)"
      />
    </div>
  </n-card>
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
        <n-form-item label="是否星标" path="star">
          <n-radio-group v-model:value="formValue.star" name="radiogroup">
            <n-space>
              <n-radio :value="false"> 普通 </n-radio>
              <n-radio :value="true"> 星标 </n-radio>
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
import { ref, computed } from 'vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { useProjectStore } from '@/store'
import { AddCircle, Close } from '@vicons/ionicons5'
import { FormInst, useMessage, useDialog } from 'naive-ui'

const projectStore = useProjectStore()
const message = useMessage()
const dialog = useDialog()

const showModal = ref<boolean>(false)
const id = ref<number | null>(null)
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  name: '',
  star: false
})
const rules = {
  name: {
    required: true,
    message: '请输入项目名称',
    trigger: 'blur'
  },
  star: {
    required: false,
    message: '请选择项目icon',
  }
}
const projectList = computed(() => projectStore.projectList)

function updateProject($event: any) {
  showModal.value = true
  id.value = $event.id
  formValue.value = {
    name: $event.name,
    star: $event.star
  }
}

function deleteProject($event: any) {
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

function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async errors => {
    if (!errors) {
      if (id.value) {
        const data = Object.assign({}, formValue.value, {
          id: id.value
        })
        const msg = await projectStore.updateProject(data)
        message.success(msg)
        showModal.value = false
        id.value = null
      } else {
        const msg = await projectStore.createProject(formValue.value)
        message.success(msg)
        showModal.value = false
      }
    } else {
      console.log(errors)
      message.error('Invalid')
    }
  })
}
</script>

<style lang="scss" scoped></style>
