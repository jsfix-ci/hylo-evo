import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import NoPosts from 'components/NoPosts'
import ScrollListener from 'components/ScrollListener'
import GroupCard from 'components/GroupCard'
import useRouter from 'hooks/useRouter'
import useDebounce from 'hooks/useDebounce'
import useEnsureSearchedGroups from 'hooks/useEnsureSearchedGroups'
import getMe from 'store/selectors/getMe'
import { SORT_NAME, SORT_NEAREST, SORT_SIZE } from 'store/constants'
import { CENTER_COLUMN_ID } from 'util/scrolling'
import { ALL_VIEW, FARM_VIEW } from 'util/constants'
import './GroupSearch.scss'

export default function GroupSearch ({ viewFilter }) {
  const currentUser = useSelector(state => getMe(state))
  const nearCoord = currentUser.locationObject ? { lng: parseFloat(currentUser.locationObject.center.lng), lat: parseFloat(currentUser.locationObject.center.lat) } : null
  const membershipGroupIds = currentUser.memberships.toModelArray().map(membership => membership.group.id)
  const [sortBy, setSortBy] = useState(SORT_NAME)
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [filterToggle, setFilterToggle] = useState(false)
  const [groupType, setGroupType] = useState(null)
  const debouncedSearchTerm = useDebounce(search, 500)
  const { query } = useRouter()
  const selectedGroupSlug = query.groupSlug
  const { groups = [], pending = false, fetchMoreGroups, hasMore } = useEnsureSearchedGroups({ sortBy, search: debouncedSearchTerm, offset, nearCoord, visibility: [3], groupType })

  useEffect(() => {
    setOffset(0)
  }, [search, sortBy, groupType])

  useEffect(() => {
    setOffset(groups.length)
  }, [groups])

  useEffect(() => {
    if (viewFilter === FARM_VIEW) {
      setSortBy(SORT_NEAREST)
    }
  }, [viewFilter])

  useEffect(() => viewFilter === FARM_VIEW ? setGroupType(FARM_VIEW) : setGroupType(null), [viewFilter])

  return <React.Fragment>
    <div styleName='group-search-view-ctrls'>
      {viewFilter !== ALL_VIEW ? <div onClick={() => setFilterToggle(!filterToggle)}>filter</div> : <div id='div-left-intentionally-blank' />}
      { makeDropdown(sortBy, sortOptions(nearCoord), setSortBy) }
    </div>
    {filterToggle && <div>
      This is where the filter info lives
    </div>}
    <div>
      This is where the filter tags live
    </div>
    <div styleName='search-input'>
      <div className='spacer' />
      <input
        styleName='searchBox'
        type='text'
        onChange={e => setSearch(e.target.value)}
        placeholder='Search groups by keyword'
        value={search}
      />
      <div className='spacer' />
    </div>
    <div styleName='group-search-items'>
      {!pending && groups.length === 0 ? <NoPosts message='No results for this search' /> : ''}
      {groups.map(group => {
        const expanded = selectedGroupSlug === group.slug
        return <GroupCard
          memberships={membershipGroupIds}
          styleName={cx({ 'card-item': true, expanded })}
          expanded={expanded}
          routeParams={query}
          group={group}
          key={group.id} />
      })}
    </div>
    <ScrollListener onBottom={() => fetchMoreGroups(offset)}
      elementId={CENTER_COLUMN_ID} />
    {pending && <Loading />}
    {(!hasMore && !!offset) && <div styleName='no-more-results'>No more results</div>}
  </React.Fragment>
}

const sortOptions = (nearCoord) => {
  let options = [
    { id: SORT_NAME, label: 'Group Name' },
    { id: SORT_SIZE, label: 'Member Count' }
  ]

  if (nearCoord) {
    options.push({ id: SORT_NEAREST, label: 'Nearest' })
  }

  return options
}

const makeDropdown = (selected, options, onChange) => (
  <Dropdown styleName='dropdown'
    toggleChildren={<span styleName='dropdown-label'>
      <Icon name='ArrowDown' />
      Sort by: <b>{options.find(o => o.id === selected).label}</b>
    </span>}
    items={options.map(({ id, label }) => ({
      label,
      onClick: () => onChange(id)
    }))} />
)
