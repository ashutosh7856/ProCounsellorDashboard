/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { CounselorList } from "@/components/CounselorList"
import { CounselorProfile } from "@/components/CounsellorProfile"
import { useAuthStore } from "@/store/AuthStore"
import { useCounsellorStore } from "@/store/CounsellorStore"


export default function Home() {
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all")
  const {user}= useAuthStore()
  const {counsellors, loading, error, fetchCounsellor} = useCounsellorStore()

  const filteredCounselors = counsellors.filter((counselor) => {
    const matchesSearch = `${counselor.firstName} ${counselor.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "approved" && counselor.verified) ||
      (filterStatus === "pending" && !counselor.verified)

    return matchesSearch && matchesFilter
  })

    const fetchData= useCallback(()=>{
        fetchCounsellor()
    }, [fetchCounsellor])

        useEffect(()=>{
            if(user){
                fetchData();
            }
        }, [user, fetchData])

  const approvedCount = counsellors.filter((c) => c.verified).length
  const pendingCount = counsellors.filter((c) => !c.verified).length

  const handleCounselorUpdate = async() => {
    await fetchCounsellor();
  }

  if (selectedCounselor) {
    const counselor = counsellors.find((c) => c.userName === selectedCounselor)
    return (
      <CounselorProfile
        counselor={counselor}
        onBack={() => setSelectedCounselor(null)}
        onCounselorUpdate={handleCounselorUpdate}
      />
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Counselor Management</h1>
        <p className="text-gray-600">Manage counselor profiles and approvals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {loading ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Counselors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counsellors.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="mb-6">
        {loading ? (
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 w-full max-w-sm" />
            <Skeleton className="h-10 w-80" />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search counselors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Tabs value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
              <TabsList>
                <TabsTrigger value="all">All ({counsellors.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>

      <CounselorList 
        counsellors={filteredCounselors} 
        onSelectCounselor={setSelectedCounselor} 
        loading={loading}
      />
    </div>
  )
}

   
   
  


   
