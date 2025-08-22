/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {toast} from 'react-toastify'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditData } from "@/lib/types"
import axios from "axios"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  ArrowLeft,
  CheckCircle,
  X,
  Edit,
  Save,
  Wallet,
  MapPin,
  Users,
  Clock,
  Star,
  FileText,
  Loader2,
} from "lucide-react"

interface CounselorProfileProps {
  counselor: any
  onBack: () => void
  onCounselorUpdate?: () => void
}

export function CounselorProfile({ counselor, onBack, onCounselorUpdate }: CounselorProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [actionMessage, setActionMessage] = useState("")
  const [counselorStatus, setCounselorStatus] = useState(counselor?.verified || false)

  const [editData, setEditData] = useState<EditData>({
    ratePerYear: counselor?.ratePerYear ?? null,
    ratePerMinute: counselor?.ratePerMinute ?? null,
    plusAmount: counselor?.plusAmount ?? null,
    proAmount: counselor?.proAmount ?? null,
    eliteAmount: counselor?.eliteAmount ?? null,
  })

  // Sync editData when counselor prop changes
  useEffect(() => {
    setEditData({
      ratePerYear: counselor?.ratePerYear ?? null,
      ratePerMinute: counselor?.ratePerMinute ?? null,
      plusAmount: counselor?.plusAmount ?? null,
      proAmount: counselor?.proAmount ?? null,
      eliteAmount: counselor?.eliteAmount ?? null,
    })
  }, [counselor])

  const notifyError = () => toast.error('Failed to save changes')
  const notifySuccess = ()=> toast.success('Saved changes')

  // Safe number conversion helper
  const safeNumber = (value: string): number | null => {
    if (value === "" || value === null || value === undefined) return null
    const num = Number(value)
    return Number.isNaN(num) ? null : num
  }

  // Generic number field setter
  const setNumberField = (field: keyof EditData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = safeNumber(e.target.value)
    setEditData(prev => ({ ...prev, [field]: numValue }))
  }

  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => {
        setActionMessage("")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [actionMessage])

  if (!counselor) {
    return (
      <div className="container mx-auto p-6">
        <Button onClick={onBack} variant="outline" className="mb-4 bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
        <p>Counselor not found</p>
      </div>
    )
  }

  const handleSave = async() => {
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/updateCounsellor?adminId=${process.env.NEXT_PUBLIC_ADMIN_ID}&counsellorId=${counselor.userName}`
    
    // Normalize payload - only include non-null numeric values
    const payload: Record<string, number> = {}
    Object.entries(editData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && !Number.isNaN(value)) {
        payload[key] = value
      }
    })

    // Don't send request if no valid data
    if (Object.keys(payload).length === 0) {
      toast.info('No valid changes to save')
      return
    }

    try {
      const res = await axios.patch(backendUrl, payload, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (res.status === 200) {
        notifySuccess()
        setIsEditing(false)
        // Update local state with saved values
        setEditData(prev => ({ ...prev, ...payload }))
        // Refresh parent component
        onCounselorUpdate?.()
      } else {
        notifyError()
      }
    } catch (_error) {
      console.error('Save failed:', _error)
      notifyError()
    }
  }

  const handleApprove = async () => {
    setIsApproving(true)
    setShowApproveDialog(false)

    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/verifyCounsellor?counsellorId=${counselor.userName}&adminId=${process.env.NEXT_PUBLIC_ADMIN_ID}`)
      if(res.status===200){
        setCounselorStatus(true)
        setActionMessage("Counselor has been successfully approved!")
        onCounselorUpdate?.()
      }
      
    } catch {
      setActionMessage("Failed to approve counselor. Please try again.")
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
  
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatFirebaseTimestamp = (timestamp: any) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
    return "N/A"
  }


  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button onClick={onBack} variant="outline" className="mb-4 bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>

        {actionMessage && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              actionMessage.includes("successfully") || actionMessage.includes("approved")
                ? "bg-green-100 text-green-800 border border-green-200"
                : actionMessage.includes("Failed")
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}
          >
            {actionMessage}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={counselor.photoUrlSmall || undefined} />
              <AvatarFallback className="text-lg">
                {counselor.firstName?.[0]}
                {counselor.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                {counselor.firstName} {counselor.lastName}
              </h1>
              <p className="text-gray-600">ID: {counselor.userName}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  <Wallet className="w-3 h-3 mr-1" />
                  {formatCurrency(counselor.walletAmount || 0)}
                </Badge>
                {counselor.rating && (
                  <Badge variant="outline" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    {counselor.rating}/5
                  </Badge>
                )}
              </div>
            </div>
            {counselorStatus ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                Approved
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Pending Approval
              </Badge>
            )}
          </div>

          <div className="flex space-x-2">
            {!counselorStatus && (
              <>
                <Button
                  onClick={() => setShowApproveDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isApproving || isRejecting}
                >
                  {isApproving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowRejectDialog(true)}
                  variant="destructive"
                  disabled={isApproving || isRejecting}
                >
                  {isRejecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </>
                  )}
                </Button>
              </>
            )}
            {isEditing ? (
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Counselor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve {counselor.firstName} {counselor.lastName}? This will grant them access
              to the platform and allow them to start accepting clients.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              Yes, Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Counselor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject {counselor.firstName} {counselor.lastName}? This action will deny their
              application and they will need to reapply.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-red-600 hover:bg-red-700">
              Yes, Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                      <p className="mt-1 text-sm text-gray-900">{counselor.firstName}</p>
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    
                      <p className="mt-1 text-sm text-gray-900">{counselor.lastName}</p>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                      <p className="mt-1 text-sm text-gray-900">{counselor.email || "Not provided"}</p>
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                      <p className="mt-1 text-sm text-gray-900">{counselor.phoneNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <Label>Languages</Label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {counselor.languagesKnow?.map((lang: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                  </div>
                  <div>
                    <Label>States of Operation</Label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {counselor.stateOfCounsellor?.map((state: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {state}
                          </Badge>
                        ))}
                      </div>
                  </div>
                </div>

                {counselor.description && (
                  <div>
                    <Label htmlFor="description">Description</Label>
                      <p className="mt-1 text-sm text-gray-900">{counselor.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address & Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {counselor.fullOfficeAddress && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="city">City</Label>
                        <p className="mt-1 text-sm text-gray-900">{counselor.fullOfficeAddress.city}</p>
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                        <p className="mt-1 text-sm text-gray-900">{counselor.fullOfficeAddress.state}</p>
                    </div>
                    <div>
                      <Label htmlFor="pinCode">Pin Code</Label>
                        <p className="mt-1 text-sm text-gray-900">{counselor.fullOfficeAddress.pinCode}</p>
                    </div>
                    {counselor.fullOfficeAddress.officeNameFloorBuildingAndArea && (
                      <div>
                        <Label htmlFor="officeAddress">Office Address</Label>
                          <p className="mt-1 text-sm text-gray-900">
                            {counselor.fullOfficeAddress.officeNameFloorBuildingAndArea}
                          </p>
                      </div>
                    )}
                    <div>
                      <Label>Coordinates</Label>
                      <p className="mt-1 text-sm text-gray-900">
                        {counselor.fullOfficeAddress.latCoordinate}, {counselor.fullOfficeAddress.longCoordinate}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Label>Verification Status</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Phone Verified</span>
                      <Badge variant={counselor.phoneOtpVerified ? "default" : "secondary"} className="text-xs">
                        {counselor.phoneOtpVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Verified</span>
                      <Badge variant={counselor.emailOtpVerified ? "default" : "secondary"} className="text-xs">
                        {counselor.emailOtpVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="experience">Experience (Years)</Label>
                    <p className="mt-1 text-sm text-gray-900">{counselor.experience || "Not specified"}</p>
                </div>
                <div>
                  <Label htmlFor="ratePerYear">Rate Per Year</Label>
                  {isEditing ? (
                    <Input
                      id="ratePerYear"
                      type="number"
                      value={editData.ratePerYear ?? ''}
                      onChange={setNumberField('ratePerYear')}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {counselor.ratePerYear ? formatCurrency(counselor.ratePerYear) : "Not specified"}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="ratePerMinute">Rate Per Minute</Label>
                  {isEditing ? (
                    <Input
                      id="ratePerMinute"
                      type="number"
                      step="0.01"
                      value={editData.ratePerMinute ?? ''}
                      onChange={setNumberField('ratePerMinute')}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {counselor.ratePerMinute ? formatCurrency(counselor.ratePerMinute) : "Not specified"}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="plusAmount">Plus Plan Amount</Label>
                  {isEditing ? (
                    <Input
                      id="plusAmount"
                      type="number"
                      value={editData.plusAmount ?? ''}
                      onChange={setNumberField('plusAmount')}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {counselor.plusAmount ? formatCurrency(counselor.plusAmount) : "Not specified"}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="proAmount">Pro Plan Amount</Label>
                  {isEditing ? (
                    <Input
                      id="proAmount"
                      type="number"
                      value={editData.proAmount ?? ''}
                      onChange={setNumberField('proAmount')}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {counselor.proAmount ? formatCurrency(counselor.proAmount) : "Not specified"}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="eliteAmount">Elite Plan Amount</Label>
                  {isEditing ? (
                    <Input
                      id="eliteAmount"
                      type="number"
                      value={editData.eliteAmount ?? ''}
                      onChange={setNumberField('eliteAmount')}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {counselor.eliteAmount ? formatCurrency(counselor.eliteAmount) : "Not specified"}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="organisationName">Organization</Label>
                    <p className="mt-1 text-sm text-gray-900">{counselor.organisationName || "Not specified"}</p>
                </div>
                <div>
                  <Label>Working Days</Label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {counselor.workingDays?.map((day: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {day}
                        </Badge>
                      ))}
                    </div>
                </div>
                <div>
                  <Label>Office Hours</Label>
                    <p className="mt-1 text-sm text-gray-900">
                      {counselor.officeStartTime && counselor.officeEndTime
                        ? `${counselor.officeStartTime} - ${counselor.officeEndTime}`
                        : "Not specified"}
                    </p>
                </div>
              </div>

              {counselor.expertise && (
                <div>
                  <Label>Expertise</Label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {counselor.expertise.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6">
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(counselor.walletAmount || 0)}</div>
                  <p className="text-gray-600 mt-2">Current Wallet Balance</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {counselor.transactions?.map((transaction: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={transaction.type === "credit" ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {transaction.type.toUpperCase()}
                          </Badge>
                          <span
                            className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                        {transaction.paymentId && (
                          <p className="text-xs text-gray-500">Payment ID: {transaction.paymentId}</p>
                        )}
                        {transaction.status && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {transaction.status}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                      </div>
                    </div>
                  )) || <p className="text-gray-500 text-center py-4">No transactions found</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Active Clients ({counselor.clients?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {counselor.clients?.map((client: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">User ID: {client.userId}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {client.plan} plan
                        </Badge>
                      </div>
                    </div>
                  )) || <p className="text-gray-500 text-center py-4">No active clients</p>}
                </div>
              </CardContent>
            </Card>
{/* 
            <Card>
              <CardHeader>
                <CardTitle>Followers ({counselor.followerIds?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {counselor.followerIds?.map((followerId: string, index: number) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      User ID: {followerId}
                    </div>
                  )) || <p className="text-gray-500 text-center py-4">No followers</p>}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Activity Log ({counselor.activityLog?.length || 0} entries)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {counselor.activityLog?.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {activity.photo && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.photo || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">U</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.activity}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">{formatFirebaseTimestamp(activity.timestamp)}</p>
                        <Badge variant="outline" className="text-xs">
                          {activity.activityType}
                        </Badge>
                        {activity.activitySenderRole && (
                          <Badge variant="outline" className="text-xs">
                            {activity.activitySenderRole}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )) || <p className="text-gray-500 text-center py-4">No activity logged</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Counselor Notes ({counselor.notesForCounsellorRelatedToUser?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {counselor.notesForCounsellorRelatedToUser?.map((note: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">User ID: {note.userId}</Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(note.timestamp).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {note.noteText || <em className="text-gray-500">No note text</em>}
                    </p>
                  </div>
                )) || <p className="text-gray-500 text-center py-4">No notes available</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Platform</Label>
                  <p className="mt-1 text-sm text-gray-900">{counselor.platform || "Not specified"}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <p className="mt-1 text-sm text-gray-900">{counselor.role || "Not specified"}</p>
                </div>
                <div>
                  <Label>Total Appointments</Label>
                  <p className="mt-1 text-sm text-gray-900">{counselor.appointmentIds?.length || 0}</p>
                </div>
                <div>
                  <Label>Total Reviews</Label>
                  <p className="mt-1 text-sm text-gray-900">{counselor.reviewIds?.length || 0}</p>
                </div>
                <div>
                  <Label>Chat Connections</Label>
                  <p className="mt-1 text-sm text-gray-900">{counselor.chatIdsCreatedForCounsellor?.length || 0}</p>
                </div>
                <div>
                  <Label>Minutes on Voice Calls</Label>
                  <p className="mt-1 text-sm text-gray-900">{counselor.minuteSpendOnCall || 0} minutes</p>
                </div>
                <div>
                  <Label>Minutes on Video Calls</Label>
                  <p className="mt-1 text-sm text-gray-900">{counselor.minuteSpendOnVideoCall || 0} minutes</p>
                </div>
                <div>
                  <Label>Bank Details Status</Label>
                  <p className="mt-1 text-sm text-gray-900">{counselor.bankDetails ? "Provided" : "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

