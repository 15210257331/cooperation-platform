import { defineStore } from 'pinia';
import { getFlowList, createTask, updateTaskProps, deleteFlow, createFlow, updateFlow } from '@/api';

interface TaskStoreType {
  flowList: Array<FlowType>;
}

export interface FlowType {
  id: number;
  name: string;
  sort: number;
  canNew: boolean;
  complete: boolean;
  range: string[];
  tasks: Array<TaskType>;
}

export interface TaskType {
  name: string;
  description: string;
  startDate: number | null;
  endDate: number | null;
  priority: string | null;
  progress: number;
  [key: string]: any;
}

export const useTaskStore = defineStore('task', {
  state: (): TaskStoreType => {
    return {
      flowList: []
    };
  },
  actions: {
    /**
     * 获取流程列表
     * @param name
     */
    getFlowList(name = '') {
      return new Promise((resolve, reject) => {
        getFlowList(name)
          .then(res => {
            if (res.code === 10000) {
              this.flowList = res.data;
              this.flowList = this.flowList.sort((a, b) => a.sort - b.sort);
              resolve(true);
            } else {
              reject(false);
            }
          })
          .catch(err => {
            reject(false);
          });
      });
    },
    /**
     * 新增流程
     */
    createFlow(data: any) {
      return new Promise((resolve, reject) => {
        createFlow(data).then(res => {
          if (res.code === 10000) {
            const index = this.flowList.findIndex(item => item.id === data.id);
            this.flowList.splice(index, 0, res.data);
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    },
    /** 更新流程 */
    updateFlow(data: any) {
      return new Promise((resolve, reject) => {
        updateFlow(data).then(res => {
          if (res.code === 10000) {
            const index = this.flowList.findIndex(item => item.id === res.data.id);
            this.flowList.splice(index, 1, res.data);
            this.flowList = this.flowList.sort((a, b) => a.sort - b.sort);
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    },
    /**
     * 删除流程
     * @param id  流程ID
     */
    deleteFlow(id: number) {
      return new Promise((resolve, reject) => {
        deleteFlow(id).then(res => {
          if (res.code === 10000) {
            const index = this.flowList.findIndex(item => item.id === id);
            this.flowList.splice(index, 1);
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    },
    /**
     * 新增任务
     */
    async createTask(data: any) {
      return new Promise((resolve, reject) => {
        createTask(data).then(res => {
          if (res.code === 10000) {
            this.flowList.map(flow => {
              if (flow.id === res.data.flow.id) {
                flow.tasks.unshift(res.data);
              }
            });
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    },
    /** 更新任务属性
     * taskId: 任务ID
     * propName: 任务属性名
     * propValue: 属性值
     */
    updateTaskProps(taskId: number, propName: string, propValue: any) {
      return new Promise((resolve, reject) => {
        updateTaskProps({ taskId, propName, propValue }).then(res => {
          if (res.code === 10000) {
            this.flowList.map(flow => {
              flow.tasks.map((task, index) => {
                if (task.id === res.data.id) {
                  flow.tasks.splice(index, 1, res.data);
                }
              });
            });
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    },
    /** 删除任务 */
    deleteTask(taskId: number) {
      return new Promise((resolve, reject) => {
        updateTaskProps({ taskId, propName: 'delete', propValue: true }).then(res => {
          if (res.code === 10000) {
            this.flowList.map(flow => {
              flow.tasks.map((task, index) => {
                if (task.id === res.data.id) {
                  flow.tasks.splice(index, 1);
                }
              });
            });
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    }
  },
  getters: {
    // 所有任务数量
    total: state => {
      let total = 0;
      state.flowList.map(item => {
        total += item.tasks.length;
      });
      return total;
    },
    // 未完成的任务数量
    peddingTotal: state => {
      let total = 0;
      state.flowList.map(item => {
        total += item.tasks.filter(task => task.complete === false).length;
      });
      return total;
    },
    completeTotal: state => {
      let total = 0;
      state.flowList.map(item => {
        total += item.tasks.filter(task => task.complete === true).length;
      });
      return total;
    },
  }
});
