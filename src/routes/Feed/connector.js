import { connect } from 'react-redux'
// import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get } from 'lodash/fp'
import orm from 'store/models'
import { fetchFeedItems } from './actions'

export const getFeedItems = ormCreateSelector(orm, (session) => {
  return session.FeedItem.all().toModelArray()
})

function mapStateToProps (state, { match, community }) {
  const slug = get('params.slug', match) || get('slug', community)
  return {
    feedItems: getFeedItems(state.orm),
    slug
  }
}

export const mapDispatchToProps = { fetchFeedItems }

export default connect(mapStateToProps, mapDispatchToProps)
