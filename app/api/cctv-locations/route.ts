import { NextResponse } from 'next/server'
import { DynamoDBClient, ScanCommand, AttributeValue } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

interface UnmarshalledItem {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  detection: string
  cctvUrl: string
}

export async function GET() {
  try {
    const command = new ScanCommand({
      TableName: 'cctv_locations'
    })

    const { Items } = await client.send(command)
    
    // Transform DynamoDB items to the expected format
    const locations = Items?.map((item: Record<string, AttributeValue>) => {
      const unmarshalled = unmarshall(item) as UnmarshalledItem
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