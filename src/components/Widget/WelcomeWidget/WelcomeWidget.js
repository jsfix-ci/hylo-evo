import { TextHelpers } from 'hylo-shared'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ClickCatcher from 'components/ClickCatcher'
import HyloHTML from 'components/HyloHTML'
import './WelcomeWidget.scss'

const { object } = PropTypes

export default class WelcomeWidget extends Component {
  static propTypes = {
    settings: object
  }

  render () {
    const { group, settings = {} } = this.props
    const message = settings.text || `We're happy you're here! Please take a moment to explore this page to see what's alive in our group. Introduce yourself by clicking Create to post a Discussion sharing who you are and what brings you to our group. And don't forget to fill out your profile - so likeminded new friends can connect with you!`
    return (
      <div styleName='welcome-widget'>
        <h2>{settings.title || `Welcome to ${group.name}!`}</h2>
        <ClickCatcher>
          <HyloHTML element='p' html={TextHelpers.markdown(message)} />
        </ClickCatcher>
      </div>
    )
  }
}
