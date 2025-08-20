import {create} from "zustand"
import axios from "axios"

export type User = {
    userId:string
    jwtToken:string,
    firebaseCustomToken:string
} | null

type AuthState = {
    user:User | null,
    token:string | null,
    login: (email:string, password:string)=>Promise<void>
    logout: ()=>void
    loading:boolean
    error:string | null
    isInitialized:boolean
    initializeAuth:()=>void
}

export const useAuthStore = create<AuthState>((set)=>({
    user:null,
    token:null,
    loading:false,
    isInitialized:false,
    error:null,
    login: async (email:string, password:string)=>{
        set({loading:true})
        try{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/adminSignin?email=${email}&password=${password}`, {
                headers:{
                    Accept:'application/json'
                },
            })
            set({token:res.data.jwtToken, loading:false, user:res.data})
            sessionStorage.setItem('token', res.data.jwtToken)
            sessionStorage.setItem('adminId', res.data.userId)
            sessionStorage.setItem('user', JSON.stringify(res.data))

            console.log(res.data.jwtToken)

        }catch(err){
            const message = axios.isAxiosError(err)
            ? err.response?.data?.message ?? err.message
            : "Random Error";
            set({loading:false, error:message})
        }
    },
    logout: ()=>{
        set({user:null, token:null})
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('adminId')
        sessionStorage.removeItem('user')
    },
    initializeAuth:()=>{
        try{
            const storedUser = sessionStorage.getItem('user')
            if(storedUser){
                const user = JSON.parse(storedUser)
                set({user, isInitialized:true})
            }else{
                set({isInitialized:true})
            }
        }catch(error){
            console.error('Failed to parse stored user' + error)
            sessionStorage.removeItem('user')
            set({isInitialized:true})
        }
    }
}))