"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Location {
  value: string
  label: string
  hasCCTV: boolean
  lat: number
  lng: number
}

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    location: "",
    lat: 0,
    lng: 0
  })
  const [open, setOpen] = useState(false)
  const [phoneError, setPhoneError] = useState("")
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetch available CCTV locations from backend
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/cctv-locations')
        if (!response.ok) {
          throw new Error('Failed to fetch locations')
        }
        const data = await response.json()
        setLocations(data.map((loc: any) => ({
          value: loc.name,
          label: loc.name,
          hasCCTV: true,
          lat: loc.lat,
          lng: loc.lng
        })))
      } catch (error) {
        console.error('Error fetching locations:', error)
        // Fallback to sample data if API fails
        setLocations([
          { value: "강남구", label: "강남구", hasCCTV: true, lat: 37.5172, lng: 127.0473 },
          { value: "송파구", label: "송파구", hasCCTV: true, lat: 37.5145, lng: 127.1066 },
          { value: "서초구", label: "서초구", hasCCTV: true, lat: 37.4837, lng: 127.0324 },
          { value: "마포구", label: "마포구", hasCCTV: true, lat: 37.5637, lng: 126.9086 },
          { value: "용산구", label: "용산구", hasCCTV: true, lat: 37.5326, lng: 126.9907 },
          { value: "중구", label: "중구", hasCCTV: true, lat: 37.5640, lng: 126.9970 },
          { value: "종로구", label: "종로구", hasCCTV: true, lat: 37.5724, lng: 126.9760 },
          { value: "성동구", label: "성동구", hasCCTV: true, lat: 37.5633, lng: 127.0366 },
        ])
      }
    }

    fetchLocations()
  }, [])

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/
    return phoneRegex.test(phone)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Format phone number as user types
    let formatted = value.replace(/[^0-9]/g, '')
    if (formatted.length > 0) {
      if (formatted.length <= 3) {
        formatted = formatted
      } else if (formatted.length <= 7) {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3)}`
      } else {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 7)}-${formatted.slice(7, 11)}`
      }
    }
    setFormData({ ...formData, phoneNumber: formatted })
    
    if (formatted.length > 0 && !validatePhoneNumber(formatted)) {
      setPhoneError("010-XXXX-XXXX 형식으로 입력해주세요")
    } else {
      setPhoneError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!validatePhoneNumber(formData.phoneNumber)) {
      toast({
        title: "전화번호 형식 오류",
        description: "010-XXXX-XXXX 형식으로 입력해주세요",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!formData.location) {
      toast({
        title: "위치 선택 오류",
        description: "위치를 선택해주세요",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Here you would typically send the data to your backend
      // const response = await fetch('/api/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      
      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify({
        ...formData,
        isLoggedIn: true
      }))

      toast({
        title: "회원가입 완료",
        description: "홈으로 이동합니다.",
        duration: 3000,
      })
      
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: "다시 시도해주세요",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">재난 알림 서비스 회원가입</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">이름</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">전화번호</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              placeholder="010-0000-0000"
              required
            />
            {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
          </div>
          <div className="space-y-2">
            <Label>위치</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {formData.location || "위치를 선택하세요"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="위치 검색..." />
                  <CommandEmpty>위치를 찾을 수 없습니다.</CommandEmpty>
                  <CommandGroup>
                    {locations.map((location) => (
                      <CommandItem
                        key={location.value}
                        value={location.value}
                        onSelect={(currentValue) => {
                          const selectedLocation = locations.find(loc => loc.value === currentValue)
                          setFormData({ 
                            ...formData, 
                            location: currentValue,
                            lat: selectedLocation?.lat || 0,
                            lng: selectedLocation?.lng || 0
                          })
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.location === location.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="flex items-center gap-2">
                          {location.label}
                          {location.hasCCTV && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              CCTV
                            </span>
                          )}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "처리중..." : "가입하기"}
          </Button>
        </form>
      </div>
    </div>
  )
}
