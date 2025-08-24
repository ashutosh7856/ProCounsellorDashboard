/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCallback, useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "react-toastify"
import { Eye, User, Check,  Wallet, ChevronLeft, ChevronRight } from "lucide-react"
import { useWithdrawalStore } from "@/store/WithdrawStore"
import { useAuthStore } from "@/store/AuthStore"
import axios from "axios"


function formatDate(timestamp: number) {
  if (timestamp === 0) return "N/A"
  return new Date(timestamp).toLocaleDateString()
}

function getStatusBadge(status: string, approved: boolean) {
  if (status === "completed") return <Badge className="bg-green-100 text-xs text-green-800">Completed</Badge>
  if (status === "transferred") return <Badge className="bg-green-100 text-xs text-green-900">Completed</Badge>
  if (status === "processing" && !approved)
    return <Badge className="bg-orange-200 text-xs text-orange-800">Processing</Badge>
  return <Badge variant="destructive">Unknown</Badge>
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20" />
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function WithdrawalRequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [selectedCounsellor, setSelectedCounsellor] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [approvingPaymentId, setApprovingPaymentId] = useState<string | null>(null)
  const {fetchWithdrawals, withdrawals, hasFetched} = useWithdrawalStore()
  const {user} = useAuthStore()
  const itemsPerPage = 7


  const fetchData= useCallback(()=>{
        fetchWithdrawals()
    }, [fetchWithdrawals])

        useEffect(()=>{
            if(user && !hasFetched){
                fetchData();
            }
        },[hasFetched, user, fetchData])



  const handleApprovePayment = async (paymentId: string) => {
    setApprovingPaymentId(paymentId)
    console.log(paymentId)
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/markRequestAsTransferred?adminId=ashu11august@gmail.com&paymentId=${paymentId}`

    try {
      const response = await axios.post(backendUrl, {
        headers: {
          Accept: "application/json",
        },
      })
      if(response.status === 200){
           toast.success(`Transaction ${paymentId} has been completed successfully.`)
           refreshData()
      }

    } catch (error) {
      console.error("Error approving payment:", error)

      toast.error("Failed to approve the payment. Please try again.")

    } finally {
      setApprovingPaymentId(null)
    }
  }

  const refreshData = async () => {
    fetchData()
  }

  const filteredRequests = withdrawals.filter((request) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "processing" && request.requestStatus === "processing") ||
      (statusFilter === "completed" && request.requestStatus === "completed") ||
      (statusFilter === "transferred" && request.requestStatus === "transferred")

    const matchesSearch =
      request.counsellorFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.paymentId.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage)

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter)
    setCurrentPage(1)
  }

  const statusCounts = {
    all: withdrawals.length,
    processing: withdrawals.filter((r) => r.requestStatus === "processing").length,
    completed: withdrawals.filter((r) => r.requestStatus === "completed").length,
    transferred: withdrawals.filter((r) => r.requestStatus === "transferred").length,
  }

  return (
    <div className="container mx-auto p-6">
      <div >
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Counselor Management</h1>
                <p className="text-gray-600">Manage counselor profiles and approvals</p>
            </div>

        <div className="mb-8">
          {isLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-80" />
              <div className="flex gap-2 flex-1">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-26" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <Input
                  placeholder="Search by counsellor name or payment ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex gap-2 flex-1">
                {["all", "processing", "completed"].map((filter) => (
                  <Button
                    key={filter}
                    variant={statusFilter === filter ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleFilterChange(filter)}
                    className={`capitalize ${
                      statusFilter === filter
                        ? "bg-white text-foreground border border-border shadow-sm hover:bg-gray-50"
                        : "text-foreground hover:bg-gray-100"
                    }`}
                  >
                    {filter} ({statusCounts[filter as keyof typeof statusCounts]})
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg  font-semibold text-card-foreground flex items-center">
              <Wallet className="w-5 h-5 mr-2" />
              Requests ({filteredRequests.length})
            </h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-foreground">Counsellor</TableHead>
                <TableHead className="font-semibold text-foreground">Payment ID</TableHead>
                <TableHead className="font-semibold text-foreground">Amount</TableHead>
                <TableHead className="font-semibold text-foreground">Request Date</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: itemsPerPage }).map((_, index) => <TableRowSkeleton key={index} />)
                : paginatedRequests.map((request, index) => (
                    <TableRow
                      key={request.paymentId}
                      className={`hover:bg-muted/30 ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-sm bg-primary/10 text-primary">
                              {request.counsellorFullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground">{request.counsellorFullName}</div>
                            <div className="text-sm text-muted-foreground">ID: {request.counsellorId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-foreground">
                          {request.paymentId}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-foreground">
                          ₹{request.withdrawalRequestAmount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(request.timestampOfWithdrawalRequest)}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.requestStatus, request.requestApproved)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {request.requestStatus === "processing" && !request.requestApproved && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprovePayment(request.paymentId)}
                                disabled={approvingPaymentId === request.paymentId}
                              >
                                {approvingPaymentId === request.paymentId ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </Button>
                              {/* <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive border-destructive/20 hover:bg-destructive/10 bg-transparent"
                              >
                                <X className="w-4 h-4" />
                              </Button> */}
                            </>
                          )}

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle >Request Details</DialogTitle>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Payment ID</label>
                                      <p className="text-sm text-foreground font-mono mt-1">
                                        {selectedRequest.paymentId}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Amount</label>
                                      <p className="text-sm text-foreground font-semibold mt-1">
                                        ₹{selectedRequest.withdrawalRequestAmount.toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                                      <div className="mt-1">
                                        {getStatusBadge(selectedRequest.requestStatus, selectedRequest.requestApproved)}
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Request Date</label>
                                      <p className="text-sm text-foreground mt-1">
                                        {formatDate(selectedRequest.timestampOfWithdrawalRequest)}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Bank Details</label>
                                    <div className="mt-2 bg-muted rounded-lg p-3 space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-xs text-muted-foreground">Account Number</span>
                                        <span className="text-xs font-mono text-foreground">
                                          {selectedRequest.counsellorBankDetails.accountNumber}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-xs text-muted-foreground">IFSC Code</span>
                                        <span className="text-xs font-mono text-foreground">
                                          {selectedRequest.counsellorBankDetails.ifscCode}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-xs text-muted-foreground">Account Holder</span>
                                        <span className="text-xs text-foreground">
                                          {selectedRequest.counsellorBankDetails.accountHolderName}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedCounsellor(request)}>
                                <User className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle >Counsellor Profile</DialogTitle>
                              </DialogHeader>
                              {selectedCounsellor && (
                                <div className="space-y-4">
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="h-12 w-12">
                                      <AvatarFallback className="bg-primary/10 text-primary">
                                        {selectedCounsellor.counsellorFullName
                                          .split(" ")
                                          .map((n: string) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="font-medium text-foreground">
                                        {selectedCounsellor.counsellorFullName}
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        ID: {selectedCounsellor.counsellorId}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="bg-muted rounded-lg p-3 space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Phone</span>
                                      <span className="text-sm text-foreground">
                                        {selectedCounsellor.counsellorPhoneNumber}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Email</span>
                                      <span className="text-sm text-foreground">
                                        {selectedCounsellor.counsellorEmail}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>

          {!isLoading && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRequests.length)} of{" "}
                  {filteredRequests.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 p-0 ${
                          currentPage === page
                            ? "bg-foreground text-background"
                            : "bg-white text-foreground hover:bg-muted"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-white"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
