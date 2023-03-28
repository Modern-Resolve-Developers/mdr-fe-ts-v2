import React, { useState } from 'react'
import UncontrolledCard from '@/components/Cards/Card';
import { 
    Box,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    TablePagination
 } from '@mui/material'

 import { NormalButton } from '@/components/Button/NormalButton';

 import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import StarIcon from '@mui/icons-material/Star';



 type CreateDataProps = {
    id: any
    taskCode: any
    title: string
    description: string
    subtask: any
    imgurl: string
    priority: string
    assignee_userid: any
    reporter: string
    task_dept: string
    task_status: string
    created_by: string
    created_at: any
    updated_at: any
 }
 const createData = (
    props: CreateDataProps
 ) => {
    const {
        id,
        taskCode,
        title,
        description,
        subtask,
        imgurl,
        priority,
        assignee_userid,
        reporter,
        task_dept,
        task_status,
        created_by,
        created_at,
        updated_at
    } = props
    return {
        id,
        taskCode,
        title,
        description,
        subtask,
        imgurl,
        priority,
        assignee_userid,
        reporter,
        task_dept,
        task_status,
        created_by,
        created_at,
        updated_at
    }
 }
 const Row = (props : { row : ReturnType<typeof createData>, handleChangeEdit: any, handleChangeDelete: any}) => {
    const { row, handleChangeEdit, handleChangeDelete } = props
    const [open, setOpen] = useState(false)
    return (
        <>
            <TableRow sx={{ '& > *' : {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                    aria-label='expand row'
                    size='small'
                    onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component='th' scope='row'>
                    {row.taskCode}
                </TableCell>
                <TableCell align='right'>
                    {row.title}
                </TableCell>
                <TableCell align='right'>
                    {
                        row.priority == 'lowest' ? (<>
                        <Chip icon={<KeyboardArrowUpIcon />} label='Lowest' color='primary'/>
                        </>) : (<></>)
                    }
                </TableCell>
                <TableCell align='right'>
                    {row.task_dept}
                </TableCell>
                <TableCell align='right'>
                    <div style={{ display: 'flex', justifyContent: 'right'}}>
                        {/* <NormalButton onClick={() => handleChangeEdit(row)} children={<>EDIT</>} variant='outlined' size='small' />&nbsp; */}
                        <NormalButton onClick={() => handleChangeDelete(row.id)} children={<>DELETE</>} color='error' variant='outlined' size='small' />
                    </div>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout='auto'unmountOnExit>
                        <UncontrolledCard style={{ marginBottom: '20px', marginTop: '10px'}}>
                            <Typography variant='h6' gutterBottom>
                                Task Description
                            </Typography>
                            <div dangerouslySetInnerHTML={{__html: JSON.parse(row.description)}}></div>
                        </UncontrolledCard>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant='h6' gutterBottom component='div'>
                                Subtask under taskcode: {row.taskCode}
                            </Typography>
                            <Table size='small' aria-label='dev tickets'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Task</TableCell>
                                        <TableCell>Priority</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        JSON.parse(row?.subtask).length > 0 && JSON.parse(row?.subtask).map((itemRow: any) => (
                                            <TableRow key={itemRow.task}>
                                                <TableCell component='th' scope='row'>
                                                    {itemRow.task}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        itemRow.priority == 'high' ? (<>
                                                        <Chip icon={<><StarIcon /> <StarIcon /></>} label='High' sx={{padding: 1, backgroundColor: '#f1493f', color: 'white'}}/>
                                                        </>) : itemRow.priority == 'lowest' ? (<>
                                                            <Chip icon={<KeyboardArrowUpIcon />} label='Lowest' color='primary'/>
                                                        </>) : (<></>)
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
 }

 type CollapsibleTableProps = {
    data: any
    pg: any
    rpg: any
    onPageChange: any
    onRowsPerPageChange: any
    handleChangeEdit: any
    handleChangeDeletion: any
 }

 export const CollapsibleTable: React.FC<CollapsibleTableProps> = (props) => {
    const {
        data,
        pg,
        rpg,
        onPageChange,
        onRowsPerPageChange,
        handleChangeEdit,
        handleChangeDeletion
    } = props
    return (
        <TableContainer component={Paper}>
            <Table aria-label='collapsible table'>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>
                            Task ID
                        </TableCell>
                        <TableCell align='right'>Title</TableCell>
                        <TableCell align='right'>Priority</TableCell>
                        <TableCell align='right'>Department</TableCell>
                        <TableCell align='right'>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data?.slice(pg * rpg, pg * rpg + rpg).map((row : any) => (
                            <Row key={row.id} row={row} handleChangeEdit={handleChangeEdit} handleChangeDelete={handleChangeDeletion}  />
                        ))
                    }
                </TableBody>
            </Table>
            <TablePagination 
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={data?.length}
            rowsPerPage={rpg}
            page={pg}  
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            />
        </TableContainer>
    )
 }