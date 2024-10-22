<template>
  <n-modal v-model:show="showModal" @after-leave="handleClose">
    <n-card
      :segmented="{
        content: true,
        footer: true
      }"
      style="width: 620px"
      title="设置角色"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button quaternary circle>
          <template #icon>
            <n-icon :component="Close" size="20" @click="showModal = false"> </n-icon>
          </template>
        </n-button>
      </template>
      <n-checkbox-group v-model:value="selectRole">
        <n-space item-style="display: flex;">
          <n-checkbox v-for="item in roleList" :key="item.id" :value="item.id" :label="item.name" />
        </n-space>
      </n-checkbox-group>
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
import { FormInst, useMessage } from 'naive-ui'
import { reactive, ref } from 'vue'
import { ProjectType } from '@/interface'
import { roleListAPI, updateUserInfo, updateUserRole } from '@/api'
import { Close } from '@vicons/ionicons5'

const emits = defineEmits<{
  (e: 'result'): void
}>()

const message = useMessage()

const userId = ref<string>('')
const selectRole = ref<string[]>([])
const showModal = ref<boolean>(false)

function show(data) {
  showModal.value = true
  userId.value = data.id
  selectRole.value = data.roles.map(item => item.id)
  queryRoleList()
}

function handleClose() {
  selectRole.value = []
}

const roleList = ref<any>([])
function queryRoleList() {
  const queryParams = reactive({
    pageIndex: 1,
    pageSize: 100,
    name: ''
  })
  roleListAPI(queryParams).then(res => {
    if (res.code === 10000) {
      roleList.value = res.data.list || []
    }
  })
}

function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  const data = {
    roleIds: selectRole.value,
    userId: userId.value
  }
  updateUserRole(data).then(res => {
    if (res.code === 10000) {
      showModal.value = false
      message.success(res.message)
      emits('result')
    }
  })
}

defineExpose({
  show
})
</script>

<style lang="scss" scoped></style>
