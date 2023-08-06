

export type SidebarTypes = {
    title: string
    dropDown: boolean
    uri?: string
}

type childMenuProps = {
    title: string
    dropDown: boolean
    uri: string
    icon: React.ReactNode
}

export type SubSidebarTypes = {
    parentMenu: string
    icon: React.ReactNode
    childMenu: childMenuProps[]
}

export type AdminSidebarProps = {
    open: any
    handleDrawerClose: any
    theme: any
    handleClick: any
    dropDown: any
    Drawer: any
    DrawerHeader: any
    sidebarConfig: SidebarTypes[]
    subsidebarConfig?: SubSidebarTypes[] | undefined
}

export type ClientSidebarProps = {
    open: any
    handleDrawerClose: any
    theme: any
    handleClick: any
    dropDown: any
    Drawer: any
    DrawerHeader: any
    sidebarConfig: SidebarTypes[]
    subsidebarConfig?: SubSidebarTypes[] | undefined
}