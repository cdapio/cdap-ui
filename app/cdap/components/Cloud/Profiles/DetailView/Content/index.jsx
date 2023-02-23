/*
 * Copyright © 2018 Cask Data, Inc.
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
import ProfileDetailViewBasicInfo from 'components/Cloud/Profiles/DetailView/Content/BasicInfo';
import ProfileDetailViewDetailsInfo from 'components/Cloud/Profiles/DetailView/Content/DetailsInfo';
import ProfileAssociations from 'components/Cloud/Profiles/DetailView/Content/ProfileAssociations';

require('./Content.scss');

export default function ProfileDetailViewContent({ ...props }) {
  return (
    <div className="detail-view-content">
      <ProfileDetailViewBasicInfo {...props} />
      <hr />
      <ProfileDetailViewDetailsInfo {...props} />
      <br />
      <ProfileAssociations {...props} />
    </div>
  );
}
