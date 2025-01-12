import cx from 'classnames'
import { set, startCase, trim } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'components/Button'
import GroupsSelector from 'components/GroupsSelector'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import SwitchStyled from 'components/SwitchStyled'
import {
  accessibilityDescription,
  accessibilityIcon,
  accessibilityString,
  GROUP_ACCESSIBILITY,
  GROUP_VISIBILITY,
  visibilityDescription,
  visibilityIcon,
  visibilityString
} from 'store/models/Group'
import SettingsSection from '../SettingsSection'

import general from '../GroupSettings.scss' // eslint-disable-line no-unused-vars
import styles from './PrivacySettingsTab.scss' // eslint-disable-line no-unused-vars

const { object } = PropTypes

export default class PrivacySettingsTab extends Component {
  static propTypes = {
    group: object,
    fetchPending: object
  }

  constructor (props) {
    super(props)
    this.state = this.defaultEditState()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.fetchPending && !this.props.fetchPending) {
      this.setState(this.defaultEditState())
    }
  }

  defaultEditState () {
    const { group } = this.props

    if (!group) return { edits: {}, changed: false }

    const {
      accessibility, groupToGroupJoinQuestions, joinQuestions, prerequisiteGroups, settings, visibility
    } = group

    return {
      edits: {
        accessibility: typeof accessibility !== 'undefined' ? accessibility : GROUP_ACCESSIBILITY.Restricted,
        groupToGroupJoinQuestions: groupToGroupJoinQuestions ? groupToGroupJoinQuestions.concat({ text: '' }) : [{ text: '' }],
        joinQuestions: joinQuestions ? joinQuestions.concat({ text: '' }) : [{ text: '' }],
        prerequisiteGroups: prerequisiteGroups || [],
        settings: typeof settings !== 'undefined' ? settings : { },
        visibility: typeof visibility !== 'undefined' ? visibility : GROUP_VISIBILITY.Protected
      },
      changed: false
    }
  }

  updateSetting = (key, setChanged = true) => event => {
    const { edits, changed } = this.state

    if (key === 'accessibility' || key === 'visibility') {
      edits[key] = parseInt(event.target.value)
    } else {
      set(edits, key, event.target.value)
    }

    this.setState({
      changed: setChanged ? true : changed,
      edits: { ...edits }
    })
  }

  updateSettingDirectly = (key, changed) => value =>
    this.updateSetting(key, changed)({ target: { value } })

  save = async () => {
    this.setState({ changed: false })
    this.props.updateGroupSettings({ ...this.state.edits })
  }

  render () {
    const { group, parentGroups } = this.props
    if (!group) return <Loading />

    const { edits, changed } = this.state
    const {
      accessibility,
      groupToGroupJoinQuestions,
      joinQuestions,
      prerequisiteGroups,
      settings,
      visibility
    } = edits
    const { askGroupToGroupJoinQuestions, hideExtensionData } = settings
    const { name, type } = group

    return (
      <div styleName='general.groupSettings'>
        <SettingsSection>
          <h3>Visibility</h3>
          <p styleName='general.detailText'>Who is able to see <strong>{name}</strong>?</p>
          {Object.values(GROUP_VISIBILITY).map(visibilitySetting =>
            <VisibilitySettingRow
              key={visibilitySetting}
              forSetting={visibilitySetting}
              currentSetting={visibility}
              updateSetting={this.updateSetting}
            />
          )}
        </SettingsSection>

        <SettingsSection>
          <h3>Access</h3>
          <p styleName='general.detailText'>How can people become members of <strong>{name}</strong>?</p>
          {Object.values(GROUP_ACCESSIBILITY).map(accessSetting =>
            <AccessibilitySettingRow
              key={accessSetting}
              forSetting={accessSetting}
              clearField={this.clearField}
              currentSetting={accessibility}
              askJoinQuestions={settings?.askJoinQuestions}
              joinQuestions={joinQuestions}
              updateJoinQuestion={this.updateJoinQuestion}
              updateSetting={this.updateSetting}
              updateSettingDirectly={this.updateSettingDirectly}
            />
          )}
        </SettingsSection>

        <SettingsSection>
          <h3>Prerequisite Groups</h3>
          <p styleName='general.detailText'>When you select a prerequisite group, people must join the selected groups before joining <strong>{name}</strong>. Only parent groups can be added as prerequisite groups.</p>
          <p styleName='styles.prerequisiteWarning'>
            <strong styleName='styles.warning'>Warning:</strong> If you select a prerequisite group that has a visibility setting of
            <strong><Icon name='Hidden' styleName='styles.prerequisiteIcon' /> Hidden</strong> or
            <strong><Icon name='Shield' styleName='styles.prerequisiteIcon' /> Protected</strong>,
            only members of those groups will be able to join this group. Because of these settings, people who find your group will not be able to see the prerequisite group.
          </p>
          <GroupsSelector
            options={parentGroups}
            selected={prerequisiteGroups}
            onChange={this.updateSettingDirectly('prerequisiteGroups')}
            groupSettings
          />
        </SettingsSection>

        <SettingsSection>
          <h3>Group Access Questions</h3>
          <p styleName='general.detailText'>What questions are asked when a group requests to join this group?</p>

          <div styleName={cx({ 'styles.groupQuestions': true, 'styles.on': askGroupToGroupJoinQuestions })}>
            <div styleName={cx({ 'general.switchContainer': true, 'general.on': askGroupToGroupJoinQuestions })} >
              <SwitchStyled
                checked={askGroupToGroupJoinQuestions}
                onChange={() => this.updateSettingDirectly('settings.askGroupToGroupJoinQuestions')(!askGroupToGroupJoinQuestions)}
                backgroundColor={askGroupToGroupJoinQuestions ? '#0DC39F' : '#8B96A4'} />
              <span styleName='general.toggleDescription'>Require groups to answer questions when requesting to join this group</span>
              <div styleName='general.onOff'>
                <div styleName='general.off'>OFF</div>
                <div styleName='general.on'>ON</div>
              </div>
            </div>
            <QuestionsForm questions={groupToGroupJoinQuestions} save={this.updateSettingDirectly('groupToGroupJoinQuestions')} disabled={!askGroupToGroupJoinQuestions} />
          </div>
        </SettingsSection>

        { type ? <SettingsSection>
          <h3>Hide {startCase(type)} Data</h3>
          <p styleName='styles.dataDetail'>If you don't want to display the detailed {type} specific data on your group's profile</p>
          <div styleName={cx({ 'general.switchContainer': true, 'general.on': hideExtensionData })}>
            <SwitchStyled
              checked={hideExtensionData}
              onChange={() => this.updateSettingDirectly('settings.hideExtensionData')(hideExtensionData === undefined || hideExtensionData === null || !hideExtensionData)}
              backgroundColor={hideExtensionData ? '#0DC39F' : '#8B96A4'}
            />
            <span styleName='general.toggleDescription'>Hide {type} data for this group</span>
            <div styleName='general.onOff'>
              <div styleName='general.off'>OFF</div>
              <div styleName='general.on'>ON</div>
            </div>
          </div>
        </SettingsSection>
          : ''
        }

        <div styleName='general.saveChanges'>
          <span styleName={changed ? 'general.settingChanged' : ''}>{changed ? 'Changes not saved' : 'Current settings up to date'}</span>
          <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? this.save : null} styleName='general.save-button' />
        </div>
      </div>
    )
  }
}

