import { useEffect, useState } from "react";
import { AdminNavbarProps } from ".";
import { Box, Toolbar, IconButton, Avatar, Menu, MenuItem, Autocomplete, TextField } from '@mui/material'
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import algoliasearch from 'algoliasearch'
const client = algoliasearch("EJNUDUL5B2", "ad45b044260204eb353de721ab3500a8")
const index = client.initIndex("dev_mdr")



const ControlledAdministratorNavbar: React.FC<AdminNavbarProps> = (props) => {
    const { 
        open, handleDrawerOpen, AppBar, token, signoutDestroy, signoutModal
    } = props

    const [anchorEl, setAnchorEl] = useState(null)
    const [searched, setSearched] = useState([])
    const logout = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
      };
      const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
      }
    useEffect(() => {
      const objects: Array<{
        objectID: number
        name: string,
        value: string
      }> = [
        {
          objectID: 1,
          name: "MDR",
          value:'mdr'
        }
      ]
      index
      .saveObjects(objects)
      .then(({ objectIDs }) => {
        console.log(objectIDs);
      })
      .catch(err => {
        console.log(err);
      });
    }, [])
    const handleChangeSearch = (event: any) => {
      index
      .search(event.target.value)
      .then(({ hits } : any) => {
        setSearched(hits)
      })
      .catch(err => {
        console.log(err);
      });
    }
    const handleChangeAutoCompleteSearch = (event: any, values: any) => {
      console.log(values)
    }
    return (
        <>
        <AppBar position='fixed' open={open}>
            <Toolbar>
                <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                    marginRight: 5,
                    ...(open && { display: 'none'})
                }}
                >
                    <MenuIcon />
                </IconButton>
                <Box className="flex items-center justify-between w-full">
                    <h3 className="text-2xl font-medium font-body text-white">
                        Hi, Administrator
                    </h3>
                   <Box className='flex item-center gap-3'>
                   <Autocomplete 
                    id="free-solo-demo"
                    freeSolo
                    options={searched}
                    getOptionLabel={(option : any) => option.name}
                    sx={{ width: 300 }}
                    onChange={(e: any, values: any) =>
                      handleChangeAutoCompleteSearch(e, values)
                    }
                    renderInput={
                      (params) => <TextField onChange={handleChangeSearch} {...params} label="Search" />
                    }
                   />
                   <Avatar
              alt="Remy Sharp"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_cj9fuTsqPCwvnG-IqN3HAVb9jMa0BD5uxQ&usqp=CAU"
            />
              <IconButton
                aria-controls={logout ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={logout ? 'true' : undefined}
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
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={signoutModal} data-testid={'btnsignouttest'}>Log out</MenuItem>
              </Menu>
                   </Box>
                </Box>
            </Toolbar>
        </AppBar>
        </>
    )
}

export default ControlledAdministratorNavbar