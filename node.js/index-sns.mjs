import {SNS, PublishCommand} from "@aws-sdk/client-sns";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {QueryCommand, DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

const sns = new SNS({region: "ap-northeast-1"});
const dynamoClient = new DynamoDBClient({region: "ap-northeast-2"});
const ddbDocClient = DynamoDBDocumentClient.from(dynamoClient);

const getPhoneNumbersByRegionFromDynamoDB = async (targetRegion) => {
  let phoneNumbers = [];
  const tableName = "Users"; // ⚠️ 실제 Users 테이블 이름으로 변경
  const gsiName = "region-index"; // ⚠️ 위에서 생성할 GSI의 이름으로 변경

  let ExclusiveStartKey = undefined;

  do {
    const command = new QueryCommand({
      TableName: tableName,
      IndexName: gsiName, // GSI를 지정하여 쿼리합니다.
      KeyConditionExpression: "#regionName = :targetRegionValue", // GSI의 PK (region)에 대한 조건
      ExpressionAttributeNames: {
        "#regionName": "region", // GSI의 Partition Key 필드명
      },
      ExpressionAttributeValues: {
        ":targetRegionValue": targetRegion, // 쿼리할 region 값
      },
      ProjectionExpression: "phoneNumber", // 가져올 속성만 지정 (이 경우 phoneNumber)
      ExclusiveStartKey,
    });

    const result = await ddbDocClient.send(command);
    result.Items?.forEach((item) => {
      if (item.phoneNumber) {
        phoneNumbers.push(item.phoneNumber);
      }
    });

    ExclusiveStartKey = result.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return phoneNumbers;
};

export const handler = async (event) => {
  const region = event.region || "미지정";
  const message = `${region}에서 재난이 발생했습니다.`;
  let phoneNumbers;
  // phoneNumbers = ["+821051039694"];

  if (region === "미지정" || !region) {
    console.warn("Region is missing or undefined for SNS notification.");
    return {
      statusCode: 400,
      body: JSON.stringify({message: "유효한 지역 정보가 필요합니다."}),
    };
  }

  try {
    phoneNumbers = await getPhoneNumbersByRegionFromDynamoDB(region);
    if (!phoneNumbers.length) {
      console.log(`💡 ${region} 지역에 등록된 전화번호가 없어 SMS를 보내지 않습니다.`);
      return {
        statusCode: 200,
        body: JSON.stringify({message: `SMS 알림 전송 대상 없음 (${region} 지역)`, region: region}),
      };
    }
  } catch (error) {
    console.error("전화번호 조회 실패:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({message: "전화번호 조회 실패", error: error.message}),
    };
  }

  const sendSms = async (number) => {
    try {
      await sns.publish({
        Message: message,
        PhoneNumber: number,
        MessageAttributes: {
          "AWS.SNS.SMS.SMSType": {
            DataType: "String",
            StringValue: "Transactional", // 'Promotional' 또는 'Transactional'
          },
        },
      });
      console.log(`${number} 전송 성공`);
      return null; // 성공 시 null 반환
    } catch (error) {
      console.error(`❌ ${number} 전송 실패`, error.message);
      return {number, error: error.message}; // 실패 시 에러 정보 반환
    }
  };

  const results = await Promise.all(phoneNumbers.map(sendSms));
  const failed = results.filter((r) => r !== null); // 실패한 항목만 필터링

  if (failed.length > 0) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "일부 또는 전체 SMS 전송 실패",
        failed,
        region: region,
        totalSent: phoneNumbers.length - failed.length, // 성공적으로 전송된 수
        totalFailed: failed.length, // 실패한 수
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({message: `SMS 전송 완료 (${region} 지역 ${phoneNumbers.length}명)`, region: region}),
  };
};