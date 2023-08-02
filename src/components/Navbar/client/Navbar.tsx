import {
    Box,
    Toolbar,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Autocomplete,
    TextField,
    List,
    ListItemButton,
    ListItemText,
    ListItem,
    Divider,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ControlledBackdrop from "../../Backdrop/Backdrop";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
import { AdminNavbarProps } from "..";
import { useRouter } from "next/router";

const ControlledClientNavbar: React.FC<AdminNavbarProps> = (props) => {
    const {
        open,
        handleDrawerOpen,
        AppBar,
        token,
        signoutDestroy,
        signoutModal,
    } = props;
    const [idetifiedUser, setIdentifiedUser] = useState<any>("");
    const { getPropsDynamic } = useDynamicDashboardContext();
    const [anchorEl, setAnchorEl] = useState(null);
    const logout = Boolean(anchorEl);
    const router = useRouter();
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        getPropsDynamic(localStorage.getItem("uid")).then((repo: any) => {
          setIdentifiedUser(repo?.data);
        });
    }, []);

    return (
        <>
            <AppBar position="fixed" open={open} sx={{
                backgroundColor: 'white',
                color: 'black'
            }}>
                <Toolbar>
                    <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(open && { display: "none" })
                    }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box className="flex items-center justify-between w-full">
                        <Typography variant="button">
                            Hi, Client
                        </Typography>
                        <Box className="flex item-center gap-3">
                        <Avatar
                            alt="Remy Sharp"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_cj9fuTsqPCwvnG-IqN3HAVb9jMa0BD5uxQ&usqp=CAU"
                        />
                        <IconButton
                            aria-controls={logout ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={logout ? "true" : undefined}
                            onClick={handleClick}
                        >
                            <ArrowDropDownIcon />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={logout}
                            onClose={handleClose}
                            MenuListProps={{
                            "aria-labelledby": "basic-button",
                            }}
                        >
                            <MenuItem onClick={() => router.push('/sys-admin/profile/user-profile')}>Profile</MenuItem>
                            <Divider>Others</Divider>
                            <MenuItem onClick={signoutModal} data-testid={"btnsignouttest"}>
                            Log out
                            </MenuItem>
                        </Menu>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
}

export default ControlledClientNavbar