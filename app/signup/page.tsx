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
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "비밀번호 확인 오류",
        description: "비밀번호가 일치하지 않습니다",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phoneNum: formData.phoneNum,
          password: formData.password,
          address: {
            city: formData.city,
            district: formData.district,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to sign up")
      }

      toast({
        title: "회원가입 완료",
        description: "로그인 페이지로 이동합니다",
        duration: 3000,
      })
      
      router.push("/login")
    } catch (error) {
      console.error("Error signing up:", error)
      toast({
        title: "회원가입 실패",
        description: "다시 시도해주세요",
        variant: "destructive",
      })
    }
  }

  const handleLocationChange = (value: string) => {
    const location = locations.find(loc => loc.value === value)
    if (location) {
      setSelectedLocation(location)
      setFormData(prev => ({
        ...prev,
        city: location.city,
        district: location.district,
      }))
    }
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
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="phoneNum">전화번호</Label>
              <Input
                id="phoneNum"
                type="tel"
                required
                value={formData.phoneNum}
                onChange={(e) => setFormData({ ...formData, phoneNum: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="location">지역 선택</Label>
              <Select onValueChange={handleLocationChange}>
                <SelectTrigger>
                  <SelectValue placeholder="도시와 구/군을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
            >
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
