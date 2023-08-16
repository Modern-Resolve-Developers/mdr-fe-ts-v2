import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { ListItemIcon } from '@mui/material'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import CategoryIcon from '@mui/icons-material/Category';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SettingsIcon from '@mui/icons-material/Settings';
type sidebarProps = {
    objectID: number
    name: string
    title: string
    dropDown: boolean
    uri?: string
    icon?: React.ReactNode
    disable?: boolean
    dropDownChildren?: sidebarExpandProps[]
}

type ChildMenuProps = {
    title: string
    dropDown: boolean
    uri: string
    icon: React.ReactNode
}

type sidebarExpandProps = {
    parentMenu: string
    icon: React.ReactNode
    childMenu: ChildMenuProps[],
    disable?: boolean
    dropDown?: boolean
}

type SettingsListOptions = {
    objectID: number
    text: string
    uri: string
    icon: React.ReactNode
}

export const sidebarSettingsArea: SettingsListOptions[] = [
    {
        objectID: 1,
        text: 'Settings',
        uri: '/sys-admin/settings',
        icon: <SettingsIcon className='text-white' />
    }
]

export const clientSidebarList: sidebarProps[] = [
    {
        objectID: 1,
        name: 'Client',
        title: 'Dashboard',
        dropDown: false,
        uri: '/client/client-dashboard',
        icon: (
            <AssessmentIcon className='text-white' />
        )
    }
]

export const sidebarList: sidebarProps[] = [
    {
        objectID: 1,
        name: "Admin",
        title: 'Admin Overview',
        dropDown: false,
        uri: '/sys-admin/admin-dashboard',
        icon: (
            <AssessmentIcon className='text-white' />
        )
    },
    {
        objectID: 2,
        name: "User Access Management",
        title: 'UAM',
        dropDown: false,
        uri: '/sys-admin/user-management',
        icon: (
            <SupervisedUserCircleIcon className='text-white' />
        )
    },
    {
        objectID: 3,
        name: "Products",
        title: 'System Products',
        dropDown: false,
        uri: '/sys-admin/product-management',
        icon: (
            <ProductionQuantityLimitsIcon className='text-white' />
        )
    },
    {
        objectID: 4,
        name: "Category Management",
        title: 'C-Management',
        dropDown: true,
        icon: (
            <CategoryIcon className='text-white' />
        ),
        dropDownChildren : [
            {
                parentMenu: 'Categories',
                icon: (
                    <>
                    <ListItemIcon>
                        <CategoryIcon className='text-white' />
                    </ListItemIcon>
                    </>
                ),
                childMenu: [
                    {
                        title: 'Manage All',
                        dropDown: true,
                        uri: '/sys-admin/category-manage-all',
                        icon: (
                            <>
                                <ListItemIcon>
                                    <AddBoxIcon className='text-white' />
                                </ListItemIcon>
                            </>
                        )
                    }
                ],
                dropDown: false
            }
        ]
    },
    {
        objectID: 5,
        name: "Task",
        title: 'Task',
        dropDown: true,
        icon: (
            <TaskAltIcon className='text-white' />
        ),
        dropDownChildren: [
            {
                parentMenu : 'Task',
                icon: (
                    <>
                    <ListItemIcon>
                        <TaskAltIcon className='text-white' />
                    </ListItemIcon>
                    </>
                ),
                childMenu : [
                    {
                        title : 'Create Task',
                        dropDown: false,
                        uri: '/sys-admin/task',
                        icon : (
                            <>
                                <ListItemIcon>
                                    <AddTaskIcon className='text-white' />
                                </ListItemIcon>
                            </>
                        )
                    },
                    {
                        title : 'Task List',
                        dropDown: false,
                        uri: '/sys-admin/tasklist',
                        icon : (
                            <>
                                <ListItemIcon>
                                    <PlaylistAddCheckIcon className='text-white' />
                                </ListItemIcon>
                            </>
                        )
                    }
                ],
                dropDown: false
            }
        ]
    },
    {
       objectID: 7,
       name: 'Digital Meet',
       title: 'Digital Meet',
       dropDown: false,
       uri: '/sys-admin/digital-meet',
       icon: (
        <ProductionQuantityLimitsIcon className='text-white' />
       ) 
    },
    {
        objectID: 6,
        name: "Client Profile",
        title: 'Client Profiles',
        dropDown: false,
        icon: (
            <FolderSharedIcon className='text-white' />
        ),
        disable: true
    }
]

export const sidebarExpand: sidebarExpandProps[] = [
    {
        parentMenu : 'Task',
        icon: (
            <>
            <ListItemIcon>
                <TaskAltIcon className='text-white' />
            </ListItemIcon>
            </>
        ),
        childMenu : [
            {
                title : 'Create Task',
                dropDown: false,
                uri: '/sys-admin/task',
                icon : (
                    <>
                        <ListItemIcon>
                            <AddTaskIcon className='text-white' />
                        </ListItemIcon>
                    </>
                )
            },
            {
                title : 'Task List',
                dropDown: false,
                uri: '/sys-admin/tasklist',
                icon : (
                    <>
                        <ListItemIcon>
                            <PlaylistAddCheckIcon className='text-white' />
                        </ListItemIcon>
                    </>
                )
            }
        ],
    },
    {
        parentMenu: 'C-Management',
        icon: (
            <>
            <ListItemIcon>
                <CategoryIcon className='text-white' />
            </ListItemIcon>
            </>
        ),
        childMenu: [
            {
                title: 'Features',
                dropDown: true,
                uri: '/sys-admin/admin-dashboard',
                icon: (
                    <>
                        <ListItemIcon>
                            <AddBoxIcon className='text-white' />
                        </ListItemIcon>
                    </>
                )
            }
        ]
    }
]

export type RouteEntity = {
    id: number
    access_level: number
    ToWhomRoute: string
    exactPath: string
}

export const toBeMigrated: RouteEntity[] = [
    {
        id: 2,
        access_level: 0,
        ToWhomRoute: 'AllAccess',
        exactPath: '/device/device-new-registration/new-device-registration'
    }
]

export type MigrationReceiver = {
    JsonRoutes: string
}