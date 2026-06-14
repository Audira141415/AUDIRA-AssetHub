# Contributing to AUDIRA AssetHub

First off, thank you for considering contributing to **AUDIRA AssetHub**! It's people like you that make this platform such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](../../issues) first to see if someone else has already created a ticket. If not, go ahead and [make one](../../issues/new)!

## Fork & create a branch

If this is something you think you can fix, then [fork AUDIRA AssetHub](https://help.github.com/articles/fork-a-repo) and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-new-dashboard-widget
```

## Get the test suite running

Make sure you're using Node.js v18+ and `pnpm`. Install dependencies and run tests:

```sh
pnpm install
pnpm test
```

## Implement your fix or feature

At this point, you're ready to make your changes. Feel free to ask for help; everyone is a beginner at first.

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with AUDIRA AssetHub's master branch:

```sh
git remote add upstream https://github.com/your-username/audira-assethub.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 325-add-new-dashboard-widget
git rebase master
git push --set-upstream origin 325-add-new-dashboard-widget
```

Finally, go to GitHub and [make a Pull Request](https://help.github.com/articles/creating-a-pull-request) :D

## Author Credit

Please note that this project was originally crafted and is maintained by **Agus Dwi R (AUDIRA)**. We appreciate your respect for the project's vision and design language.
