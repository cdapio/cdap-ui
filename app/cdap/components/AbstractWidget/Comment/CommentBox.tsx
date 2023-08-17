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
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import makeStyle from '@material-ui/core/styles/makeStyles';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles';
import { COMMENT_WIDTH, IComment } from 'components/AbstractWidget/Comment/CommentConstants';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CommentMenu from 'components/AbstractWidget/Comment/CommentMenu';
import { humanReadableDate } from 'services/helpers';
import Markdown from 'components/shared/Markdown';
import { ClickAwayListener, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import isObject from 'lodash/isObject';

const useStyles = makeStyle<Theme, ICommentStyleProps>((theme) => {
  return {
    root: {
      zIndex: 1,
      cursor: 'text',
      userSelect: 'text',
    },
    contentRoot: {
      maxHeight: '300px',
      overflowY: 'auto',
      paddingTop: ({ editMode }) => (!editMode ? 0 : theme.spacing(2)),
    },
    cardAction: {
      display: 'inline-flex',
    },
    textarea: {
      width: '100%',
      resize: 'vertical',
      maxHeight: COMMENT_WIDTH, // Allow to resize vertically upto 300px
      padding: theme.spacing(2),
    },
  };
});
interface ICommentStyleProps {
  editMode: boolean;
}

interface ICommentBoxProps {
  comment?: IComment;
  onSave: (comment?: IComment) => void;
  onDelete: () => void;
  focus?: boolean;
  disabled?: boolean;
  onClose?: () => void;
  onClickAway: () => void;
}

export default function CommentBox({
  comment,
  onSave,
  onDelete,
  focus = false,
  disabled = false,
  onClose,
  onClickAway,
}: ICommentBoxProps) {
  const isThereExistingComment = comment?.content && comment.content.length > 0 ? true : false;
  const [editMode, setEditMode] = React.useState(!isThereExistingComment && !disabled);
  const [localComment, setLocalComment] = React.useState(comment);

  const classes = useStyles({ editMode });

  const onCommentChange = (value: string) => {
    if (!localComment?.content || !localComment?.content.length) {
      setLocalComment({
        ...comment,
        content: value,
        createDate: Date.now(),
      });
    } else {
      setLocalComment({
        ...comment,
        content: value,
      });
    }
  };
  const onSaveComment = () => {
    onSave({
      ...comment,
      content: localComment?.content,
    });
  };
  const onResetComment = () => {
    onSave(comment);
  };
  const handleClickAway = () => {
    if (localComment && localComment.content && !confirm('Discard comment?')) {
      return;
    }
    onClickAway();
  };
  React.useEffect(() => {
    setLocalComment(comment);
    const commentExists = comment?.content && comment.content.length > 0 ? true : false;
    setEditMode(!commentExists && !disabled);
  }, [comment]);

  const CommentMenuLocal = (
    <div className={classes.cardAction}>
      {!disabled && <CommentMenu onEdit={() => setEditMode(true)} onDelete={onDelete} />}
      {typeof onClose === 'function' && (
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      )}
    </div>
  );
  if (!editMode) {
    return (
      <Card className={classes.root}>
        <CardHeader
          avatar={<AccountCircleOutlinedIcon />}
          action={CommentMenuLocal}
          title={humanReadableDate(comment?.createDate, true) || '--'}
        />
        <CardContent className={classes.contentRoot}>
          <Markdown markdown={`${localComment?.content}`} />
        </CardContent>
      </Card>
    );
  }
  return (
    <ClickAwayListener onClickAway={handleClickAway} mouseEvent="onMouseDown">
      <Card className={classes.root}>
        <CardContent className={classes.contentRoot}>
          <TextareaAutosize
            className={classes.textarea}
            value={localComment?.content}
            placeholder="Add a comment"
            rowsMax={10}
            rowsMin={3}
            onChange={(e) => onCommentChange(e.target.value)}
            autoFocus={focus}
          />
        </CardContent>
        <CardActions className={classes.cardAction}>
          <Button
            variant="contained"
            color="primary"
            disabled={
              typeof localComment?.content === 'string' && localComment?.content.length === 0
            }
            onClick={() => {
              onSaveComment();
              setEditMode(false);
            }}
          >
            Comment
          </Button>
          <Button
            onClick={() => {
              if (isObject(comment) && !comment?.content?.length && typeof onClose === 'function') {
                onClose();
                return;
              }
              setLocalComment({ ...localComment, content: comment?.content });
              onResetComment();
              setEditMode(false);
            }}
          >
            Cancel
          </Button>
        </CardActions>
      </Card>
    </ClickAwayListener>
  );
}
