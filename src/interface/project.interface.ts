import { UserType } from './user.interface'
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
  members: Array<UserType>
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
  startDate: number | null
  endDate: number | null
  priority: number | null
  tag: string
  progress: number
  description: string
  [key: string]: any
}
