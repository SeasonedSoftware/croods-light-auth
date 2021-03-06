import React, { useState, Fragment } from 'react'
import { Auth, useUserFromContext } from 'croods-auth'
import { Router, navigate } from '@reach/router'

import basePath from './basePath'
import Alert from './Alert'
import Start from './Start'
import OtherPage from './OtherPage'
import EditProfile from './EditProfile'
import SignIn from './SignIn'
import SignUp from './SignUp'
import ForgotPassword from './ForgotPassword'
import ForgotSent from './ForgotSent'
import ResetPassword from './ResetPassword'

export default () => {
  const [alert, setAlert] = useState()
  const redirect = (path, message = 'You must sign in first') => async () => {
    await navigate(`${basePath}${path}`)
    setAlert({ message, type: 'danger' })
  }

  const [{ status }] = useUserFromContext()

  return (
    <Fragment>
      <Alert alert={alert} close={() => setAlert(null)} />
      {status}

      <Router basepath={basePath}>
        <Auth Component={Start} path="/" unauthorized={redirect('/sign-in')} />
        <Auth
          Component={OtherPage}
          unauthorized={currentUser =>
            currentUser
              ? redirect('/', 'You are not authorized to access this page')
              : redirect('/sign-in')()
          }
          unauthorize={currentUser => currentUser.email === 'foo@bar.com'}
          authorizing="Checking foo@bar.com"
          path="/other-page"
        />
        <Auth
          Component={EditProfile}
          setAlert={setAlert}
          path="/edit-profile"
          unauthorized={redirect('/sign-in')}
        />
        <SignIn setAlert={setAlert} path="/sign-in" />
        <SignUp setAlert={setAlert} path="/sign-up" />
        <ForgotSent path="/forgot-sent" />
        <ForgotPassword path="/forgot-password" />
        <ResetPassword path="/reset-password" />
      </Router>
    </Fragment>
  )
}
