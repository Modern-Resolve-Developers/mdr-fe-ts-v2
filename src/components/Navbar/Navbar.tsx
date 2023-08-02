import { useEffect, useState } from "react";
import { AdminNavbarProps } from ".";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import algoliasearch from "algoliasearch";
import { sidebarList } from "@/utils/sys-routing/sys-routing";
import { useRouter } from "next/router";
import ControlledBackdrop from "../Backdrop/Backdrop";
import ControlledModal from "../Modal/Modal";
import ControlledTypography from "../Typography/Typography";
import React from "react";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useQuery } from "react-query";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";

const client = algoliasearch(
  `${process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}`,
  `${process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY}`
);
const index = client.initIndex("dev_mdr");

const ControlledAdministratorNavbar: React.FC<AdminNavbarProps> = (props) => {
  const {
    open,
    handleDrawerOpen,
    AppBar,
    token,
    signoutDestroy,
    signoutModal,
  } = props;
  const router = useRouter();
  const [backdrop, setBackdrop] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searched, setSearched] = useState([]);
  const [childMenus, setChildMenus] = useState([]);
  const [algoSearchModal, setAlgoSearchModal] = useState(false);
  const logout = Boolean(anchorEl);
  const [currentUser, setCurrentUser] = useState<any>("");
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");
  const { getPropsDynamic } = useDynamicDashboardContext();
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  useEffect(() => {
    getPropsDynamic(localStorage.getItem("uid")).then((repo: any) => {
      setIdentifiedUser(repo?.data);
    });
  }, []);
  useEffect(() => {
    let savedCurrentUser;
    const getSavedCurrentUser = localStorage.getItem("ut");
    if (typeof getSavedCurrentUser == "string") {
      savedCurrentUser = getSavedCurrentUser;
    }
    setCurrentUser(savedCurrentUser);
  }, [currentUser]);
  useEffect(() => {
    index
      .saveObjects(sidebarList)
      .then(({ objectIDs }) => {})
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleChangeSearch = (event: any) => {
    index
      .search(event.target.value)
      .then(({ hits }: any) => {
        setSearched(hits);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChangeAutoCompleteSearch = (event: any, values: any) => {
    if (values?.dropDownChildren?.length > 0) {
      setAlgoSearchModal(!algoSearchModal);
      values?.dropDownChildren?.length > 0 &&
        values.dropDownChildren.map((item: any) => {
          item?.childMenu?.length > 0 && setChildMenus(item.childMenu);
        });
    } else {
      if (values == null) return;
      setBackdrop(!backdrop);
      setTimeout(() => {
        router.push(values.uri);
      }, 2000);
    }
  };

  const handleNavigateSubPages = (uri: string) => {
    setAlgoSearchModal(false);
    setBackdrop(!backdrop);
    setTimeout(() => {
      router.push(uri);
    }, 2000);
  };

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box className="flex items-center justify-between w-full">
            <h3 className="text-2xl font-medium font-body text-white">
              Hi,{" "}
              {idetifiedUser == 1
                ? "Administrator"
                : idetifiedUser == 2
                ? "Developer"
                : "Unknown"}
            </h3>
            <Box className="flex item-center gap-3">
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={searched}
                groupBy={(option: any) => option.name}
                getOptionLabel={(option: any) => option.title}
                sx={{ width: 300 }}
                onChange={(e: any, values: any) =>
                  handleChangeAutoCompleteSearch(e, values)
                }
                renderInput={(params) => (
                  <TextField
                    onChange={handleChangeSearch}
                    {...params}
                    label="Search"
                  />
                )}
              />
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
      <ControlledBackdrop open={backdrop} />
      <ControlledModal
        open={algoSearchModal}
        handleClose={() => setAlgoSearchModal(false)}
        title="SUB PAGES"
        buttonTextAccept="NO-BTN"
      >
        <List>
          {childMenus?.length > 0 &&
            childMenus.map((item: any) => (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleNavigateSubPages(item.uri)}
                >
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </ControlledModal>
    </>
  );
};

export default ControlledAdministratorNavbar;
