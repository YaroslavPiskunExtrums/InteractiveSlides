import AuthButton from '@components/taskPane/authButton/AuthButton'
import AuthInput from '@components/taskPane/authInput/AuthInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { signUp } from '@lib/api/signUp'
import { TaskPaneRouterList } from '@lib/routes/routes.enum'
import { signUpSchema } from '@lib/validation/signUpSchema'
import { useRoute } from '@store/routing.store'
import { Dispatch, Fragment, SetStateAction } from 'react'
import { Controller, useForm } from 'react-hook-form'
import classes from './signUpForm.module.scss'

interface IForm {
  email: string
  password: string
  username: string
  companyName: string
  companyDomain: string
}

const inputList = [
  {
    type: 'text',
    id: 'email',
    placeholder: 'Enter your email',
    label: 'Email',
  },
  {
    type: 'text',
    id: 'username',
    placeholder: 'Enter your Username',
    label: 'Username',
  },
  {
    type: 'password',
    id: 'password',
    placeholder: 'Enter your password',
    label: 'Password',
  },
  {
    type: 'text',
    id: 'companyName',
    placeholder: 'Enter your company name',
    label: 'Company Name',
  },
  {
    type: 'text',
    id: 'companyDomain',
    placeholder: 'Enter your company domain',
    label: 'Company Domain',
  },
] as const

interface IProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

const SignUpForm = ({ setIsLoading }: IProps) => {
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
      username: '',
      companyDomain: '',
      companyName: '',
    },
    resolver: yupResolver(signUpSchema),
  })

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
      await signUp({
        company_domain: data.companyDomain,
        company_name: data.companyName,
        email: data.email,
        password: data.password,
        username: data.username,
      })
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
            control={control}
            name={id}
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
        <AuthButton onClick={onSubmitHandler}>Sign Up</AuthButton>
      </div>
    </div>
  )
}

export default SignUpForm
