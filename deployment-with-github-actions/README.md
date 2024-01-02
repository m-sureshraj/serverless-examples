# deployment-with-github-actions

This example project demonstrates how to securely deploy an application to AWS using GitHub Actions.
It uses [OpenID Connect (OIDC)](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) for secure authentication with AWS.
This eliminates the need to store AWS credentials as long-lived GitHub secrets.

## Goals

- Build and run tests whenever a pull request that includes changes to this example project. [Workflow file: [build-test.yml](../.github/workflows/build-test.yml)]
- Manually deploy one of the example projects to `development` environment on AWS. [Workflow file: [deploy-to-dev-env.yml](../.github/workflows/deploy-to-dev-env.yml)]

## Prerequisites

- Add the GitHub OIDC provider to IAM,

## Setup

## Deployment
