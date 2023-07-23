import { useAuthContext } from "@/utils/context/base/AuthContext";
import { useEffect, useState, useContext, useRef } from "react";
import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";
import { ControlledBackdrop, ControlledGrid, UncontrolledCard } from "@/components";
import { CardContent, Container, Grid, Typography } from "@mui/material";
import { ProfileCard } from "@/components/Cards/ProfileCard/ProfileCard";
import { NormalButton } from "@/components/Button/NormalButton";
import { useReferences } from "@/utils/context/hooks/hooks";
import { FormProvider, useForm } from "react-hook-form";
import { userProfileAtom } from "../../../utils/hooks/useAccountAdditionValues";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfileSchema, UserProfileType } from "@/utils/schema/UserProfileSchema";
import { useAtom } from "jotai";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { ControlledTextField } from "@/components/TextField/TextField";
import { ControlledCheckbox } from "@/components/Checkbox/Checkbox";

const UserProfile: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [files, setFiles] = useState<any>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [progress, setProgress] = useState(0)
    const [profile, setProfile] = useAtom(userProfileAtom)

    const { checkAuthentication } = useAuthContext()
    const [references, setReferences] = useReferences()
    const { accessSavedAuth, accessUserId } = useContext(
        SessionContextMigrate
    ) as SessionStorageContextSetup;

    const form = useForm<UserProfileType>({
        mode: 'all',
        resolver: zodResolver(UserProfileSchema),
        defaultValues: profile ?? { hasNoMiddleName: false }
    })
    const {
        control, getValues, watch, trigger, resetField, setValue
    } = form

    useEffect(() => {
        checkAuthentication("admin");
        setTimeout(() => {
        setLoading(false);
        }, 3000);
    }, [accessSavedAuth, accessUserId])
    useEffect(() => {
        setValue('firstname', references.firstname)
        // need backend adjustments, include middlename on response.
        if(references.middlename == 'N/A') {
            setValue('middlename', references.middlename)
            setValue('hasNoMiddleName', true)
        }
        setValue('lastname', references.lastname)
        setValue('email', references.email)
        setProfileImage(references.imgurl)
    }, [])
    const image = watch('profileImage')
    useEffect(() => {}, [image])
    const hasNoMiddleName = watch('hasNoMiddleName')
    const hasNoMiddleNamePrevValue = usePreviousValue(hasNoMiddleName)
    useEffect(() => {
        resetField('middlename')
        if(hasNoMiddleNamePrevValue) {
            trigger('middlename')
        }
    }, [
        hasNoMiddleName,
        hasNoMiddleNamePrevValue,
        trigger,
        resetField
    ])
    return (
        <>
            {loading ? (
                <ControlledBackdrop open={loading} />
            ) : (
                <Container>
                    <UncontrolledCard>
                        <Typography variant='body2' gutterBottom>
                            User Profile Management
                        </Typography>
                        <ProfileCard
                            profilePicture="https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*"
                            coverPhoto="https://i.pinimg.com/originals/f2/e2/5f/f2e25fa89ad3e970aeb994db60a81303.jpg"
                            name='JM Sevilla'
                            position="Senior Technical Engineering Lead"
                        >
                            <CardContent>
                                <UncontrolledCard
                                style={{
                                    float: 'right',
                                    marginTop: '10px',
                                    marginBottom: '10px'
                                }}
                                >
                                    <Typography variant='caption'>
                                        Actions
                                    </Typography>
                                    <div style={{
                                        display: 'flex'
                                    }}>
                                        <NormalButton 
                                        variant='outlined'
                                        size='small'
                                        children='Change profile picture'
                                        />&nbsp;
                                        <NormalButton 
                                        variant='outlined'
                                        size='small'
                                        children='Change cover photo'
                                        />
                                    </div>
                                </UncontrolledCard>
                                <FormProvider {...form}>
                                <ControlledGrid>
                                    <Grid item xs={6}>
                                        <UncontrolledCard>
                                            <Typography variant='caption'>
                                                Basic Information
                                            </Typography>
                                            <ControlledGrid>
                                                <Grid item xs={4}>
                                                    <ControlledTextField 
                                                    control={control}
                                                    name='firstname'
                                                    label='Firstname'
                                                    shouldUnregister
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ControlledTextField 
                                                        control={control}
                                                        name='middlename'
                                                        required={!hasNoMiddleName}
                                                        disabled={hasNoMiddleName}
                                                        shouldUnregister
                                                        label='Middlename'
                                                    />
                                                    <ControlledCheckbox 
                                                        control={control}
                                                        name='hasNoMiddleName'
                                                        label='I do not have a middlename'
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                <ControlledTextField 
                                                    control={control}
                                                    name='lastname'
                                                    label='Lastname'
                                                    shouldUnregister
                                                    />
                                                </Grid>
                                            </ControlledGrid>
                                        </UncontrolledCard>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <UncontrolledCard>
                                            <Typography variant='caption'>
                                                Credentials Information
                                            </Typography> <br/>
                                            <button
                      className="rounded-md border border-transparent bg-cyan-900 py-2 px-4 text-sm font-medium text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:bg-cyan-500 focus:ring-offset-2"
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#153D77",
                        width: "150px",
                      }}
                    >
                      Go to settings
                    </button>
                                        </UncontrolledCard>
                                    </Grid>
                                </ControlledGrid>
                                </FormProvider>
                            </CardContent>
                        </ProfileCard>
                    </UncontrolledCard>
                </Container>
            )}
        </>
    );
};

export default UserProfile;
