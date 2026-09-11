export interface Block {
  title: string
  desc: string
  link: string
}

export interface Logo {
  filename: string
  alt?: string
}

export interface MenuItem {
  label: string
  link: string
  content: Block[]
}

export interface DrawerItem {
  label: string
  link: string
}
