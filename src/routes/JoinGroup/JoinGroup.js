import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, Redirect } from 'react-router-dom'
import { every, isEmpty } from 'lodash/fp'
import { groupUrl } from 'util/navigation'
import fetchForGroup from 'store/actions/fetchForGroup'
import setReturnToPath from 'store/actions/setReturnToPath'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import getRouteParam from 'store/selectors/getRouteParam'
import { getSignupComplete } from 'store/selectors/getSignupState'
import useInvitation from 'store/actions/useInvitation'
import checkInvitation from 'store/actions/checkInvitation'
import Loading from 'components/Loading'

export const SIGNUP_PATH = '/signup'
export const EXPIRED_INVITE_PATH = '/invite-expired'

export default function JoinGroup (props) {
  const history = useHistory()
  const dispatch = useDispatch()
  const signupComplete = useSelector(getSignupComplete)
  const [redirectTo, setRedirectTo] = useState()

  useEffect(() => {
    (async function () {
      try {
        const invitationTokenAndCode = {
          invitationToken: getQuerystringParam('token', null, props),
          accessCode: getRouteParam('accessCode', null, props)
        }

        if (every(isEmpty, invitationTokenAndCode)) {
          throw new Error('Please provide either a `token` query string parameter or `accessCode` route param')
        }

        if (signupComplete) {
          const result = await dispatch(useInvitation(invitationTokenAndCode))
          const newMembership = result?.payload?.getData()?.membership
          const groupSlug = newMembership?.group?.slug

          if (groupSlug) {
            /*
              `AuthLayoutRouter` will already try and fetch this group due to the
              `/groups/:groupSlug/join/<token>` route matching `:groupSlug` before the
              group has been joined (unauthorized), this could be fixed and this extra
              fetch removed.
            */
            await dispatch(fetchForGroup(groupSlug))
            setRedirectTo(groupUrl(groupSlug, 'explore'))
          } else {
            throw new Error('Join group was unsuccessful')
          }
        } else {
          const result = await dispatch(checkInvitation(invitationTokenAndCode))
          const isValidInvite = result?.payload?.getData()?.valid

          if (isValidInvite) {
            dispatch(setReturnToPath(props.location.pathname + props.location.search))
            setRedirectTo(SIGNUP_PATH)
          } else {
            setRedirectTo(EXPIRED_INVITE_PATH)
          }
        }
      } catch (error) {
        history.goBack()
      }
    })()
  }, [])

  if (redirectTo) return <Redirect to={redirectTo} />

  return <Loading />
}
