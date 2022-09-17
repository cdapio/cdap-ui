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

import { makeStyles } from '@material-ui/styles';
import { grey } from '@material-ui/core/colors';

export const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    gap: '50px',
    flexWrap: 'wrap',
  },
  card: {
    padding: '0px 28px',
    height: '180px',
    width: '220px',
    border: `1px solid ${grey[300]}`,
    borderRadius: '10px',
    boxShadow: 'none',
    display: 'flex',
    '&:hover': {
      boxShadow: '3px 4px 15px rgba(68, 132, 245, 0.15)',
      border: '1px solid white',
      boxSizing: 'border-box',
    },
    cursor: 'pointer',
  },
  cardContent: {
    width: '100%',
    display: 'flex',
    paddingBottom: '47px',
    placeSelf: 'flex-end',
    margin: '0 auto',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardText: {
    marginTop: '15px',
    letterSpacing: '0.15px',
    lineHeight: '24px',
    fontSize: '16px',
    fontWeight: 400,
    color: '#000000',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '166px',
  },
  link: {
    textDecoration: 'none',
  },
});
