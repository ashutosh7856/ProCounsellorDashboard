/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wallet } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "./avatar"
import { Badge } from "./badge"


export function ClientProfile({ client }: { client: any }) {
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

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src={client.photoUrlSmall || undefined} />
            <AvatarFallback className="text-lg">
              {client.firstName?.[0]}
              {client.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">
              {client.firstName} {client.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">ID: {client.userName}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <Wallet className="w-3 h-3 mr-1" />
                {formatCurrency(client.walletAmount || 0)}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {client.role || "User"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Phone:</span>
            <span className="text-sm">{client.phoneNumber || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Email:</span>
            <span className="text-sm">{client.email || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-lg">Academic Interests</h4>
        <div className="space-y-3">
          {client.interestedCourse && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Interested Course:</span>
              <Badge variant="outline" className="ml-2">
                {client.interestedCourse}
              </Badge>
            </div>
          )}

          {client.interestedColleges && client.interestedColleges.length > 0 && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Interested Colleges:</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {client.interestedColleges.map((college: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {college}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {client.userInterestedStateOfCounsellors && client.userInterestedStateOfCounsellors.length > 0 && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Interested States for Counselors:</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {client.userInterestedStateOfCounsellors.map((state: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {state}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {client.interestedLocationsForCollege && client.interestedLocationsForCollege.length > 0 && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Interested College Locations:</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {client.interestedLocationsForCollege.map((location: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {client.languagesKnow && client.languagesKnow.length > 0 && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Languages Known:</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {client.languagesKnow.map((language: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-lg">Social Connections</h4>
        <div className="grid grid-cols-1 gap-2 p-4 bg-muted/50 rounded-lg text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Followed Counselors:</span>
            <span>{client.followedCounsellorsIds?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Friends:</span>
            <span>{client.friendIds?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Reviews Given:</span>
            <span>{client.userReviewIds?.length || 0}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-lg">Communication</h4>
        <div className="space-y-3">
          {client.chatIdsCreatedForUser && client.chatIdsCreatedForUser.length > 0 && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Active Chats ({client.chatIdsCreatedForUser.length}):</span>
              <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                {client.chatIdsCreatedForUser.slice(0, 5).map((chat: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span>With: {chat.user2}</span>
                    <Badge variant="outline" className="text-xs">
                      {chat.chatId}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {client.appointmentIds && client.appointmentIds.length > 0 && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Appointments ({client.appointmentIds.length}):</span>
              <div className="grid grid-cols-2 gap-1 mt-2 max-h-32 overflow-y-auto">
                {client.appointmentIds.slice(0, 10).map((appointmentId: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs truncate">
                    {appointmentId}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>


      <div className="space-y-3">
        <h4 className="font-semibold text-lg">Technical Details</h4>
        <div className="grid grid-cols-1 gap-2 p-4 bg-muted/50 rounded-lg text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Platform:</span>
            <Badge variant="outline" className="text-xs">
              {client.platform || "N/A"}
            </Badge>
          </div>
          {client.currectCallUUID && (
            <div className="flex justify-between">
              <span className="font-medium">Current Call:</span>
              <Badge variant="secondary" className="text-xs">
                {client.currectCallUUID}
              </Badge>
            </div>
          )}
          {client.fcmToken && (
            <div className="flex justify-between">
              <span className="font-medium">FCM Token:</span>
              <span className="text-xs truncate max-w-32">{client.fcmToken.substring(0, 20)}...</span>
            </div>
          )}
          {client.voipToken && (
            <div className="flex justify-between">
              <span className="font-medium">VoIP Token:</span>
              <span className="text-xs truncate max-w-32">{client.voipToken.substring(0, 20)}...</span>
            </div>
          )}
        </div>
      </div>

      {client.subscribedCounsellors && client.subscribedCounsellors.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">Subscribed Counselors</h4>
          <div className="space-y-2">
            {client.subscribedCounsellors.map((subscription: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">ID: {subscription.counsellorId}</span>
                <Badge
                  variant={
                    subscription.plan === "elite" ? "default" : subscription.plan === "plus" ? "secondary" : "outline"
                  }
                >
                  {subscription.plan?.toUpperCase() || "BASIC"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {client.transactions && client.transactions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">Recent Transactions</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {client.transactions.slice(0, 10).map((transaction: any, index: number) => (
              <div key={index} className="flex justify-between items-start p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={transaction.type === "credit" ? "default" : "destructive"} className="text-xs">
                      {transaction.type?.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium">{formatCurrency(transaction.amount || 0)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{transaction.description}</p>
                  {transaction.paymentId && (
                    <p className="text-xs text-muted-foreground">Payment ID: {transaction.paymentId}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.timestamp)}</p>
                  {transaction.status && (
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs mt-1"
                    >
                      {transaction.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {client.activityLog && client.activityLog.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">Recent Activity</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {client.activityLog.slice(0, 10).map((activity: any, index: number) => (
              <div key={index} className="flex justify-between items-start p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.activity || "Activity"}</p>
                  {activity.description && <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>}
                  {activity.counsellorId && (
                    <p className="text-xs text-muted-foreground">Counselor: {activity.counsellorId}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(activity.timestamp.seconds)}</p>
              </div>
            ))}
          </div>
        </div>
      )}


      {client.bankDetails && (
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">Bank Details</h4>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm">Bank details available</p>
          </div>
        </div>
      )}


      <div className="space-y-3">
        <h4 className="font-semibold text-lg">Additional Information</h4>
        <div className="grid grid-cols-1 gap-2 p-4 bg-muted/50 rounded-lg text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Total Transactions:</span>
            <span>{client.transactions?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Activity Entries:</span>
            <span>{client.activityLog?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Subscriptions:</span>
            <span>{client.subscribedCounsellors?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
 