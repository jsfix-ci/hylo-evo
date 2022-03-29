import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, useLocation, useHistory } from 'react-router-dom'
import getSignupState, { SignupState } from 'store/selectors/getSignupState'
import Signup from './Signup'
import VerifyEmail from './VerifyEmail'
import FinishRegistration from './FinishRegistration'
import './Signup.scss'
import Loading from 'components/Loading'

export default function SignupRouter (props) {
  const location = useLocation()
  const history = useHistory()
  const signupState = useSelector(getSignupState)
  const [loading, setLoading] = useState(true)

  // Ensures user is direct to the appropriate Signup screen regardless
  // of which `/signup/*` path navigated to
  useEffect(() => {
    setLoading(true)

    const redirectTo = path => {
      if (path && (path !== location.pathname)) {
        history.push(path)
        return null
      }
    }

    switch (signupState) {
      case SignupState.None: {
        if (location.pathname !== '/signup/verify-email') {
          redirectTo('/signup')
        }
        break
      }
      case SignupState.EmailValidation: {
        redirectTo('/signup/verify-email')
        break
      }
      case SignupState.Registration: {
        redirectTo('/signup/finish')
        break
      }
      // Should never be true as SignupRouter is not active at this state,
      // Routing will have been turned-over to AuthLayoutRouter
      case SignupState.InProgress: {
        redirectTo('/')
        break
      }
    }

    setLoading(false)
  }, [signupState, location.pathname])

  if (loading) return <Loading />

  return (
    <Switch>
      <Route
        exact
        path='/signup'
        component={() => <Signup {...props} />}
      />
      <Route
        exact
        path='/signup/verify-email'
        component={() => <VerifyEmail {...props} />}
      />
      <Route
        exact
        path='/signup/finish'
        component={() => <FinishRegistration {...props} />}
      />
    </Switch>
  )
}
