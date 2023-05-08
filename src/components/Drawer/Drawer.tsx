
/* DEPRECATED CURRENTLY NOT WORKING */
import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton, ListItemIcon, ListItemText
} from '@mui/material'
import React, { useState } from 'react'

type ChildMenuProps = {
    title: string
    dropDown: boolean
    uri: string
    icon: React.ReactNode
}

export type Anchor = 'right'
type AnchorPositionProps = {
    right: boolean
}
type DrawerProps = {
    childMenu: ChildMenuProps[]
    anchor: any | null
    toggleDrawer: (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void
    anchorPosition: boolean

}

export const ControlledMuiDrawer = (props: DrawerProps) => {
    const { 
        childMenu,
        anchor,
        toggleDrawer,
        anchorPosition
    } = props;
    const MuiDrawer = (anchor: Anchor) => (
        <Box
        sx={{ width: 250 }}
        role='presentation'
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {
                    childMenu?.length > 0 && childMenu.map((text: any, index: any) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                {text.icon}
                            </ListItemButton>
                            <ListItemText primary={text.title} />
                        </ListItem>
                    ))
                }
            </List>
        </Box>
    ) 
    return (
        <>
             <Drawer
                anchor={anchor}
                open={anchorPosition}
                onClose={toggleDrawer(anchor, false)}
                >
                    {MuiDrawer(anchor)}
            </Drawer>
        </>
    )
}
 

