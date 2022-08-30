import { IconButton } from '@material-ui/core';
import * as React from 'react';
import './index.scss';

const Aaitems = (props) => {
  const { details } = props;
  const { id, imgUrl } = details;
  return <IconButton className="listitem">{imgUrl}</IconButton>;
};
export default Aaitems;
