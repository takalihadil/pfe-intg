"use client";

import {
  LineChart, Wallet, Clock, ListTodo, Users, Trophy,
  Menu, X, Brain, Sparkles, Settings, Globe, Briefcase, 
  Calendar, HandCoins, LayoutDashboard, Shuffle, Rocket,
  Bell,
  CheckCircle,
  Diamond,
  Lock
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { useTranslation } from "@/components/context/translation-context";
import { useEffect, useState } from "react";
import {
  Popover, PopoverTrigger, PopoverContent
} from "./ui/popover";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose
} from "./ui/sheet";
import {
  Avatar, AvatarFallback, AvatarImage
} from "./ui/avatar";
import { Button } from "./ui/button";
import Cookies from 'js-cookie';
import { Skeleton } from "./ui/skeleton";
import { motion } from "framer-motion";
import NotificationButton from "./notification";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Notification {
  id: string;
  type: string;
  content: string;
  isRead: boolean;
  userId: string;
  habitId: string | null;
  postId: string | null;
  commentId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  id: string;
  email: string;
  fullname: string;
  role: string;
  profile_photo?: string;
  projectType: 'online' | 'offline';
  packageType: 'SILVER' | 'GOLD' | 'DIAMOND';
}

const baseNavigation = [
  { key: "transactions", name: "Transactions", href: "/transactions", icon: Wallet },
  { key: "habits", name: "Habits", href: "/habit", icon: ListTodo },
  { key: "community", name: "Community", href: "/habits/networking", icon: Users },
  { key: "sales", name: "Sales", href: "/sales", icon: HandCoins },
];

const offlineNavigation = [
  { key: "dashboard", name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "shifts", name: "Shifts", href: "/shifts", icon: Calendar },
  { key: "weekly_plan", name: "WeeklyPlan", href: "/WeeklyPlan", icon: Clock }, 
  { 
    key: "make_plan_real", 
    name: "Let's Make Your Plan Real", 
    href: "/startBusiness", 
    icon: Trophy,
    isDiamond: true,
    requiresPackage: 'DIAMOND'
  },
  { 
    key: "increase_business", 
    name: "Increase Your Business", 
    href: "/business-growth", 
    icon: Brain,
    isDiamond: true,
    isAlwaysDisabled: true,
    disabledMessage: "Start working first! Get some sales, expenses, and products to unlock this feature."
  },
];

const onlineNavigation = [
  { key: "dashboard", name: "Freelance", href: "/freelance", icon: LayoutDashboard },
  { 
    key: "find_job", 
    name: "Find Jobs", 
    href: "/skills", 
    icon: Sparkles,
    isDiamond: true,
    requiresPackage: 'DIAMOND'
  },
  { 
    key: "your_jobs", 
    name: "Your Jobs", 
    href: "/jobs", 
    icon: Briefcase,
    isDiamond: true,
    requiresPackage: 'DIAMOND'
  },
  { 
    key: "increase_work", 
    name: "Increase Your Work", 
    href: "/AiSalesBusiness", 
    icon: Rocket,
    isDiamond: true,
    isAlwaysDisabled: true,
    disabledMessage: "Start working first! Get some clients, projects, and invoices to unlock this feature."
  },
];

const adminNavigation = [
  { key: "admin_dashboard", name: "Admin", href: "/admin", icon: Shuffle },
];

interface NavigationProps {
  children: React.ReactNode;
}

// Diamond shimmer effect component
const DiamondShimmer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    className={cn("relative overflow-hidden", className)}
    animate={{
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{
      background: "linear-gradient(90deg, transparent, rgba(147, 197, 253, 0.3), transparent)",
      backgroundSize: "200% 100%",
    }}
  >
    <div className="relative z-10 flex items-center">
      <Diamond className="h-3 w-3 mr-2 text-blue-400 animate-pulse" />
      {children}
    </div>
  </motion.div>
);

