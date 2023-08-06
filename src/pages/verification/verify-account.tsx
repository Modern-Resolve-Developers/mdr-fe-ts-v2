import { ControlledBackdrop, ControlledGrid, UncontrolledCard } from "@/components"
import { ControlledCodeEntry } from "@/components/TextField/CodeEntry"
import { styledCodeEntry } from "@/utils/GlobalCascadeStyleSheet"
import { ClientCreationAtom, verifyAtom } from "@/utils/hooks/useAccountAdditionValues"
import { useApiCallBack, useSecureHiddenNetworkApi } from "@/utils/hooks/useApi"
import { VerifyBase, VerifyType } from "@/utils/schema/VerifySchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Container, Grid, Typography } from "@mui/material"
import { useAtom } from "jotai"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AuthenticationJwtCreateAccount, BeginToVerifyCode } from "../api/Authentication/types"
import { useMutation } from "react-query"
import { useToastContext } from "@/utils/context/base/ToastContext"
import { UAMAddRequestArgs } from "../api/users/types"
import { AxiosResponse } from "axios"
import { useAuthContext } from "@/utils/context/base/AuthContext"
import { encrypt } from "@/utils/secrets/hashed"

const VerifyAccount: React.FC = () => {
    const [verify, setVerify] = useAtom(verifyAtom)
    const [details, setDetails] = useAtom(ClientCreationAtom)
    const { login } = useAuthContext()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [preload, setPreLoad] = useState(false)
    const form = useForm<VerifyType>({
        mode: 'all',
        resolver: zodResolver(VerifyBase),
        defaultValues: verify
    })
    const customerAccountCreation = useApiCallBack(
        async (api, args: UAMAddRequestArgs) => await api.users.CustomerAccountCreation(args)
      );
    const secureBeginCheckingCode = useSecureHiddenNetworkApi(
        async (api, args: BeginToVerifyCode) => await api.secure.sla_begin_checking_verification_code(args)
    )
    const SecureJwtAccountCreation = useSecureHiddenNetworkApi(
        async (api, args: AuthenticationJwtCreateAccount) => await api.secure.sla_jwt_account_creation(args)
    )
    
    const useSecureBeginCheckCode = () => {
        return useMutation((data: BeginToVerifyCode) => 
            secureBeginCheckingCode.execute(data)
        );
    }
    const useCustomerCreation = useMutation((data: UAMAddRequestArgs) => 
        customerAccountCreation.execute(data)
    );
    const useCreateSecureJwtAccount = useMutation((data: AuthenticationJwtCreateAccount) => 
        SecureJwtAccountCreation.execute(data)
    );
    const { handleOnToast } = useToastContext()
    const { mutate } = useSecureBeginCheckCode()
    const { resendRevalidate, handleResendCode, cooldownIsActive, cooldown, remainingTime, resendCheckCounts, formatCooldownTime, FormatExpiry, maxResentWith401 } = useAuthContext()
    const {
        formState: {isValid},
        handleSubmit,
        control,
        getValues,
        reset
    } = form;
    useEffect(() => {
        setTimeout(() => {
            if(!details) {
                router.push('/login')
            } else {
                setLoading(false)
            }
        }, 3000)
    }, [])
    useEffect(() => {
        resendCheckCounts(details?.email)
        resendRevalidate(details?.email)
    }, [])
    const handleContinue = () => {
        handleSubmit(
            (values) => {
                setPreLoad(!preload)
                const beginWork: BeginToVerifyCode = {
                    code: values.code,
                    email: details?.email,
                    type: "account_activation"
                }
                const accountWork: UAMAddRequestArgs & {
                    phoneNumber: string | undefined
                } = {
                    firstname: details?.firstName,
                    middlename: details?.middleName,
                    lastname: details?.lastName,
                    phoneNumber: details?.phoneNumber,
                    email: details?.email,
                    password: details?.password,
                    userType: "3",
                    key: encrypt(details?.password)
                }
                const jwtWork: AuthenticationJwtCreateAccount = {
                    jwtusername: details?.email,
                    jwtpassword: details?.password,
                    isValid: "1"
                }
                mutate(beginWork, {
                    onSuccess: (res) => {
                        if(res?.data == 200) {
                            // account & jwt account creation
                            useCustomerCreation.mutate(accountWork, {
                                onSuccess: (account: AxiosResponse | undefined) => {
                                    if(account?.data == 200) {
                                        useCreateSecureJwtAccount.mutate(jwtWork, {
                                            onSuccess: (jwtres: AxiosResponse | undefined) => {
                                                if(jwtres?.data?.status == "Success"){
                                                    handleOnToast(
                                                        "Successfully Verified and Created.",
                                                        "top-right",
                                                        false,
                                                        true,
                                                        true,
                                                        true,
                                                        undefined,
                                                        "dark",
                                                        "success"
                                                    );
                                                    setPreLoad(false)
                                                    login(details?.email, details?.password)
                                                    /* navigate to client dashboard */
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        } else {
                            handleOnToast(
                                "Invalid verification code. Please try again.",
                                "top-right",
                                false,
                                true,
                                true,
                                true,
                                undefined,
                                "dark",
                                "error"
                              );
                              setPreLoad(false)
                              reset({})
                        }
                    }
                })
            }
        )()
    }
    const handleResend = () => {
        setPreLoad(!preload)
        handleResendCode("email", details?.email)
        setTimeout(() => setPreLoad(false), 3000)
    }
    return (
        <>
            {loading ? <ControlledBackdrop open={loading} /> :
            <div className="verify-account-container">
            <Container>
                <div style={{ padding: '20px'}}>
                    <UncontrolledCard
                    style={{
                        padding: '20px',
                        marginTop: '50px'
                    }}
                    >
                        <ControlledGrid>
                            <Grid item xs={6}>
                                <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "50px",
                                }}
                                >
                                <Typography fontWeight='bold' variant="h5">Please Check your Email</Typography>
                               
                                
                                </div>
                                <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "10px",
                                }}
                                >
                                <Typography 
                                sx={{
                                    color: '#808080'
                                }}
                                variant="caption">
                                    We've sent code to <span style={{color: '#A43A38', fontWeight: "bold"}}>
                                    {details?.email}
                                    </span>
                                </Typography>
                                </div>
                                <div
                                 style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "10px",
                                }}
                                >
                                <ControlledCodeEntry 
                                control={control}
                                name="code"
                                fields={6}
                                required
                                onChange={(e: any) => console.log()}
                                value={getValues().code}
                                type='text'
                                style={styledCodeEntry}
                                />
                                
                                </div>
                                <div
                                 style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "10px",
                                }}
                            >
                               {
                                cooldownIsActive && maxResentWith401 == 401 ? 
                                (
<Typography
                                    sx={{
                                        color: '#808080'
                                    }}
                                    variant='caption'
                                    >
                                        Please wait {formatCooldownTime(remainingTime)} 
                                </Typography>
                                ) : 
                                <>
                                <Typography
                                    sx={{
                                        color: '#808080'
                                    }}
                                    variant='caption'
                                    >
                                        {
                                            maxResentWith401 == 400 ? 
                                            <>
                                            You've reached maximum sent email. Please wait for 24 hours
                                            </>
                                            :
                                            <>
                                            Did you not receive the code? <span style={{color: '#A43A38', fontWeight: "bold", cursor: 'pointer'}} onClick={handleResend}>Resend</span>
                                            </>
                                        }
                                </Typography>
                                </>
                               }
                                </div>
                                <div className="flex justify-center items-center">
                                    <button
                                    disabled={!isValid}
                                    onClick={handleContinue}
                                    className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    style={{
                                        cursor: !isValid ? "not-allowed" : "pointer",
                                        backgroundColor: "#973B74",
                                        width: "250px",
                                        marginTop: '50px'
                                    }}
                                    >
                                    Verify
                                    </button>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <img 
                                src="/clientreg.png"
                                style={{
                                    width: "80%",
                                    height: "auto"
                                }}
                                />
                            </Grid>
                        </ControlledGrid>
                    </UncontrolledCard>
                </div>
                <ControlledBackdrop open={preload} />
            </Container>
        </div>}
        </>
    )
}

export default VerifyAccount