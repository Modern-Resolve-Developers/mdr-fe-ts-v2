import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { ListItemIcon } from '@mui/material'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
type sidebarProps = {
    title: string
    dropDown: boolean
    uri?: string
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
    childMenu: ChildMenuProps[]
}

export const sidebarList: sidebarProps[] = [
    {
        title: 'Admin Overview',
        dropDown: false,
        uri: '/sys-admin/admin-dashboard'
    },
    {
        title: 'User Management',
        dropDown: false,
        uri: '/sys-admin/user-management'
    },
    {
        title: 'System Products',
        dropDown: false,
        uri: '/sys-admin/product-management'
    },
    {
        title: 'Ecommerce',
        dropDown: true,
    },
    {
        title: 'Client Profiles',
        dropDown: false,
    },
    {
        title: 'Transactions',
        dropDown: false,
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
        ]
    }
]