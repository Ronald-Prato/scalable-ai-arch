"use client";

import { FileText, Home } from "lucide-react";
import { useDarkMode } from "~/hooks/useDarkMode";
import { Switch } from "~/components/ui/switch";
import Link from "next/link";
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
  SidebarTrigger,
} from "~/components/ui/sidebar";

export function AppSidebar() {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <>
      <Sidebar>
        <SidebarHeader className="p-4">
          <h2 className="text-xl font-bold">IA Resumenes</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegación</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/">
                      <Home className="h-4 w-4" />
                      <span>Inicio</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/mis-resumenes">
                      <FileText className="h-4 w-4" />
                      <span>Mis resumenes</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Switch checked={isDark} onCheckedChange={toggleTheme} />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {isDark ? "Modo oscuro" : "Modo claro"}
            </span>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Mobile trigger for the sidebar */}
      <div className="md:hidden fixed left-4 top-4 z-10">
        <SidebarTrigger />
      </div>
    </>
  );
}
