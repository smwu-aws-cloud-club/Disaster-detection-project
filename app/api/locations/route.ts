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
      TableName: 'locations',
    });

    const { Items } = await client.send(command);
    
    if (!Items) {
      return NextResponse.json([]);
    }

    const locations = Items.map(item => unmarshall(item)).map(location => ({
      value: location.id,
      label: location.name,
      hasCCTV: location.hasCCTV || false,
      lat: location.latitude,
      lng: location.longitude,
    }));

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
} 