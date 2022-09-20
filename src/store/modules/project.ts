import { defineStore } from 'pinia'
import {
  createFlow,
  createProject,
  createTask,
  deleteFlow,
  deleteProject,
  getFlowList,
  getProjectList,
  updateFlow,
  updateProject,
  updateTaskProps
} from '@/api'
import { ProjectStoreType } from '@/interface'

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
                const selectedProjectId = localStorage.getItem('selectedProjectId')
                if (selectedProjectId) {
                  this.changeSelectedProject(Number(selectedProjectId))
                } else {
                  this.changeSelectedProject(this.projectList[0].id as number)
                }
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
              icon: res.data.icon,
              type: res.data.type,
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
    /** 修改项目信息 */
    async updateProject(data: any): Promise<string> {
      return new Promise((resolve, reject) => {
        updateProject(data).then(res => {
          if (res.code === 10000) {
            const index = this.projectList.findIndex(item => item.id === data.id)
            this.projectList[index].name = res.data.name
            this.projectList[index].icon = res.data.icon
            this.projectList[index].type = res.data.type
            resolve(res.message)
          } else {
            reject(res.message)
          }
        })
      })
    },
    /**
     * 删除项目
     * @param id  流程ID
     */
    deleteProject(id: number) {
      return new Promise((resolve, reject) => {
        deleteProject(id).then(res => {
          if (res.code === 10000) {
            const index = this.projectList.findIndex(item => item.id === id)
            this.projectList.splice(index, 1)
            resolve(true)
          } else {
            reject(false)
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
      localStorage.setItem('selectedProjectId', selectedId.toString())
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
    total: state => {
      return state.projectList.length
    },
    selectedProject: state => {
      return state.projectList.find(item => item.selected)
    },
    selectedProjectGroups: state => {
      const selectedProject = state.projectList.find(item => item.selected)
      return selectedProject ? selectedProject.flows : []
    }
  }
})
