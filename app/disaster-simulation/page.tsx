"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft } from "lucide-react"

interface DisasterLocation {
  id: number
  name: string
  time: string
  location: string
  type: string
  status: string
}

export default function DisasterSimulationPage() {
  const router = useRouter()
  const [disasterLocations, setDisasterLocations] = useState<DisasterLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/disasters')
        if (!response.ok) {
          throw new Error('Failed to fetch disaster data')
        }
        const data = await response.json()
        setDisasterLocations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch disaster data')
        console.error('Error fetching disasters:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDisasters()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            className="mb-6"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            지도로 돌아가기
          </Button>
          <Card>
            <CardContent className="p-8">
              <div className="text-center">데이터를 불러오는 중...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            className="mb-6"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            지도로 돌아가기
          </Button>
          <Card>
            <CardContent className="p-8">
              <div className="text-center text-red-600">오류: {error}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          지도로 돌아가기
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              재난 발생 지역
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disasterLocations.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  현재 발생한 재난이 없습니다.
                </div>
              ) : (
                disasterLocations.map((location) => (
                  <div
                    key={location.id}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <h3 className="font-bold text-red-700">{location.name}</h3>
                    <p className="text-sm text-red-600 mt-2">
                      재난 발생 시간: {location.time}
                    </p>
                    <p className="text-sm text-red-600">
                      위치: {location.location}
                    </p>
                    <p className="text-sm text-red-600">
                      유형: {location.type}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 