"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader,} from "@/components/ui/card"
import { Eye, EyeOff} from "lucide-react"
import { useAuthStore} from "@/store/AuthStore"


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const {loading,login, error, clearError} = useAuthStore()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = formData.username
    const password = formData.password
    await login(email, password)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
  const notify = () => toast.error('invalid credentials')
  
  useEffect(()=>{
    if(error){
      notify();
      clearError();
    }
  }, [error, clearError])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-2xl font-bold text-foreground">Procounsel Admin</h1>
          </div>
        </div>

        <Card className="border-border shadow-lg h-76">
          <CardHeader className="space-y-1">
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="bg-input border-border focus:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="bg-input border-border focus:ring-ring pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-6"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
