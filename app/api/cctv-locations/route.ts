import { NextResponse } from 'next/server'

// This would typically come from your database
const cctvLocations = [
  { id: 1, name: "강남구", lat: 37.5172, lng: 127.0473, status: "normal" },
  { id: 2, name: "송파구", lat: 37.5145, lng: 127.1066, status: "normal" },
  { id: 3, name: "서초구", lat: 37.4837, lng: 127.0324, status: "normal" },
  { id: 4, name: "마포구", lat: 37.5637, lng: 126.9086, status: "normal" },
  { id: 5, name: "용산구", lat: 37.5326, lng: 126.9907, status: "normal" },
]

export async function GET() {
  // In a real application, you would fetch this data from your database
  return NextResponse.json(cctvLocations)
} 