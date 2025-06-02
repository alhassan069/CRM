import { AppSidebar } from "@/components/shadcn_components/app-sidebar"
import { ChartAreaInteractive } from "@/components/shadcn_components/chart-area-interactive"
import { DataTable } from "@/components/shadcn_components/data-table"
import { SectionCards } from "@/components/shadcn_components/section-cards"
import { SiteHeader } from "@/components/shadcn_components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom";
import data from "./data.json"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
