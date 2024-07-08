export interface ProjectStoreType {
  currentProject: ProjectType | null
  projectList: ProjectType[]
}

export interface ProjectType {
  id?: string
  name: string
  icon: string
  type: string
  star: boolean
  cover: string
  status: number
  createDate: string
  startDate: string
  endDate: string
  groups: Array<GroupType>
}
/** group type */
export interface GroupType {
  id?: string
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
