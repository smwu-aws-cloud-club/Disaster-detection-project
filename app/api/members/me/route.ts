import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // TODO: Implement actual user profile fetching logic
    // For now, return a mock response
    return NextResponse.json({
      id: 1,
      name: 'Test User',
      phoneNum: '010-1234-5678',
      city: '서울특별시',
      district: '강남구',
      verified: true
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, phoneNum, city, district } = body;

    // TODO: Implement actual user profile update logic
    // For now, return a mock response
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: 1,
        name: name || 'Test User',
        phoneNum: phoneNum || '010-1234-5678',
        city: city || '서울특별시',
        district: district || '강남구'
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 