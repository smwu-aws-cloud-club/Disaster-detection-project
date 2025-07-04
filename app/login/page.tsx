"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    phoneNum: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      localStorage.setItem('userData', JSON.stringify(data))
      
      toast({
        title: "로그인 완료",
        description: "환영합니다!",
      })
      
      router.push("/")
    } catch (error) {
      console.error("Error logging in:", error)
      toast({
        title: "로그인 실패",
        description: "다시 시도해주세요",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-6">
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
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
            >
              로그인
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 