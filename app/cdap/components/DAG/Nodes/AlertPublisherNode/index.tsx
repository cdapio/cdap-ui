/*
 * Copyright © 2020 Cask Data, Inc.
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

import withStyles from '@material-ui/core/styles/withStyles';
import { IAbstractNodeProps, AbstractNode } from 'components/DAG/Nodes/AbstractNode';
import { genericNodeStyles } from 'components/DAG/Nodes/utilities';

const styles = genericNodeStyles({
  border: '1px solid #ffba01',
  '&.drag-hover': {
    backgroundColor: 'rgba(255, 186, 1, 0.1)',
  },
});
type IAlertPublisherProps = IAbstractNodeProps<typeof styles>;
class AlertPublisherComponent extends AbstractNode<IAlertPublisherProps> {
  public type = 'alertpublisher';

  public checkForValidIncomingConnection = (connObj) => {
    if (connObj.connection.target.getAttribute('data-node-type') !== 'alertpublisher') {
      return true;
    }
    const sourceEndpointDOMElement = document.getElementById(connObj.sourceId);
    return (
      sourceEndpointDOMElement &&
      sourceEndpointDOMElement.getAttribute('data-endpoint-type') === 'alert'
    );
  };
}

const AlertPublisherNode = withStyles(styles)(AlertPublisherComponent);
export { AlertPublisherNode };
