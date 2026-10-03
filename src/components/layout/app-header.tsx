import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, Moon, Search, Sun, LogOut, User, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { notificationService } from "@/services";
import { titleForPath } from "@/lib/nav";

export function AppHeader() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  const { data: notes = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.list,
  });
  const unread = notes.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card/95 px-3 backdrop-blur md:px-5">
      <SidebarTrigger aria-label="Toggle sidebar" />
      <Separator orientation="vertical" className="h-5" />
      <Breadcrumb className="hidden sm:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Workspace</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{titleForPath(path)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search cases and evidence"
            placeholder="Search cases, evidence IDs…"
            className="h-9 w-64 bg-background pl-8"
          />
        </div>
        <Button variant="ghost" size="icon" aria-label="Toggle dark mode" onClick={() => setDark((d) => !d)}>
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`Notifications, ${unread} unread`} className="relative">
              <Bell className="size-4" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-violet" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notes.map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5">
                <span className={n.read ? "text-muted-foreground" : "font-medium"}>{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-1.5" aria-label="User menu">
              <Avatar className="size-7">
                <AvatarFallback className="bg-accent text-xs text-accent-foreground">AR</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium lg:inline">Ananya Rao</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm">Ananya Rao</div>
              <div className="text-xs font-normal text-muted-foreground">Lead Investigator</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="size-4" /> Profile</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings"><Settings className="size-4" /> Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled><LogOut className="size-4" /> Sign out (not available in demo)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
