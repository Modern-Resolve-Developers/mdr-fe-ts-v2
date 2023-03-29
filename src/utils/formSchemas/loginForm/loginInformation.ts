import yup, {
    multipleEmailSchema
} from '../common'

const credentialsSchema = yup.object().shape({
    email: multipleEmailSchema.label('Email Address')
})

const loginDetailsSchema = yup
.array()
.of(credentialsSchema)

const loginInformationSchema = yup.object().shape({
    loginInfo: loginDetailsSchema
})

export default loginInformationSchema