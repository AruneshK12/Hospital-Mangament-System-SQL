# team048-PrimaryKeyPlayers
This is a template for CS411 project repository. Please make sure that your title follows the convention: [TeamID]-[YourTeamName]. All TeamIDs should have a three-digit coding (i.e. if you are team 20, you should have `team020` as your ID.). You should also ensure that your URL for this repository is [su24-cs411-team000-teamname.git] so TAs can correctly clone your repository and keep it up-to-date.

Once you set up your project, please remember to submit your team formation to the team form.

## Permission
Make your repository private. TAs will be able to access it even if it's private.

## Preparing for your release
Each submission should be in its own [release](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases). Release are specific freezes to your repository. You should submit your commit hash on PrairieLearn. When tagging your stage, please use the tag `stage.x` where x is the number to represent the stage.

## Keeping things up-to-date
Please make sure you keep your project root files up-to-date. Information for each file/folder are explained.

## Code Contribution
Individual code contributions will be used to evaluate individual contributions to the project.

## Running the project
Kindly make sure your IP is whitelisted in GCP SQL Studio
Run the following before running the application
```Bash
cd frontend
npm ci
cd ..
cd server
npm ci
```

Post this, to run the application kindly perform the same in 2 terminal windows

```Bash
cd frontend
npm run start
```
```Bash
cd server
npm run dev
```
