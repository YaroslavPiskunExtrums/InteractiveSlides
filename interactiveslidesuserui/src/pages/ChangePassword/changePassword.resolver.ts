import * as yup from 'yup';

export const changePasswordSchema = yup.object({
	password: yup.string().required("Password is a required field"),
	confirmPassword: yup.string().required("Confirm password is a required field").test({
		message: 'Passwords are different', name: 'compare', test: (val, context) => {
			return context.parent.password === val
		}
	})
}).required()
