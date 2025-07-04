import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phoneNum, password, city, district } = body;

    // TODO: Implement actual user registration logic
    // For now, return a mock response
    if (name && phoneNum && password && city && district) {
      return NextResponse.json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: 1,
          name: name,
          phoneNum: phoneNum,
          city: city,
          district: district
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 