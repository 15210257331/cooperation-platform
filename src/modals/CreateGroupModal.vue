<template>
  <n-modal v-model:show="showModal">
    <n-card
      :segmented="{
        content: true,
        footer: true
      }"
      style="width: 620px"
      :title="isEdit ? '分组信息修改' : '新建分组'"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button quaternary circle>
          <template #icon>
            <n-icon size="20" @click="handleClose">
              <Close />
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-form ref="formRef" :label-placement="'left'" :label-width="'auto'" :model="form" :rules="rules">
        <n-form-item label="流程名称:" path="name">
          <n-input v-model:value="form.name" placeholder="输入流程名称" />
        </n-form-item>
        <n-form-item label="节点排序:" path="sort">
          <n-input-number v-model:value="form.sort" />
        </n-form-item>
        <n-form-item label="新建任务:" path="canNew">
          <n-radio-group v-model:value="form.canNew" name="radiogroup">
            <n-space>
              <n-radio :value="1"> 允许新建任务 </n-radio>
              <n-radio :value="2"> 无法新建任务 </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item v-if="isEdit === true" label="流转范围:" path="range">
          <n-checkbox-group v-model:value="form.range">
            <n-space item-style="display: flex;">
              <n-checkbox
                v-for="item in rangeList"
                :key="item.id"
                :disabled="item.disabled"
                :value="item.id"
                :label="item.name"
              />
            </n-space>
          </n-checkbox-group>
        </n-form-item>
        <n-form-item label="标记完成:" path="complete">
          <n-space horizontal>
            <n-switch v-model:value="form.complete" />
            <n-tag v-if="form.complete === true" :bordered="false" type="success">
              该流程下的所有任务状态为已完成
            </n-tag>
          </n-space>
          <span></span>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space horizontal style="float: right">
          <n-button tertiary @click="handleClose"> 取消 </n-button>
          <n-button type="primary" @click="handleSubmit"> 确认 </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { FormInst, useMessage } from 'naive-ui'
import { useProjectStore } from '@/store'
import { GroupType } from '@/interface'
import { Close } from '@vicons/ionicons5'

interface Props {
  /** 弹窗显隐 */
  value: boolean
  data: GroupType | null
}
const props = defineProps<Props>()

interface Emits {
  (e: 'update:value', val: boolean): void
}
const emit = defineEmits<Emits>()

const projectStore = useProjectStore()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const form = ref<GroupType>({
  name: '',
  canNew: 1,
  sort: props.data ? props.data.sort + 1 : 0,
  complete: false,
  range: [],
  tasks: []
})
const rules = {
  name: {
    required: true,
    message: '请输入流程名称',
    trigger: 'blur'
  },
  sort: {
    required: true,
    message: '排序必填'
  },
  canNew: {
    required: true,
    message: '新建任务必选'
  },
  complete: {
    required: true,
    message: '完成状态必选'
  }
}

const showModal = computed({
  get() {
    return props.value
  },
  set(val: boolean) {
    emit('update:value', val)
  }
})

const isEdit = computed(() => {
  if (props.data) {
    return true
  }
  return false
})

const rangeList = computed(() => {
  const arr = projectStore.currentProject ? projectStore.currentProject.groups : []
  arr.sort((a: { sort: number }, b: { sort: number }) => a.sort - b.sort)
  arr.map((flow: any) => {
    if (flow.id === (props.data as GroupType).id) {
      flow.disabled = true
    } else {
      flow.disabled = false
    }
  })
  return arr
})

watch(
  () => props.data,
  newValue => {
    if (newValue) {
      console.log(newValue)
      const data = props.data as GroupType
      form.value = {
        id: data.id,
        name: data.name,
        canNew: data.canNew ? 1 : 2,
        sort: data.sort,
        complete: data.complete,
        range: data.range.map((item: string) => item),
        tasks: []
      }
    } else {
      form.value = {
        id: undefined,
        name: '',
        canNew: 1,
        sort: 0,
        complete: false,
        range: [],
        tasks: []
      }
    }
  }
)

async function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async errors => {
    if (!errors) {
      if (isEdit.value === false) {
        createFlow()
      } else {
        updateFlow()
      }
    } else {
      console.log(errors)
      //   message.error('Invalid');
    }
  })
}

async function createFlow() {
  const data = Object.assign({}, form.value, {
    canNew: form.value.canNew === 1 ? true : false,
    projectId: projectStore.currentProject?.id
  })
  await projectStore.createGroup(data)
  showModal.value = false
  resetForm()
  message.success('操作成功')
}

async function updateFlow() {
  const data = Object.assign({}, form.value, {
    canNew: form.value.canNew === 1 ? true : false
  })
  await projectStore.updateGroup(data)
  showModal.value = false
  resetForm()
  message.success('操作成功')
}

function resetForm() {
  formRef.value?.restoreValidation()
  form.value = {
    name: '',
    canNew: 1,
    sort: props.data ? props.data.sort + 1 : 0,
    complete: false,
    range: [],
    tasks: []
  }
}

function handleClose() {
  showModal.value = false
}
</script>

<style lang="scss" scoped></style>
