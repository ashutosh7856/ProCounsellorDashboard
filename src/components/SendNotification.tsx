'use client'
import { NotificationData } from "@/lib/types"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Building2, Loader2, Send } from "lucide-react"
import { toast } from "react-toastify"


const notificationType = [
    {value:'APPLICATION_TYPE', label:"Application Alert"},
    {value:"REG_TIME", label:'Register Now'},
    {value:'collegeNotification', label:'College Nofification'}
]

export function SendNotification({onSendNotification}:{onSendNotification:(notification:NotificationData)=>void}){
    const [formData, setFormData] = useState<NotificationData>({
        id:'',
        type:'',
        title:'',
        body:''
    })
    const [isLoading, setIsLoading ] = useState<boolean>(false)


    const handlesubmit=async(e:React.FormEvent)=>{
        e?.preventDefault();
        setIsLoading(true)
        if(formData.id && formData.body && formData.type && formData.title){
        try{
            await onSendNotification(formData)
            setFormData({id:'', type:'', title:"", body:''})
            toast.success('Notification Sent')
        }catch(err){
            toast.error('Request Failed.')
            console.log(err)
        }finally{
            setIsLoading(false)
        }
        }
    }



    const handleInputChange = (field: keyof NotificationData, value:string)=>{
        setFormData((prev)=>({...prev, [field]:value}))
    }
    return(
        <div className="w-full">

            <Card className="bg-card  border-border shadow-md">
                <CardHeader className="pb-6">
                    <CardTitle className="font-semibold text-card-foreground flex items-center gap-2">
                        <Building2 className="text-primary h-5 w-5"/>
                        Create Notification
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handlesubmit} className="space-y-6 ">
                       <div className="space-y-2">
                        <Label htmlFor="id" className="text-sm font-medium text-foreground">
                            ID
                        </Label>
                        <Input
                        id="id"
                        placeholder="eg. VIT_PUNE"
                        value={formData.id}
                        onChange={(e)=>handleInputChange('id', e.target.value)}
                        className="border-border focus:border-primary focus:ring-ring h-11"
                        />
                       </div>

                        <div className="space-y-2">
                        <Label htmlFor="id" className="text-sm font-medium text-foreground">
                            Notification Type
                        </Label>
                        <Select value={formData.type} onValueChange={(value)=>handleInputChange('type', value)}>
                            <SelectTrigger className="border-border focus:border-primary focus:ring-ring h-11 w-full ">
                                <SelectValue placeholder='Select notification type'/>
                            </SelectTrigger>  

                            <SelectContent className="bg-popover border-border">
                                {notificationType.map((type) => (
                                 <SelectItem key={type.value} value={type.value} className="hover:bg-muted focus:bg-muted">
                                  {type.label}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        </div>
                        
                       <div className="space-y-2">
                         <Label htmlFor="title" className="text-sm font-medium text-foreground">
                            Title
                        </Label>
                        <Input
                        id="title"
                        placeholder="eg. Application Starts"
                        value={formData.title}
                        onChange={(e)=> handleInputChange('title', e.target.value)}
                        className="border-border focus:border-primary focus:ring-ring h-11"
                        />
                       </div>

                       <div className="space-y-2">
                         <Label htmlFor="body" className="text-sm font-medium text-foreground">
                            Description
                        </Label>
                        <Textarea
                        id="body"
                        placeholder="Enter Notification Message"
                        value={formData.body}
                        onChange={(e)=> handleInputChange('body', e.target.value)}
                        className=" border-border focus:border-primary focus:ring-ring min-h-[100px] resize-none"
                        />
                       </div>

                        <Button 
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-12 text-base 
                        disabled:opacity-50 disabled:hover:cursor-not-allowed hover:cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                        disabled={!formData.id || !formData.type || !formData.title || !formData.body || isLoading}
                        >
                            {isLoading ? (
                                <>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin"/>
                                Sending...
                                </>
                            ):(
                                <>
                                <Send className="mr-2 w-4 h-4"/>
                                Send
                                </>
                            )} 
                        </Button>    
                    </form>

                </CardContent>
            </Card>

        </div>
    )
}