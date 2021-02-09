import { trim } from 'lodash/fp'
import React, { Component } from 'react'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import GroupsSelector from 'components/GroupsSelector'
import Icon from 'components/Icon'
import TextInput from 'components/TextInput'
import { accessibilityString, visibilityString, GROUP_ACCESSIBILITY, GROUP_VISIBILITY } from 'store/models/Group'
import styles from './CreateGroup.scss'

const slugValidatorRegex = /^[0-9a-z-]{2,40}$/

export default class CreateGroup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      accessibility: 1,
      invitees: [],
      name: '',
      parentGroups: this.props.parentGroups || [],
      slug: '',
      slugCustomized: false,
      visibility: 1,

      errors: {
        name: false,
        slug: false
      }
    }

    this.groupsSelector = React.createRef()
  }

  componentDidUpdate (oldProps) {
    if (oldProps.groupSlugExists !== this.props.groupSlugExists) {
      this.setState({ errors: { ...this.state.errors, slug: this.props.groupSlugExists ? 'This URL already exists. Try another.' : false } })
    }
  }

  isValid = () => {
    return Object.values(this.state.errors).every(v => v === false) && this.state.name && this.state.slug
  }

  updateField = (field) => (value) => {
    let newValue = typeof value.target !== 'undefined' ? value.target.value : value
    newValue = typeof newValue === 'string' ? trim(newValue) : newValue

    const updates = {
      [field]: newValue,
      errors: { ...this.state.errors }
    }

    if (field === 'name') {
      updates.errors.name = newValue === '' ? 'Please enter a group name' : false
    }

    if (field === 'slug') {
      if (newValue === '') {
        updates.errors.slug = 'Please enter a URL slug'
      } else if (!slugValidatorRegex.test(newValue)) {
        updates.errors.slug = 'URLs must have between 2 and 40 characters, and can only have lower case letters, numbers, and dashes.'
      } else {
        updates.errors.slug = false
        this.props.fetchGroupExists(newValue)
      }
      updates.slugCustomized = true
    }

    // TODO: generate slug
    if (field === 'name' && !this.state.slugCustomized) {

    }

    this.setState(updates)
  }

  onSubmit = () => {
    if (this.isValid()) {
      this.props.createGroup(this.state.name, this.state.slug, this.state.parentGroups.map(g => g.id))
        .then(({ error }) => {
          if (error) {
            this.setState({
              error: 'There was an error, please try again.'
            })
          } else {
            this.props.goToGroup(this.state.slug)
          }
        })
    }
  }

  render () {
    const { match, parentGroupOptions } = this.props
    const { accessibility, errors, name, parentGroups, slug, visibility } = this.state

    if (!match) return null

    return <div styleName='wrapper'>
      <div styleName='header'>Create group</div>
      <div styleName='name-and-slug'>
        <TextInput
          autoFocus
          type='text'
          name='name'
          onChange={this.updateField('name')}
          value={name}
          theme={{ inputStyle: 'modal-input', wrapperStyle: 'center' }}
          placeholder="What's the name of your group?"
          noClearButton
          onEnter={this.onSubmit}
        />
        {errors.name && <span styleName='error'>{errors.name}</span>}
        <span styleName='slug'>
          https://hylo.com/groups/
          <TextInput
            type='text'
            name='name'
            onChange={this.updateField('slug')}
            value={slug}
            theme={{ input: styles['slug-input'], wrapper: styles['slug-wrapper'] }}
            noClearButton
            onEnter={this.onSubmit}
          />
        </span>
        {errors.slug && <span styleName='error'>{errors.slug}</span>}
      </div>

      <div styleName='privacy'>
        <div>
          Visibility:
          <Dropdown styleName='privacyDropdown'
            toggleChildren={<span>
              {visibilityString(visibility)}
              <Icon name='ArrowDown' />
            </span>}
            items={Object.keys(GROUP_VISIBILITY).map(label => ({
              label,
              onClick: () => this.updateField('visibility')(GROUP_VISIBILITY[label])
            }))}
            alignRight />
        </div>
        <div>
          Accessibility: <Dropdown styleName='privacyDropdown'
            toggleChildren={<span>
              {accessibilityString(accessibility)}
              <Icon name='ArrowDown' />
            </span>}
            items={Object.keys(GROUP_ACCESSIBILITY).map(label => ({
              label,
              onClick: () => this.updateField('accessibility')(GROUP_ACCESSIBILITY[label])
            }))}
            alignRight />
        </div>
      </div>

      { this.props.parentGroups.length > 0 && <div styleName='parentGroups'>
        <p>Is the group a member of other groups?</p>
        {/* TODO: somehow show groups that are restricted and will be a join request differently */}
        <GroupsSelector
          options={parentGroupOptions}
          selected={parentGroups}
          onChange={(newGroups) => { this.updateField('parentGroups')(newGroups) }}
          readOnly={false}
          ref={this.groupsSelector}
        />
      </div>}

      <Button
        color='green-white-green-border'
        key='create-button'
        narrow
        disabled={!this.isValid()}
        onClick={this.onSubmit}
        styleName='submit-button'
      >
        <Icon name='Plus' green />Create Group
      </Button>
    </div>
  }
}