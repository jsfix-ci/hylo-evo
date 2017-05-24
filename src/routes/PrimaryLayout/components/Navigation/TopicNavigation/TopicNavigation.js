import React, { Component } from 'react'
const { array, func, string } = React.PropTypes
import { get } from 'lodash/fp'

import Icon from 'components/Icon'
import Badge from 'components/Badge'
import { Link } from 'react-router-dom'
import { tagUrl, topicsUrl } from 'util/index'
import s from './TopicNavigation.scss' // eslint-disable-line no-unused-vars
import badgeHoverStyles from '../../../../../components/Badge/component.scss'

export default class TopicNavigation extends Component {
  static propTypes = {
    subscriptions: array,
    fetchSubscriptions: func,
    clearBadge: func,
    slug: string
  }

  componentDidMount () {
    this.props.fetchSubscriptions()
  }

  componentDidUpdate (prevProps) {
    if (get('slug', this.props) !== get('slug', prevProps)) {
      this.props.fetchSubscriptions()
    }
  }

  render () {
    const { subscriptions, clearBadge, slug } = this.props

    return <div styleName='s.topicNavigation'>
      <div styleName='s.header'>
        <Icon name='Topics' styleName='s.icon' />
        Topics
      </div>
      <ul styleName='s.topics'>
        {subscriptions.map(sub => <li key={sub.topic.name}>
          <Link styleName='s.topic' className={badgeHoverStyles.parent}
            to={tagUrl(sub.topic.name, slug)}
            onClick={() => sub.newPostCount > 0 && clearBadge(sub.id)}>
            <span styleName='s.name'>#{sub.topic.name}</span>
            {sub.newPostCount > 0 && <Badge number={sub.newPostCount} styleName='s.badge' />}
          </Link>
        </li>)}
      </ul>
      <div styleName='s.addTopic'>
        <Link to={topicsUrl(slug)}>see all</Link>
      </div>
    </div>
  }
}
