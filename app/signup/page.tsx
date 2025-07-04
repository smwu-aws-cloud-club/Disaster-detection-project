"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LocationOption } from "../utils/locations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocations } from "../hooks/useLocations"
import { useToast } from "@/components/ui/use-toast"

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { locations, loading, error } = useLocations()
  const [formData, setFormData] = useState({
    name: "",
    phoneNum: "",
    password: "",
    confirmPassword: "",
    city: "",
    district: "",
  })

  // Get unique cities
  const cities = locations.map(loc => loc.city)

  // Get districts for selected city
  const districts = locations.find(loc => loc.city === formData.city)?.districts || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phoneNum: formData.phoneNum,
          password: formData.password,
          city: formData.city,
          district: formData.district,
        }),
      })

      if (!response.ok) {
        throw new Error("Signup failed")
      }

      const data = await response.json()
      
      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(data))
      
      toast({
        title: "회원가입 완료",
        description: "환영합니다!",
      })
      
      router.push("/")
    } catch (error) {
      console.error("Error signing up:", error)
      toast({
        title: "회원가입 실패",
        description: "다시 시도해주세요",
        variant: "destructive",
      })
    }
  }

  const handleCityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      city: value,
      district: "" // Reset district when city changes
    }))
  }

  const handleDistrictChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      district: value
    }))
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {typeof error === 'string' ? error : 'An error occurred'}</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">이름</Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNum" className="text-base">전화번호</Label>
              <Input
                id="phoneNum"
                type="tel"
                required
                value={formData.phoneNum}
                onChange={(e) => setFormData({ ...formData, phoneNum: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">비밀번호</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-base">도시</Label>
              <Select onValueChange={handleCityChange} value={formData.city}>
                <SelectTrigger>
                  <SelectValue placeholder="도시를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district" className="text-base">구/군</Label>
              <Select 
                onValueChange={handleDistrictChange} 
                value={formData.district}
                disabled={!formData.city}
              >
                <SelectTrigger>
                  <SelectValue placeholder="구/군을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
            >
              회원가입
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
