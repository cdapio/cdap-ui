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

package co.cask.cdap.proto.metadata.lineage;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Nullable;

/**
 * Represents the lineage associated with the field of a dataset in detail.
 * Detail view in the backward direction not only includes the information about the fields
 * and corresponding datasets which were responsible for generating the field but also includes
 * the information about operations and programs which were responsible for generating the field.
 * Similarly detail view in the forward direction not only includes the target fields along with
 * their dataset information which got generated by this field but also includes the operations
 * and programs information which were responsible for the transformation.
 */
public class FieldLineageDetails {
  private final List<ProgramFieldOperationInfo> backward;
  private final List<ProgramFieldOperationInfo> forward;

  public FieldLineageDetails(List<ProgramFieldOperationInfo> backward, List<ProgramFieldOperationInfo> forward) {
    this.backward = backward == null ? null : Collections.unmodifiableList(new ArrayList<>(backward));
    this.forward = forward == null ? null : Collections.unmodifiableList(new ArrayList<>(forward));
  }

  @Nullable
  public List<ProgramFieldOperationInfo> getBackward() {
    return backward;
  }

  @Nullable
  public List<ProgramFieldOperationInfo> getForward() {
    return forward;
  }
}
