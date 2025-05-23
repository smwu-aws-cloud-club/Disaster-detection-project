import dotenv from "dotenv";
import {SNS} from "@aws-sdk/client-sns";
import {DynamoDBClient, ScanCommand} from "@aws-sdk/client-dynamodb";

dotenv.config();

const sns = new SNS({region: "ap-northeast-1"});
const dynamo = new DynamoDBClient({region: "ap-northeast-2"});

const getPhoneNumbers = async () => {
  const phoneNumbers = [];

  let ExclusiveStartKey = undefined;

  do {
    const command = new ScanCommand({
      TableName: "Users", // 이름 지정 필요
      ProjectionExpression: "phoneNumber",
      ExclusiveStartKey,
    });

    const result = await dynamo.send(command);
    result.Items?.forEach((item) => {
      if (item.phoneNumber?.S) {
        phoneNumbers.push(item.phoneNumber.S);
      }
    });

    ExclusiveStartKey = result.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return phoneNumbers;
};

export const handler = async (event) => {
  const region = event.region || "미지정";
  let phoneNumbers;
  phoneNumbers = ["+821051039694"];
  const message = `${region}에서 재난이 발생했습니다.`;

  // try {
  //   phoneNumbers = await getPhoneNumbersFromDynamoDB();
  //   if (!phoneNumbers.length) throw new Error("전화번호 없음");
  // } catch (error) {
  //   console.error("전화번호 조회 실패:", error.message);
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({message: "전화번호 조회 실패", error: error.message}),
  //   };
  // }

  const sendSms = async (number) => {
    try {
      await sns.publish({
        Message: message,
        PhoneNumber: number,
      });
      console.log(`${number} 전송 성공`);
    } catch (error) {
      console.error(`❌ ${number} 전송 실패`, error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({message: "알림 전송 실패", error: error.message}),
      };
    }
  };
  await Promise.all(phoneNumbers.map(sendSms));

  return {
    statusCode: 200,
    body: JSON.stringify({message: "SMS 전송 완료"}),
    // body: JSON.stringify({message: "SMS 전송 완료", count: phoneNumbers.length}),
  };
};
