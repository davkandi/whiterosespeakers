import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as ses from "aws-cdk-lib/aws-ses";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class WhiteRoseSpeakersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // =====================
    // DynamoDB Tables
    // =====================

    // Content Table (for static pages)
    const contentTable = new dynamodb.Table(this, "ContentTable", {
      tableName: "wrs-content",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Articles Table
    const articlesTable = new dynamodb.Table(this, "ArticlesTable", {
      tableName: "wrs-articles",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Add GSI for querying by status and date
    articlesTable.addGlobalSecondaryIndex({
      indexName: "status-publishedAt-index",
      partitionKey: { name: "status", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "publishedAt", type: dynamodb.AttributeType.STRING },
    });

    // Events Table
    const eventsTable = new dynamodb.Table(this, "EventsTable", {
      tableName: "wrs-events",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Add GSI for querying by type and date
    eventsTable.addGlobalSecondaryIndex({
      indexName: "type-date-index",
      partitionKey: { name: "type", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "date", type: dynamodb.AttributeType.STRING },
    });

    // Gallery Table
    const galleryTable = new dynamodb.Table(this, "GalleryTable", {
      tableName: "wrs-gallery",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Subscribers Table
    const subscribersTable = new dynamodb.Table(this, "SubscribersTable", {
      tableName: "wrs-subscribers",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // =====================
    // S3 Bucket for Images
    // =====================

    const imagesBucket = new s3.Bucket(this, "ImagesBucket", {
      bucketName: `wrs-images-${this.account}`,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
          ],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });

    // =====================
    // CloudFront Distribution
    // =====================

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OAI"
    );

    imagesBucket.grantRead(originAccessIdentity);

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(imagesBucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    // =====================
    // Cognito User Pool
    // =====================

    const userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: "wrs-admin-users",
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Create Admin group
    new cognito.CfnUserPoolGroup(this, "AdminGroup", {
      userPoolId: userPool.userPoolId,
      groupName: "Admins",
      description: "Administrator group with full access",
    });

    // User Pool Client
    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      userPoolClientName: "wrs-web-client",
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      preventUserExistenceErrors: true,
    });

    // =====================
    // SES (Email)
    // =====================

    // Note: SES identity verification must be done manually in the console
    // or via a separate process

    // =====================
    // IAM Role for Lambda/API
    // =====================

    const apiRole = new iam.Role(this, "ApiRole", {
      roleName: "wrs-api-role",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    // Grant DynamoDB access
    contentTable.grantReadWriteData(apiRole);
    articlesTable.grantReadWriteData(apiRole);
    eventsTable.grantReadWriteData(apiRole);
    galleryTable.grantReadWriteData(apiRole);
    subscribersTable.grantReadWriteData(apiRole);

    // Grant S3 access
    imagesBucket.grantReadWrite(apiRole);

    // Grant SES access
    apiRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail", "ses:SendRawEmail"],
        resources: ["*"],
      })
    );

    // =====================
    // Outputs
    // =====================

    new cdk.CfnOutput(this, "ContentTableName", {
      value: contentTable.tableName,
      description: "DynamoDB Content Table Name",
    });

    new cdk.CfnOutput(this, "ArticlesTableName", {
      value: articlesTable.tableName,
      description: "DynamoDB Articles Table Name",
    });

    new cdk.CfnOutput(this, "EventsTableName", {
      value: eventsTable.tableName,
      description: "DynamoDB Events Table Name",
    });

    new cdk.CfnOutput(this, "GalleryTableName", {
      value: galleryTable.tableName,
      description: "DynamoDB Gallery Table Name",
    });

    new cdk.CfnOutput(this, "SubscribersTableName", {
      value: subscribersTable.tableName,
      description: "DynamoDB Subscribers Table Name",
    });

    new cdk.CfnOutput(this, "ImagesBucketName", {
      value: imagesBucket.bucketName,
      description: "S3 Images Bucket Name",
    });

    new cdk.CfnOutput(this, "CloudFrontUrl", {
      value: `https://${distribution.distributionDomainName}`,
      description: "CloudFront Distribution URL",
    });

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
      description: "Cognito User Pool ID",
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
      description: "Cognito User Pool Client ID",
    });
  }
}
