import { defineStore } from 'pinia'

interface ProjectStoreType {
  projectList: Array<ProjectType>;
}

export interface ProjectType {
  id: number;
  name: string;
  type: number;
  icon: any;
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
        this.projectList = [
          {
            id: 1,
            name: '我的项目一',
            type: 1,
            icon: null
          },
          {
            id: 2,
            name: '我的项目2',
            type: 1,
            icon: null
          },
          {
            id: 3,
            name: '我的项目3',
            type: 1,
            icon: null
          }
        ]
        resolve(true)
      })
    }
    // /**
    //  * 新增流程
    //  */
    // createFlow(data: any) {
    //   return new Promise((resolve, reject) => {
    //     createFlow(data).then(res => {
    //       if (res.code === 10000) {
    //         const index = this.flowList.findIndex(item => item.id === data.id);
    //         this.flowList.splice(index, 0, res.data);
    //         resolve(true);
    //       } else {
    //         reject(false);
    //       }
    //     });
    //   });
    // },
  },
  getters: {
    // 所有项目数量
    total: state => {
      return state.projectList.length
    }
  }
})
