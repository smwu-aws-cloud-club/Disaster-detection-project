"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft } from "lucide-react"

interface DisasterLocation {
  id: number
  name: string
  lat: number
  lng: number
  status: "disaster"
}

export default function DisasterSimulationPage() {
  const router = useRouter()
  const [disasterLocations, setDisasterLocations] = useState<DisasterLocation[]>([])

  useEffect(() => {
    const handleDisaster = (e: CustomEvent<{ locations: DisasterLocation[] }>) => {
      setDisasterLocations(e.detail.locations)
    }

    window.addEventListener("disasterDetected", handleDisaster as EventListener)
    return () => {
      window.removeEventListener("disasterDetected", handleDisaster as EventListener)
    }
  }, [])

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
            {disasterLocations.length > 0 ? (
              <div className="space-y-4">
                {disasterLocations.map((location) => (
                  <div
                    key={location.id}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <h3 className="font-bold text-red-700">{location.name}</h3>
                    <p className="text-sm text-red-600">
                      위도: {location.lat.toFixed(6)}, 경도: {location.lng.toFixed(6)}
                    </p>
                    <p className="text-sm text-red-600 mt-2">
                      재난 발생 시간: {new Date().toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                현재 발생한 재난이 없습니다.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 