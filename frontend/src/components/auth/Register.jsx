import React, { useEffect, useState } from 'react'
import { useRegisterMutation } from '../../redux/api/authApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MetaData from '../layout/MetaData'

const Register = () => {

  const navigate = useNavigate()

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  })

  const { name, email, password } = user;

  const { isAuthenticated } = useSelector((state) => state.auth)
  const [register, { isLoading, error }] = useRegisterMutation()

  const submitHandler = (e) => {
    e.preventDefault();
    const registerData = {
      name, email, password
    };

    register(registerData)
  }

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
    if (error) {
      toast.error(error?.data?.message)
    }
  }, [error, isAuthenticated])

  return (
    <>
      <MetaData title={"Register"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow rounded bg-body"
            onSubmit={submitHandler}
          >
            <h2 className="mb-4">Register</h2>
            <div className="mb-3">
              <label htmlFor="name_field" className="form-label">Name</label>
              <input
                type="name"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email_field" className="form-label">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={onChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password_field" className="form-label">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={onChange}
              />
            </div>

            <a href="/password/forgot" className="float-end mb-4">Forgot Password?</a>

            <button id="login_button" type="submit" className="btn w-100 py-2" disabled={isLoading}>
              {isLoading ? "Authenticating" : "SIGNUP"}
            </button>

            <div className="my-3">
              <a href="/register" className="float-end">Already have an account?</a>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Register