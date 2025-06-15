import { NextResponse } from 'next/server';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Region } from '@/app/types/database';

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
      TableName: 'regions',
    });

    const { Items } = await client.send(command);
    
    if (!Items) {
      return NextResponse.json([]);
    }

    const regions = Items.map(item => {
      const unmarshalled = unmarshall(item);
      return {
        region: unmarshalled.region as string,
        status: unmarshalled.status as boolean,
        timestamp: unmarshalled.timestamp as number,
      } as Region;
    });

    return NextResponse.json(regions);
  } catch (error) {
    console.error('Error fetching regions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regions' },
      { status: 500 }
    );
  }
} 