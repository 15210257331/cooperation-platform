import { UserType } from './user.interface'
export interface ProjectStoreType {
  currentProject: ProjectType | null
  projectListLoading: boolean
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
  members: Array<UserType>
  groups: Array<GroupType>
  tags: Array<any>
  [key: string]: any
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
  startDate: number | null
  endDate: number | null
  priority: number | null
  progress: number
  description: string
  tags: Array<any>
  [key: string]: any
}
