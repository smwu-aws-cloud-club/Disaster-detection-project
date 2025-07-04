import { NextResponse } from 'next/server';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function GET() {
  try {
    const command = new ScanCommand({
      TableName: 'disasters',
    });

    const { Items } = await client.send(command);
    
    if (!Items) {
      return NextResponse.json([]);
    }

    const disasters = Items.map(item => {
      const unmarshalled = unmarshall(item);
      return {
        id: unmarshalled.id,
        name: unmarshalled.name,
        time: unmarshalled.time,
        location: unmarshalled.location,
        type: unmarshalled.type || 'fire',
        status: unmarshalled.status || 'active'
      };
    });

    return NextResponse.json(disasters);
  } catch (error) {
    console.error('Error fetching disasters:', error);
    // Return mock data if DynamoDB is not available
    return NextResponse.json([
      {
        id: 1,
        name: "서울시 강남구",
        time: "2024-03-20 14:30:00",
        location: "서울특별시 강남구",
        type: "fire",
        status: "active"
      },
      {
        id: 2,
        name: "부산시 해운대구",
        time: "2024-03-20 14:35:00",
        location: "부산광역시 해운대구",
        type: "fire",
        status: "active"
      },
      {
        id: 3,
        name: "대구시 수성구",
        time: "2024-03-20 14:40:00",
        location: "대구광역시 수성구",
        type: "fire",
        status: "active"
      }
    ]);
  }
} 