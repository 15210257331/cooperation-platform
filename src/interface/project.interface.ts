export interface ProjectStoreType {
  projectList: Array<ProjectType>
}

export interface ProjectType {
  id?: number
  name: string
  icon: string
  type: number
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
