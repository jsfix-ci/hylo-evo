import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './NotificationsDropdown.scss'
import { TextHelpers } from 'hylo-shared'
import cx from 'classnames'
import RoundImage from 'components/RoundImage'
import { firstName } from 'store/models/Person'
import TopNavDropdown from '../TopNavDropdown'
import { find, isEmpty, some } from 'lodash/fp'
import {
  ACTION_NEW_COMMENT,
  ACTION_TAG,
  ACTION_JOIN_REQUEST,
  ACTION_APPROVED_JOIN_REQUEST,
  ACTION_MENTION,
  ACTION_COMMENT_MENTION,
  ACTION_ANNOUNCEMENT,
  ACTION_DONATION_TO,
  ACTION_DONATION_FROM,
  ACTION_EVENT_INVITATION,
  ACTION_GROUP_CHILD_GROUP_INVITE,
  ACTION_GROUP_CHILD_GROUP_INVITE_ACCEPTED,
  ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST,
  ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST_ACCEPTED
} from 'store/models/Notification'
import NoItems from 'routes/AuthLayoutRouter/components/TopNav/NoItems'
import LoadingItems from 'routes/AuthLayoutRouter/components/TopNav/LoadingItems'

const NOTIFICATION_TEXT_MAX = 76

export default class NotificationsDropdown extends Component {
  static propTypes = {
    fetchNotifications: PropTypes.func,
    markActivityRead: PropTypes.func,
    markAllActivitiesRead: PropTypes.func,
    renderToggleChildren: PropTypes.func,
    notifications: PropTypes.array,
    className: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      showingUnread: false
    }
  }

  onToggle = nowActive => {
    if (nowActive) this.setState({ lastOpenedAt: new Date() })
  }

  componentDidMount = () => {
    const { fetchNotifications } = this.props
    fetchNotifications()
  }

  hasUnread () {
    if (isEmpty(this.props.notifications)) {
      const { currentUser } = this.props
      return currentUser && currentUser.newNotificationCount > 0
    }

    const { lastOpenedAt } = this.state
    const isUnread = n =>
      n.activity && n.activity.unread && (!lastOpenedAt || new Date(n.createdAt) > lastOpenedAt)

    return some(isUnread, this.props.notifications)
  }

  render () {
    const {
      renderToggleChildren,
      className,
      goToNotification,
      markActivityRead,
      markAllActivitiesRead,
      pending
    } = this.props
    var { notifications } = this.props
    const { showingUnread } = this.state

    const showRecent = () => this.setState({ showingUnread: false })
    const showUnread = () => this.setState({ showingUnread: true })

    if (showingUnread) {
      notifications = notifications.filter(n => n.activity.unread)
    }

    const message = `No ${showingUnread ? 'unread ' : ''}notifications`

    const onClick = notification => {
      if (notification.activity.unread) markActivityRead(notification.activity.id)
      goToNotification(notification)
      this.refs.dropdown.toggle(false)
    }

    let body
    if (pending) {
      body = <LoadingItems />
    } else if (isEmpty(notifications)) {
      body = <NoItems message={message} />
    } else {
      body = <div styleName='notifications'>
        {notifications.map(notification => <Notification
          notification={notification}
          onClick={onClick}
          key={notification.id} />)}
      </div>
    }

    return <TopNavDropdown ref='dropdown'
      className={className}
      onToggle={this.onToggle}
      toggleChildren={renderToggleChildren(this.hasUnread())}
      header={
        <div styleName='header-content'>
          <span onClick={showRecent} styleName={cx('tab', { active: !showingUnread })}>
            Recent
          </span>
          <span onClick={showUnread} styleName={cx('tab', { active: showingUnread })}>
            Unread
          </span>
          <span onClick={markAllActivitiesRead} styleName='mark-read'>Mark all as read</span>
        </div>}
      body={body}
    />
  }
}

export function Notification ({ notification, onClick }) {
  const { activity: { unread, actor } } = notification

  return <li styleName={cx('notification', { unread })}
    onClick={() => onClick(notification)}>
    <div styleName='image-wraper'>
      <RoundImage url={actor.avatarUrl} />
    </div>
    <div styleName='content'>
      <NotificationHeader notification={notification} />
      <NotificationBody notification={notification} />
      <div styleName='date'>{TextHelpers.humanDate(notification.createdAt)}</div>
    </div>
  </li>
}

