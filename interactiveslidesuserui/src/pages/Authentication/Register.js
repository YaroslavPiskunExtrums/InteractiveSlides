import React, {useEffect} from "react";
import {Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback, Button} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import {useFormik} from "formik";

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// action
import {registerUser, apiError, resetRegisterFlag} from "../../store/actions";

//redux
import {useSelector, useDispatch} from "react-redux";

import {Link, useNavigate} from "react-router-dom";

//import images 
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

const Register = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      username: '',
      password: '',
      confirm_password: '',
      company_name: '',
      company_domain: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      username: Yup.string().required("Please Enter Your Username"),
      password: Yup.string().required("Please Enter Your Password"),
      company_name: Yup.string().required("Please Enter Your Company Name"),
      company_domain: Yup.string().required("Please Enter Your Company Domain"),
      confirm_password: Yup.string().when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Confirm Password Isn't Match"
        )
      })
    }),
    onSubmit: async (values) => {

      const apiUrl = window.location.hostname.indexOf("app.slidex.ai") !== -1  ? `${window.location.origin}/addin` : "http://localhost:5000"

      const registerResponse = await fetch(`${apiUrl}/api/auth/sign-up-company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      })
      const registerResponseJson = await registerResponse.json()
      console.log(registerResponseJson)
      dispatch(registerUser(values));
    }
  });

  const {error, registrationError, success} = useSelector(state => ({
    registrationError: state.Account.registrationError,
    success: state.Account.success,
    error: state.Account.error
  }));

  useEffect(() => {
    dispatch(apiError(""));
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setTimeout(() => history("/login"), 3000);
    }

    setTimeout(() => {
      dispatch(resetRegisterFlag());
    }, 3000);

  }, [dispatch, success, error, history]);

  document.title = "Basic SignUp | SlideX";

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="20"/>
                    </Link>
                  </div>
                  <p className="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">

                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Create New Account</h5>
                      <p className="text-muted">Get your free velzon account now</p>
                    </div>
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        className="needs-validation" action="#">

                        {success && success ? (
                          <>
                            {toast("Your Redirect To Login Page...", {
                              position: "top-right",
                              hideProgressBar: false,
                              className: 'bg-success text-white',
                              progress: undefined,
                              toastId: ""
                            })}
                            <ToastContainer autoClose={2000} limit={1}/>
                            <Alert color="success">
                              Register User Successfully and Your Redirect To Login Page...
                            </Alert>
                          </>
                        ) : null}

                        {error && error ? (
                          <Alert color="danger">
                            <div>
                              {/* {registrationError} */}
                              Email has been Register Before, Please Use Another Email Address...
                            </div>
                          </Alert>
                        ) : null}

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
                              validation.touched.email && validation.errors.email ? true : false
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
                              validation.touched.username && validation.errors.username ? true : false
                            }
                          />
                          {validation.touched.username && validation.errors.username ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.username}</div>
                            </FormFeedback>
                          ) : null}

                        </div>

                        <div className="mb-3">
                          <Label htmlFor="company_name" className="form-label">Company name <span
                            className="text-danger">*</span></Label>
                          <Input
                            name="company_name"
                            type="text"
                            placeholder="Enter company name"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.company_name || ""}
                            invalid={
                              !!(validation.touched.company_name && validation.errors.company_name)
                            }
                          />
                          {validation.touched.company_name && validation.errors.company_name ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.company_name}</div>
                            </FormFeedback>
                          ) : null}

                        </div>

                        <div className="mb-3">
                          <Label htmlFor="company_domain" className="form-label">Company domain<span
                            className="text-danger">*</span></Label>
                          <Input
                            name="company_domain"
                            type="text"
                            placeholder="Enter company domain"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.company_domain || ""}
                            invalid={
                              !!(validation.touched.company_domain && validation.errors.company_domain)
                            }
                          />
                          {validation.touched.company_domain && validation.errors.company_domain ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.company_domain}</div>
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
                              validation.touched.password && validation.errors.password ? true : false
                            }
                          />
                          {validation.touched.password && validation.errors.password ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.password}</div>
                            </FormFeedback>
                          ) : null}

                        </div>

                        <div className="mb-2">
                          <Label htmlFor="confirmPassword" className="form-label">Confirm Password <span
                            className="text-danger">*</span></Label>
                          <Input
                            name="confirm_password"
                            type="password"
                            placeholder="Confirm Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.confirm_password || ""}
                            invalid={
                              validation.touched.confirm_password && validation.errors.confirm_password ? true : false
                            }
                          />
                          {validation.touched.confirm_password && validation.errors.confirm_password ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.confirm_password}</div>
                            </FormFeedback>
                          ) : null}

                        </div>

                        <div className="mt-4">
                          <button className="btn btn-success w-100" type="submit">Sign Up</button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-4 text-center">
                  <p className="mb-0">Already have an account ? <Link to="/login"
                                                                      className="fw-semibold text-primary text-decoration-underline"> Signin </Link>
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default Register;
