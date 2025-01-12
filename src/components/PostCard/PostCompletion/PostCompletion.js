import React from 'react'
import './PostCompletion.scss'
import DropdownButton from 'components/DropdownButton'

const promptOptions = {
  request: 'Is this request still needed?',
  offer: 'Is this offer still available?',
  resource: 'Is this resource still available?',
  project: 'Is this project still active?'
}

const messages = {
  request: [
    { label: 'This is still needed', value: false },
    { label: 'No longer needed', value: true }
  ],
  offer: [
    { label: 'Available', value: false },
    { label: 'Unavailable', value: true }
  ],
  resource: [
    { label: 'Available', value: false },
    { label: 'Unavailable', value: true }
  ],
  project: [
    { label: 'Active', value: false },
    { label: 'Completed', value: true }
  ]
}

export default function PostCompletion ({ type, startTime, endTime, isFulfilled, fulfillPost, unfulfillPost }) {
  const label = messages[type].find(choice => choice.value === !!isFulfilled).label

  const prompt = promptOptions[type]
  const choices = messages[type]

  return <div styleName='postCompletion'>
    <div>{prompt}</div>
    <DropdownButton label={label}
      choices={choices}
      onChoose={response => {
        response === false ? unfulfillPost() : fulfillPost()
      }} />
  </div>
}
