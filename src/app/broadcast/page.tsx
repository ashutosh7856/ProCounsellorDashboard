'use client'
import { SendNotification } from "@/components/SendNotification";
import { NotificationData } from "@/lib/types";
import axios from "axios";

export default function Broadcast(){

    const sendNotification= async(notification:NotificationData)=>{
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/broadcastNotification?adminId=${process.env.NEXT_PUBLIC_ADMIN_ID}`,
            {
                id:notification.id,
                type:notification.type,
                title:notification.title,
                body:notification.body
            },
            {
                headers:{
                    Accept:'application/json'
                }
            }
        )

        if(res.status !== 200){
            throw new Error('request failed')
        }

        return true
        
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Broadcast Notification</h1>
                <p className="text-gray-600">Brodcast Notification accross all ProCounsel plateforms.</p>
            </div>
            <SendNotification onSendNotification={sendNotification}/>
        </div>
    )
}