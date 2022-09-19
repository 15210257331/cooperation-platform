import { defineStore } from 'pinia'
import {
  createFlow,
  createProject,
  createTask,
  deleteFlow,
  getFlowList,
  getProjectList,
  updateFlow,
  updateTaskProps
} from '@/api'

interface ProjectStoreType {
  projectList: Array<ProjectType>
}

export interface ProjectType {
  id?: number
  name: string
  star: boolean
  createDate: string
  // 是否是当前选中的项目
  selected: boolean
  // 项目下的任务分组
  flows: Array<FlowType>
}

export interface FlowType {
  id?: number
  name: string
  sort: number
  canNew: number
  complete: boolean
  range: string[]
  disabled?: boolean
  tasks: Array<TaskType>
}

export interface TaskType {
  name: string
  description: string
  startDate: number | null
  endDate: number | null
  priority: string | null
  progress: number
  [key: string]: any
}

export const useProjectStore = defineStore('project', {
  state: (): ProjectStoreType => {
    return {
      projectList: []
    }
  },
  actions: {
    /**
     * 获取项目列表
     * @param name
     */
    getProjectList() {
      return new Promise((resolve, reject) => {
        getProjectList()
          .then(res => {
            if (res.code === 10000) {
              this.projectList = res.data
              if (this.projectList.length > 0) {
                const selectedId = this.projectList[0].id
                this.changeSelectedProject(selectedId as number)
              }
              resolve(true)
            } else {
              reject(false)
            }
          })
          .catch(err => {
            reject(false)
          })
      })
    },
    /** 新增项目 */
    async createProject(data: any): Promise<string> {
      return new Promise((resolve, reject) => {
        createProject(data).then(res => {
          if (res.code === 10000) {
            this.projectList.push({
              id: res.data.id,
              name: res.data.name,
              star: res.data.star,
              createDate: res.data.createDate,
              selected: false,
              flows: []
            })
            resolve(res.message)
          } else {
            reject(res.message)
          }
        })
      })
    },
    /**
     * 根据项目ID加载项目分组列表
     * @param name
     */
    getFlowList(projectId: number, name = '') {
      return new Promise((resolve, reject) => {
        getFlowList(projectId, name)
          .then(res => {
            if (res.code === 10000) {
              const flowList = res.data.sort((a: any, b: any) => a.sort - b.sort)
              const selectedIndex = this.projectList.findIndex(item => item.selected)
              this.projectList[selectedIndex].flows = flowList
              resolve(true)
            } else {
              reject(false)
            }
          })
          .catch(err => {
            reject(false)
          })
      })
    },
    changeSelectedProject(selectedId: number) {
      this.projectList.map((item, index) => {
        item.flows = []
        item.selected = false
        if (item.id === selectedId) {
          item.selected = true
        }
      })
      this.getFlowList(selectedId)
    },
    /**
     * 新增分组
     */
    createFlow(data: any) {
      return new Promise((resolve, reject) => {
        createFlow(data).then(res => {
          if (res.code === 10000) {
            const index = this.selectedProject?.flows.findIndex(item => item.id === data.id) as number
            this.selectedProject?.flows.splice(index, 0, res.data)
            resolve(true)
          } else {
            reject(false)
          }
        })
      })
    },
    /** 更新流程 */
    updateFlow(data: any) {
      return new Promise((resolve, reject) => {
        updateFlow(data).then(res => {
          if (res.code === 10000) {
            const index = this.selectedProject?.flows.findIndex(item => item.id === data.id) as number
            this.selectedProject?.flows.splice(index, 1, res.data)
            // this.selectedProject.flows = this.selectedProject?.flows.sort((a, b) => a.sort - b.sort)
            resolve(true)
          } else {
            reject(false)
          }
        })
      })
    },
    /**
     * 删除流程
     * @param id  流程ID
     */
    deleteFlow(id: number) {
      return new Promise((resolve, reject) => {
        deleteFlow(id).then(res => {
          if (res.code === 10000) {
            const index = this.selectedProject?.flows.findIndex(item => item.id === id) as number
            this.selectedProject?.flows.splice(index, 1)
            resolve(true)
          } else {
            reject(false)
          }
        })
      })
    },
    /**
     * 新增任务
     */
    async createTask(data: any) {
      return new Promise((resolve, reject) => {
        createTask(data).then(res => {
          if (res.code === 10000) {
            this.selectedProject?.flows.map(flow => {
              if (flow.id === res.data.flow.id) {
                flow.tasks.unshift(res.data)
              }
            })
            resolve(true)
          } else {
            reject(false)
          }
        })
      })
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
            this.selectedProject?.flows.map(flow => {
              flow.tasks.map((task, index) => {
                if (task.id === res.data.id) {
                  flow.tasks.splice(index, 1, res.data)
                }
              })
            })
            resolve(true)
          } else {
            reject(false)
          }
        })
      })
    },
    /** 删除任务 */
    deleteTask(taskId: number) {
      return new Promise((resolve, reject) => {
        updateTaskProps({ taskId, propName: 'delete', propValue: true }).then(res => {
          if (res.code === 10000) {
            this.selectedProject?.flows.map(flow => {
              flow.tasks.map((task, index) => {
                if (task.id === res.data.id) {
                  flow.tasks.splice(index, 1)
                }
              })
            })
            resolve(true)
          } else {
            reject(false)
          }
        })
      })
    }
  },
  getters: {
    // 所有项目数量
    totalProject: state => {
      return state.projectList.length
    },
    selectedProject: state => {
      return state.projectList.find(item => item.selected)
    },
    selectedProjectGroups: state => {
      const selectedProject = state.projectList.find(item => item.selected)
      return selectedProject ? selectedProject.flows : []
    },
    // 所有任务数量
    totalTask: state => {
      let total = 0
      // state.flowList.map(item => {
      //   total += item.tasks.length
      // })
      return total
    },
    // 未完成的任务数量
    peddingTotal: state => {
      let total = 0
      // state.flowList.map(item => {
      //   total += item.tasks.filter(task => task.complete === false).length
      // })
      return total
    },
    completeTotal: state => {
      let total = 0
      // state.flowList.map(item => {
      //   total += item.tasks.filter(task => task.complete === true).length
      // })
      return total
    }
  }
})
