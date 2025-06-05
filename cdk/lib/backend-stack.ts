import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class BackendStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function to parse RSS
    const rssParserLambda = new lambda.Function(this, 'RssParserLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'gr-rss-parser.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
    });

    // API Gateway REST API
    const api = new apigateway.LambdaRestApi(this, 'RssApi', {
      handler: rssParserLambda,
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'], // Adjust to your frontend domain for security
        allowMethods: ['GET'],
      },
    });

    const rssResource = api.root.addResource('rss');
    rssResource.addMethod('GET'); // GET /rss

    this.apiUrl = api.url; // save the url for output or frontend usage

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });
  }
}
