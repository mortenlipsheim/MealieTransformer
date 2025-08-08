
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
import { useTranslation } from "@/hooks/use-translation";

export default function AppSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

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
              {t('Recipe')}
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/settings">
            <SidebarMenuButton isActive={pathname === "/settings"}>
              <Settings />
              {t('Settings')}
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
