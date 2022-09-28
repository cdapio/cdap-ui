# Developing the CDAP UI

We'd like to accept as many contributions as possible, but in order
to maintain consistency and high code quality, please note these
guidelines.

## All file types

Ensure all files end with a newline (configure your editor
to do this automatically).

All code files must contain a license and copyright header.

```
/*
 * Copyright © <year of file creation> Cask Data, Inc.
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
 ```

## JS/TS Files

Where possible, create new files as `.ts`/`.tsx` even if full type information is
not available.

Please follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html).

Linting is TBD.

When possible, use `RxJS` instead of `Promise`s.

## React

Where possible, create function components in new code (not class components). Create one component
per file.

Use Mui components (including icons) where available. If you create a component that can be used in many places, or
encapsulates a common configuration of a Mui component, please add it to the
[shared components](./app/cdap/components/shared/).

`<If condition={foo} />` is deprecated and should no longer be used - we prefer `{foo && component}`.
If you are making large updates to a component that uses `<If />` please convert the code.

If a component should be available to a browser-based test, please add a `data-testid` tag
to identify it. This makes the component findable without depending on the surrounding DOM
structure, which could change for unrelated reasons.

## CSS

All new CSS should be CSS-in-JS. Use `styled-components` where feasible, including in all new components.

When setting colors on elements, please check the
[palette](./app/cdap/components/ThemeWrapper/colors.ts) and use an existing color if possible.

## Internationalization

Please help improve our Internationalization. Text strings should be read from
[text-en.yaml](./adpp/cdap/text/text-en.yaml) and read using the `i18n-react` module.
Data should be formatted for display using the
[DataFormatter](./app/cdap/services/DataFormatter/index.ts) module.

## Testing

All new code should have associated tests. We use the following test approaches:
* For business logic unit tests, use `jest`
  ([example](./app/cdap/services/DataFormatter/__tests__/DataFormatter.test.ts))
* For component unit testing, use `testing-library`
  ([example](./app/cdap/services/react/customHooks/useDebounce.test.ts))
* For end-to-end integration tests, use `cucumber` ([test cases](./src/e2e-test/))
