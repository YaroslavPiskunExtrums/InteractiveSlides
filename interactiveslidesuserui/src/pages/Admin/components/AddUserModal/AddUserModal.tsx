import { Alert, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { toast, ToastContainer } from 'react-toastify'
import React from 'react'
import apiLink from '../../../../helpers/api_links'
import adminStore from '../../admin.store'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormInputs } from 'src/pages/Admin/components/AddUserModal/add-user-modal.types'
import { addUserModalValidation } from 'src/pages/Admin/components/AddUserModal/add-user-modal.resolver'

const AddUserModal = ({ modalShow, onClose }) => {
  const { getUsers } = adminStore()

  const formMethods = useForm<FormInputs>({
    resolver: yupResolver(addUserModalValidation),
    defaultValues: {
      company_domain: '',
      company_name: '',
      confirm_password: '',
      email: '',
      password: '',
      username: '',
    },
    mode: 'onChange',
  })
  const onSubmit: SubmitHandler<FormInputs> = async (values) => {
    const registerResponse = await fetch(`${apiLink}/api/super-user/register-company-owner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${JSON.parse(sessionStorage.getItem('authUser')).accessToken}`,
      },
      body: JSON.stringify(values),
    })
    const registerResponseJson = await registerResponse.json()

    if (registerResponse.status === 200) {
      toast.success('User is added')
      await getUsers()
    } else {
      toast.error(registerResponseJson.errors[0].safeMessage)
    }

    formMethods.reset({
      company_domain: '',
      company_name: '',
      confirm_password: '',
      email: '',
      password: '',
      username: '',
    })
    onClose()
  }

  return (
    <Modal
      fade
      centered
      isOpen={modalShow}
      toggle={() => {
        formMethods.reset({
          company_domain: '',
          company_name: '',
          confirm_password: '',
          email: '',
          password: '',
          username: '',
        })
        onClose()
      }}
    >
      <ModalHeader>Add user</ModalHeader>
      <ModalBody>
        <Form
          //@ts-ignore
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="needs-validation"
        >
          <div className="mb-3">
            <Label htmlFor="useremail" className="form-label">
              Email <span className="text-danger">*</span>
            </Label>

            <Controller
              render={({ field: { value, onChange, onBlur }, fieldState }) => {
                return (
                  <>
                    <Input
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter email address"
                      type="email"
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      invalid={fieldState.error && fieldState.isTouched}
                    />
                    {fieldState.error && fieldState.error.message ? (
                      <FormFeedback type="invalid">
                        <div>{fieldState.error.message}</div>
                      </FormFeedback>
                    ) : null}
                  </>
                )
              }}
              name={'email'}
              control={formMethods.control}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="username" className="form-label">
              Username <span className="text-danger">*</span>
            </Label>

            <Controller
              render={({ field: { value, onChange, onBlur }, fieldState }) => {
                return (
                  <>
                    <Input
                      id="username"
                      name="username"
                      className="form-control"
                      placeholder="Enter username"
                      type="text"
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      invalid={fieldState.error && fieldState.isTouched}
                    />
                    {fieldState.error && fieldState.error.message ? (
                      <FormFeedback type="invalid">
                        <div>{fieldState.error.message}</div>
                      </FormFeedback>
                    ) : null}
                  </>
                )
              }}
              name={'username'}
              control={formMethods.control}
            />
          </div>

          <div className="mb-3">
            <Label htmlFor="company_name" className="form-label">
              Company name <span className="text-danger">*</span>
            </Label>

            <Controller
              render={({ field: { value, onChange, onBlur }, fieldState }) => {
                return (
                  <>
                    <Input
                      id="company_name"
                      name="company_name"
                      className="form-control"
                      placeholder="Enter company name"
                      type="text"
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      invalid={fieldState.error && fieldState.isTouched}
                    />
                    {fieldState.error && fieldState.error.message ? (
                      <FormFeedback type="invalid">
                        <div>{fieldState.error.message}</div>
                      </FormFeedback>
                    ) : null}
                  </>
                )
              }}
              name={'company_name'}
              control={formMethods.control}
            />
          </div>

          <div className="mb-3">
            <Label htmlFor="company_domain" className="form-label">
              Company domain<span className="text-danger">*</span>
            </Label>
            <Controller
              render={({ field: { value, onChange, onBlur }, fieldState }) => {
                return (
                  <>
                    <Input
                      id="company_domain"
                      name="company_domain"
                      className="form-control"
                      placeholder="Enter company domain"
                      type="text"
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      invalid={fieldState.error && fieldState.isTouched}
                    />
                    {fieldState.error && fieldState.error.message ? (
                      <FormFeedback type="invalid">
                        <div>{fieldState.error.message}</div>
                      </FormFeedback>
                    ) : null}
                  </>
                )
              }}
              name={'company_domain'}
              control={formMethods.control}
            />
          </div>

          <div className="mt-4">
            <button className="btn btn-success w-100" type="submit">
              Sign Up
            </button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default AddUserModal
