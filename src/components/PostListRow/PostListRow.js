import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { isEmpty } from 'lodash/fp'
import { personUrl, topicUrl } from 'util/navigation'
import { humanDate } from 'hylo-utils/text'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import './PostListRow.scss'

const PostListRow = (props) => {
  const {
    routeParams,
    post,
    showDetails,
    voteOnPost,
    expanded
  } = props
  const {
    title,
    details,
    creator,
    createdAt,
    commentersTotal,
    votesTotal,
    myVote,
    topics
  } = post

  if (!creator) { // PostCard guards against this, so it must be important? ;P
    return null
  }

  const creatorUrl = personUrl(creator.id, routeParams.slug)
  const numOtherCommentors = commentersTotal - 1
  const unread = false

  return (
    <div styleName={cx('post-row', { unread, expanded })} onClick={showDetails}>
      <div styleName='votes'>
        <a onClick={voteOnPost} styleName={cx('vote-button', { voted: myVote })}
          data-tip-disable={myVote} data-tip='Upvote this post so more people see it.' data-for='postfooter-tt'>
          <Icon name='ArrowUp' styleName='vote-icon' />
          {votesTotal}
        </a>
      </div>
      <div styleName='content-summary'>
        <div styleName='participants'>
          <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} styleName='avatar' tiny />
          {creator.name} {
            numOtherCommentors > 0
              ? (<span> and <strong>{numOtherCommentors}</strong></span>)
              : null
          }
        </div>
        <h3 styleName='title'>{title}</h3>
        <div styleName='details' dangerouslySetInnerHTML={{ __html: details }} />
      </div>
      <div styleName='meta'>
        {!isEmpty(topics) && (
          <div styleName='topics'>
            {topics.slice(0, 3).map(t =>
              <Link styleName='topic' to={topicUrl(t.name, { groupSlug: routeParams.slug })} key={t.name}>#{t.name}</Link>)}
          </div>
        )}
        <div styleName='timestamp'>
          {humanDate(createdAt)}
        </div>
      </div>
    </div>
  )
}

export default PostListRow