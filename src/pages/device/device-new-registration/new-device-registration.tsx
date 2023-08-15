import { ControlledBackdrop, UncontrolledCard } from "@/components"
import { Alert, Container, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import HelloWorld from "@/components/Scanner/HelloWorld"
import styles from '@/styles/Home.module.css'
import { useAuthContext } from "@/utils/context/base/AuthContext"
import { useToastContext } from "@/utils/context/base/ToastContext"
import { useApiCallBack } from "@/utils/hooks/useApi"
import { decrypt } from "@/utils/secrets/hashed"
import { AxiosError, AxiosResponse } from "axios"
import { useDevice } from "@/utils/context/hooks/hooks"
const NewDeviceRegistration: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { 
        approvedDeviceTrigger,
        isApprovedDeviceAlive,
        login
    } = useAuthContext()
    const {
        email, password
    } = router.query
    const [device, setDevice] = useDevice()
    const UnauthRevokeCb = useApiCallBack(
        async (api, email: string) => await api.users.unauthRevokeDevice(email)
    )
    const approvedDeviceReset = useApiCallBack(
        async (api, email: string) => await api.users.approvedDeviceReset(email)
    )
    const [remainingTime, setRemainingTime] = useState(60)
    useEffect(() => {
        const intervalId = setInterval(() => {
            approvedDeviceTrigger(decrypt(email))
        }, 1000)
        return () => clearInterval(intervalId)
    }, [])
    useEffect(() => {
        if(isApprovedDeviceAlive){
            setLoading(true)
            approvedDeviceReset.execute(decrypt(email))
            .then((response: AxiosResponse | undefined) => {
                if(response?.data == 200){
                    setDevice(undefined)
                    login(decrypt(email), decrypt(password))
                }
            }).catch((error: AxiosError) => {
                if(error.response?.status == 400){
                    setDevice(undefined)
                }
            })
        }
    }, [isApprovedDeviceAlive])
    useEffect(() => {
        if(device != undefined) {
            setLoading(false)
            if(remainingTime > 0) {
                const intervalId = setInterval(() => {
                    setRemainingTime(prevTime => prevTime - 1)
                }, 1000)
                return () => {
                    clearInterval(intervalId)
                }
            }
        } else {
            router.push('/login')
        }
    }, [remainingTime, device]);
    useEffect(() => {
        if(remainingTime == 0) {
            setDevice(undefined)
                    router.replace('/login')
        }
    }, [remainingTime])
    
    return (
        <>
            {
                loading ? <ControlledBackdrop open={loading} />
                :
                <Container maxWidth="sm" className="forgot-pw-container">
                   {
                    remainingTime > 0 && (
                        <div style={{
                            position: 'fixed', top: '20px', right: '20px', zIndex: 9999
                          }}>
                            <Alert severity={"error"}>
                                The approval time will end in : {remainingTime} seconds
                            </Alert>
                          </div> 
                    )
                   }
                    {/* className must be replaced. */}
                    <UncontrolledCard elevation={5} style={{
                        width: '50vw'
                    }}>
                        {/* className must be replaced. */}
                        <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        >
                            <Typography variant='button'>
                                Primary Device Key
                            </Typography>
                        </div>
                        <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        >
                            <img 
                            src="https://cdn.dribbble.com/users/1436489/screenshots/4549419/media/888bd63de57b7b587fdccecdaee555ab.gif"
                            style={{
                                width: '50%',
                            }}
                            />
                        </div>
                        <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        >
                            <Typography variant='caption'
                            sx={{
                                fontWeight: 'bold'
                            }}>
                                Processing...
                            </Typography>
                        </div>
                        <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        >
                            <Typography variant='caption'>
                                You are currently logged in to the other device. Please approved the request to proceed.
                            </Typography>
                        </div>
                        {/* Don't remove this code is part of psi poc. will remove on the future sprint by me. thanks */}
                        {/* <main className={styles.main}>
  <div className={styles.UIElement}>
    <HelloWorld />
  </div>
</main> */}
                    </UncontrolledCard>
                </Container>
            }
        </>
    )
}

export default NewDeviceRegistration