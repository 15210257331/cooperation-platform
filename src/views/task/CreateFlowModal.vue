<template>
  <n-modal v-model:show="showModal">
    <n-card
      :segmented="{
        content: true,
        footer: true
      }"
      style="width: 620px"
      :title="isEdit ? '节点信息修改' : '新建流程节点'"
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
      <n-form ref="formRef" :label-placement="'left'" :label-width="'auto'" :model="formValue" :rules="rules">
        <n-form-item label="流程名称:" path="name">
          <n-input v-model:value="formValue.name" placeholder="输入流程名称" />
        </n-form-item>
        <n-form-item v-if="isEdit === true" label="节点排序:" path="sort">
          <n-input-number v-model:value="formValue.sort" />
        </n-form-item>
        <n-form-item label="新建任务:" path="canNew">
          <n-radio-group v-model:value="formValue.canNew" name="radiogroup">
            <n-space>
              <n-radio :value="1"> 允许新建任务 </n-radio>
              <n-radio :value="2"> 无法新建任务 </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item v-if="isEdit === true" label="流转范围:" path="range">
          <n-checkbox-group v-model:value="formValue.range">
            <n-space item-style="display: flex;">
              <n-checkbox
                v-for="item in allFlows"
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
            <n-switch v-model:value="formValue.complete" />
            <n-tag :bordered="false" type="success" v-if="formValue.complete === true">
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
import { ref, computed, watch } from 'vue';
import { FormInst, useMessage } from 'naive-ui';
import { useTaskStore } from '@/store';
import { Close } from '@vicons/ionicons5';
import { getAllFlows } from '@/api';

const taskStore = useTaskStore();
const message = useMessage();

interface FlowType {
  id: number | undefined;
  name: string;
  canNew: number;
  sort: number;
  complete: boolean;
  range: Array<number>;
  disabled?: boolean;
}

interface Props {
  /** 弹窗显隐 */
  value: boolean;
  data: any;
  isEdit: boolean;
}
const props = defineProps<Props>();

interface Emits {
  (e: 'update:value', val: boolean): void;
}
const emit = defineEmits<Emits>();

const allFlows = ref<FlowType[]>([]);
const formRef = ref<FormInst | null>(null);
const formValue = ref<FlowType>({
  id: undefined,
  name: '',
  canNew: 1,
  sort: props.data.sort + 1,
  complete: false,
  range: []
});
const rules = {
  name: {
    required: true,
    message: '请输入流程名称',
    trigger: 'blur'
  }
  //   canNew: {
  //     required: true,
  //     message: '新建任务必选',
  //     trigger: ['blur']
  //   },
  //   complete: {
  //     required: true,
  //     message: '完成状态必选',
  //     trigger: ['blur']
  //   }
};

const showModal = computed({
  get() {
    return props.value;
  },
  set(val: boolean) {
    emit('update:value', val);
  }
});

watch(
  () => props.isEdit,
  newValue => {
    console.log(newValue);
    if (newValue === true) {
      formValue.value = {
        id: props.data.id,
        name: props.data.name,
        canNew: props.data.canNew ? 1 : 2,
        sort: props.data.sort,
        complete: props.data.complete,
        range: props.data.range.map((item: string) => Number(item))
      };
      getFlowList();
    } else {
      formValue.value = {
        id: undefined,
        name: '',
        canNew: 1,
        sort: props.data.sort + 1,
        complete: false,
        range: []
      };
    }
  }
);

function getFlowList() {
  getAllFlows().then(res => {
    if (res.code === 10000) {
      const arr = res.data || [];
      arr.sort((a: { sort: number }, b: { sort: number }) => a.sort - b.sort);
      arr.map((flow: any) => {
        if (flow.id === formValue.value.id) {
          flow.disabled = true;
        } else {
          flow.disabled = false;
        }
      });
      allFlows.value = arr;
    }
  });
}

async function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async errors => {
    if (!errors) {
      if (props.isEdit === false) {
        createFlow();
      } else {
        updateFlow();
      }
    } else {
      console.log(errors);
      //   message.error('Invalid');
    }
  });
}

async function createFlow() {
  const data = Object.assign({}, formValue.value, {
    canNew: formValue.value.canNew == 1 ? true : false
  });
  await taskStore.createFlow(data);
  showModal.value = false;
  message.success('操作成功');
}

async function updateFlow() {
  const data = Object.assign({}, formValue.value, {
    canNew: formValue.value.canNew == 1 ? true : false
  });
  await taskStore.updateFlow(data);
  showModal.value = false;
  message.success('操作成功');
}

function handleClose() {
  showModal.value = false;
}
</script>

<style lang="scss" scoped></style>
