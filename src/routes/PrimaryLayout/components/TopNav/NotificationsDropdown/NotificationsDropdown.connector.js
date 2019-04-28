import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import notificationsQuery from 'graphql/queries/notificationsQuery.graphql'
import markActivityReadMutation from 'graphql/mutations/markActivityReadMutation.graphql'
import markAllActivitiesReadMutation from 'graphql/mutations/markAllActivitiesReadMutation.graphql'
import getMe from 'store/selectors/getMe'
import { urlForNotification } from 'store/models/Notification'

export const fetchNotifications = graphql(notificationsQuery, {
  props: ({ data: { notifications, loading } }) => ({
    notifications: notifications && notifications.items,
    pending: loading
  })
})

export const markActivityRead = graphql(markActivityReadMutation, {
  props: ({ mutate }) => ({
    markActivityRead: id => mutate({ variables: { id } })
  })
})

export const markAllActivitiesRead = graphql(markAllActivitiesReadMutation, {
  name: 'markAllActivitiesRead'
})

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNotification: notification => dispatch(push(urlForNotification(notification)))
  }
}

export default compose(
  fetchNotifications,
  markActivityRead,
  markAllActivitiesRead,
  connect(mapStateToProps, mapDispatchToProps)
)
