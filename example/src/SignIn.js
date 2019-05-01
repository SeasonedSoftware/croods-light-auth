import React from 'react'
import { navigate, Link } from '@reach/router'
import { useSignIn } from 'croods-light-auth'

import Input from './Input'
import basePath from './basePath'

export default () => {
  const [
    { signingIn, error, emailProps, passwordProps, formProps },
  ] = useSignIn({ afterSuccess: () => navigate(`${basePath}/`) })

  return (
    <form {...formProps}>
      <h2>Sign In</h2>
      <Input {...emailProps} label="Email address" />
      <Input {...passwordProps} error={error} />
      <p>
        <Link to={`${basePath}/sign-up`}>{`Don't have an account?`}</Link>
      </p>
      <p>
        <Link to={`${basePath}/forgot-password`}>Forgot your password?</Link>
      </p>
      <button type="submit" className="btn btn-primary">
        {signingIn ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}