import { NextResponse } from 'next/server';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const command = new GetItemCommand({
      TableName: 'cctv_locations',
      Key: {
        id: { N: id }
      }
    });

    const { Item } = await client.send(command);
    
    if (!Item) {
      return NextResponse.json(
        { error: 'CCTV not found' },
        { status: 404 }
      );
    }

    const cctv = unmarshall(Item);
    return NextResponse.json({
      id: cctv.id,
      name: cctv.name,
      address: cctv.address,
      lat: cctv.lat,
      lng: cctv.lng,
      cctvUrl: cctv.cctvUrl,
      city: cctv.city,
      district: cctv.district,
      status: cctv.status || true
    });
  } catch (error) {
    console.error('Error fetching CCTV by ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CCTV data' },
      { status: 500 }
    );
  }
} 