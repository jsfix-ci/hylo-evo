import React from 'react'
import './component.scss'
import FeedItem from 'components/FeedItem'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import ScrollListener from 'components/ScrollListener'
import TabBar from './TabBar'
import { bgImageStyle } from 'util/index'
import { throttle } from 'lodash/fp'

export default class Feed extends React.Component {
  static defaultProps = {
    feedItems: []
  }

  componentDidMount () {
    this.props.fetchFeedItems(this.props.slug)
  }

  fetchMoreFeedItems () {
    this.props.fetchFeedItems(this.props.slug, {
      // cursor: this.props.feedItems.slice(-1)[0].id
    })
  }

  render () {
    const { feedItems, community, currentUser } = this.props

    const feedId = 'feed'

    return <div styleName='feed' id={feedId}>
      <CommunityBanner community={community} currentUser={currentUser} />
      <TabBar styleName='tabBar' feedId={feedId} />
      <div styleName='feedItems'>
        {feedItems.map(feedItem =>
          <FeedItem feedItem={feedItem} styleName='feedItem' key={feedItem.id} />)}
      </div>
      <ScrollListener elementId={feedId} onBottom={() => this.fetchMoreFeedItems()} />
    </div>
  }
}

export const CommunityBanner = ({ community, currentUser }) => {
  return <div styleName='banner'>
    <div style={bgImageStyle(community.bannerUrl)} styleName='image'>
      <div styleName='fade'><div styleName='fade2' /></div>
      <div styleName='header'>
        <div styleName='logo' style={bgImageStyle(community.avatarUrl)} />
        <div styleName='header-text'>
          <span styleName='header-name'>{community.name}</span>
          {community.location && <div styleName='header-location'>
            <Icon name='Location' styleName='header-icon' />
            {community.location}
          </div>}
        </div>
      </div>
    </div>
    <PostPrompt currentUser={currentUser} />
  </div>
}

export const PostPrompt = ({ currentUser }) => {
  if (!currentUser) return null
  return <div styleName='postPrompt' onClick={() => console.log('Open Post Form')}>
    <div styleName='shadow' />
    <RoundImage url={currentUser.avatarUrl} small styleName='prompt-image' />
    Hi {currentUser.firstName}, what's on your mind?
  </div>
}
