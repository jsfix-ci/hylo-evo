export const _PENDING = '_PENDING'
export const ACCEPT_GROUP_RELATIONSHIP_INVITE = 'ACCEPT_GROUP_RELATIONSHIP_INVITE'
export const ACCEPT_JOIN_REQUEST = 'ACCEPT_JOIN_REQUEST'
export const ADD_USER_TYPING = 'ADD_USER_TYPING'
export const ADD_MODERATOR = 'ADD_MODERATOR'
export const ADD_MODERATOR_PENDING = ADD_MODERATOR + _PENDING
export const BLOCK_USER = 'BLOCK_USER'
export const CALL_APOLLO = 'CALL_APOLLO'
export const CANCEL_GROUP_RELATIONSHIP_INVITE = 'CANCEL_GROUP_RELATIONSHIP_INVITE'
export const CANCEL_JOIN_REQUEST = 'CANCEL_JOIN_REQUEST'
export const CHECK_INVITATION = 'CHECK_INVITATION'
export const CHECK_LOGIN = 'CHECK_LOGIN'
export const CLEAR_USER_TYPING = 'CLEAR_USER_TYPING'
export const CLEAR_MODERATOR_SUGGESTIONS = 'CLEAR_MODERATOR_SUGGESTIONS'
export const CREATE_AFFILIATION = 'CREATE_AFFILIATION'
export const CREATE_COMMENT = 'CREATE_COMMENT'
export const CREATE_COMMENT_PENDING = CREATE_COMMENT + _PENDING
export const CREATE_GROUP = 'CREATE_GROUP'
export const CREATE_GROUP_PENDING = 'CREATE_GROUP' + _PENDING
export const CREATE_JOIN_REQUEST = 'CREATE_JOIN_REQUEST'
export const CREATE_JOIN_REQUEST_PENDING = 'CREATE_JOIN_REQUEST' + _PENDING
export const CREATE_MESSAGE = 'CREATE_MESSAGE'
export const CREATE_MESSAGE_PENDING = CREATE_MESSAGE + _PENDING
export const CREATE_POST = 'CREATE_POST'
export const CREATE_PROJECT = 'CREATE_PROJECT'
export const DEACTIVATE_ME = 'DEACTIVATE_ME'
export const DELETE_AFFILIATION = 'DELETE_AFFILIATION'
export const DECLINE_GROUP_INVITE = 'DECLINE_GROUP_INVITE'
export const DECLINE_JOIN_REQUEST = 'DECLINE_JOIN_REQUEST'
export const DELETE_COMMENT = 'DELETE_COMMENT'
export const DELETE_COMMENT_PENDING = `${DELETE_COMMENT}_PENDING`
export const DELETE_GROUP_RELATIONSHIP = 'DELETE_GROUP_RELATIONSHIP'
export const DELETE_GROUP_RELATIONSHIP_PENDING = DELETE_GROUP_RELATIONSHIP + _PENDING
export const DELETE_ME = 'DELETE_ME'
export const DELETE_SAVED_SEARCH = 'DELETE_SAVED_SEARCH'
export const DROP_QUERY_RESULTS = 'DROP_QUERY_RESULTS'
export const EXTRACT_MODEL = 'EXTRACT_MODEL'
export const FETCH_COMMENTS = 'FETCH_COMMENTS'
export const FETCH_CHILD_COMMENTS = 'FETCH_CHILD_COMMENTS'
export const FETCH_GROUP_DETAILS = 'FETCH_GROUP_DETAILS'
export const FETCH_GROUP_DETAILS_PENDING = 'FETCH_GROUP_DETAILS_PENDING'
export const FETCH_GROUPS = 'FETCH_GROUPS'
export const FETCH_GROUP_TOPIC = 'FETCH_GROUP_TOPIC'
export const FETCH_DEFAULT_TOPICS = 'FETCH_DEFAULT_TOPICS'
export const FETCH_FEED_ITEMS = 'FETCH_FEED_ITEMS'
export const FETCH_FOR_GROUP = 'FETCH_FOR_GROUP'
export const FETCH_FOR_GROUP_PENDING = FETCH_FOR_GROUP + '_PENDING'
export const FETCH_FOR_CURRENT_USER = 'FETCH_FOR_CURRENT_USER'
export const FETCH_JOIN_REQUESTS = 'FETCH_JOIN_REQUESTS'
export const FETCH_JOIN_REQUESTS_PENDING = FETCH_JOIN_REQUESTS + '_PENDING'
export const FETCH_MESSAGES = 'FETCH_MESSAGES'
export const FETCH_MESSAGES_PENDING = FETCH_MESSAGES + _PENDING
export const FETCH_MODERATOR_SUGGESTIONS = 'FETCH_MODERATOR_SUGGESTIONS'
export const FETCH_MY_JOIN_REQUESTS = 'FETCH_MY_JOIN_REQUESTS'
export const FETCH_MY_REQUESTS_AND_INVITES = 'FETCH_MY_REQUESTS_AND_INVITES'
export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS'
export const FETCH_PEOPLE = 'FETCH_PEOPLE'
export const FETCH_PERSON = 'FETCH_PERSON'
export const FETCH_PERSON_PENDING = FETCH_PERSON + '_PENDING'
export const FETCH_POST = 'FETCH_POST'
export const FETCH_POSTS = 'FETCH_POSTS'
export const FETCH_POSTS_FOR_WIDGETS = 'FETCH_POSTS_FOR_WIDGETS'
export const FETCH_POSTS_PENDING = FETCH_POSTS + '_PENDING'
export const FETCH_RECENT_CONTACTS = 'FETCH_RECENT_CONTACTS'
export const FETCH_SAVED_SEARCHES = 'FETCH_SAVED_SEARCHES'
export const FETCH_THREAD = 'FETCH_THREAD'
export const FETCH_THREADS = 'FETCH_THREADS'
export const FETCH_TOPIC = 'FETCH_TOPIC'
export const FETCH_TOPICS = 'FETCH_TOPICS'
export const FIND_MENTIONS = 'FIND_MENTIONS'
export const FIND_MENTIONS_PENDING = 'FIND_MENTIONS_PENDING'
export const FIND_TOPICS = 'FIND_TOPICS'
export const FIND_TOPICS_PENDING = 'FIND_TOPICS_PENDING'
export const FULFILL_POST = 'FULFILL_POST'
export const FULFILL_POST_PENDING = 'FULFILL_POST_PENDING'
export const UNFULFILL_POST = 'UNFULFILL_POST'
export const UNFULFILL_POST_PENDING = 'UNFULFILL_POST_PENDING'
export const FIND_OR_CREATE_THREAD = 'FIND_OR_CREATE_THREAD'
export const INVITE_CHILD_TO_JOIN_PARENT_GROUP = 'INVITE_CHILD_TO_JOIN_PARENT_GROUP'
export const INVITE_CHILD_TO_JOIN_PARENT_GROUP_PENDING = INVITE_CHILD_TO_JOIN_PARENT_GROUP + _PENDING
export const JOIN_PROJECT = 'JOIN_PROJECT'
export const JOIN_PROJECT_PENDING = 'JOIN_PROJECT_PENDING'
export const LEAVE_PROJECT_PENDING = 'LEAVE_PROJECT_PENDING'
export const LEAVE_GROUP = 'LEAVE_GROUP'
export const LEAVE_PROJECT = 'LEAVE_PROJECT'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const LOGOUT_PENDING = 'LOGOUT_PENDING'
export const MARK_ACTIVITY_READ = 'MARK_ACTIVITY_READ'
export const MARK_ACTIVITY_READ_PENDING = 'MARK_ACTIVITY_READ_PENDING'
export const MARK_ALL_ACTIVITIES_READ = 'MARK_ALL_ACTIVITIES_READ'
export const MARK_ALL_ACTIVITIES_READ_PENDING = 'MARK_ALL_ACTIVITIES_READ_PENDING'
export const MESSAGE_GROUP_MODERATORS = 'MESSAGE_GROUP_MODERATORS'
export const PROCESS_STRIPE_TOKEN = 'PROCESS_STRIPE_TOKEN'
export const PROCESS_STRIPE_TOKEN_PENDING = PROCESS_STRIPE_TOKEN + _PENDING
export const REJECT_GROUP_RELATIONSHIP_INVITE = 'REJECT_GROUP_RELATIONSHIP_INVITE'
export const REMOVE_MODERATOR = 'REMOVE_MODERATOR'
export const REMOVE_MODERATOR_PENDING = REMOVE_MODERATOR + _PENDING
export const REQUEST_FOR_CHILD_TO_JOIN_PARENT_GROUP = 'REQUEST_FOR_CHILD_TO_JOIN_PARENT_GROUP'
export const REQUEST_FOR_CHILD_TO_JOIN_PARENT_GROUP_PENDING = REQUEST_FOR_CHILD_TO_JOIN_PARENT_GROUP + _PENDING
export const RESET_NEW_POST_COUNT = 'RESET_NEW_POST_COUNT'
export const RESET_NEW_POST_COUNT_PENDING = 'RESET_NEW_POST_COUNT' + _PENDING
export const RESET_STORE = 'RESET_STORE'
export const RESPOND_TO_EVENT = 'RESPOND_TO_EVENT'
export const RESPOND_TO_EVENT_PENDING = 'RESPOND_TO_EVENT' + _PENDING
export const SAVE_SEARCH = 'SAVE_SEARCH'
export const SEND_PASSWORD_RESET = 'SEND_PASSWORD_RESET'
export const SET_RETURN_TO_PATH = 'SET_RETURN_TO_PATH'
export const SIGNUP = 'SIGNUP'
export const SORT_NAME = 'name'
export const SORT_NEAREST = 'nearest'
export const SORT_SIZE = 'size'
export const SET_CONFIRM_BEFORE_CLOSE = 'SET_CONFIRM_BEFORE_CLOSE'
export const SET_STATE = 'SET_STATE'
export const STORE_CLEAR_FEED_LIST = 'STORE_CLEAR_FEED_LIST'
export const TOGGLE_GROUP_TOPIC_SUBSCRIBE = 'TOGGLE_GROUP_TOPIC_SUBSCRIBE'
export const TOGGLE_GROUP_TOPIC_SUBSCRIBE_PENDING = 'TOGGLE_GROUP_TOPIC_SUBSCRIBE_PENDING'
export const TRACK_ANALYTICS_EVENT = 'TRACK_ANALYTICS_EVENT'
export const UPDATE_COMMENT = 'UPDATE_COMMENT'
export const UPDATE_COMMENT_PENDING = `${UPDATE_COMMENT}_PENDING`
export const UPDATE_GROUP_TOPIC = 'UPDATE_GROUP_TOPIC'
export const UPDATE_GROUP_TOPIC_PENDING = 'UPDATE_GROUP_TOPIC_PENDING'
export const UPDATE_POST = 'UPDATE_POST'
export const UPDATE_POST_PENDING = `${UPDATE_POST}_PENDING`
export const UPDATE_THREAD_READ_TIME = 'UPDATE_THREAD_READ_TIME'
export const UPDATE_USER_SETTINGS = 'UPDATE_USER_SETTINGS'
export const UPDATE_USER_SETTINGS_PENDING = 'UPDATE_USER_SETTINGS_PENDING'
export const UPDATE_WIDGET = 'UPDATE_WIDGET'
export const UPLOAD_ATTACHMENT = 'UPLOAD_ATTACHMENT'
export const UPLOAD_ATTACHMENT_PENDING = 'UPLOAD_ATTACHMENT' + _PENDING
export const UNBLOCK_USER = 'UNBLOCK_USER'
export const UNLINK_ACCOUNT = 'UNLINK_ACCOUNT'
export const USE_INVITATION = 'USE_INVITATION'
export const VIEW_SAVED_SEARCH = 'VIEW_SAVED_SEARCH'
export const VOTE_ON_POST = 'VOTE_ON_POST'
export const VOTE_ON_POST_PENDING = VOTE_ON_POST + _PENDING
