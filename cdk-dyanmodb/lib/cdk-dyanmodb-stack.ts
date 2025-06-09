import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class CdkDyanmodbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fcmTokensTable = new dynamodb.Table(this, "FcmTokensTable", {
      // 고유한 ID (예: "FcmTokensTable")
      tableName: "FcmTokens", // 실제 DynamoDB 테이블 이름
      partitionKey: {
        // Key
        name: "token",
        type: dynamodb.AttributeType.STRING,
      },
      timeToLiveAttribute: "expireAt", // TTL 필드 설정
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // 온디맨드 모드
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 같이 삭제
    });
    // 2. Region 테이블 생성
    const regionsTable = new dynamodb.Table(this, "RegionsTable", {
      tableName: "Regions",
      partitionKey: {
        name: "region",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // isDisaster와 lastUpdatedAt -> 항목(item) 데이터 저장 시 추가
      // DynamoDB는 schemaless -> PK/SK만 정의
    });

    const usersTable = new dynamodb.Table(this, "UsersTable", {
      tableName: "Users",
      partitionKey: {
        name: "phoneNumber",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "address",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    const cctvsTable = new dynamodb.Table(this, "CCTVsTable", {
      tableName: "CCTVs",
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.NUMBER,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    
    /*
    // (선택 사항) 테이블의 ARN 등을 CloudFormation 출력으로 내보내기
    new cdk.CfnOutput(this, "FcmTokensTableName", {
      value: fcmTokensTable.tableName,
      description: "The name of the FCM Tokens DynamoDB table",
    });
    new cdk.CfnOutput(this, "RegionTableName", {
      value: regionTable.tableName,
      description: "The name of the Region DynamoDB table",
    });
    */
  }
}

// npm install -g aws-cdk -> 전역 설치
// cdk --version          -> 설치 확인
// cdk init app --language typescript
  // 이건 더이상 안 쓰임
  // npm i @aws-cdk/aws-dynamodb
// npm install aws-cdk-lib constructs -> init 하면 자동 설치되긴 함

// aws cli 설정
  // which aws -> 확인 없으면 설치 필요
  // aws configure -> accesskey, secret, 지역, 형식 입력

// 처음: cdk bootstrap
// cdk synth
// cdk diff
// cdk deploy