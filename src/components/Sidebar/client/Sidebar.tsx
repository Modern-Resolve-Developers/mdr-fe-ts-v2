import {
    Box,
    List,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Typography,
  } from "@mui/material";
import React, { useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/router";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { ClientSidebarProps } from "..";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
import { sidebarSettingsArea } from "@/utils/sys-routing/sys-routing";

const ControlledClientSidebar: React.FC<ClientSidebarProps> = (props) => {
    const {
        open,
        handleDrawerClose,
        theme,
        handleClick,
        dropDown,
        Drawer,
        DrawerHeader,
        sidebarConfig,
        subsidebarConfig,
      } = props;
    const router = useRouter()
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [user, setUser] = useState<number>(0)

    const { getPropsDynamic } = useDynamicDashboardContext()
    useEffect(() => {
        getPropsDynamic(localStorage.getItem("uid")).then((repo: any) => {
            setUser(repo?.data);
          });
    }, [])
    const handleSelectedIndex = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number
    ) => {
        setSelectedIndex(index)
    }

    return (
        <>
            <Drawer
            open={open}
            variant='permanent'
            PaperProps={{
                sx: {
                    backgroundColor: '#FFFFFF',
                    color: 'white'
                }
            }}
            >
                <Box className='flex flex-col justify-between h-full'>
                    <Box className='flex flex-col'>
                        <DrawerHeader>
                            <Box className='flex gap-2 items-center'>
                                <img 
                                    src="/drlogo.png"
                                    style={{
                                        width: '100%'
                                    }}
                                />
                            </Box>
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === "rtl" ? (
                                <ChevronRightIcon style={{ color: "#932262" }} />
                                ) : (
                                <ChevronLeftIcon style={{ color: "#932262" }} />
                                )}
                            </IconButton>
                        </DrawerHeader>
                        <Divider className="bg-sideBarTabHover" />
                        <List style={{ marginTop: '5px' }}>
                        {user == 3 &&
                            sidebarConfig?.map((text: any, outerIndex: any) => (
                        <Box key={outerIndex} className="flex flex-col items-center">
                            <ListItem
                            key={text}
                            disablePadding
                            sx={{
                                display: "block",
                                background: "#932262",
                                margin: "4px 0px",
                                borderRadius: "10px",
                                width: "90%",
                                "&:hover": {
                                backgroundColor: "#DB4E82",
                                },
                            }}
                            >
                            {text.dropDown ? (
                                <>
                                {text.dropDownChildren?.length > 0 &&
                                    text.dropDownChildren?.map(
                                    (item: any, innerIndex: any) => (
                                        <>
                                        <ListItemButton
                                            selected={selectedIndex == innerIndex}
                                            key={innerIndex}
                                            disabled={item.disable}
                                            onClick={(event) => {
                                            handleClick(outerIndex, innerIndex),
                                                handleSelectedIndex(event, innerIndex);
                                            }}
                                        >
                                            {item.icon}
                                            <ListItemText primary={item.parentMenu} />
                                            {item.dropDown ? (
                                            <ExpandLess />
                                            ) : (
                                            <ExpandMore />
                                            )}
                                        </ListItemButton>
                                        {item.childMenu.map((child: any) => (
                                            <>
                                            <Collapse
                                                in={item.dropDown}
                                                key={innerIndex}
                                                timeout="auto"
                                                unmountOnExit
                                            >
                                                <List component="div" disablePadding>
                                                <ListItemButton
                                                    sx={{ pl: 4 }}
                                                    onClick={() =>
                                                    router.push(child.uri)
                                                    }
                                                >
                                                    {child.icon}
                                                    <ListItemText
                                                    primary={child.title}
                                                    />
                                                </ListItemButton>
                                                </List>
                                            </Collapse>
                                            </>
                                        ))}
                                        </>
                                    )
                                    )}
                                </>
                            ) : (
                                <>
                                <ListItemButton
                                    selected={selectedIndex == outerIndex}
                                    sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                    }}
                                    onClick={(event) => {
                                    router.push(text.uri),
                                        handleSelectedIndex(event, outerIndex);
                                    }}
                                    disabled={text.disable}
                                >
                                    <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                        color: "white",
                                    }}
                                    >
                                    {text.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                    primary={text.title}
                                    sx={{ opacity: open ? 1 : 0 }}
                                    />
                                    {text.disable && (
                                    <EngineeringIcon className="text-white" />
                                    )}
                                </ListItemButton>
                                </>
                            )}
                            </ListItem>
                        </Box>
                        ))}
                        </List>
                        {/* <Divider className="bg-sideBarTabHover" /> */}
                        <List>
                        {user == 3 && sidebarSettingsArea.map((item, index) => (
                            <Box className="flex flex-col items-center">
                            <ListItem
                                key={item.text}
                                disablePadding
                                sx={{
                                display: "block",
                                background: "#932262",
                                margin: "4px 0px",
                                borderRadius: "10px",
                                width: "90%",
                                "&:hover": {
                                    backgroundColor: "#DB4E82",
                                },
                                }}
                            >
                                <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                                onClick={() => router.push(item.uri)}
                                >
                                <ListItemIcon
                                    sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                    color: "white",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                                </ListItemButton>
                            </ListItem>
                            </Box>
                        ))}
                        </List>
                    </Box>
                    <Box className="flex flex-col py-2 gap-2">
                        <Divider className="bg-sideBarTabHover" />
                        <Typography
                        className={
                            open ? "block font-serif text-black text-center" : "hidden"
                        }
                        variant='caption'
                        >
                        All rights Reserved DGR
                        </Typography>
                    </Box>
                </Box>
            </Drawer>
        </>
    )
}

export default ControlledClientSidebar