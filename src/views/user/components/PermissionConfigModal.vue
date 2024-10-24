<template>
  <n-modal v-model:show="showModal" @after-leave="handleClose">
    <n-card
      :segmented="{
        content: true,
        footer: true
      }"
      style="width: 620px"
      title="角色权限配置"
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
      <n-space>
        <n-checkbox :checked="checkedAll" label="全选" @update:checked="handleCheckedChange" />
      </n-space>
      <n-checkbox-group v-model:value="selectPermission">
        <template v-for="item in permissionOptions" :key="item.id">
          <n-space v-if="item.type === 'menu'" style="margin: 18px 0 10px 0">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-checkbox :value="item.value">
                  <n-tag size="small" type="warning" :bordered="false"> {{ item.title }}(菜单) </n-tag>
                </n-checkbox>
              </template>
              权限编码：{{ item.value }}
            </n-tooltip>
          </n-space>
          <n-tooltip v-else trigger="hover">
            <template #trigger>
              <n-checkbox :value="item.value" :label="item.title" style="margin-right: 10px" />
            </template>
            权限编码：{{ item.value }}
          </n-tooltip>
        </template>
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
import { ref } from 'vue'
import { ProjectType } from '@/interface'
import { setRolePermissionAPI, createProject } from '@/api'
import { Close } from '@vicons/ionicons5'
import { permissionOptions } from '@/config'

const emits = defineEmits<{
  (e: 'result'): void
}>()

const message = useMessage()

const id = ref<string>('')
const selectPermission = ref<number[]>([])
const showModal = ref<boolean>(false)

function show(data) {
  showModal.value = true
  id.value = data.id
  permissionOptions.map(item => {
    if (item.value & data.permission) {
      selectPermission.value.push(item.value)
    }
  })
  if (selectPermission.value.length === permissionOptions.length) {
    checkedAll.value = true
  }
}

function handleClose() {
  selectPermission.value = []
  checkedAll.value = false
}

const checkedAll = ref<boolean>(false)
function handleCheckedChange(checked: boolean) {
  checkedAll.value = checked
  if (checkedAll.value === true) {
    selectPermission.value = permissionOptions.map(item => item.value)
  } else {
    selectPermission.value = []
  }
}

function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  let result = 0
  selectPermission.value.map(item => {
    result = result | item
  })
  const data = {
    permission: result,
    roleId: id.value
  }
  setRolePermissionAPI(data).then(res => {
    if (res.code === 10000) {
      message.success(res.message)
      emits('result')
      showModal.value = false
    }
  })
}

defineExpose({
  show
})
</script>

<style lang="scss" scoped></style>
