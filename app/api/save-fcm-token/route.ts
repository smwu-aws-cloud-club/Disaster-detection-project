import { NextResponse } from 'next/server'
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export async function POST(request: Request) {
  try {
    const { token, userId } = await request.json()

    if (!token || !userId) {
      return NextResponse.json(
        { error: 'Token and userId are required' },
        { status: 400 }
      )
    }

    const command = new PutItemCommand({
      TableName: 'fcm_tokens',
      Item: marshall({
        userId,
        token,
        createdAt: new Date().toISOString()
      })
    })

    await client.send(command)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving FCM token:', error)
    return NextResponse.json(
      { error: 'Failed to save FCM token' },
      { status: 500 }
    )
  }
} 