#!/usr/bin/env node
import 'source-map-support/register';
import {App} from 'aws-cdk-lib';
import { FrontEndRootStack } from '../lib/frontend-root-stack';
import { BackendStack } from '../lib/backend-stack';

const app = new App();

new FrontEndRootStack(app, 'FrontEndRootStack', {
  env: { 
    account: '432083695606',
    region: 'us-east-1' 
  },
});

new BackendStack(app, 'BackendStack', {
  env: { 
    account: '432083695606',
    region: 'us-east-1' 
  },
});