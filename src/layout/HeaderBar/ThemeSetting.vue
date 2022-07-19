<template>
  <n-modal v-model:show="show">
    <n-card
      :segmented="{
        content: true,
        footer: true
      }"
      style="width: 740px"
      title="主题设置"
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
      <n-space>
        <div
          class="theme-item"
          :style="{ backgroundColor: item.color }"
          v-for="item in themes"
          :key="item.name"
          @click="changeTheme(item.name)"
        >
          <h5>{{ item.title }}</h5>
          <label class="no-selected" :class="{ selected: item.name === appStore.theme }" for="choose">
            <input style="width: 0; height: 0" type="checkbox" clsss="choose" />
          </label>
        </div>
      </n-space>

      <template #footer>
        <n-space horizontal style="float: right">
          <n-button tertiary @click="handleClose"> 关闭 </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore, UserInfoType } from '@/store';
import { Close } from '@vicons/ionicons5';
import { FormInst, useMessage } from 'naive-ui';
import { updateUserInfo } from '@/api';
import { themes } from '@/constant';
import { useAppStore } from '@/store';
interface Props {
  /** 弹窗显隐 */
  value: boolean;
}
const props = defineProps<Props>();

interface Emits {
  (e: 'update:value', val: boolean): void;
}
const emit = defineEmits<Emits>();

const userStore = useUserStore();
const appStore = useAppStore();
const message = useMessage();

const show = computed({
  get() {
    return props.value;
  },
  set(val: boolean) {
    emit('update:value', val);
  }
});

function changeTheme(theme: any) {
  appStore.setTheme(theme);
}

function handleSubmit(e: MouseEvent) {}
function handleClose() {
  show.value = false;
}
</script>

<style lang="scss" scoped>
.theme-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 70px;
  line-height: 80px;
  border-radius: 8px;
  text-align: center;
  line-height: 40px;
  color: white;
  font-weight: 500;
  margin-bottom: 5px;
  cursor: pointer;
  h5 {
    text-align: center;
    font-size: 14px;
  }
}

.no-selected {
  display: none;
}
.selected {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #22d7bb;
  position: absolute;
  right: -5px;
  top: 55px;
  cursor: pointer;
  &:after {
    content: '';
    display: inline-block;
    border: 3px solid #fff;
    border-top-width: 0;
    border-left-width: 0;
    width: 6px;
    height: 14px;
    transform: rotate(45deg);
    position: absolute;
    top: 2px;
    left: 7px;
  }
}
</style>
