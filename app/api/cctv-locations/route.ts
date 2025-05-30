import { NextResponse } from 'next/server'
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

interface DynamoDBItem {
  id: { N: string }
  name: { S: string }
  address: { S: string }
  lat: { N: string }
  lng: { N: string }
  detection: { S: string }
  cctvUrl: { S: string }
}

export async function GET() {
  try {
    const command = new ScanCommand({
      TableName: 'cctv_locations'
    })

    const { Items } = await client.send(command)
    
    // Transform DynamoDB items to the expected format
    const locations = Items?.map((item: DynamoDBItem) => {
      const unmarshalled = unmarshall(item)
      return {
        id: unmarshalled.id,
        name: unmarshalled.name,
        address: unmarshalled.address,
        lat: unmarshalled.lat,
        lng: unmarshalled.lng,
        detection: unmarshalled.detection,
        cctvUrl: unmarshalled.cctvUrl
      }
    }) || []

    return NextResponse.json(locations)
  } catch (error) {
    console.error('DynamoDB Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CCTV locations' },
      { status: 500 }
    )
  }
} 