export function NotificationHeader ({ notification }) {
  const { activity: { action, actor, post, meta: { reasons } } } = notification
  switch (action) {
    case ACTION_NEW_COMMENT:
      return <div styleName='header'>
        New Comment on <span styleName='bold'>{post.title}</span>
      </div>
    case ACTION_TAG:
      const tagReason = find(r => r.startsWith('tag: '), reasons)
      const tag = tagReason.split(': ')[1]
      return <div styleName='header'>
        New Post in <span styleName='bold'>#{tag}</span>
      </div>
    case ACTION_JOIN_REQUEST:
      return <div styleName='header'>
        New Join Request
      </div>
    case ACTION_APPROVED_JOIN_REQUEST:
      return <div styleName='header'>
        Join Request Approved
      </div>
    case ACTION_MENTION:
      return <div styleName='header'>
        <span styleName='bold'>{actor.name} </span>
        mentioned you
      </div>
    case ACTION_COMMENT_MENTION:
      return <div styleName='header'>
        <span styleName='bold'>{actor.name} </span>
        mentioned you in a comment on
        <span styleName='bold'> {post.title}</span>
      </div>
    case ACTION_ANNOUNCEMENT:
      return <div styleName='header'>
        <span styleName='bold'>{actor.name} </span>
        sent an announcement
      </div>
    case ACTION_DONATION_TO:
      return <div styleName='header'>
        <span styleName='bold'>You </span>
        contributed to a project
      </div>
    case ACTION_DONATION_FROM:
      return <div styleName='header'>
        <span styleName='bold'>{actor.name} </span>
        contributed to your project
      </div>
    case ACTION_EVENT_INVITATION:
      return <div styleName='header'>
        <span styleName='bold'>{actor.name} </span>
        invited you to an event
      </div>
    case ACTION_GROUP_CHILD_GROUP_INVITE:
      return <div styleName='header'>
        Your group has been invited
      </div>
    case ACTION_GROUP_CHILD_GROUP_INVITE_ACCEPTED:
      return <div styleName='header'>
        New Group Joined
      </div>
    case ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST:
      return <div styleName='header'>
        Group Requesting to Join
      </div>
    case ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST_ACCEPTED:
      return <div styleName='header'>
        New Group Joined
      </div>
  }

  return null
}

export const truncateHTML = html => TextHelpers.presentHTMLToText(html, { truncate: NOTIFICATION_TEXT_MAX })

export const truncateText = text => TextHelpers.truncateText(text, NOTIFICATION_TEXT_MAX)

export function NotificationBody ({ notification }) {
  const { activity: { action, actor, post, comment, group, otherGroup, contributionAmount } } = notification

  switch (action) {
    case ACTION_NEW_COMMENT:
    case ACTION_COMMENT_MENTION:
      var text = truncateHTML(comment.text)
      return <div styleName='body'>
        <span styleName='bold'>{firstName(actor)}</span> wrote: "{text}"
      </div>
    case ACTION_TAG:
    case ACTION_MENTION:
      text = truncateText(post.title)
      return <div styleName='body'>
        <span styleName='bold'>{firstName(actor)}</span> wrote: "{text}"
      </div>
    case ACTION_JOIN_REQUEST:
      return <div styleName='body'>
        <span styleName='bold'>{actor.name} </span>
        asked to join
        <span styleName='bold'> {group.name}</span>
      </div>
    case ACTION_APPROVED_JOIN_REQUEST:
      return <div styleName='body'>
        <span styleName='bold'>{actor.name} </span>
        approved your request to join
        <span styleName='bold'> {group.name}</span>
      </div>
    case ACTION_ANNOUNCEMENT:
      text = truncateText(post.title)
      return <div styleName='body'>
        <span styleName='bold'>{firstName(actor)}</span> wrote: "{text}"
      </div>
    case ACTION_DONATION_TO:
      text = truncateText(post.title)
      return <div styleName='body'>
        <span styleName='bold'>You</span> contributed ${contributionAmount / 100} to "{text}"
      </div>
    case ACTION_DONATION_FROM:
      text = truncateText(post.title)
      return <div styleName='body'>
        <span styleName='bold'>{actor.name}</span> contributed ${contributionAmount / 100} to "{text}"
      </div>
    case ACTION_EVENT_INVITATION:
      text = truncateText(post.title)
      return <div styleName='body'>
        <span styleName='bold'>{firstName(actor)}</span> invited you to: "{text}"
      </div>
    case ACTION_GROUP_CHILD_GROUP_INVITE:
      return <div styleName='body'>
        <span styleName='bold'>{group.name}</span> has invited <span styleName='bold'>{otherGroup.name}</span> to join it
      </div>
    case ACTION_GROUP_CHILD_GROUP_INVITE_ACCEPTED:
      return <div styleName='body'>
        <span styleName='bold'>{otherGroup.name}</span> has joined <span styleName='bold'>{group.name}</span>!
      </div>
    case ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST:
      return <div styleName='body'>
        <span styleName='bold'>{group.name}</span> has requested to join <span styleName='bold'>{otherGroup.name}</span>
      </div>
    case ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST_ACCEPTED:
      return <div styleName='body'>
        <span styleName='bold'>{group.name}</span> has joined <span styleName='bold'>{otherGroup.name}</span>!
      </div>
  }

  return null
}
