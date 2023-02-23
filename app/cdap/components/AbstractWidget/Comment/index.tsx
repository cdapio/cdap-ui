/*
 * Copyright © 2021 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { PopperPlacementType } from '@material-ui/core/Popper';
import CommentIcon from 'components/AbstractWidget/Comment/CommentIcon';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { IComment } from 'components/AbstractWidget/Comment/CommentConstants';
import ThemeWrapper from 'components/ThemeWrapper';
import { preventPropagation } from 'services/helpers';
import DynamicAnchoredComment from 'components/AbstractWidget/Comment/DynamicAnchoredComment';
import { Theme } from '@material-ui/core/styles';
import { createStyles } from '@material-ui/core/styles';
import uuidv4 from 'uuid/v4';

const useStyles = makeStyles<Theme, { highlight: boolean }>((theme) =>
  createStyles({
    root: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      color: ({ highlight }) => (highlight ? theme.palette.primary.main : 'inherit'),
    },
  })
);

interface ICommentProps {
  comments?: IComment[];
  onChange: (commentId: string, updatedComments: IComment[]) => void;
  placement?: PopperPlacementType;
  onOpen?: (nodeid: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  commentsId: string;
  disabled?: boolean;
}

function Comment({
  comments,
  onChange,
  onClose,
  onOpen,
  commentsId,
  isOpen,
  disabled = false,
}: ICommentProps) {
  const isThereExistingComment = () =>
    Array.isArray(comments)
      ? // CDAP-20181 this is written weird but it should be fine
        // @ts-ignore
        comments.length > 0 && comments[0].content.length > 0
      : false;
  const classes = useStyles({ highlight: isThereExistingComment() });
  const [anchorRef, setAnchorRef] = React.useState(null);
  const [anchorId] = React.useState(`id-${uuidv4()}`);
  const [isCommentOpen, setIsCommentOpen] = React.useState(false);
  const [localComments, setLocalComments] = React.useState(comments);
  const toggleComments = (e) => {
    setIsCommentOpen((commentOpen) => {
      if (commentOpen) {
        setAnchorRef(null);
        return false;
      } else {
        setAnchorRef(e.currentTarget);
        setIsCommentOpen(!isCommentOpen);
      }
      return true;
    });
    preventPropagation(e);
  };
  React.useEffect(() => {
    if (isCommentOpen) {
      if (typeof onOpen === 'function') {
        onOpen(commentsId);
      }
    } else {
      setAnchorRef(null);
    }
  }, [isCommentOpen]);

  React.useEffect(() => {
    if (isOpen !== isCommentOpen) {
      setIsCommentOpen(!!isOpen);
    }
  }, [isOpen]);
  React.useEffect(() => {
    setLocalComments(comments);
  }, [comments]);
  return (
    <div className={classes.root} onClick={preventPropagation}>
      <CommentIcon onClick={toggleComments} id={anchorId} />
      <DynamicAnchoredComment
        comments={localComments as any}
        commentsId={commentsId}
        anchorEl={anchorRef || anchorId}
        isOpen={isCommentOpen}
        onClose={onClose as any}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
function ThemeWrappedComment(props) {
  return (
    <ThemeWrapper>
      <Comment {...props} />
    </ThemeWrapper>
  );
}
(ThemeWrappedComment as any).propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  placement: PropTypes.string,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  commentsId: PropTypes.string,
  isOpen: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ThemeWrappedComment;
