import { 
    useContext, useEffect, useState
} from 'react'
import {
    Container, Grid
} from '@mui/material'
import { useRouter } from 'next/router'
import { ToastContextContinue } from '@/utils/context/base/ToastContext'
import { SessionStorageContextSetup, ToastContextSetup } from '@/utils/context'
import { NormalButton } from '../Button/NormalButton'
import ControlledGrid from '../Grid/Grid'
import {
    FormProvider,
    useForm,
    useFormContext
} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { requiredString } from '@/utils/formSchema'
import { ControlledTextField } from '../TextField/TextField'
import { useApiCallBack } from '@/utils/hooks/useApi'
import { ControlledSwitch } from '../Switch/Switch'
import { useAtom } from 'jotai'
import { meetAtom } from '@/utils/hooks/useAccountAdditionValues'
import ControlledBackdrop from '../Backdrop/Backdrop'
import { JitserStoreDetails } from '@/pages/api/types'
import { useAuthContext } from '@/utils/context/base/AuthContext'
import { SessionContextMigrate } from '@/utils/context/base/SessionContext'

import { useMutation } from 'react-query'
import { useRefreshToken } from '@/utils/context/hooks/hooks'

export const meetBaseSchema = z.object({
    username: requiredString('Username is required.'),
    roomName: requiredString('Kindly provide room name.'),
    isPrivate: z.any(),
    roomPassword: z.any()
})

export type MeetCreation = z.infer<typeof meetBaseSchema>
const CreateMeetForm = () => {
    const [checked, setChecked] = useState(false)
    const {
        control,
        setValue
    } = useFormContext<MeetCreation>()
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked)
        setValue('isPrivate', event.target.checked)
    }
    return (
        <>
            <ControlledGrid>
                <Grid item xs={4}>
                    <ControlledTextField 
                        control={control}
                        required
                        name='username'
                        label='Username'
                        placeholder='Enter your username'
                    />
                </Grid>
                <Grid item xs={4}>
                <ControlledTextField 
                        control={control}
                        required
                        name='roomName'
                        label='Room Name'
                        placeholder='Enter room name'
                    />
                </Grid>
                <Grid item xs={4}>
                    <ControlledSwitch 
                        checked={checked}
                        handleChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                        label='Private Room'
                        disabled={true}
                    />
                </Grid>
            </ControlledGrid>
            {
                checked &&
                <ControlledGrid>
                    <Grid item xs={4}>
                    <ControlledTextField 
                        control={control}
                        required
                        name='roomPassword'
                        label='Room Password'
                        placeholder='Enter room password'
                        type='password'
                    />
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}></Grid>
                </ControlledGrid>
            }
        </>
    )
}
export const StartupPage = () => {
    useRefreshToken()
    const router = useRouter()
    const [jitsiMeetAtom, setJitsiMeetAtom] = useAtom(meetAtom)
    const [backdrop, setBackdrop] = useState(false)
    const storeMeetDetails = useApiCallBack(async (api, args: JitserStoreDetails) => await api.mdr.StoreMeetDetails(args))
    const storeMeetJoinedTeam = useApiCallBack(async (api, props : { roomId: number, name: string }) => await api.mdr.JoinRoomStoreDetails(props))
    const useStoreDetails = () => {
        return useMutation((data: JitserStoreDetails) => storeMeetDetails.execute(data).then((response) => response.data))
    }
    const useJoinMeeting = useMutation((props : {roomId: number, name: string}) => 
        storeMeetJoinedTeam.execute(props)
    )
    const {mutate} = useStoreDetails()
    const { checkAuthentication } = useAuthContext()

    const {
        accessSavedAuth, accessUserId
    } = useContext(SessionContextMigrate) as SessionStorageContextSetup
    
    const form = useForm<MeetCreation>({
        resolver: zodResolver(meetBaseSchema),
        mode: 'all',
        defaultValues: jitsiMeetAtom
    })  
    const {
        formState: { isValid },
        handleSubmit,
        reset
    } = form;
    useEffect(() => {
        reset({})
    }, [])
    useEffect(
        () => {
          checkAuthentication("admin")
        },
        [accessSavedAuth, accessUserId]
    )
    const {
        handleOnToast
    } = useContext(ToastContextContinue) as ToastContextSetup
    const handleContinue = () => {
        handleSubmit(
            (values) => {
                setBackdrop(!backdrop)
                let concat = values.roomName.replace(/\s+/g, "+")
                const jitserObject = {
                    username : values.username,
                    roomName: values.roomName,
                    isPrivate : values.isPrivate ? "1" : "0",
                    roomPassword: values.isPrivate ? values.roomPassword : "no-password-public-room",
                    createdBy : "Administrator",
                    roomUrl : `/sys-admin/meet-page?match=${concat}`
                }
                mutate(jitserObject, {
                    onSuccess: (response) => {
                        if(response == 'room-name-exist'){
                            handleOnToast(
                                "Sorry the room is already exist.",
                                "top-right",
                                false,
                                true,
                                true,
                                true,
                                undefined,
                                "dark",
                                "error"
                            )
                            setBackdrop(false)
                        } else {
                            handleOnToast(
                                "The room has been created. Please wait..",
                                "top-right",
                                false,
                                true,
                                true,
                                true,
                                undefined,
                                "dark",
                                "success"
                            )
                            const jitserObjectForAtom = {
                                username : values.username,
                                roomName: values.roomName,
                                isPrivate : values.isPrivate ? "1" : "0",
                                roomPassword: values.isPrivate ? values.roomPassword : "no-password-public-room",
                            }
                            setJitsiMeetAtom(jitserObjectForAtom)
                            const joinobj = {
                                roomId: response?.id,
                                name: values.username
                            }
                            useJoinMeeting.mutate(joinobj, {
                                onSuccess: (repository: any) => {
                                    if(repository?.data == 'joined') {
                                        setTimeout(() => {
                                            router.push({
                                                pathname: '/sys-admin/meet-page',
                                                query: { match: values.roomName, roomId: response?.id }
                                            })
                                        }, 5000)
                                    }
                                }
                            })
                        }
                    },
                    onError: (error) => {
                        console.log(error)
                    }
                })
            }
        )()
        return false
    }
    return (
        <Container>
            <FormProvider {...form}>
                <CreateMeetForm />
                <NormalButton 
                sx={{
                    float: 'right',
                    mt: 2,
                    mb: 2
                }}
                variant='outlined'
                size='small'
                children='CREATE'
                onClick={handleContinue}
                />
            </FormProvider>
            <ControlledBackdrop 
                open={backdrop}
            />
        </Container>
    )
  }