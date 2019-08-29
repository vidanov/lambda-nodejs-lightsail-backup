# Automatic backups for AWS Lightsail

[![Video Instructions Automatic backups for AWS Lightsail](http://img.youtube.com/vi/vUy-eX20nsA/0.jpg)](http://www.youtube.com/watch?v=vUy-eX20nsA)

- [Video Instructions Automatic backups for AWS Lightsail](http://www.youtube.com/watch?v=vUy-eX20nsA)

This script for the AWS Lambda NodeJS is to automate the backup process for your AWS Lightsail instances easily. 

The AWS Lightsail is an excellent hosting service to start with it. The Lightsail backups are a no-brainer to use. They are very powerful and incremental. You pay only for the differences in your files. It means you can create a lot of backups without spending a fortune on them. It keeps your work safe. But sorrowfully you cannot set up automatic backups from the console of the service. Now you can solve this problem easily with the help of this manual.

**Benefits**
- Free of charge!
- Once set up, no need to worry 
- Daily, weekly and monthly backups

Follow the instructions here for the setup. It is easy!
We will use the AWS Lambda.

# Setup

There are two options now how to install it:

a) Manual installation (s. below).
It takes more time but you do not need to install anything. You can perform all steps in the AWS console using your web browser.

b) [Using serverles](serverless.md) created by Angel Abad Cerdeira.
It is a faster and better solution. It is easier to deploy for multiple Lightsail instances.


# The manual installation

We need to set up some permissions, so that our Lambda function has enough rights to do the job. 

***ATTENTION!*** The script will remove all snapshots you created if they are out of range. To keep them you need modify the script. I plan to change it to keep all manually created backups. But now be careful!

## Step 1. Create the IAM policy
 1. Sign up to the AWS console here https://aws.amazon.com
 2. Put IAM in the search field or go to https://console.aws.amazon.com/iam/
 3. Open the link POLICIES from the menu at the left and push the CREATE POLICY button.
 4. Go to the JSON tab. And put this text there
<pre><code>
    {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "Stmt1510233220000",
                    "Effect": "Allow",
                    "Action": [
                        "lightsail:CreateInstanceSnapshot",
                        "lightsail:DeleteInstanceSnapshot",
                        "lightsail:GetInstanceSnapshot",
                        "lightsail:GetInstanceSnapshots"
                    ],
                    "Resource": [
                        "*"
                    ]
                }
            ]
    }
</code></pre>  

 5. Push the REVIEW POLICY button. Give it the name ***lightsail_snapshots*** to it, put ***lightsail backups*** in the description and push the CREATE POLICY button. 
 
 
 ## Step 2. Create the IAM role

1. Click on the link ROLES in the menu at the left in the console
2. Push the button CREATE ROLE
3. Use preselected AWS Service tab and click on the link LAMBDA in the services list.
4. Push the button NEXT: PERMISSIONS
5. In the search field type **AWSLambdaBasicExecutionRole** and check the box for it, then type **lightsail_snapshots** and check the box for it too. Push the button NEXT: REVIEW
6. Give the role name ***LightsailsnapshotsRole*** push the button CREATE ROLE

## Step 3. Create Lambda function

 1. Go to the https://aws.amazon.com again
 2. Put the Lambda in the search field
 3. Push the button CREATE FUNCTION
 4. Use the preselected AUTHOR FROM SCRATCH tab, give the name for the function ***LightSailBackup***
 5. Use the "Node.js 6.10" for Runtime and "Choose an existing role" for the Role. Choose the ***LightsailsnapshotsRole*** role you created in the step 2. Push the button CREATE FUNCTION
 6. In the panel Add triggers at the left click the CLOUD WATCH EVENTS link. In the 'Rule' section select 'Create a new rule'. Give the name ***daily*** in the 'Schedule expression' section put ***rate(1 day)*** and push the ADD button.
 7. Click on the block "LightSailBackup" again and paste in the 'Function Code' field the code from here  (the index.js contents in this repository)
 https://raw.githubusercontent.com/vidanov/lambda-nodejs-lightsail-backup/master/index.js
 Change the name of the ***instanceName*** in the function and set up the frequency of the backups.
 
  <pre><code>
        
        const backupDaysMax = 7; // keep at least 7 daily backups 
        
        const backupWeeksMax = 4; // keep at least 4  weekly  backups
        
        const backupMonthsMax = 3; // keep at least 3  monthly  backups
</code></pre>        

[Set the name, tag and the region (s. the picture)](https://raw.githubusercontent.com/vidanov/lambda-nodejs-lightsail-backup/master/Lambda%20Management%20Console%202019-08-29%2015-54-53(1).png) accordingly with environment variables
| instanceName | LAMP_Stack-2GB-Frankfurt-1 |
| labelTag | ABC |
| region | eu-central-1 |

 Your instance name and region can be found here (see image): 
http://take.ms/3KOAo

 
 8. Set timeout to 1 minute in Basic Settings for your Lambda function http://take.ms/yRMxp
 9. Push SAVE button at the top right.

## Step 4. A first run of your function

Attention! If you created some snapshots already they could be deleted after this run.
You will use the test in the AWS Lambda console for it.

 1. Select 'Configure test events' in the drop down left from the TEST button on the top of the window. Use preselected values.
 2. Give the name to the event ***TestMyFunction*** and push the CREATE button
 3. Push the TEST button 
 4. The new snapshot will be created for your instance. 
  
The script will remove old backups, that are not in the range of dates you set. The Lightsail backups are incremental and they are very economical to use for you.


JFYI: Weekly and monthly backups will be saved on Sundays. You need at least 7 daily backups for weekly and monthly backups work correctly.

Copyright 2011-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

http://aws.amazon.com/apache2.0/

## LICENSE
Copyright 2019 Alexey Vidanov, Angel Abad Cerdeira

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
