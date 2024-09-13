import { defineStore } from 'pinia'
import { GroupType, ProjectStoreType, ProjectType } from '@/interface'
import {
  createFlow,
  createTask,
  deleteFlow,
  getProjectDetail,
  updateFlow,
  updateTaskProps,
  getProjectList,
  deleteProject,
  createProject,
  updateProject,
  createTagAPI
} from '@/api'
import { useLocalStorage } from '@/hooks'

const { setItem, value } = useLocalStorage('currentTaskView')

export const useProjectStore = defineStore('project', {
  state: (): ProjectStoreType => {
    return {
      currentProject: null,
      projectList: []
    }
  },
  actions: {
    // 查询项目列表
    queryProjectList() {
      return new Promise((resolve, reject) => {
        getProjectList('')
          .then(res => {
            if (res.code === 10000) {
              this.projectList = res.data || []
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
    createProject() {},
    updateProject() {},
    // 删除项目
    deleteProject(id: string) {
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
     * 根据项目ID查询项目详情
     * @param name
     */
    queryProjectDetail(projectId: string, keywords = '') {
      return new Promise((resolve, reject) => {
        getProjectDetail(projectId)
          .then(res => {
            if (res.code === 10000) {
              // 分组排序和筛选操作
              const projectData: ProjectType = res.data
              projectData.groups = this.groupSort(projectData.groups)
              projectData.groups.map(group => {
                group.tasks = group.tasks.filter(task => task.name.includes(keywords))
              })
              this.setCurrentProject(projectData)
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

    /**
     * 新增分组
     */
    createGroup(data: string) {
      return new Promise((resolve, reject) => {
        createFlow(data).then(res => {
          if (res.code === 10000) {
            if (this.currentProject) {
              this.currentProject.groups.push(res.data)
              this.currentProject.groups = this.groupSort(this.currentProject?.groups)
              resolve(true)
            }
            reject(false)
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
            if (this.currentProject) {
              const index = this.currentProject?.groups.findIndex(item => item.id === data.id) as number
              this.currentProject?.groups.splice(index, 1, res.data)
              this.currentProject.groups = this.groupSort(this.currentProject?.groups)
              resolve(true)
            }
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
    deleteGroup(id: string) {
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
    // 新增项目标签
    async createProjectTag(data: any) {
      return new Promise((resolve, reject) => {
        createTagAPI(data).then(res => {
          if (res.code === 10000) {
            this.currentProject?.tags.unshift(res.data)
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
    },
    /** 设置当前项目数据 */
    setCurrentProject(project: ProjectType) {
      this.currentProject = project
    },
    /** 分组排序 */
    groupSort(groups: Array<GroupType>): Array<GroupType> {
      return groups.sort((a: GroupType, b: GroupType) => a.sort - b.sort)
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
