import { create } from "zustand"
import { Counsellor } from "@/lib/types"
import axios from "axios"

type CounsellorStore = {
  counsellors: Counsellor[]
  loading: boolean
  error: string | null
  fetchCounsellor: () => Promise<void>
}

export const useCounsellorStore = create<CounsellorStore>((set) => ({
  counsellors: [],
  loading: false,
  error: null,
  fetchCounsellor: async () => {
    set({ loading: true, error: null })
    // const token =
    //   "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhc2h1MTFhdWd1c3RAZ21haWwuY29tIiwiaWF0IjoxNzU1NjMxMzMzLCJleHAiOjE3NTcxMDI1NjJ9.ObcaN7Byzd40FTXhSnKElfv3tnbkOcRygXQwbgvvrZY"
    // const adminId = "ashu11august@gmail.com"

    try {
      const res = await axios.get<Counsellor[]>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/getAllCounsellors?adminId=${process.env.NEXT_PUBLIC_ADMIN_ID}`,
        {
          headers: {
            Accept: "application/json",
            // Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      )

      set({ counsellors: res.data, loading: false })
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : "Random Error"
      set({ loading: false, error: message })
    }
  },
}))