export function Navigation({ children }: NavigationProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, changeLanguage } = useTranslation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Add these effects
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch('http://localhost:3000/auth/unread/count', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setUnreadCount(data.count);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
  }, [notifications]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch('http://localhost:3000/auth/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        console.log(data)
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Add these handler functions
  const handleMarkRead = async (notificationId: string) => {
    try {
      const token = Cookies.get("token");
      await fetch(`http://localhost:3000/auth/${notificationId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = Cookies.get("token");
      await fetch('http://localhost:3000/auth/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) throw new Error('No authentication token found');

        // First fetch to get sub
        const meResponse = await fetch("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!meResponse.ok) throw new Error('Failed to fetch user sub');
        const { sub } = await meResponse.json();

        // Second fetch to get user details including package
        const userResponse = await fetch(`http://localhost:3000/auth/${sub}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!userResponse.ok) throw new Error('Failed to fetch user details');
        const userData = await userResponse.json();

        setUser({
          id: userData.id,
          email: userData.email,
          fullname: userData.fullname,
          role: userData.role,
          profile_photo: userData.profile_photo,
          projectType: userData.projectType,
          packageType: userData.packageType || 'SILVER'
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getNavigationItems = () => {
    if (!user) return baseNavigation;
    
    let items = [...baseNavigation];
    
    if (user.role === 'ADMIN') {
      items = [...items, ...adminNavigation];
    } else if (user.projectType === 'offline') {
      items = [...items, ...offlineNavigation];
    } else if (user.projectType === 'online') {
      items = [...items, ...onlineNavigation];
    }

    return items;
  };

  const isItemAccessible = (item: any) => {
    if (!item.requiresPackage && !item.isAlwaysDisabled) return true;
    if (item.isAlwaysDisabled) return false;
    if (item.requiresPackage && user?.packageType !== item.requiresPackage) return false;
    return true;
  };

  const getDisabledMessage = (item: any) => {
    if (item.disabledMessage) return item.disabledMessage;
    if (item.requiresPackage && user?.packageType !== item.requiresPackage) {
      return `Upgrade to ${item.requiresPackage} package to unlock this feature!`;
    }
    return "This feature is not available";
  };

  const renderNavigationItem = (item: any, isMobile = false) => {
    const isAccessible = isItemAccessible(item);
    const isActive = pathname === item.href || pathname.startsWith(item.href);
    
    const content = (
      <div
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative",
          isActive && isAccessible
            ? "bg-primary/10 text-primary"
            : isAccessible
            ? "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            : "text-muted-foreground/50 cursor-not-allowed",
          !isMobile && isCollapsed ? "justify-center" : ""
        )}
      >
        {!isAccessible && (
          <Lock className={cn("shrink-0 text-muted-foreground/50", 
            isCollapsed && !isMobile ? "h-5 w-5" : "h-4 w-4 mr-3"
          )} />
        )}
        
        {isAccessible && (
          <item.icon className={cn("shrink-0", 
            isCollapsed && !isMobile ? "h-5 w-5" : "h-4 w-4 mr-3"
          )} />
        )}
        
        {(!isCollapsed || isMobile) && (
          <span className="truncate flex-1">
            {item.isDiamond && isAccessible ? (
              <DiamondShimmer>
                {t(item.key)}
              </DiamondShimmer>
            ) : (
              t(item.key)
            )}
          </span>
        )}
        
        {item.isDiamond && isAccessible && (!isCollapsed || isMobile) && (
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Diamond className="h-4 w-4 text-blue-400 ml-2" />
          </motion.div>
        )}
      </div>
    );

    if (!isAccessible) {
      return (
        <TooltipProvider key={item.href}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>{content}</div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p>{getDisabledMessage(item)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Link key={item.href} href={item.href}>
        {content}
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Skeleton className="w-64 bg-card border-r" />
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={cn("bg-card border-r flex flex-col transition-all duration-300", isCollapsed ? "w-[4rem]" : "w-64")}>
        <div className="p-4 border-b flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold">IndieTracker</span>
              {user?.packageType === 'DIAMOND' && (
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Diamond className="h-5 w-5 text-blue-400" />
                </motion.div>
              )}
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Package Status */}
        {!isCollapsed && user && (
          <div className="p-3 border-b">
            <div className={cn(
              "text-xs font-medium px-2 py-1 rounded-full text-center",
              user.packageType === 'DIAMOND' 
                ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                : user.packageType === 'GOLD'
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30"
                : "bg-gray-500/20 text-gray-400 border border-gray-400/30"
            )}>
              {user.packageType === 'DIAMOND' && (
                <div className="flex items-center justify-center space-x-1">
                  <Diamond className="h-3 w-3" />
                  <span>DIAMOND</span>
                </div>
              )}
              {user.packageType === 'GOLD' && <span>GOLD</span>}
              {user.packageType === 'SILVER' && <span>SILVER</span>}
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 p-2 space-y-1">
          {getNavigationItems().map((item) => renderNavigationItem(item))}
        </nav>

        {/* Bottom Controls */}
        <div className="p-4 border-t flex flex-col gap-3">
          <ModeToggle />
          {!isCollapsed && user && (
            <div className="flex items-center justify-between">
              <Link href="/settings">
                <Settings className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Link>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profile_photo || "/default-avatar.png"} alt={user.fullname} />
                      <AvatarFallback>{user.fullname?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-40">
                  <Link href="/profile" className="block px-3 py-2 hover:bg-accent rounded-md">
                    {t("profile")}
                  </Link>
                  <Link href="/logout" className="block px-3 py-2 hover:bg-accent rounded-md">
                    {t("logout")}
                  </Link>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Topbar (for small screens) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold">IndieTracker</span>
            {user?.packageType === 'DIAMOND' && (
              <Diamond className="h-4 w-4 text-blue-400" />
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-6 w-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40">
              <button onClick={() => changeLanguage("en")} className="block w-full px-3 py-2 text-left hover:bg-accent rounded-md">
                English
              </button>
              <button onClick={() => changeLanguage("ar")} className="block w-full px-3 py-2 text-left hover:bg-accent rounded-md">
                العربية
              </button>
            </PopoverContent>
          </Popover>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-semibold">IndieTracker</span>
            {user?.packageType === 'DIAMOND' && (
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Diamond className="h-5 w-5 text-blue-400" />
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-6 w-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-40">
                <button onClick={() => changeLanguage("en")} className="block w-full px-3 py-2 text-left hover:bg-accent rounded-md">
                  English
                </button>
                <button onClick={() => changeLanguage("ar")} className="block w-full px-3 py-2 text-left hover:bg-accent rounded-md">
                  العربية
                </button>
              </PopoverContent>
            </Popover>

            {/* Dark/Light Mode */}
            <ModeToggle />
            
            <NotificationButton
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
            />

            {/* Settings and Avatar */}
            <Link href="/settings">
              <Settings className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Link>
            
            
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    {user ? (
                      <>
                        <AvatarImage src={user.profile_photo || "/default-avatar.png"} alt={user.fullname} />
                        <AvatarFallback>{user.fullname?.[0]}</AvatarFallback>
                      </>
                    ) : (
                      <AvatarFallback>U</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-40">
                <Link href="/profile" className="block px-3 py-2 hover:bg-accent rounded-md">
                  {t("profile")}
                </Link>
                <Link href="/logout" className="block px-3 py-2 hover:bg-accent rounded-md">
                  {t("logout")}
                </Link>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <main className="flex-1 container mx-auto px-4 py-4">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[250px]">
          <SheetHeader className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SheetTitle>{t("menu")}</SheetTitle>
                {user?.packageType === 'DIAMOND' && (
                  <Diamond className="h-4 w-4 text-blue-400" />
                )}
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>
          
          {/* Mobile Package Status */}
          {user && (
            <div className="mb-4">
              <div className={cn(
                "text-xs font-medium px-2 py-1 rounded-full text-center",
                user.packageType === 'DIAMOND' 
                  ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                  : user.packageType === 'GOLD'
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30"
                  : "bg-gray-500/20 text-gray-400 border border-gray-400/30"
              )}>
                {user.packageType === 'DIAMOND' && (
                  <div className="flex items-center justify-center space-x-1">
                    <Diamond className="h-3 w-3" />
                    <span>DIAMOND</span>
                  </div>
                )}
                {user.packageType === 'GOLD' && <span>GOLD</span>}
                {user.packageType === 'SILVER' && <span>SILVER</span>}
              </div>
            </div>
          )}
          
          <nav className="flex flex-col gap-2">
            {getNavigationItems().map((item) => renderNavigationItem(item, true))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}