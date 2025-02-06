export interface ChildElement {
  key: string,
  value: string
  status: boolean
}

export interface SubMenuElementData {
  key: string,
  value: string,
  status: boolean,
  search: string,
  children: ChildElement[]
}