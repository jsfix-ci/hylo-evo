import { CREATE_COMMENT } from 'store/constants'
import { uniqueId } from 'lodash/fp'
import { AnalyticsEvents } from 'hylo-shared'
import CreateCommentMutation from 'graphql/mutations/CreateCommentMutation.graphql'

export default function createComment ({
  postId,
  parentCommentId,
  text,
  attachments
}) {
  return {
    type: CREATE_COMMENT,
    graphql: {
      query: CreateCommentMutation,
      variables: {
        postId,
        parentCommentId,
        text,
        attachments
      }
    },
    meta: {
      optimistic: true,
      extractModel: 'Comment',
      tempId: uniqueId(`post${postId}_`),
      postId,
      text,
      attachments,
      analytics: AnalyticsEvents.COMMENT_CREATED
    }
  }
}
