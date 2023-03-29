import { validateEmail, validateMobile } from "../validation"
type YupMessage = { label: string; value: any }
type YupMaxMessage = YupMessage & { max: number }
type YupTypeMessage = YupMessage & { type: string }

import * as yup from 'yup'

export const emailErrorMessage = ({ value } : YupMessage): string => {
    const count = value?.filter((a: string) => !validateEmail(a || '')).length

    if(!count) return '';
    if(count === 1) {
        return `${count} input is invalid email format.`
    }
    return `${count} inputs are invalid email format.`
}

export const multipleEmailSchema = yup
	.array()
	.of(yup.string())
	.ensure()
	.min(1, ({ label }) => `Input ${label}.`)
	.test(
		'isValidNumber',
		emailErrorMessage,
		(v) => !!v?.every((a) => validateEmail(a || ''))
	);

export default yup