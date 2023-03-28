import DashboardLayout from "@/components/DashboardLayout";
import { 
    useState,
    useEffect,
    useContext
} from 'react'

import { useApiCallBack } from "@/utils/hooks/useApi";
import { 
    ControlledBackdrop,
    ControlledGrid,
    UncontrolledCard,
    ControlledTypography
} from '@/components'

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";

import { ContextSetup } from "@/utils/context";
import { ARContext } from "@/utils/context/base/AdminRegistrationContext";
import { useRouter } from "next/router";
import {
     Container,
     Grid,
     ListItemIcon
} from '@mui/material'

import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddTaskIcon from '@mui/icons-material/AddTask';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

export const devSidebarData = [
    {
        title: 'Developer Overview',
        dropDown: false,
        uri: '/sys-dev/dev-dashboard'
    }
]

const DeveloperDashboard: React.FC = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [savedAuth, setSavedAuth] = useState({})
    const IdentifyUsertype = useApiCallBack((api, uuid: any) => api.mdr.IdentifyUserTypeFunc(uuid))
    const {
        handleOnToast
    } = useContext(ToastContextContinue) as ToastContextSetup
    const {
        accessSavedAuth, accessUserId
    } = useContext(SessionContextMigrate) as SessionStorageContextSetup

    useEffect(() => {
        setOpen(!open)
        const objSession = {
            userId: accessUserId,
            savedAuth : accessSavedAuth
        }
        if(accessSavedAuth != null && accessUserId != null){
            setOpen(false)
            setSavedAuth(objSession)
        } else {
            IdentifyUsertype.execute(accessUserId)
            .then((response : any) => {
                const { data } : any = response
                if(data == 'Developers') {
                  return;
                }
                else if(data == 'Client') {
                  setOpen(false)
                  console.log('Client Dashboard')
                } else if(data == 'Administrator') {
                    setOpen(false)  
                  router.push('/sys-admin/admin-dashboard')
                }
                else {
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
                  setOpen(false)  
                  router.push('/login')
                }
              })
        }
    }, [accessSavedAuth, accessUserId])

    return (
        <>
            <DashboardLayout sidebarConfig={devSidebarData}>
                <Container>

                </Container>
            </DashboardLayout>
        </>
    )
}

export default DeveloperDashboard