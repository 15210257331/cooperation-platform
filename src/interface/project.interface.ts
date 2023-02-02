export interface ProjectStoreType {
  currentProject: ProjectType | null;
}

export interface ProjectType {
  id?: number
  name: string
  icon: string
  type: number
  cover: string
  createDate: string
  // 项目下的任务分组
  groups: Array<GroupType>
}
/** group type */
export interface GroupType {
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
