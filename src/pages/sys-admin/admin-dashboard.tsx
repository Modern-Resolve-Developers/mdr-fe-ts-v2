
import { useState, useEffect, useContext } from "react";
import {
  ControlledBackdrop,
  ControlledGrid,
  UncontrolledCard,
  ControlledTypography,
  ControlledModal,
} from "@/components";
import { useRouter } from "next/router";

import { Container, Grid, Typography } from "@mui/material";

import exportingInit from "highcharts/modules/exporting";
import offlineExporting from "highcharts/modules/offline-exporting";
import Highcharts, { Chart } from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useApiCallBack } from "@/utils/hooks/useApi";

import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
import { PageProps } from "@/utils/types";
import { GetServerSideProps } from "next";
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user";
import { useAccessToken, useReferences, useRouting, useUserId } from "@/utils/context/hooks/hooks";
import { getDataFromLocalStorage } from "@/utils/ssr/storageWithSsr";
import { useToastContext } from "@/utils/context/base/ToastContext";
import { useLoaders } from "@/utils/context/base/LoadingContext";

if (typeof Highcharts === "object") {
  exportingInit(Highcharts);
  offlineExporting(Highcharts);
}



const TestAdminDashboard: React.FC = () => {
  const { signoutProcess, tokenExpired, TrackTokenMovement, expirationTime, AlertTracker, FormatExpiry, refreshTokenBeingCalled, isMouseMoved, isKeyPressed,
  accessToken, disableRefreshTokenCalled, requestNum, devicePromptApproval, requestGetNums, approveIncomingDevice, cookies } = useAuthContext();
  const { loading, setLoading } = useLoaders()
  const [options, setOptions] = useState<any>({
    chart: {
      type: "spline",
    },
    tooltip: {
      valueSuffix: " user counts",
      crosshairs: true,
      shared: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [{ data: [] }],
    subtitle: {
      text: "Line Graph",
    },
    title: {
      text: "Users Overall Count",
    },
  });
  const [references, setReferences] = useReferences()
  const [devicePrompt, setDevicePrompt] = useState<boolean>(false)
  const FetchUsersReport = useApiCallBack((api) => api.mdr.fetchUsersReport());
  const router = useRouter()
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");
  const { getPropsDynamic } = useDynamicDashboardContext();
  useEffect(() => {
    if(typeof window !== 'undefined' && window.localStorage){
      getPropsDynamic(localStorage.getItem("uid") ?? 0).then((repo: any) => {
        setIdentifiedUser(repo?.data);
      });
    }
  }, []);
  const { handleOnToast } = useToastContext()
  const calculateReport = () => {
    FetchUsersReport.execute()
    .then((response: any) => {
      if(response?.data == undefined) {
        return;
      } else {
        for (var x = 0; x < response.data?.length; x++) {
          var ifExist = 0;
          if (options.series.length > 0) {
            for (var check = 0; check < options.series.length; check++) {
              if (response.data[x]?.email == options.series[check]?.name) {
                ifExist = 1;
                check = options.series.length;
                options.series = [];
                var structure1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (
                  var structureCount1 = 0;
                  structureCount1 < response.data?.length;
                  structureCount1++
                ) {
                  if (response.data[structureCount1]?.email == response.data[x]?.email) {
                    structure1[response.data[structureCount1]?.id] =
                      response.data[structureCount1]?.id;
                  }
                }
                setOptions({ series: [{ data: structure1 }] });
              }
              if (ifExist == 0) {
                var structure = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (
                  var structureCount = 0;
                  structureCount < response.data?.length;
                  structureCount++
                ) {
                  if (response.data[structureCount]?.email == response.data[x]?.email) {
                    structure[structureCount] = response.data[structureCount]?.id;
                  }
                }
                setOptions({ series: [{ data: structure }] });
              }
            }
          }
        }
      }
    })
  };
  useEffect(() => {
    setLoading(false)
    calculateReport();
  }, []);

  useEffect(() => {
    const interval = setInterval(requestGetNums, 1000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    if(requestNum == 1 || requestNum == 2) {
      setDevicePrompt(true)
    }
  }, [requestNum])
  useEffect(() => {
    if(!accessToken || accessToken == undefined) {
      router.push('/login')
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    } else {
      setLoading(false)
        const isExpired = TrackTokenMovement()
        if(isExpired) {
          signoutProcess("expired")
          handleOnToast(
            "Token expired. Please re-login.",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "error"
          );
        }
    }
  }, [tokenExpired]);
  useEffect(() => {
    if(!disableRefreshTokenCalled) {
      if(isMouseMoved) {
        refreshTokenBeingCalled()
      }
    }
  }, [isMouseMoved, disableRefreshTokenCalled])
  useEffect(() => {
    if(!disableRefreshTokenCalled) {
      if(isKeyPressed){
        refreshTokenBeingCalled()
      }
    }
  }, [isKeyPressed, disableRefreshTokenCalled])
  const handleApproveDeviceIncoming = () => {
    approveIncomingDevice(cookies.deviceId, references?.email)
  }
  return (
    <>
      {loading ? (
        <ControlledBackdrop open={loading} />
      ) : (
        <Container>
          {
            expirationTime != null && expirationTime <= 30 * 1000 &&
            AlertTracker(
              `You are idle. Token expires in: ${FormatExpiry(expirationTime)}`, "error"
            )
          }
          <ControlledGrid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <ControlledTypography
                  variant="subtitle1"
                  isGutterBottom={true}
                  text="Internal Developers"
                  style={{
                    color: "white",
                  }}
                />
                <ControlledTypography
                  variant="h6"
                  isGutterBottom={false}
                  text="0"
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                />
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <ControlledTypography
                  variant="subtitle1"
                  isGutterBottom={true}
                  text="Clients"
                  style={{
                    color: "white",
                  }}
                />
                <ControlledTypography
                  variant="h6"
                  isGutterBottom={false}
                  text="0"
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                />
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <ControlledTypography
                  variant="subtitle1"
                  isGutterBottom={true}
                  text="Ready Products"
                  style={{ color: "white" }}
                />
                <ControlledTypography
                  variant="h6"
                  isGutterBottom={false}
                  text="0"
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                />
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <ControlledTypography
                  variant="subtitle1"
                  isGutterBottom={true}
                  text="Sales"
                  style={{ color: "white" }}
                />
                <ControlledTypography
                  variant="h6"
                  isGutterBottom={false}
                  text="0"
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                />
              </UncontrolledCard>
            </Grid>
          </ControlledGrid>
          <UncontrolledCard style={{ marginTop: "10px", borderRadius: "25px" }}>
            <ControlledTypography
              variant="subtitle1"
              isGutterBottom={true}
              text="Overall users"
            />
            <HighchartsReact highcharts={Highcharts} options={options} />
          </UncontrolledCard>
          {
            devicePromptApproval({
              content: (
                <>
                 <Typography gutterBottom variant="button">New Device Approval</Typography>
                 <Container>
                  <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  >
                    <img 
                    src='https://cdn.dribbble.com/userupload/7433107/file/original-dd35f5eb54ba85db5dedda17c84e0353.png?resize=1200x900'
                    style={{
                      width: '50%',
                  }}
                    />
                  </div>
                  <Typography variant="caption">
                    A new device is trying to sign in. Please select between approve and decline. Once approved you will automatically logged out on this device
                  </Typography>
                 </Container>
                </>
              ),
              handleAuthApproved: handleApproveDeviceIncoming,
              handleAuthDeclined: () => {},
              openState: devicePrompt
            })
          }
        </Container>
      )}
    </>
  );
};

export default TestAdminDashboard;
