import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useContext, useCallback } from "react";

import { ControlledTypography, UncontrolledCard } from "@/components";

import { useRouter } from 'next/router';
import { Container, ListItemIcon } from "@mui/material";

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";
import { ContextSetup } from "@/utils/context";
import {ARContext} from "@/utils/context/base/AdminRegistrationContext"
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddTaskIcon from '@mui/icons-material/AddTask';

import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { FormAdditionalDetails } from "@/components/UserManagement";
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
const UserManagement: React.FC = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [savedAuth, setSavedAuth] = useState({})
    const {
        handleOnToast
    } = useContext(ToastContextContinue) as ToastContextSetup
    const {
        CheckAuthentication
    } = useContext(ARContext) as ContextSetup
    useEffect(() => {
        setOpen(!open)
            CheckAuthentication().then((repository : any) => {
                const { data } : any = repository;
                if(data == 'no_records' || data == 'not_match'){
                    setOpen(false)
                    handleOnToast(
                        "Invalid Token.",
                        "top-right",
                        false,
                        true,
                        true,
                        true,
                        undefined,
                        "dark",
                        "error"
                    )
                    router.push('/login')
                } else if(data == 'no_saved_storage'){
                setOpen(false)   
                }else {
                    setOpen(false)
                    setSavedAuth(data)
                }
            })
    }, [])

    return (
        <>
             <DashboardLayout sidebarConfig={adminSidebarData} subsidebarConfig={subExpandData}>
                <Container>
                    <UncontrolledCard>
                            <ControlledTypography
                                variant="h6"
                                isGutterBottom={true}
                                text="User Management"
                                />
                            <FormAdditionalDetails />
                    </UncontrolledCard>
                </Container>
             </DashboardLayout>
        </>
    )
}

export default UserManagement