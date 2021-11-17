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

import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Heading, { HeadingTypes } from 'components/shared/Heading';
import LoadingSVGCentered from 'components/shared/LoadingSVGCentered';
import If from 'components/shared/If';
import { Modal, ModalBody } from 'reactstrap';
import { objectQuery } from 'services/helpers';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const useStyle = makeStyles((theme) => {
  return {
    modalContainer: {
      marginTop: '50px',
    },
    modalDialog: {
      height: 'calc(100vh - 50px)',
      maxWidth: '100vw',
      width: '100vw',
      marginTop: 0,
      marginBottom: 0,
    },
    modalContent: {
      height: '100%',
      borderRadius: 0,
    },
    modalHeader: {
      backgroundColor: objectQuery(theme, 'palette', 'grey', 600),
      display: 'flex',
      height: '50px',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${objectQuery(theme, 'palette', 'grey', 500)}`,
      padding: 0,
    },
    modalTitle: {
      paddingLeft: '15px',
      marginBottom: 0,
    },
    closeBtn: {
      marginRight: '15px',
    },
  };
});

interface IPipelineModalProps {
  isOpen: boolean;
  toggle: () => void;
  header: string;
  loading: boolean;
  modalBodyClassName?: string;
}

const PipelineModal: React.FC<React.PropsWithChildren<IPipelineModalProps>> = ({
  isOpen,
  toggle,
  header,
  loading,
  children,
  modalBodyClassName,
}) => {
  const classes = useStyle();

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
      modalClassName={classes.modalContainer}
      contentClassName={classes.modalContent}
      className={classes.modalDialog}
      backdrop="static"
      zIndex="1061"
    >
      <div className={classes.modalHeader}>
        <Heading type={HeadingTypes.h5} className={classes.modalTitle} label={header} />

        <IconButton onClick={toggle} className={classes.closeBtn}>
          <CloseIcon />
        </IconButton>
      </div>
      <ModalBody className={modalBodyClassName}>
        <If condition={loading}>
          <LoadingSVGCentered />
        </If>

        <If condition={!loading}>{children}</If>
      </ModalBody>
    </Modal>
  );
};

export default PipelineModal;