function VisibilitySettingRow ({ currentSetting, forSetting, updateSetting }) {
  return <div styleName={'styles.privacySetting' + ' ' + cx({ 'styles.on': currentSetting === forSetting })}>
    <label>
      <input type='radio' name='Visibility' value={forSetting} onChange={updateSetting('visibility')} checked={currentSetting === forSetting} />
      <Icon name={visibilityIcon(forSetting)} styleName='styles.settingIcon' />
      <div styleName='styles.settingDescription'>
        <h4>{visibilityString(forSetting)}</h4>
        <span styleName={cx('styles.privacy-option', { 'styles.disabled': currentSetting !== forSetting })}>{visibilityDescription(forSetting)}</span>
      </div>
    </label>
  </div>
}

function AccessibilitySettingRow ({ askJoinQuestions, clearField, currentSetting, forSetting, joinQuestions, updateJoinQuestion, updateSetting, updateSettingDirectly }) {
  return <div styleName={'styles.privacySetting' + ' ' + cx({ 'styles.on': currentSetting === forSetting })}>
    <label>
      <input type='radio' name='accessibility' value={forSetting} onChange={updateSetting('accessibility')} checked={currentSetting === forSetting} />
      <Icon name={accessibilityIcon(forSetting)} styleName='styles.settingIcon' />
      <div styleName='styles.settingDescription'>
        <h4>{accessibilityString(forSetting)}</h4>
        <span styleName={cx('styles.privacy-option', { 'styles.disabled': currentSetting !== forSetting })}>{accessibilityDescription(forSetting)}</span>
      </div>
    </label>
    {forSetting === currentSetting && currentSetting === GROUP_ACCESSIBILITY.Restricted &&
      <div styleName={cx({ 'styles.groupQuestions': true, 'styles.on': askJoinQuestions })}>
        <div styleName={cx({ 'general.switchContainer': true, 'general.on': askJoinQuestions })}>
          <SwitchStyled
            checked={askJoinQuestions}
            onChange={() => updateSettingDirectly('settings.askJoinQuestions')(!askJoinQuestions)}
            backgroundColor={askJoinQuestions ? '#0DC39F' : '#8B96A4'} />
          <span styleName='general.toggleDescription'>Require people to answer questions when requesting to join this group</span>
          <div styleName='general.onOff'>
            <div styleName='general.off'>OFF</div>
            <div styleName='general.on'>ON</div>
          </div>
        </div>
        <QuestionsForm questions={joinQuestions} save={updateSettingDirectly('joinQuestions', true)} disabled={!askJoinQuestions} />
      </div>
    }
  </div>
}

function QuestionsForm ({ disabled, questions, save }) {
  const updateJoinQuestion = (index) => event => {
    const value = event.target.value
    const newQuestions = questions
    if (trim(value) === '') {
      newQuestions.splice(index, 1)
    } else if (newQuestions[index].text !== value) {
      newQuestions[index] = { text: value }
    }
    if (newQuestions[newQuestions.length - 1].text !== '') {
      newQuestions.push({ text: '' })
    }
    save(newQuestions)
  }

  const clearField = (index) => event => {
    event.target.value = ''
    updateJoinQuestion(index)(event)
  }

  return <div styleName='styles.questionList'>
    {questions.map((q, i) => <div key={i} styleName='styles.question'>
      {q.text ? <div styleName='styles.deleteInput'><Icon name='CircleEx' styleName='styles.close' onClick={clearField(i)} /></div> : <span styleName='styles.createInput'>+</span>}
      <input name='questions[]' disabled={disabled} value={q.text} placeholder='Add a new question' onChange={updateJoinQuestion(i)} />
    </div>)}
  </div>
}
