import ControlledAdministratorNavbar from "../Navbar/Navbar"
import ControlledAdministratorSidebar from "../Sidebar/Sidebar"
import ControlledClientSidebar from "../Sidebar/client/Sidebar";
import { Box } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { useState, useEffect, useCallback, useContext } from "react";
import ControlledModal from "../Modal/Modal";
import ControlledTypography from "../Typography/Typography";


import { useApiCallBack } from "@/utils/hooks/useApi";
import {useRouter} from 'next/router'

import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup, ToastContextSetup } from "@/utils/context";
import { ToastContextContinue } from "@/utils/context/base/ToastContext";

import { useAccessToken, useRefreshToken } from "@/utils/context/hooks/hooks";

import { SidebarTypes, SubSidebarTypes } from "../Sidebar";
import { sidebarList } from "@/utils/sys-routing/sys-routing";
import { useGlobalsContext } from "@/utils/context/base/GlobalContext";
import ControlledClientNavbar from "../Navbar/client/Navbar";
import { useAuthContext } from "@/utils/context/base/AuthContext";
type DashboardLayoutProps = {
    children : React.ReactNode
    sidebarConfig: SidebarTypes[]
    subsidebarConfig?: SubSidebarTypes[]
}



const drawerWidth = 240;
const openedMixin = (theme : any) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme : any) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open } : any) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  background: '#153D77',
  color: 'black',
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open } : any) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

export default function DashboardLayout({children, sidebarConfig, subsidebarConfig} : DashboardLayoutProps){
    const theme = useTheme()
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false)
    const [dropDown, setDropDown] = useState(false);
    const router = useRouter()
    const [accessToken, setAccessToken, clearAccessToken] = useAccessToken()
    const [refreshToken, setRefreshToken, clearRefreshToken] = useRefreshToken()
    const signoutInProgress = useApiCallBack((api, uuid: any) => api.mdr.signoutUser(uuid))
    const [sidebarStateConfig , setSidebarStateConfig] = useState<any>(sidebarList)
    const { globals } = useGlobalsContext()
    const {
      accessSavedAuth, accessUserId, clearAccessSavedAuth, clearAccessUserId
    } = useContext(SessionContextMigrate) as SessionStorageContextSetup
    const { signoutProcess, setDisableRefreshTokenCalled } = useAuthContext()
    useEffect(() => {
        window.addEventListener('resize', () => {
            return window.innerWidth < 1024 ? setOpen(false) : setOpen(!open)
        })
    })
    const handleDrawerOpen = () => {
        setOpen(!open)
    }
    const handleDrawerClose = () => {
        setOpen(false)
    }
    const handleSignoutModal = () => {
      setModalOpen(!modalOpen)
    }

    const handleSignout = () => {
      if(accessSavedAuth != null && accessUserId != null) {
        setOpen(!open)
        setDisableRefreshTokenCalled(true)
        signoutProcess()
        setTimeout(() => setOpen(false), 2000)
      }
    }
    const handleClick = (outerIndex: any, innerIndex: any) => {
      let newArray = sidebarStateConfig
      const outerArray = [...newArray]
      const innerArray = outerArray[outerIndex]
      innerArray.dropDownChildren[innerIndex] = {...innerArray?.dropDownChildren[innerIndex], dropDown: !innerArray.dropDownChildren[innerIndex].dropDown}
      outerArray[outerIndex] = innerArray
      setSidebarStateConfig([...newArray, ...outerArray])
    }
    return (
        <Box className='flex'>
            <CssBaseline />
            {
              globals?.storedType == 1 ?  
              <>
              <ControlledAdministratorNavbar
                open={open}
                handleDrawerOpen={handleDrawerOpen}
                AppBar={AppBar}
                signoutModal={handleSignoutModal}
              />
              <ControlledAdministratorSidebar 
              open={open}
              handleDrawerClose={handleDrawerClose}
              theme={theme}
              handleClick={handleClick}
              dropDown={dropDown}
              Drawer={Drawer}
              DrawerHeader={DrawerHeader}
              sidebarConfig={sidebarConfig}
              subsidebarConfig={subsidebarConfig}
              />
              </>
              : globals?.storedType == 3 &&
              <>
               <ControlledClientNavbar
                open={open}
                handleDrawerOpen={handleDrawerOpen}
                AppBar={AppBar}
                signoutModal={handleSignoutModal}
              />
              <ControlledClientSidebar 
              open={open}
              handleDrawerClose={handleDrawerClose}
              theme={theme}
              handleClick={handleClick}
              dropDown={dropDown}
              Drawer={Drawer}
              DrawerHeader={DrawerHeader}
              sidebarConfig={sidebarConfig}
              subsidebarConfig={subsidebarConfig}
              />
              </>
            }
            <Box component="main" sx={{ flexGrow: 1, p: 3 }} className='items-center'>
                <DrawerHeader />
                {children}
            </Box>
            <ControlledModal 
            open={modalOpen}
            handleClose={() => setModalOpen(false)}
            handleSubmit={handleSignout}
            title="Account signout"
            buttonTextAccept="SIGNOUT"
            buttonTextDecline="CANCEL"
            handleDecline={() => setModalOpen(false)}
            color={'error'}>
              <ControlledTypography
                                variant="subtitle1"
                                isGutterBottom={true}
                                text="Are you sure you want to signout?"
                                />
            </ControlledModal>
        </Box>
    )
}
