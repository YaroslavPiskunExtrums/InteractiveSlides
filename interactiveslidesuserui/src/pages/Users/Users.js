import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, FormFeedback, Input, Label, Modal, ModalBody, Row} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import useUsersStore from "./user.store";
import './_users.scss'
import {useFormik} from "formik";
import * as Yup from "yup";
import DeleteModal from "../../Components/Common/DeleteModal";


const Users = () => {
  const {users, getUsers, addUser, removeUser} = useUsersStore()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModal, setIsDeleteModal] = useState(false)

  const [selectedUser, setSelectedUser] = useState(null)

  const deleteUser = async () => {
    await removeUser(selectedUser)
    setIsDeleteModal(false)
    setSelectedUser(null)
  }

  useEffect(() => {
    getUsers().then(() => console.log("Users is loaded"))
  }, [])
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      username: Yup.string().required("Please Enter Your Username"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values, {resetForm}) => {
      await addUser(values)
      setIsAddModalOpen(false)
      resetForm()
    }
  });

  return (
    <React.Fragment>
      <div className="page-content users-page">

        <Container fluid>
          <BreadCrumb title="Users" pageTitle=""/>
          <Row>
            <Col>
              <div>
                <Button onClick={() => setIsAddModalOpen(true)} className={"action-button --add-session"}><i
                  className={"ri-add-circle-line align-middle fw-medium"}></i></Button>
              </div>
            </Col>
          </Row>
          <div className={"table-divider"}></div>
          <Row>
            <table className={"table align-middle mb-0"}>
              <thead>
              <tr>
                <th>
                  User Email
                </th>
                <th>
                  User Name
                </th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {
                users.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        {user.email}
                      </td>
                      <td>
                        {user.username}
                      </td>
                      <td>
                        <div className={"d-flex gap-2"}>
                          <Button onClick={() => {
                            setSelectedUser(user)
                            setIsDeleteModal(true)
                          }} color={"danger"} className={"action-button"}><i
                            className={"ri-delete-bin-6-line align-middle"}></i></Button>
                          {/*<button className={"btn btn-sm btn-warning"}><i*/}
                          {/*  className={"ri-edit-2-line align-middle"}></i></button>*/}
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
              </tbody>
            </table>
          </Row>

          <Modal fade={true} isOpen={isAddModalOpen} toggle={() => setIsAddModalOpen(false)} centered={true}>
            <ModalBody className="py-2 px-5">
              <div className="mt-2 text-center">
                <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                  <h4>Add a new user</h4>
                </div>
              </div>
              <Form onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}>
                <div className="mb-3">
                  <Label htmlFor="useremail" className="form-label">Email <span className="text-danger">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter email address"
                    type="email"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.email || ""}
                    invalid={
                      !!(validation.touched.email && validation.errors.email)
                    }
                  />
                  {validation.touched.email && validation.errors.email ? (
                    <FormFeedback type="invalid">
                      <div>{validation.errors.email}</div>
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label htmlFor="username" className="form-label">Username <span
                    className="text-danger">*</span></Label>
                  <Input
                    name="username"
                    type="text"
                    placeholder="Enter username"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.username || ""}
                    invalid={
                      !!(validation.touched.username && validation.errors.username)
                    }
                  />
                  {validation.touched.username && validation.errors.username ? (
                    <FormFeedback type="invalid">
                      <div>{validation.errors.username}</div>
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label htmlFor="userpassword" className="form-label">Password <span
                    className="text-danger">*</span></Label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.password || ""}
                    invalid={
                      !!(validation.touched.password && validation.errors.password)
                    }
                  />
                  {validation.touched.password && validation.errors.password ? (
                    <FormFeedback type="invalid">
                      <div>{validation.errors.password}</div>
                    </FormFeedback>
                  ) : null}

                </div>
                <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                  <button
                    type="submit"
                    className="btn w-sm btn-success"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn w-sm btn-light"
                  >
                    Close
                  </button>
                </div>
              </Form>
            </ModalBody>
          </Modal>
          <DeleteModal onDeleteClick={deleteUser} onCloseClick={() => {
            setSelectedUser(null)
            setIsDeleteModal(false)
          }} show={isDeleteModal}/>

        </Container>
      </div>
    </React.Fragment>
  )
}

export default Users