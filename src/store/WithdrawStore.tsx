import { create } from "zustand"
import { Withdrawal } from "@/lib/types"
import axios from "axios"

type WithdrawalStore = {
  withdrawals: Withdrawal[]
  loading: boolean
  error: string | null
  fetchWithdrawals: () => Promise<void>
  hasFetched:boolean
}

export const useWithdrawalStore = create<WithdrawalStore>((set) => ({
  withdrawals: [],
  loading: false,
  error: null,
  hasFetched: false,
  fetchWithdrawals: async () => {
    set({ loading: true, error: null })
    try {
      const res = await axios.get<Withdrawal[]>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/getAllWithdrawals?adminId=${process.env.NEXT_PUBLIC_ADMIN_ID}`,
        {
          headers: {
            Accept: "application/json",
          },
          timeout: 10000,
        }
      )

      set({ withdrawals: res.data, hasFetched:true, loading: false })
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : "Random Error"
      set({ loading: false, error: message })
    }
  },
}))
