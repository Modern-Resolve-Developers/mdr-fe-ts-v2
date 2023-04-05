import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useContext } from "react";
import { buildHttp } from "./api/http";

import { ControlledBackdrop, ControlledGrid, UncontrolledCard, ControlledTypography, ProjectTable, ControlledHighCharts } from "@/components";
import { ControlledStorage } from "@/utils/storage";

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";

import { ContextSetup } from "@/utils/context";
import {ARContext} from "@/utils/context/base/AdminRegistrationContext"

import { useRouter } from 'next/router';

import { Container, Grid } from "@mui/material";

import exportingInit from 'highcharts/modules/exporting'
import offlineExporting from 'highcharts/modules/offline-exporting'
import Highcharts, {Chart} from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

if(typeof Highcharts === 'object'){
    exportingInit(Highcharts)
    offlineExporting(Highcharts)
}





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
    const {
        handleOnToast
    } = useContext(ToastContextContinue) as ToastContextSetup
    
    const {
        CheckAuthentication
    } = useContext(ARContext) as ContextSetup
    const calculateReport = () => {
        const ReportObjectRequest = {
            combinationUrl : '/api/users/find-all-users-report',
            HttpRequest : {
                PropsType : '[Request][FromRoute]',
                RequestMethod: 'GET'
            }
        }
        buildHttp(ReportObjectRequest).then((res: any) => {
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
        })
    }
    useEffect(() => {
        calculateReport()
    },[])
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
            <DashboardLayout>
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
                    <UncontrolledCard
                    style={{marginTop: '10px', marginBottom: '10px'}}
                    >
                                        <ControlledTypography 
                                        variant='subtitle1'
                                        isGutterBottom={true}
                                        text='Clients List'
                                        />
                                        <ProjectTable 
                                        data={report}
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