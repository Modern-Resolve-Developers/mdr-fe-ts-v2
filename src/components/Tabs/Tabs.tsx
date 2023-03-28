import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps{
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps){
    const { children, index, value, ...other } = props

    return(
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

function a11yProps(index: number){
    return {
        id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
    }
}
type TabExtraData = {
    label: string
}
type TabProps = {
    tabsinject : TabExtraData[]
}

type ControlledTabsProps = {
    value: number
    handleChange: (event : React.SyntheticEvent, newValue: number) => void
    children: React.ReactNode
}

type CombinedProps = ControlledTabsProps & TabProps;

export const ControlledTabs: React.FC<CombinedProps> = ({value, handleChange, tabsinject, children}) => {
    return (
        <Box sx={{ width: '100%'}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                   {
                    tabsinject.map((item: any, index: any) => (
                        <Tab label={item.label} {...a11yProps(index)} />
                    ))
                   }
                </Tabs>
            </Box>
            {children}
        </Box>
    )
}
