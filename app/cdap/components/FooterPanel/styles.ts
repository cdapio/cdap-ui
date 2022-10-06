/*
 * Copyright © 2022 Cask Data, Inc.
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
import { makeStyles } from '@material-ui/core';

export const useCss = makeStyles({
  containerProps: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    width: '100%',
    position: 'absolute',
    bottom: '54px',
  },
  cont: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'space-between',
    backgroundColor: '#F3F6F9',
    height: '40px',
    boxShadow: '0px -2px 2px rgba(0, 0, 0, 0.1)',
  },
  spanElement: {
    marginLeft: '2px',
    marginRight: '5px',
    marginTop: '8px',
  },
  imgCont: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '8px 32px',
    gap: '8px',
    width: '88px',
    height: '40px',
    background:
      'linear-gradient(180deg, rgba(70, 129, 244, 0) 0.85%, rgba(70, 129, 244, 0.2) 118.78%)',
    borderLeft: '1px solid rgba(57, 148, 255, 0.4)',
    flex: 'none',
    order: 0,
    flexGrow: 0,
    borderRight: '1px solid rgba(57, 148, 255, 0.4)',
  },
  data: {
    width: '900px',
    padding: '8px 32px',
    height: '21px',
    textAlign: 'left',
    fontFamily: 'Noto Sans',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '150%',
    letterSpacing: '0.15px',
    color: '#5F6368',
  },

  zoomCont: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '9.5px 32px',
    gap: '8px',
    width: '143px',
    height: '40px',
    background:
      'linear-gradient(180deg, rgba(70, 129, 244, 0) 0.85%, rgba(70, 129, 244, 0.2) 118.78%)',
    borderLeft: '1px solid rgba(57, 148, 255, 0.4)',
  },
  directivesCont: {
    textAlign: 'center',
    padding: '9.5px 32px',
    gap: '8px',
    width: '143px',
    height: '40px',
    background:
      'linear-gradient(180deg, rgba(70, 129, 244, 0) 0.85%, rgba(70, 129, 244, 0.2) 118.78%)',
    borderLeft: '1px solid rgba(57, 148, 255, 0.4)',
  },
  recipeCont: {
    '&:hover': {
      backgroundColor: 'red',
    },
    textAlign: 'center',
    padding: '9.5px 32px',
    gap: '8px',
    width: '184px',
    height: '40px',
    background:
      'linear-gradient(180deg, rgba(70, 129, 244, 0) 0.85%, rgba(70, 129, 244, 0.2) 118.78%)',
    borderLeft: '1px solid rgba(57, 148, 255, 0.4)',
    display: 'flex',
  },
  spanElement1: {
    backgroundColor: '#5F6368',
    height: '21px',
    width: '20px',
    color: '#FFFFFF',
  },
});
