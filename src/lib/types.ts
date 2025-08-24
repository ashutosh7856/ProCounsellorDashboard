type FullOfficeAddress = {
  officeNameFloorBuildingAndArea: string;
  city: string;
  state: string;
  pinCode: string;
  latCoordinate: string;
  longCoordinate: string;
};

type ActivityLog = {
  activity: string;
  timestamp: { seconds: number; nanos: number };
  id: string;
  photo: string | null;
  activityType: string | null;
  activitySenderId: string | null;
  activitySenderRole: string | null;
};

type Transaction = {
  type: string;
  amount: number;
  timestamp: number;
  description: string;
  paymentId: string;
  counsellorId: string;
  userId: string;
  method: string;
  status: string;
};

export  type EditData = {
  ratePerYear?: number | null
  ratePerMinute?: number | null
  plusAmount?: number | null
  proAmount?: number | null
  eliteAmount?: number | null
 }

export type Counsellor = {
  userName: string;
  role: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  description: string | null;
  email: string;
  walletAmount: number;
  transactions: Transaction[] | null;
  bankDetails: unknown | null;
  photoUrlSmall: string | null;
  organisationName: string;
  experience: string | null;
  activityLog: ActivityLog[] | null;
  stateOfCounsellor: string[];
  expertise: string[];
  clients: { userId: string; plan: string }[] | null;
  followerIds: string[] | null;
  rating: number | null;
  languagesKnow: string[];
  workingDays: string[];
  officeStartTime: string;
  officeEndTime: string;
  fullOfficeAddress: FullOfficeAddress;
  phoneOtpVerified: boolean;
  emailOtpVerified: boolean;
  appointmentIds: string[] | null;
  verified: boolean;
};



export interface SubscribedCounsellor {
  counsellorId: string
  plan: "elite" | "plus" | "pro"
}

export interface ClientTransaction {
  transactionId: string
  amount: number
  type: "credit" | "debit"
  description: string
  timestamp: string
  status: "completed" | "pending" | "failed"
}

export interface ClientActivityLog {
  activityId: string
  type: "appointment" | "call" | "message" | "subscription" | "payment"
  description: string
  timestamp: string
  counsellorId?: string
  counsellorName?: string
  amount?: number
  status?: string
}

export interface ClientAddress {
  city: string
  state: string
  pinCode: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface Client {
  userName: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  description?: string
  photoUrl?: string
  photoUrlSmall?: string
  walletAmount: number
  verified: boolean
  phoneOtpVerified: boolean
  emailOtpVerified: boolean
  platform: string
  role: string
  fcmToken?: string
  subscribedCounsellors: SubscribedCounsellor[]
  transactions: ClientTransaction[]
  activityLog: ClientActivityLog[]
  fullAddress?: ClientAddress
  appointmentIds: string[]
  reviewIds: string[]
  chatIds: string[]
  createdAt: string
  updatedAt: string
}

export interface ClientListResponse {
  clients: Client[]
  totalCount: number
  page: number
  limit: number
}


export interface ClientSubscriptionInfo {
  userName: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  photoUrl?: string
  plan: "elite" | "plus" | "pro"
  walletAmount: number
  subscriptionDate: string
  isActive: boolean
}

export interface Withdrawal{
  paymentId: string,
  counsellorId: string,
  counsellorFullName: string,
  counsellorPhoneNumber: string,
  counsellorEmail: string,
  withdrawalRequestAmount: string,
  timestampOfWithdrawalRequest: number,
  timestampOfCompletionRequest: string,
  requestStatus: string,
  requestApproved: boolean,
  counsellorBankDetails: {
      accountHolderName: string,
      ifscCode: string,
      accountNumber: string
  }

}

export interface NotificationData{
  id:string,
  type:string,
  title:string,
  body:string
}