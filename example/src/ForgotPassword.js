import React from 'react'
import { navigate, Link } from '@reach/router'
import { useForgotPassword } from 'croods-auth'

import Input from './Input'
import Error from './Error'
import basePath from './basePath'

export default () => {
  const [{ sending, error, formProps, emailProps }] = useForgotPassword({
    stateId: 'forgot',
    redirectUrl: '/',
    afterSuccess: () => navigate(`${basePath}/forgot-sent`),
  })

  return (
    <form {...formProps}>
      <h2>Forgot your password?</h2>
      <Input {...emailProps} />
      <Error message={error} />
      <p>
        <Link to={`${basePath}/sign-in`}>{`Go back`}</Link>
      </p>
      <button type="submit" className="btn btn-primary">
        {sending ? 'Sending email...' : 'Send reset instructions'}
      </button>
    </form>
  )
}
