/// <reference path="./.sst/platform/config.d.ts" />

/**
 * SST Configuration for White Rose Speakers
 *
 * Deploys Next.js app using OpenNext to AWS Lambda + CloudFront
 *
 * Usage:
 *   npx sst dev          # Local development with live Lambda
 *   npx sst deploy       # Deploy to AWS
 *   npx sst remove       # Remove all resources
 */

export default $config({
  app(input) {
    return {
      name: "whiterose",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: input?.stage === "production",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
      },
    };
  },
  async run() {
    // Environment variables for the Next.js application
    const environment = {
      // DynamoDB Tables
      DYNAMODB_CONTENT_TABLE: "wrs-content",
      DYNAMODB_ARTICLES_TABLE: "wrs-articles",
      DYNAMODB_EVENTS_TABLE: "wrs-events",
      DYNAMODB_GALLERY_TABLE: "wrs-gallery",
      DYNAMODB_SUBSCRIBERS_TABLE: "wrs-subscribers",

      // S3 & CloudFront
      S3_BUCKET_NAME: "wrs-images-058264552608",
      CLOUDFRONT_URL: "https://d1onsjo8rd4nrx.cloudfront.net",

      // Cognito
      NEXT_PUBLIC_COGNITO_USER_POOL_ID: "us-east-1_K6fqek0I4",
      NEXT_PUBLIC_COGNITO_CLIENT_ID: "71l32873gcdqh48ngbrshutlq2",

      // Site Configuration
      NEXT_PUBLIC_SITE_URL: $app.stage === "production"
        ? "https://whiterosespeakers.co.uk"
        : "https://dev.whiterosespeakers.co.uk",
      NEXT_PUBLIC_DEV_MODE: "false",

      // Email
      SES_SENDER_EMAIL: "noreply@whiterosespeakers.co.uk",
    };

    // Deploy Next.js site
    const site = new sst.aws.Nextjs("WhiteRoseSite", {
      // Custom domain configuration - using Route 53
      domain: $app.stage === "production"
        ? {
            name: "whiterosespeakers.co.uk",
            redirects: ["www.whiterosespeakers.co.uk"],
          }
        : undefined,

      // Environment variables
      environment,

      // Server function configuration
      server: {
        // Memory allocation for Lambda
        memory: "1024 MB",

        // Timeout for SSR functions
        timeout: "30 seconds",

        // Node.js runtime version
        runtime: "nodejs22.x",
      },

      // Warm up Lambda functions to reduce cold starts
      warm: $app.stage === "production" ? 1 : 0,

      // IAM permissions for AWS services
      permissions: [
        {
          actions: [
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
            "dynamodb:Query",
            "dynamodb:Scan",
          ],
          resources: [
            "arn:aws:dynamodb:us-east-1:*:table/wrs-*",
            "arn:aws:dynamodb:us-east-1:*:table/wrs-*/index/*",
          ],
        },
        {
          actions: [
            "s3:GetObject",
            "s3:PutObject",
            "s3:DeleteObject",
          ],
          resources: [
            "arn:aws:s3:::wrs-images-*/*",
          ],
        },
        {
          actions: [
            "ses:SendEmail",
            "ses:SendRawEmail",
          ],
          resources: ["*"],
        },
        {
          actions: [
            "cognito-idp:ListUsers",
            "cognito-idp:AdminCreateUser",
            "cognito-idp:AdminDeleteUser",
            "cognito-idp:AdminAddUserToGroup",
            "cognito-idp:AdminRemoveUserFromGroup",
            "cognito-idp:AdminListGroupsForUser",
            "cognito-idp:AdminSetUserPassword",
            "cognito-idp:AdminEnableUser",
            "cognito-idp:AdminDisableUser",
          ],
          resources: ["arn:aws:cognito-idp:us-east-1:*:userpool/us-east-1_K6fqek0I4"],
        },
      ],
    });

    return {
      url: site.url,
      stage: $app.stage,
    };
  },
});
