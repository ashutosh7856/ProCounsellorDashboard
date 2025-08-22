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
