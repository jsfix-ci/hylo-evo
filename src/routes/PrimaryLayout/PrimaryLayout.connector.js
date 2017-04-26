import { connect } from 'react-redux'
import { fetchCurrentUser, toggleCommunitiesDrawer } from './PrimaryLayout.store'
import { getMe } from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'

function mapStateToProps (state, props) {
  return {
    community: getCommunityForCurrentRoute(state, props),
    currentUser: getMe(state),
    isDrawerOpen: state.communitiesDrawerOpen
  }
}

export default connect(mapStateToProps, {fetchCurrentUser, toggleCommunitiesDrawer})
