import { isEmpty } from 'lodash/fp'
import React, { useState } from 'react'
import { formatError } from '../../util'
import Button from 'components/Button'
import './Consent.scss'

export default function Consent (props) {
  const [error, setError] = useState(null)

  const submit = () => {
    props.confirm().then((results) => {
      if (results.error) {
        setError(results.error)
        console.error('Something weird happened during consent process', results.error)
      } else if (results.payload && results.payload.redirectTo) {
        window.location.href = results.payload.redirectTo
      } else {
        console.error('Something weird happened during consent process')
      }
    })
  }

  const cancel = () => {
    props.cancel().then((results) => {
      window.location.href = results.payload.redirectTo
    })
  }

  const { appName, className, missingOIDCClaims, missingOIDCScopes, missingResourceScopes, offlineAccessRequested, previousAuthsOnly } = props

  return <div className={className}>
    <div styleName='formWrapper'>
      <h1 styleName='title'>{appName} wants access to your Hylo account</h1>
      {error && formatError(error, 'Login')}

      <div>
        {previousAuthsOnly
          ? <p>{appName} is asking you to confirm previously given authorization</p>
          : ''
        }

        {!isEmpty(missingOIDCScopes)
          ? <div><h3>This will allow {appName} to:</h3>
            <ul>
              {missingOIDCScopes.map((scope) =>
                <li key={scope}>
                  {scope === 'profile' ? 'Access your profile, including your name and image. '
                    : scope === 'address' ? 'Access to your physical address.'
                      : scope === 'email' ? 'Access to your email address.'
                        : scope === 'phone' ? 'Access to your phone number.'
                          : ''}
                </li>
              )}
            </ul>
          </div>
          : ''
        }

        {!isEmpty(missingOIDCClaims)
          ? <div>
            <h3>Claims:</h3>
            <ul>
              {missingOIDCClaims.map((claim) => {
                return <li key={claim}>{claim}</li>
              })}
            </ul>
          </div>
          : ''
        }

        {!isEmpty(missingResourceScopes)
          ? Object.keys(missingResourceScopes).map(indicator => <div key={indicator}>
            <h3>{indicator}</h3>
            <ul>
              {missingResourceScopes[indicator].map(scope => <li key={scope}>{scope}</li>)}
            </ul>
          </div>)
          : ''
        }

        {offlineAccessRequested
          ? <div>
            {appName} is asking to have offline access to Hylo
            {isEmpty(missingOIDCScopes) || missingOIDCScopes.includes('offline_access')
              ? <p>(which you've previously granted)</p>
              : ''
            }
          </div>
          : ''
        }
      </div>

      <Button label='Cancel' color='dark-gray' narrow onClick={cancel} />

      <Button styleName='submit' label='Allow' onClick={submit} />
    </div>
  </div>
}
