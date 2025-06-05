import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';


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

    const cacheBucket = new s3.Bucket(this, 'RssCacheBucket', {
        removalPolicy: cdk.RemovalPolicy.DESTROY, // Change to RETAIN in production
        autoDeleteObjects: true, // Only allowed with DESTROY policy
        lifecycleRules: [
          {
            expiration: cdk.Duration.days(1), // Optional: auto-delete cached files after 1 day
          },
        ],
      });

      cacheBucket.grantReadWrite(rssParserLambda);
      rssParserLambda.addEnvironment('CACHE_BUCKET', cacheBucket.bucketName);

  }
}
