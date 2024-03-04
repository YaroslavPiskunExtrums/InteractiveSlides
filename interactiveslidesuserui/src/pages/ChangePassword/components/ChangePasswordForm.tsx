import { yupResolver } from '@hookform/resolvers/yup'
import { FC, useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { CardBody, Spinner } from 'reactstrap'
import { changePasswordSchema } from '../changePassword.resolver'
import classNames from 'src/lib/util/classNames'
import { changePassword } from 'src/lib/api/changePassword'
import { useNavigate } from 'react-router-dom'
import IncorrectLink from './IncorrectLink'

type ChangePasswordInputsType = {
  password?: string
  confirmPassword?: string
}

type ChangePasswordFormProps = {
  link: string
}

const ChangePasswordForm: FC<ChangePasswordFormProps> = (props) => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInputsType>({
    mode: 'onChange',
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const onSubmit: SubmitHandler<ChangePasswordInputsType> = async (data) => {
    try {
      setIsLoading(true)

      const response = await changePassword({
        link: props.link,
        confirmPassword: data.confirmPassword,
        password: data.password,
      })
      navigate('/login')
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError(JSON.stringify(e))
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!props.link) return <IncorrectLink />

  return (
    <CardBody className="p-4">
      <div className="text-center mt-2">
        <h5 className="text-primary">Change temporary password</h5>
        <p className="text-muted">You can change password by this link only once</p>
      </div>
      <div className="mt-4 p-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="position-relative auth-pass-inputgroup mb-3">
            <Controller
              name="password"
              control={control}
              render={({ field: { value, onChange } }) => (
                <input
                  onChange={onChange}
                  name="password"
                  id="password"
                  className={classNames(
                    'form-control',
                    errors.password ? 'border-danger text-danger' : ''
                  )}
                  placeholder="Enter password"
                  type={showPass ? 'text' : 'password'}
                  value={value}
                  autoComplete="off"
                />
              )}
            />
            <button
              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
              type="button"
              id="password-addon"
              onClick={() => setShowPass((prev) => !prev)}
            >
              <i className="ri-eye-fill align-middle" />
            </button>
            {errors.password && (
              <span className="position-absolute text-danger" style={{ fontSize: '0.875em' }}>
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm password
            </label>
            <div className="position-relative auth-pass-inputgroup mb-3">
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    onChange={onChange}
                    name="confirmPassword"
                    id="confirmPassword"
                    className={classNames(
                      'form-control',
                      errors.confirmPassword ? 'border-danger text-danger' : ''
                    )}
                    placeholder="Enter confirm password"
                    type={showConfirmPass ? 'text' : 'password'}
                    value={value}
                    autoComplete="off"
                  />
                )}
              />
              <button
                className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                type="button"
                id="password-addon1"
                onClick={() => setShowConfirmPass((prev) => !prev)}
              >
                <i className="ri-eye-fill align-middle" />
              </button>
              {errors.confirmPassword && (
                <span className="position-absolute text-danger" style={{ fontSize: '0.875em' }}>
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
          <button
            className="btn btn-success w-100 d-flex justify-content-center align-items-center gap-2"
            type="submit"
            disabled={isLoading || Boolean(Object.values(errors).length)}
          >
            Send new password
            {isLoading ? (
              <Spinner size="sm" className="me-2">
                {' '}
                Loading...{' '}
              </Spinner>
            ) : null}
          </button>
        </form>
      </div>
    </CardBody>
  )
}

export default ChangePasswordForm
