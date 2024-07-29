# ⚡ serverless-examples

A collection of example projects built with Serverless framework on AWS.

| Example                                                           | Description                                                                                                                                                                                                                                      | Used Services                                                         |
| :---------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| [dynamodb-streams](/dynamodb-streams)                             | This example reimplements AWS developer guide [tutorial](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.Lambda.Tutorial.html) (`Process New Items with DynamoDB Streams and Lambda`) through the Serverless Framework. | Lambda, DynamoDB (with stream enabled), and SNS                       |
| [secrets-manager](/secrets-manager)                               | Demonstrates how to access Secrets Manager in a Lambda function using the `aws-sdk` and the `AWS Parameters and Secrets Lambda Extension`                                                                                                        | Lambda and Secrets Manager                                            |
| [event-bus-via-sns](/event-bus-via-sns)                           | Event Bus pattern in Serverless architectures using SNS, SQS, and Lambda                                                                                                                                                                         | SNS, SQS, and Lambda                                                  |
| [attr-based-access-ctrl](/attr-based-access-ctrl)                 | A full-stack application demonstrating the implementation of [attribute-based access control](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html) (ABAC)                                          | Cognito (User pool & Identity pool), Lambda, IAM, S3, and API Gateway |
| [deployment-with-github-actions](/deployment-with-github-actions) | Demonstrates how to securely deploy an application to AWS using GitHub Actions                                                                                                                                                                   | IAM (Roles and OIDC provider) and GitHub Actions                      |

### Credits

- Inspired by [serverless/examples](https://github.com/serverless/examples) project
