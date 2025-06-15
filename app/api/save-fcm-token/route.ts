import { NextResponse } from 'next/server'
import { DynamoDBClient, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

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

    // Check if token already exists for this user
    const getCommand = new GetItemCommand({
      TableName: 'fcm_tokens',
      Key: marshall({
        userId
      })
    })

    const { Item } = await client.send(getCommand)

    if (Item) {
      const existingToken = unmarshall(Item)
      if (existingToken.token === token) {
        return NextResponse.json({ 
          success: true, 
          message: 'Token already exists' 
        })
      }
    }

    // Save new token
    const putCommand = new PutItemCommand({
      TableName: 'fcm_tokens',
      Item: marshall({
        userId,
        token,
        createdAt: new Date().toISOString()
      })
    })

    await client.send(putCommand)

    return NextResponse.json({ 
      success: true, 
      message: 'Token saved successfully' 
    })
  } catch (error) {
    console.error('Error saving FCM token:', error)
    return NextResponse.json(
      { error: 'Failed to save FCM token' },
      { status: 500 }
    )
  }
} 