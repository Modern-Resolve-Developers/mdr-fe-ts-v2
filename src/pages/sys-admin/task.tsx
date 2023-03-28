import DashboardLayout from "@/components/DashboardLayout";
import { ControlledTypography, UncontrolledCard } from "@/components";
import { Container, ListItemIcon } from "@mui/material";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddTaskIcon from '@mui/icons-material/AddTask';

import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { TaskFormAdditionalDetails } from "@/components/TaskManagement";
export const adminSidebarData = [
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
  
  const subExpandData = [
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
const Task: React.FC = () => {
    
    return (
        <>
            <DashboardLayout sidebarConfig={adminSidebarData} subsidebarConfig={subExpandData}>
                <Container>
                    <UncontrolledCard>
                        <ControlledTypography 
                        variant='h6'
                        isGutterBottom
                        text='Task Management > Create Task'
                        />
                        <TaskFormAdditionalDetails />
                    </UncontrolledCard>
                </Container>
            </DashboardLayout>
        </>
    )
}

export default Task