#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WhiteRoseSpeakersStack } from "../lib/wrs-stack";

const app = new cdk.App();

new WhiteRoseSpeakersStack(app, "WhiteRoseSpeakersStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || "eu-west-2",
  },
  description: "White Rose Speakers Leeds - Infrastructure Stack",
  tags: {
    Project: "WhiteRoseSpeakers",
    Environment: "Production",
  },
});
