"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera, AlertTriangle, User, LogOut } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Location {
  id: number
  name: string
  lat: number
  lng: number
  status: "normal" | "disaster"
}

// Sample CCTV locations for fallback
const sampleLocations: Location[] = [
  { id: 1, name: "강남구", lat: 37.5172, lng: 127.0473, status: "normal" },
  { id: 2, name: "송파구", lat: 37.5145, lng: 127.1066, status: "normal" },
  { id: 3, name: "서초구", lat: 37.4837, lng: 127.0324, status: "normal" },
  { id: 4, name: "마포구", lat: 37.5637, lng: 126.9086, status: "normal" },
  { id: 5, name: "용산구", lat: 37.5326, lng: 126.9907, status: "normal" },
]

// Location coordinates mapping
const locationCoordinates: { [key: string]: [number, number] } = {
  "강남구": [37.5172, 127.0473],
  "송파구": [37.5145, 127.1066],
  "서초구": [37.4837, 127.0324],
  "마포구": [37.5637, 126.9086],
  "용산구": [37.5326, 126.9907],
  "중구": [37.5637, 126.9977],
  "종로구": [37.5724, 126.9760],
  "성동구": [37.5633, 127.0366],
}

// Fetch CCTV locations from backend
async function fetchCCTVLocations(): Promise<Location[]> {
  try {
    const response = await fetch('/api/cctv-locations')
    if (!response.ok) {
      throw new Error('Failed to fetch CCTV locations')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching CCTV locations:', error)
    // Fallback to sample data if API fails
    return sampleLocations
  }
}

// Dynamic import for the map components
const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">지도를 불러오는 중...</p>
    </div>
  ),
})

export default function DisasterDetectionPage() {
  const [selectedCamera, setSelectedCamera] = useState<Location | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [locations, setLocations] = useState<Location[]>([])
  const [userLocation, setUserLocation] = useState<[number, number]>([37.5665, 126.9780])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    setIsLoggedIn(!!userData)

    if (userData) {
      const { location } = JSON.parse(userData)
      if (location && locationCoordinates[location]) {
        setUserLocation(locationCoordinates[location])
      }
    }

    // Fetch initial CCTV locations
    fetchCCTVLocations().then(setLocations)

    const handleDisaster = (e: CustomEvent<{ locations: Location[] }>) => {
      setLocations(e.detail.locations)
      router.push('/disaster-simulation')
    }

    window.addEventListener("disasterDetected", handleDisaster as EventListener)
    return () => {
      window.removeEventListener("disasterDetected", handleDisaster as EventListener)
    }
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem('userData')
    setIsLoggedIn(false)
    toast({
      title: "로그아웃 완료",
      description: "로그아웃되었습니다.",
    })
    router.push("/")
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto relative">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden aspect-square relative">
          <div className="absolute top-4 right-4 z-[1000] flex gap-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    프로필
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="font-semibold">
                <Link href="/signup">회원가입</Link>
              </Button>
            )}
          </div>

          <div className="h-full w-full">
            <MapWithNoSSR
              locations={locations}
              userLocation={userLocation}
              onSelectCamera={setSelectedCamera}
            />
          </div>

          <Dialog open={!!selectedCamera} onOpenChange={() => setSelectedCamera(null)}>
            <DialogContent className="max-w-3xl z-[9999]">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    {selectedCamera?.name} CCTV 화면
                    {selectedCamera?.status === "disaster" && (
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        재난 발생
                      </span>
                    )}
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="relative aspect-video bg-black rounded-md overflow-hidden">
                {selectedCamera?.status === "disaster" ? (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img src="/disaster-feed.png" alt="재난 CCTV 화면" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                        <span className="text-white text-sm font-mono">실시간</span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="text-white text-sm font-mono bg-black/50 px-2 py-1 rounded">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img src="/normal-feed.png" alt="정상 CCTV 화면" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-white text-sm font-mono">실시간</span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="text-white text-sm font-mono bg-black/50 px-2 py-1 rounded">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
