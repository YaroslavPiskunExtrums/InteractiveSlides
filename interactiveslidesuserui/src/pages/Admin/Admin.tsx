import './_admin.scss'
import React, { useEffect } from 'react'
import {
  Button,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from 'reactstrap'
import BreadCrumb from '../../Components/Common/BreadCrumb'
import adminStore from './admin.store'
import getUserObjectFromSession from '../../helpers/userObjectFromJwt'
import AddUserModal from './components/AddUserModal/AddUserModal'
import DeleteModal from '../../Components/Common/DeleteModal'
import apiLink from '../../helpers/api_links'
import { authFetch } from 'src/lib/util/auth'

const Admin = () => {
  const { users, getUsers } = adminStore()

  const [addUserModalShow, setAddUserModalShow] = React.useState(false)
  const [deleteUserModal, setDeleteUserModal] = React.useState(false)
  const [loginModal, setLoginModal] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState(null)
  const [searchUser, setSearchUser] = React.useState<string>('')

  const [userHash, setUserHash] = React.useState<string>('')
  const [hashCopied, setHashCopied] = React.useState<boolean>(false)


  useEffect(() => {
    if (getUserObjectFromSession().is_super_user) {
      Promise.all([getUsers()]).then((res) => {
        console.log('ALL DATA IS FETCHED')
      })
    } else {
      window.location.href = '/'
    }
  }, [])

  const copyHashToClipboard = async () => {
    await navigator.clipboard.writeText(userHash)
    if(!hashCopied) setHashCopied(true)
    setTimeout(() => {
      setHashCopied(false)
    }, 1700)
  }
  const showHash = async (user: { id: string, username: string }) => {
    console.log('showHash')
    try {
      setSelectedUser(user)
      const sendUserId = new URLSearchParams({ userId: user.id })
      const response = await authFetch(`/api/super-user/resolve-one-time-hash?${sendUserId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 200) {
        const { hash } = await response.json()
        setUserHash(await hash)
      }
    } catch (e) {

      console.log(e)
    }
  }

  const deleteUser = async () => {
    try {
      const removeUserRequest = await authFetch(`/api/super-user/delete-user/${selectedUser?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (removeUserRequest.status === 200) {
        await getUsers()
        setSelectedUser(null)
        setDeleteUserModal(false)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onLoginAsUser = async () => {
    try {
      const loginAsUserRequest = await authFetch(`/api/super-user/visit-as-user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser?.id,
          refreshToken: JSON.parse(sessionStorage.getItem('authUser')).refreshToken,
          accessToken: JSON.parse(sessionStorage.getItem('authUser')).accessToken,
        }),
      })
      const res = await loginAsUserRequest.json()
      if (res.accessToken) {
        sessionStorage.setItem('authUser', JSON.stringify(res))
        window.location.reload()
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <React.Fragment>
      <div className='page-content admin-page'>
        <Container fluid>
          <BreadCrumb title='Admin panel' pageTitle='' />
          <Row>
            <Col xs={12}>
              <div className={'admin-page_main-content'}>
                <div className={'admin-page_main-content_buttons mb-3'}>
                  <Button
                    onClick={() => {
                      setAddUserModalShow(true)
                    }}
                    className={'action-button --add-session'}
                  >
                    <i className={'ri-add-circle-line align-middle fw-medium'}></i>
                  </Button>
                </div>
                <div className={'admin-page_main-content_inputs'}>
                  <input
                    onChange={(e) => {
                      setSearchUser(e.target.value)
                    }}
                    placeholder={'Search user'}
                    className={'form-control'}
                  />
                </div>
                <Table className={''}>
                  <thead>
                  <tr>
                    <th>User email</th>
                    <th>User name</th>
                    <th>User company</th>
                    <th>Company owner</th>
                    <th></th>
                  </tr>
                  </thead>

                  <tbody>
                  {users
                    .filter((user) => {
                      return user.id !== getUserObjectFromSession()?.id
                    })
                    .filter((user) => {
                      return (
                        user.email.toLowerCase().includes(searchUser.toLowerCase()) ||
                        user.username.toLowerCase().includes(searchUser.toLowerCase())
                      )
                    })
                    .map((user, i) => {
                      return (
                        <tr key={i}>
                          <td>{user.email}</td>
                          <td>{user.username}</td>
                          <td>{user.company_name}</td>
                          <td>{user.company_owner_id === user.id ? 'Yes' : 'No'}</td>
                          <td>
                            <div className={'d-flex gap-3'}>
                              <Button
                                className={'action-button --with-text --delete-presentation-button'}
                                onClick={() => {
                                  setSelectedUser(user)
                                  setLoginModal(true)
                                }}
                              >
                                <i className='ri-login-circle-line align-middle fw-medium'></i>
                                Login as
                              </Button>
                              {
                                selectedUser?.id === user.id && userHash ?
                                  <div className={'hash-field'}>
                                    <input
                                      type={'text'}
                                      value={userHash}
                                      readOnly
                                      style={{ cursor: 'pointer' }}
                                      onClick={async () => {
                                        await copyHashToClipboard()
                                      }}
                                      className={'form-control'}
                                    />
                                    <Button
                                      className={'action-button --delete-presentation-button'}
                                      onClick={async () => {
                                        await copyHashToClipboard()
                                      }}
                                    >
                                      {
                                        hashCopied ?
                                          <i className={'ri-check-fill align-middle fw-medium'}></i>
                                          :
                                          <i className='ri-file-copy-line align-middle fw-medium'></i>
                                      }
                                    </Button>
                                    <Button
                                      className={'action-button --delete-presentation-button'}
                                      color={'danger'}
                                      onClick={() => {
                                        setUserHash('')
                                        setSelectedUser(null)
                                      }}
                                    >
                                      <i className='ri-close-line align-middle fw-medium'></i>
                                    </Button>
                                  </div>
                                  :
                                  <Button
                                    className={'action-button --with-text --delete-presentation-button'}
                                    color={'success'}
                                    onClick={async () => {
                                      await showHash(user)
                                    }}
                                  >
                                    <i className='ri-hashtag align-middle fw-medium'></i>
                                    Generate one-time hash
                                  </Button>
                              }

                              <Button
                                className={'action-button --with-text --delete-presentation-button'}
                                color={'danger'}
                                onClick={() => {
                                  setSelectedUser(user)
                                  setDeleteUserModal(true)
                                }}
                              >
                                <i className='ri-delete-bin-line align-middle fw-medium'></i>
                                Delete user
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          {addUserModalShow && (
            <AddUserModal modalShow={addUserModalShow} onClose={() => setAddUserModalShow(false)} />
          )}
          {deleteUserModal && (
            <DeleteModal
              onDeleteClick={deleteUser}
              onCloseClick={() => {
                setSelectedUser(null)
                setDeleteUserModal(false)
              }}
              show={deleteUserModal}
            />
          )}
          {loginModal && (
            <Modal
              toggle={() => {
                setSelectedUser(null)
                setLoginModal(false)
              }}
              fade
              centered
              isOpen={true}
            >
              <ModalHeader>Log in as user</ModalHeader>
              <ModalBody>Do you want to log in as user {selectedUser?.username}?</ModalBody>
              <ModalFooter>
                <div className={'d-flex gap-3'}>
                  <Button onClick={onLoginAsUser}>Yes</Button>
                  <Button
                    onClick={() => {
                      setSelectedUser(null)
                      setLoginModal(false)
                    }}
                    outline
                    color='secondary'
                  >
                    No
                  </Button>
                </div>
              </ModalFooter>
            </Modal>
          )}
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Admin
