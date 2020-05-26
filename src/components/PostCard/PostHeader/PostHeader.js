import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import moment from 'moment'
import Avatar from 'components/Avatar'
import Dropdown from 'components/Dropdown'
import PostLabel from 'components/PostLabel'
import Highlight from 'components/Highlight'
import FlagContent from 'components/FlagContent'
import Icon from 'components/Icon'
import { personUrl, tagUrl } from 'util/navigation'
import { humanDate } from 'hylo-utils/text'
import './PostHeader.scss'
import { filter, isFunction, isEmpty } from 'lodash'
import cx from 'classnames'

const formatStartDate = (startTime) => {
  const current = moment()
  let start = ''
  if (moment(startTime).isAfter(current)) {
    start = moment(startTime).format('MMM D YYYY')
  }
  return start
}

const formatEndDate = (endTime) => {
  const current = moment()
  let end = ''
  const endFormatted = moment(endTime).format('MMM D YYYY')
  if (moment(endTime).isAfter(current)) {
    end = `ends ${endFormatted}`
  } else if (current.isAfter(moment(endTime))) {
    end = `ended ${endFormatted}`
  }
  return end
}

export default class PostHeader extends PureComponent {
  static defaultProps = {
    routeParams: {}
  }

  state = {
    flaggingVisible: false
  }

  flagPostFunc = () =>
    this.props.canFlag ? () => { this.setState({ flaggingVisible: true }) } : undefined

  render () {
    const {
      routeParams,
      creator,
      createdAt,
      type,
      id,
      startTime,
      endTime,
      fulfilledAt,
      location,
      locationText,
      pinned,
      topics,
      close,
      className,
      editPost,
      deletePost,
      removePost,
      pinPost,
      highlightProps,
      topicsOnNewline,
      announcement
    } = this.props

    if (!creator) return null

    const creatorUrl = personUrl(creator.id, routeParams.slug, routeParams.networkSlug)
    const { flaggingVisible } = this.state
    // Used to generate a link to this post from the backend.
    const flagPostData = {
      slug: routeParams.slug,
      id: id,
      type: 'post'
    }
    const dropdownItems = filter([
      { icon: 'Pin', label: pinned ? 'Unpin' : 'Pin', onClick: pinPost },
      { icon: 'Edit', label: 'Edit', onClick: editPost },
      { icon: 'Flag', label: 'Flag', onClick: this.flagPostFunc() },
      { icon: 'Trash', label: 'Delete', onClick: deletePost, red: true },
      { icon: 'Trash', label: 'Remove From Community', onClick: removePost, red: true }
    ], item => isFunction(item.onClick))

    const canHaveTimes = type === 'offer' || type === 'request' || type === 'resource'
    let timeWindow = ''
    const startDate = startTime && formatStartDate(startTime)
    const endDate = endTime && formatEndDate(endTime)
    if (startDate && endDate) {
      timeWindow = `${type} starts ${startDate} and ${endDate}`
    } else if (endDate) {
      timeWindow = `${type} ${endDate}`
    } else if (startDate) {
      timeWindow = `${type} starts ${startDate}`
    }

    // Formatting location to display in stream view
    let generalLocation = locationText || ''

    if (location) {
      if (location.addressNumber !== null) {
        generalLocation = `${location.addressNumber} ${location.addressStreet}, ${location.city}, ${location.region}`
      } else {
        // Note - Pending location bug fix, can use location city and region
        // generalLocation = `${location.city}, ${location.region}`
        generalLocation = `${location.fullText}`
      }
    }

    return <div styleName='header' className={className}>
      <div styleName='headerMainRow'>
        <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} styleName='avatar' />
        <div styleName='headerText'>
          <Highlight {...highlightProps}>
            <Link to={creatorUrl} styleName='userName'>{creator.name}{creator.tagline && ', '}</Link>
          </Highlight>
          {creator.tagline && <span styleName='userTitle'>{creator.tagline}</span>}
          <div styleName='timestampRow'>
            <span styleName='timestamp'>
              {humanDate(createdAt)}
            </span>
            {locationText && <div><span styleName='locationIcon'><img src='/location-pin-stream.svg' /></span>
              <span styleName='headerLocation'>{generalLocation}</span></div>
            }
            {announcement && <span styleName='announcementSection'>
              <span styleName='announcementSpacer'>•</span>
              <span data-tip='Announcement' data-for='announcement-tt'>
                <Icon name='Announcement' styleName='announcementIcon' />
              </span>
              <ReactTooltip
                effect={'solid'}
                delayShow={550}
                id='announcement-tt' />
            </span>}
            {!topicsOnNewline && !isEmpty(topics) && <TopicsLine topics={topics} slug={routeParams.slug} />}
          </div>
        </div>
        <div styleName='upperRight'>
          {pinned && <Icon name='Pin' styleName='pinIcon' />}
          {fulfilledAt && <PostLabel type={'completed'} styleName='label' />}
          {type && <PostLabel type={type} styleName='label' />}
          {dropdownItems.length > 0 &&
            <Dropdown toggleChildren={<Icon name='More' />} items={dropdownItems} />}
          {close &&
            <a styleName='close' onClick={close}><Icon name='Ex' /></a>}
        </div>
        {flaggingVisible && <FlagContent type='post'
          linkData={flagPostData}
          onClose={() => this.setState({ flaggingVisible: false })} />
        }
      </div>
      {topicsOnNewline && !isEmpty(topics) && <TopicsLine topics={topics} slug={routeParams.slug} newLine />}
      {canHaveTimes && <div styleName='timeWindow'>
        {timeWindow}
      </div>}
    </div>
  }
}

export function TopicsLine ({ topics, slug, newLine }) {
  return <div styleName={cx('topicsLine', { 'newLineForTopics': newLine })}>
    {!newLine && <span styleName='spacer'>•</span>}
    {topics.slice(0, 3).map(t =>
      <Link styleName='topic' to={tagUrl(t.name, slug)} key={t.name}>#{t.name}</Link>)}
  </div>
}
