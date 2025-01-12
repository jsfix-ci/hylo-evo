import { isEmpty, get } from 'lodash/fp'
import { connect } from 'react-redux'
import getRouteParam from 'store/selectors/getRouteParam'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { cancel, confirm } from './Consent.store'

export function mapStateToProps (state, props) {
  let missingOIDCScopes = getQuerystringParam('missingScopes', state, props) || []

  if (!isEmpty(missingOIDCScopes)) {
    if (!Array.isArray(missingOIDCScopes)) {
      missingOIDCScopes = [missingOIDCScopes]
    }
    // remove openid and offline_access from scopes
    missingOIDCScopes = missingOIDCScopes.filter(s => !['openid', 'offline_access'].includes(s))
  }

  let missingOIDCClaims = getQuerystringParam('missingClaims', state, props) || []
  if (Array.isArray(missingOIDCClaims) && missingOIDCClaims.length) {
    missingOIDCClaims = missingOIDCClaims.filter(c => !['sub', 'sid', 'auth_time', 'acr', 'amr', 'iss'].includes(c))
  }

  const missingResourceScopes = getQuerystringParam('missingResourceScopes', state, props) || []
  const previousAuthsOnly = !isEmpty(missingOIDCScopes) && !isEmpty(missingOIDCClaims) && !isEmpty(missingResourceScopes)
  const offlineAccessRequested = get('offline_access', getQuerystringParam('scope', state, props))

  return {
    missingOIDCClaims,
    missingOIDCScopes,
    missingResourceScopes,
    appName: getQuerystringParam('name', state, props) || 'The App',
    offlineAccessRequested,
    previousAuthsOnly,
    oauthUID: getRouteParam('uid', state, props)
  }
}

export const mapDispatchToProps = {
  cancel,
  confirm
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    cancel: () => { return dispatchProps.cancel(stateProps.oauthUID) },
    confirm: () => { return dispatchProps.confirm(stateProps.oauthUID) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
