import { Controller, useForm } from 'react-hook-form'
import { TaskPaneRouterList } from '@lib/routes/routes.enum'
import AuthButton from '@components/taskPane/authButton/AuthButton'
import AuthInput from '@components/taskPane/authInput/AuthInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { logIn } from '@lib/api/signIn'
import { Dispatch, Fragment, SetStateAction } from 'react'
import { useRoute } from '@store/routing.store'
import { signInSchema } from '@lib/validation/signInSchema'
import classes from './signInForm.module.scss'

interface IForm {
  email: string
  password: string
}

const inputList = [
  {
    type: 'text',
    id: 'email',
    placeholder: 'Enter your email',
    label: 'Email',
  },
  {
    type: 'password',
    id: 'password',
    placeholder: 'Enter your password',
    label: 'Password',
  },
] as const

interface IProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

const SignInForm = ({ setIsLoading }: IProps) => {
  const { setHash } = useRoute()

  const {
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<IForm>({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(signInSchema),
  })

  const onNavigateToSignUp = () => {
    setHash(TaskPaneRouterList.registration.path)
  }

  const onSubmitHandler = async () => {
    const data = watch()

    const isExistEmptyInput = Object.values(data).some((input) => !input)
    const isExistError = Boolean(Object.keys(errors).length)

    if (isExistEmptyInput || isExistError) {
      console.log({ isExistEmptyInput, isExistError })
      return
    }
    setIsLoading(true)
    try {
      await logIn({ email: data.email, password: data.password })
      reset()
      setHash(TaskPaneRouterList.presentationRename.path)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={classes.form}>
      {inputList.map(({ type, id, placeholder, label }) => (
        <Fragment key={id}>
          <label htmlFor={id}>{label}</label>
          <Controller
            name={id}
            control={control}
            render={({ field }) => (
              <AuthInput
                id={id}
                type={type}
                value={field.value}
                onChange={field.onChange}
                placeholder={placeholder}
              />
            )}
          />
        </Fragment>
      ))}

      <div className={classes.btnContainer}>
        <AuthButton onClick={onSubmitHandler}>Sign In</AuthButton>
        <AuthButton onClick={onNavigateToSignUp}>Sign Up</AuthButton>
      </div>
    </div>
  )
}

export default SignInForm
