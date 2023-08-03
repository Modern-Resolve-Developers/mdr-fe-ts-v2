import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@/components/PasswordStrengthMeter/PasswordStrengthMeter.css";
import "@/pages/screen.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import AdminRegistrationContext from "../utils/context/base/AdminRegistrationContext";
import ToastContext from "../utils/context/base/ToastContext";
import { ControlledBackdrop, ControlledToast } from "@/components";
import "./index.css";
import SessionContext from "@/utils/context/base/SessionContext";
import CssBaseline from "@mui/material/CssBaseline";
import "react-quill/dist/quill.snow.css";
import TableSearchContext from "@/utils/context/base/TableSearchContext";
import { AuthProvider } from "@/utils/context/base/AuthContext";
import { CookiesProvider } from "react-cookie";
import { MeetProvider } from "@/utils/context/base/MeetContext";
import { LoadingProvider } from "@/utils/context/base/LoadingContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { DynamicDashboardProvider } from "@/utils/context/base/DynamicDashboardContext";
import { GlobalsProvider } from "@/utils/context/base/GlobalContext";
import { useAccessToken, useUserType } from "@/utils/context/hooks/hooks";
import DashboardLayout from "@/components/DashboardLayout";
import { sidebarExpand, sidebarList, clientSidebarList } from "@/utils/sys-routing/sys-routing";
import { decrypt } from "@/utils/secrets/hashed";
export type NextPageWithLayout<P = any, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const darkTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const queryClient = new QueryClient({});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useUserType();
  const [storedValue, setStoredValue] = useState<string | undefined>(undefined);
  const [storedType, setStoredType] = useState<number | undefined>(undefined);
  const [accessToken, setAccessToken] = useAccessToken();

  useEffect(() => {
    setLoading(!loading);
    let savedAuthenticationStorage;
    let savedUserType;
    const savedUserTypeStorage = localStorage.getItem("UT");
    const savedAuthStorage = localStorage.getItem("AT");
    if (
      typeof savedAuthStorage == "string" &&
      typeof savedUserTypeStorage == "string"
    ) {
      savedAuthenticationStorage = JSON.parse(savedAuthStorage);
      savedUserType = JSON.parse(savedUserTypeStorage);
    }
    if (accessToken != undefined) {
      setLoading(false);
      setStoredValue(accessToken);
      setStoredType(parseInt(decrypt(savedUserType)));
    } else {
      setLoading(false);
    }
  }, [accessToken, userType]);

  return (
    <>
      <GlobalsProvider
        globals={{ storedValue: storedValue, storedType: storedType }}
      >
        <LoadingProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider clientId="643485254029-mmi46n2kojuce223b8cpfqkck1s4gv0c.apps.googleusercontent.com">
            <DynamicDashboardProvider>
                <SessionContext>
                <ToastContext>
                  <AuthProvider>
                    <MeetProvider>
                      <TableSearchContext>
                        <AdminRegistrationContext>
                              <ControlledToast
                                position="top-right"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="dark"
                              />
                              <CookiesProvider>
                                {loading && !storedValue ? (
                                  <ControlledBackdrop open={loading} />
                                ) : storedValue ? (
                                  <>
                                    <DashboardLayout
                                      sidebarConfig={
                                        storedType == 1 ? sidebarList : storedType == 3 ? clientSidebarList : []
                                      }
                                      subsidebarConfig={
                                        storedType == 1 ? sidebarExpand : []
                                      }
                                    >
                                      {getLayout(<Component {...pageProps} />)}
                                    </DashboardLayout>
                                  </>
                                ) : (
                                  <>{getLayout(<Component {...pageProps} />)}</>
                                )}
                              </CookiesProvider>
                        </AdminRegistrationContext>
                      </TableSearchContext>
                    </MeetProvider>
                  </AuthProvider>
                  </ToastContext>
                  </SessionContext>
                </DynamicDashboardProvider>
            </GoogleOAuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
        </LoadingProvider>
      </GlobalsProvider>
    </>
  );
}
