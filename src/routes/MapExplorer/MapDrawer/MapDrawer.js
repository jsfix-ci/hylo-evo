import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import PostCard from 'components/PostCard'
import { SORT_OPTIONS } from '../MapExplorer.store'
import styles from './MapDrawer.scss'

function MapDrawer (props) {
  let { onUpdateFilters, posts, querystringParams, routeParams, topics } = props

  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [sort, setSort] = useState(SORT_OPTIONS[0].id)
  const [filterTopics, setFilterTopics] = useState([])

  const filterByTopic = (topic) => {
    const newFilterTopics = filterTopics.concat(topic)
    setFilterTopics(newFilterTopics)
    onUpdateFilters({ topics: newFilterTopics })
  }

  const removeTopicFilter = (topic) => (e) => {
    const newFilterTopics = filterTopics.filter(t => t.name !== topic.name)
    setFilterTopics(newFilterTopics)
    onUpdateFilters({ topics: newFilterTopics })
  }

  const postsHTML = posts.map(post =>
    <PostCard
      routeParams={routeParams}
      querystringParams={querystringParams}
      post={post}
      styleName='postCard'
      expanded={false}
      key={post.id} />
  )

  // Don't show topics we are already filtering by in searches
  const searchTopics = topics.filter(topic => !filterTopics.find(t => t.name === topic.name))

  return (
    <div styleName='container'>
      <h1>{posts.length} result{posts.length === 1 ? '' : 's'} in this area</h1>

      <Dropdown styleName='sorter'
        toggleChildren={<span styleName='sorter-label'>
          {SORT_OPTIONS.find(o => o.id === sort).label}
          <Icon name='ArrowDown' className={styles.sorterIcon} />
        </span>}
        items={SORT_OPTIONS.map(({ id, label }) => ({
          label,
          onClick: () => {
            setSort(id)
            onUpdateFilters({ sortBy: id })
          }
        }))}
        alignRight
      />

      <input
        styleName='searchBox'
        type='text'
        onChange={e => setSearch(e.target.value)}
        onFocus={e => setIsSearching(true)}
        onKeyUp={e => {
          if (e.keyCode === 13) {
            setSearch('')
            setSearchText(e.target.value)
            setIsSearching(false)
            onUpdateFilters({ search: e.target.value })
            e.target.blur()
          }
        }}
        placeholder='Search among these results'
        value={search}
      />
      { isSearching
        ? <div styleName='searchFilters'>
            {searchTopics.slice(0, 10).map(topic => {
              return (
                <span
                  key={'choose_topic_' + topic.name}
                  onClick={() => {
                    filterByTopic(topic)
                    setIsSearching(false)
                  }}
                  styleName='topicButton'
                >
                  <span styleName='topicCount'>{topic.count}</span> {topic.name}
                </span>
              )
            })}
          </div>
        : ''
      }

      <div styleName='currentFilters'>
        {searchText ? <div styleName='currentSearchText' onClick={() => { setSearchText(''); onUpdateFilters({ search: '' })}}>&quot;{searchText}&quot; x</div> : ""}
        {filterTopics.map(topic => {
          return (
            <span
              key={'filter_topic_' + topic.name}
              onClick={removeTopicFilter(topic)}
              styleName='topicButton'
            >
              <span styleName='topicCount'>{topic.count}</span> #{topic.name} x
            </span>
          )
        })}
      </div>
      {postsHTML}
    </div>
  )
}

MapDrawer.propTypes = {
  posts: PropTypes.array,
  querystringParams: PropTypes.object,
  routeParams: PropTypes.object,
  onUpdateFilters: PropTypes.func
}

MapDrawer.defaultProps = {
  posts: [],
  querystringParams: {},
  routeParams: {},
  onUpdateFilters: (opts) => { console.log('Updating filters with: ' + opts) }
}

export default MapDrawer