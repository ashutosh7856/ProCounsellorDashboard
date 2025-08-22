"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye, CheckCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Counsellor } from "@/lib/types"

interface CounselorListProps {
  counsellors: Counsellor[]
  onSelectCounselor: (id: string) => void
  loading?: boolean
}

export function CounselorList({ counsellors, onSelectCounselor, loading = false }: CounselorListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalPages = Math.ceil((counsellors.length | 0 )/ itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCounselors = counsellors.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [counsellors.length])

  return (
    <div className="space-y-4">
      {loading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-44" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        currentCounselors.map((counselor) => (
        <Card key={counselor.userName} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={counselor.photoUrlSmall || undefined} />
                  <AvatarFallback>
                    {counselor.firstName[0]}
                    {counselor.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">
                      {counselor.firstName} {counselor.lastName}
                    </h3>
                    {counselor.verified ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">ID:</span> {counselor.userName}
                    </p>
                    <p>
                      <span className="font-medium">City:</span> {counselor.fullOfficeAddress?.city || "Not specified"}
                    </p>
                    <p>
                      <span className="font-medium">Languages:</span> {counselor.languagesKnow.join(", ")}
                    </p>
                    {counselor.expertise && counselor.expertise.length > 0 && (
                      <p>
                        <span className="font-medium">Expertise:</span> {counselor.expertise.join(", ")}
                      </p>
                    )}
                    {counselor.experience && (
                      <p>
                        <span className="font-medium">Experience:</span> {counselor.experience}
                      </p>
                    )}
                    {counselor.organisationName && (
                      <p>
                        <span className="font-medium">Organization:</span> {counselor.organisationName}
                      </p>
                    )}
                    {counselor.rating && (
                      <p>
                        <span className="font-medium">Rating:</span> {counselor.rating}/5
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => onSelectCounselor(counselor.userName)}>
                  <Eye className="w-4 h-4 mr-1" />
                  View Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        ))
      )}

      {!loading && counsellors.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No counselors found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, counsellors.length)} of {counsellors.length} counselors
          </p>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
