# Deployment using Serverless

## Step 1: Install and prepare credentials

- Install serverless:
https://github.com/nodesource/distributions/blob/master/README.md

- Install AWS CLI:
https://aws.amazon.com/cli/

- Login to AWS Console and add an IAM user:
  - Access type: `Programmatic access`
  - Attach existing policy: `AdministratorAccess` 
https://console.aws.amazon.com/iam/home

Grab `Access key ID` and `Secret Access key` and store them in a safe place. 

## Step 2: Edit `serverless.yaml` 

- Change line 32 `instanceName` with the name of your instance in LightSail.
- Change line 34 `labelTag` so the snapshots have unique names in case use you crreate more Lambda functions for other instances.
- Change line 9 and 36 `region` with the region where your LightSail instance is.

## Step 3: Setup

- Define your credentials and region so AWS CLI can manage your account:
```
export AWS_REGION=
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
```

- Create and/or update everything using *serverless*:
```
sls deploy
```

- Test your function

```
sls invoke -f instance1
```

## Notes:

- If you are going to deploy more than one function to manage more than one LightSail instance in the same region ensure that:
  - `labelTag` is different for each function
  - Optionally change `instance1` with something else in line 23, 49 and 56.

## TODO:

- Better output after calling `sls invoke`
- Better way of managing multiple LightSail instances in the same region.
