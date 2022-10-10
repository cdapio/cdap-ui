# How to Contribute

We'd love to accept your patches and contributions to this project. There are
just a few small guidelines you need to follow.

## Contributor License Agreement

Contributions to this project must be accompanied by a Contributor License
Agreement (CLA). You (or your employer) retain the copyright to your
contribution; this simply gives us permission to use and redistribute your
contributions as part of the project. Head over to
<https://cla.developers.google.com/> to see your current agreements on file or
to sign a new one.

You generally only need to submit a CLA once, so if you've already submitted one
(even if it was for a different project), you probably don't need to do it
again.

## Code Reviews

All submissions, including submissions by project members, require review. We
use GitHub pull requests for this purpose. Consult
[GitHub Help](https://help.github.com/articles/about-pull-requests/) for more
information on using pull requests.

When you open a pull request, the description will be pre-filled with our
template. Please follow the template and fill in all relevent sections.

All pull requests must pass our automated testing before being merged. Before
merging, please squash all commits to a single commit.

## Branching

Please add your commits to a branch and do not push directly to `develop`. If you're a
member of the project, feel free to push your branches to the `cdapio/cdap-ui` repo. If
you're not a member, please fork the repo and open a pull request from the branch
in your fork.

Branches will be created before every major or minor release (as defined by
[semver](https://semver.org/)). These branches will have the pattern `release/x.y`.
If a bug is found in a release branch, the fix should be made in `develop` first
and the fix then cherry-picked to the release branch. If the bug only exists in
the release branch, then the fix can be made directly on the release branch.

## Community Guidelines

This project follows
[Google's Open Source Community Guidelines](https://opensource.google/conduct/).
See our [Code of Conduct](./CODE_OF_CONDUCT.md) for more details.

## Issue Tracking

Issues are tracked in [Jira](https://cdap.atlassian.net/jira/projects). Please make
sure all code changes have a corresponding Jira ticket.

## Development Guidelines

Please see the [DEVELOPERS file](./DEVELOPERS.md).
