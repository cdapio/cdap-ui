import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
// import {FormDialog} from '/NewRepoButton/index.tsx';
import FormDialog from 'components/Github/NewRepoButton';
import LongMenu from 'components/Github/RepoMenu';
import ActionsPopover from 'components/ActionsPopover';
// import { MyAppApi } from 'api/app';

const useStyle = makeStyles((theme) => {
  return {};
});

const Gihub = () => {
  //   React.useEffect(() => {
  //     const params = {
  //       namespace: 'default',
  //     };
  //     MyAppApi.list(params).subscribe(
  //       (response) => {},
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  //   }, []);

  return <h1>Hello World</h1>;
};
function Github() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal((prev) => !prev);
  };
  return (
    <div>
      <button>Add New Repository</button>
      <div>
        <FormDialog></FormDialog>
      </div>
      <div>
        <LongMenu></LongMenu>
      </div>
    </div>
  );
}

export default Github;
