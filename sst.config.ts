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
          region: "eu-west-2",
        },
      },
    };
  },
  async run() {
    // Environment variables for the Next.js application
    const environment = {
      // AWS Region
      AWS_REGION: "eu-west-2",

      // DynamoDB Tables
      DYNAMODB_CONTENT_TABLE: "wrs-content",
      DYNAMODB_ARTICLES_TABLE: "wrs-articles",
      DYNAMODB_EVENTS_TABLE: "wrs-events",
      DYNAMODB_GALLERY_TABLE: "wrs-gallery",
      DYNAMODB_SUBSCRIBERS_TABLE: "wrs-subscribers",

      // S3 & CloudFront (from environment or secrets)
      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || "",
      CLOUDFRONT_URL: process.env.CLOUDFRONT_URL || "",

      // Cognito
      NEXT_PUBLIC_COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID || "",
      NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID || "",

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
      // Custom domain configuration
      domain: $app.stage === "production"
        ? {
            name: "whiterosespeakers.co.uk",
            dns: false, // We manage DNS externally
            cert: process.env.ACM_CERTIFICATE_ARN,
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
              `arn:aws:dynamodb:eu-west-2:*:table/wrs-*`,
              `arn:aws:dynamodb:eu-west-2:*:table/wrs-*/index/*`,
            ],
          },
          {
            actions: [
              "s3:GetObject",
              "s3:PutObject",
              "s3:DeleteObject",
            ],
            resources: [
              `arn:aws:s3:::wrs-images-*/*`,
            ],
          },
          {
            actions: [
              "ses:SendEmail",
              "ses:SendRawEmail",
            ],
            resources: ["*"],
          },
        ],
      },

      // Warm up Lambda functions to reduce cold starts
      warm: $app.stage === "production" ? 1 : 0,
    });

    return {
      url: site.url,
      stage: $app.stage,
    };
  },
});
