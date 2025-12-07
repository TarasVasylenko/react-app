import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

export class SecureWebStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const ReactAppBucket = new s3.Bucket(this, 'ReactAppBucket', {
            bucketName: `react-app-${this.account}`,
        });

        const distribution = new cloudfront.Distribution(this, 'ReactAppDistribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: origins.S3BucketOrigin.withOriginAccessControl(ReactAppBucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            errorResponses: [
                {
                    httpStatus: 403,
                    responsePagePath: '/index.html',
                    responseHttpStatus: 200,
                    ttl: cdk.Duration.seconds(0),
                },
                {
                    httpStatus: 404,
                    responsePagePath: '/index.html',
                    responseHttpStatus: 200,
                    ttl: cdk.Duration.seconds(0),
                },
            ],
        });

        new BucketDeployment(this, 'ReactAppBucketDeployment', {
            sources: [Source.asset('../front-end/dist')],
            destinationBucket: ReactAppBucket,
            distribution: distribution,
            distributionPaths: ['/*'],
        });
    }
}
