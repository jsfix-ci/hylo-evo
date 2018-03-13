import React from 'react'
import './SendAnnouncementModal.scss'
import Button from '../Button'
import { pluralize } from 'util/index'

export default function SendAnnouncementModal ({closeModal, save, communityMembersCount}) {
  const members = communityMembersCount === 1 ? 'member' : 'members'
  return <div styleName='modal'>
    <div styleName='modal-container'>
      <h1 styleName='modal-header'>MAKE AN ANNOUNCEMENT</h1>
      <p styleName='modal-paragraph'>Send an email and push notif to the entire community of {communityMembersCount.toLocaleString()} {members} along with this announcement.</p>
      <a>
        <Button styleName='close-button' small onClick={closeModal}>Go Back</Button>
        <Button styleName='send-button' small onClick={save}>Send It</Button>
      </a>
    </div>
  </div>
}
