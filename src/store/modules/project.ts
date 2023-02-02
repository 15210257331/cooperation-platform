import { defineStore } from 'pinia'
import { ProjectStoreType, ProjectType } from '@/interface'
import { createFlow, createTask, deleteFlow, getProjectDetail, updateFlow, updateTaskProps } from '@/api'

export const useProjectStore = defineStore('project', {
  state: (): ProjectStoreType => {
    return {
      currentProject: null
    }
  },
  actions: {
    /**
     * 根据项目ID查询项目详情
     * @param name
     */
    queryProjectDetail(projectId: number, keywords = '') {
      return new Promise((resolve, reject) => {
        getProjectDetail(projectId)
          .then(res => {
            if (res.code === 10000) {
              this.setCurrentProject(res.data)
              // const flowList = res.data.sort((a: any, b: any) => a.sort - b.sort)
              // const selectedIndex = this.projectList.findIndex(item => item.selected)
              // this.projectList[selectedIndex].flows = flowList
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
    /** 设置当前项目数据 */
    setCurrentProject(project: ProjectType) {
      this.currentProject = project
    },
    /**
     * 新增分组
     */
    createGroup(data: any) {
      return new Promise((resolve, reject) => {
        createFlow(data).then(res => {
          if (res.code === 10000) {
            const index = this.currentProject?.groups.findIndex(item => item.id === data.id) as number
            this.currentProject?.groups.splice(index, 0, res.data)
            resolve(true)
          } else {
            reject(false)
          }
        })
      })
    },
    /** 更新分组信息 */
    updateGroup(data: any) {
      return new Promise((resolve, reject) => {
        updateFlow(data).then(res => {
          if (res.code === 10000) {
            const index = this.currentProject?.groups.findIndex(item => item.id === data.id) as number
            this.currentProject?.groups.splice(index, 1, res.data)
            // this.selectedProject.flows = this.selectedProject?.flows.sort((a, b) => a.sort - b.sort)
            resolve(true)
          } else {
            reject(false)
          }
        })
      })
    },
    /**
     * 删除项目中的分组
     * @param id  分组ID
     */
    deleteGroup(id: number) {
      return new Promise((resolve, reject) => {
        deleteFlow(id).then(res => {
          if (res.code === 10000) {
            const index = this.currentProject?.groups.findIndex(item => item.id === id) as number
            this.currentProject?.groups.splice(index, 1)
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
            this.currentProject?.groups.map(item => {
              if (item.id === res.data.flow.id) {
                item.tasks.unshift(res.data)
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
            this.currentProject?.groups.map(flow => {
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
            this.currentProject?.groups.map(flow => {
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
    // total: state => {
    //   return state.projectList.length
    // },
    // selectedProject: state => {
    //   return state.projectList.find(item => item.selected)
    // },
    // selectedProjectGroups: state => {
    //   const selectedProject = state.projectList.find(item => item.selected)
    //   return selectedProject ? selectedProject.flows : []
    // }
  }
})
