import { deletePost, removePost, pinPost, getCommunity } from './PostHeader.store'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { removePostFromUrl, postUrl } from 'util/index'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const community = getCommunity(state, props)

  return {
    currentUser: getMe(state, props),
    community
  }
}

export function mapDispatchToProps (dispatch) {
  const closeUrl = removePostFromUrl(window.location.pathname)
  const deletePostWithConfirm = id => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(id))
      .then(() => dispatch(push(closeUrl)))
    }
  }
  const editPost = (id, slug, opts = {}) =>
    dispatch(push(postUrl(id, slug, {action: 'edit', ...opts})))

  return {
    deletePost: deletePostWithConfirm,
    editPost,
    removePost: (postId, slug) => dispatch(removePost(postId, slug)),
    pinPost: (postId, communityId) => dispatch(pinPost(postId, communityId))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser, community } = stateProps
  const { id, creator, slug, type, networkSlug } = ownProps
  const { deletePost, editPost, removePost, pinPost } = dispatchProps
  const isCreator = currentUser && creator && currentUser.id === creator.id
  const canEdit = isCreator
  const canModerate = currentUser && currentUser.canModerate(community)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deletePost: isCreator ? () => deletePost(id) : null,
    editPost: canEdit ? () => editPost(id, slug, {networkSlug, postTypeContext: type}) : null,
    canFlag: !isCreator,
    pinPost: canModerate && community ? () => pinPost(id, community.id) : null,
    removePost: !isCreator && canModerate ? () => removePost(id, slug) : null,
    canEdit
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
