import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Telescope,
  MessagesSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo.png";

const tools = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Smart Email", url: "/email", icon: Mail },
  { title: "Meeting Notes", url: "/notes", icon: FileText },
  { title: "Task Planner", url: "/tasks", icon: ListChecks },
  { title: "Research", url: "/research", icon: Telescope },
  { title: "AI Chat", url: "/chat", icon: MessagesSquare },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-gold shadow-soft">
            <img src={logo} alt="" className="h-6 w-6" />
          </div>
          <div className="grid leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-display text-sm font-semibold text-sidebar-foreground">
              Prestige AI
            </span>
            <span className="text-[11px] text-sidebar-foreground/70">Workplace Copilot</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="rounded-lg border border-sidebar-border/60 bg-sidebar-accent/40 p-3 text-[11px] leading-snug text-sidebar-foreground/75 group-data-[collapsible=icon]:hidden">
          <span className="font-medium text-gold">Note</span> — AI-generated content
          may require human review.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
