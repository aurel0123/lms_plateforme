"use client"

import * as React from "react"
import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {  ChartCandlestick, Folder, HelpCircle, LayoutDashboard, LayoutList, Search, Settings, Users } from "lucide-react"
import Link from "next/link"
import Logo from "@/public/Logo/LogoBG.png"
import Image from "next/image"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/",
      icon: LayoutDashboard,
    },
    {
      title: "Cours",
      url: "/admin/courses",
      icon: LayoutList,
    },
    {
      title: "Analytics",
      url: "#",
      icon: ChartCandlestick,
    },
    {
      title: "Projects",
      url: "#",
      icon: Folder,
    },
    {
      title: "Team",
      url: "#",
      icon: Users,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircle,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5"
            >
              <Link href="/">
                <Image
                  src={Logo}
                  alt ="Logo"
                  className="size-4"
                />
                <span className="text-base font-semibold">KammLMS.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  )
}
