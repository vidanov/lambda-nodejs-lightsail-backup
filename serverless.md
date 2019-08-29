# Deployment using Serverless

## Prerequisites

- Install *Node*
  - Mac (assuming you already have [Homebrew](https://brew.sh/) installed):
    ```
    brew install node
    ```

  - Windows: Install WSL first (Windows Subsystem for Linux) and then install it in Ubuntu/Debian/SuSE...
  - Other: https://nodejs.org/en/download/

- Install *serverless*
```
npm install -g serverless
```

- Install *AWS CLI*:
https://aws.amazon.com/cli/

## Step 1: Install and prepare credentials

You need credentials to manipulate your AWS account from command line, if you don't have these already:

- Login to [AWS Console](https://console.aws.amazon.com/iam/home) in a web browser and add an IAM user:
  - Access type: `Programmatic access`
  - Attach existing policy: `AdministratorAccess` 

Grab `Access key ID` and `Secret Access key` and store them in a safe place. 

## Step 2: Edit [serverless.yaml](https://github.com/vidanov/lambda-nodejs-lightsail-backup/blob/master/serverless.yaml)

- Change line 32 `instanceName` with the name of your instance in LightSail.
- Change line 34 `labelTag` so the snapshots have unique names in case you create more Lambda functions for other instances.
- Change line 8 and 30 `region` with the region where your LightSail instance is.

## Step 3: Setup

- In command line define your credentials and region so AWS CLI can do changes in your account:
```
export AWS_REGION=
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
```

## Step 3: Deploy
- Create and/or update everything using *serverless*:
```
sls deploy
```

- Test your function (optional)

```
sls invoke -f instance1
```
