import PropTypes from 'prop-types'
import React from 'react'
import RoundImage from 'components/RoundImage'
import { Link } from 'react-router-dom'

const { string, bool } = PropTypes

export default function Avatar ({ url, avatarUrl, small, medium, className }) {
  if (url) {
    return <Link to={url} className={className}>
      <RoundImage url={avatarUrl} small={small} medium={medium} />
    </Link>
  } else {
    return <span className={className}>
      <RoundImage url={avatarUrl} small={small} medium={medium} />
    </span>
  }
}
Avatar.propTypes = {
  avatarUrl: string,
  small: bool,
  medium: bool,
  className: string
}
