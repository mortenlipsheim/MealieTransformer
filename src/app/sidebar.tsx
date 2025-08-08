"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Settings, Soup } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/logo";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href="/">
            <SidebarMenuButton isActive={pathname === "/"}>
              <Soup />
              Recipe
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/settings">
            <SidebarMenuButton isActive={pathname === "/settings"}>
              <Settings />
              Settings
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
