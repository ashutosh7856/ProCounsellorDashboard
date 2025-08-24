import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { User, LogOut,  Users, FileMinus2 , Send} from "lucide-react"
import { useAuthStore } from "@/store/AuthStore"
import Link from "next/link"
import Image from "next/image"

export function AppSidebar() {
    const {user , logout} = useAuthStore()
  return (
    <Sidebar>
      <SidebarHeader>
           <Link href="/" className="flex items-center space-x-2">
            <Image
                src="/logo.png"
                alt="ProCounsel icon"
                height={40}
                width={40}
                priority
            /> 
        
            <div className="flex flex-col leading-tight">
                <h1 className={`text-2xl font-bold  text-orange-600`}>
                    ProCounsel
                </h1>
                <span className={`text-xs text-gray-500`}>
                    by <span className={`font-semibold text-gray-700`}>CatalystAI</span>
                </span>
            </div>
            </Link>
      </SidebarHeader>

       <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Users className="mr-2 h-4 w-4" />
                    Counsellors
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/withdrawls">
                    <FileMinus2 className="mr-2 h-4 w-4" />
                    Withdraw Requests
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/broadcast">
                  <Send className="mr-2 h-4 w-4"/>
                   Broadcast
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-2 p-2 rounded-md hover:bg-muted">
                    <User className="h-6 w-6" />
                    <div className="flex flex-col items-start">
                           <span className="text-sm">User</span>
                           <span>{user?.userId}</span>
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                    Logged in as
                    <br />
                    <span className="text-xs text-muted-foreground">
                        {user?.userId}
                    </span>
                </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}