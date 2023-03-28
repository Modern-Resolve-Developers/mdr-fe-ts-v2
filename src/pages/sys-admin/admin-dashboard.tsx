import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useContext } from "react";
import { buildHttp } from "../api/http";

import { ControlledBackdrop, ControlledGrid, UncontrolledCard, ControlledTypography, ProjectTable, ControlledHighCharts } from "@/components";
import { ControlledStorage } from "@/utils/storage";

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";

import { ContextSetup } from "@/utils/context";
import {ARContext, AuthenticationProps} from "@/utils/context/base/AdminRegistrationContext"

import { useRouter } from 'next/router';

import { Container, Grid, ListItemIcon } from "@mui/material";

import exportingInit from 'highcharts/modules/exporting'
import offlineExporting from 'highcharts/modules/offline-exporting'
import Highcharts, {Chart} from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";

import { useApiCallBack } from "@/utils/hooks/useApi";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddTaskIcon from '@mui/icons-material/AddTask';

import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
if(typeof Highcharts === 'object'){
    exportingInit(Highcharts)
    offlineExporting(Highcharts)
}

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

const TestAdminDashboard: React.FC = () => {
    const router = useRouter()
    const [savedAuth, setSavedAuth] = useState({})
    const [open, setOpen] = useState(false)
    const [report, setReport] = useState([])
    const [options, setOptions] = useState<any>({
        chart: {
            type: 'spline'
        },
        tooltip: {
            valueSuffix: ' user counts',
            crosshairs: true,
            shared: true
                    },
                    credits: {
            enabled: false
            },
        plotOptions: {
        series: {
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{data: []}],
            subtitle: {
            text: 'Line Graph'
        },
        title: {
            text: 'Users Overall Count'
        }
    })
    const FetchUsersReport = useApiCallBack(api => api.mdr.fetchUsersReport())
    const IdentifyUsertype = useApiCallBack((api, uuid: any) => api.mdr.IdentifyUserTypeFunc(uuid))
    const FetchAuthentication = useApiCallBack(async (api, args: AuthenticationProps) => {
        const result = await api.authentication.userAvailabilityCheck(args)
        return result
      })
    const {
        handleOnToast
    } = useContext(ToastContextContinue) as ToastContextSetup
    const {
        accessSavedAuth, accessUserId
    } = useContext(SessionContextMigrate) as SessionStorageContextSetup
    const {
        CheckAuthentication
    } = useContext(ARContext) as ContextSetup
    const calculateReport = () => {
        FetchUsersReport.execute().then((res : any) => {
            for(var x = 0; x < res.data.length; x++){
                var ifExist = 0;
                if(options.series.length > 0)
                {
                    for(var check = 0;check < options.series.length; check++) {
                        if(res.data[x].email == options.series[check].name){
                            ifExist = 1;
                            check = options.series.length;
                            options.series = []
                             var data1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                                for(var dataCount1 = 0; dataCount1 < res.data.length; dataCount1++){
                                    if(res.data[dataCount1].email == res.data[x].email){
                                        data1[res.data[dataCount1].id] = res.data[dataCount1].id
                                    }
                                }
                                setOptions({ series : [{ data : data1 }]})
                        }
                    }
                }
                if(ifExist == 0){
                    var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    for(var dataCount = 0; dataCount < res.data.length; dataCount++){
                        if(res.data[dataCount].email == res.data[x].email){
                            data[dataCount] = res.data[dataCount].id
                        }
                    }
                    setOptions({ series : [{ data : data }]})
                }
            }
            setReport(res.data)
        }).catch(error => {
            if(error?.response?.status === 401){
                handleOnToast(
                    "Invalid Refresh Token. Kindly Relogin",
                    "top-right",
                    false,
                    true,
                    true,
                    true,
                    undefined,
                    "dark",
                    "error"
                )
                localStorage.clear()
                router.push('/login')
                return;
            }
        })
    }
    useEffect(() => {
        calculateReport()
    },[])

    useEffect(
        () => {
          setOpen(!open)
          let savedAuthStorage;
          const savedTokenStorage = localStorage.getItem('token')
          if(typeof savedTokenStorage == 'string'){
              savedAuthStorage = JSON.parse(savedTokenStorage)
          }
          const uuid = localStorage.getItem('uid') === null ? 0 : localStorage.getItem('uid')
          if(savedAuthStorage == undefined && uuid == 0) {
            setOpen(false)
            return;
          } else {
              /* if the token is not valid or neither expired -> fetching API to get the user data breakdown will prohibited.  */
              FetchAuthentication.execute({
                userId : uuid == null ? 0 : uuid,
                savedAuth: savedAuthStorage == null ? null : savedAuthStorage
              }).then((res : any) => {
                if(res == 'no_saved_storage') {
                    setOpen(false)
                  }
                  else if(res?.data == 'no_records'){
                    setOpen(false)
                  } else if(res?.data == 'not_match'){
                    setOpen(false)
                  } else {
                    IdentifyUsertype.execute(uuid)
                    .then((identified: any) => {
                      if(identified?.data == 'Administrator') {
                        setOpen(false)
                        return;
                      } else if(identified?.data == 'Developers') {
                        setOpen(false)
                        router.push('/sys-dev/dev-dashboard')
                      }
                    })
                  }
            }).catch(error => {
                setOpen(false)
                handleOnToast(
                    "Invalid Refresh Token. Kindly Relogin",
                    "top-right",
                    false,
                    true,
                    true,
                    true,
                    undefined,
                    "dark",
                    "error"
                )
                localStorage.clear()
              router.push('/login')
              return;
            })
          }
          
        },
        [accessSavedAuth, accessUserId]
      )
    return (
        <>
            <DashboardLayout sidebarConfig={adminSidebarData} subsidebarConfig={subExpandData}>
                <Container>
                    <ControlledGrid>
                        <Grid item xs={3}>
                            <UncontrolledCard
                            style={{
                                background: 'linear-gradient(to right, #a770ef, #cf8bf3, #fdb99b)'
                            }}
                            >
                                <ControlledTypography
                                variant="subtitle1"
                                isGutterBottom={true}
                                text="Internal Developers"
                                />
                                <ControlledTypography
                                variant="h6"
                                isGutterBottom={false}
                                text="0"
                                style={{
                                    float: 'right',
                                    marginBottom: '10px'
                                }}
                                />
                            </UncontrolledCard>
                        </Grid>
                        <Grid item xs={3}>
                        <UncontrolledCard
                        style={{
                            background: 'linear-gradient(to left, #a770ef, #cf8bf3, #fdb99b)'
                        }}
                        >
                                <ControlledTypography
                                variant="subtitle1"
                                isGutterBottom={true}
                                text="Clients"
                                />
                                <ControlledTypography
                                variant="h6"
                                isGutterBottom={false}
                                text="0"
                                style={{
                                    float: 'right',
                                    marginBottom: '10px'
                                }}
                                />
                            </UncontrolledCard>
                        </Grid>
                        <Grid item xs={3}>
                        <UncontrolledCard
                        style={{
                            background: 'linear-gradient(to right, #a770ef, #cf8bf3, #fdb99b)'
                        }}
                        >
                                <ControlledTypography
                                variant="subtitle1"
                                isGutterBottom={true}
                                text="Ready Products"
                                />
                                <ControlledTypography
                                variant="h6"
                                isGutterBottom={false}
                                text="0"
                                style={{
                                    float: 'right',
                                    marginBottom: '10px'
                                }}
                                />
                            </UncontrolledCard>
                        </Grid>
                        <Grid item xs={3}>
                        <UncontrolledCard
                        style={{
                            background: 'linear-gradient(to left, #a770ef, #cf8bf3, #fdb99b)'
                        }}
                        >
                                <ControlledTypography
                                variant="subtitle1"
                                isGutterBottom={true}
                                text="Sales"
                                />
                                <ControlledTypography
                                variant="h6"
                                isGutterBottom={false}
                                text="0"
                                style={{
                                    float: 'right',
                                    marginBottom: '10px'
                                }}
                                />
                            </UncontrolledCard>
                        </Grid>
                    </ControlledGrid>
                    <UncontrolledCard
                    style={{marginTop: '10px'}}
                    >
                        <ControlledTypography 
                                        variant='subtitle1'
                                        isGutterBottom={true}
                                        text='Overall users'
                                        />
                                         <HighchartsReact
                                            highcharts={Highcharts}
                                            options={options}
                                            />
                    </UncontrolledCard>
                </Container>
            </DashboardLayout>
            <ControlledBackdrop 
            open={open}
            />
        </>
    )
}

export default TestAdminDashboard