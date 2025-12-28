"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Bell, Loader2 } from "lucide-react"; // Add Loader2 icon for spinner
import { Badge } from "./ui/badge";
import {
  getnotification_admin,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/action/dashboard";
import { useQuery } from "@tanstack/react-query";
import { format } from "path";
import Link from "next/link";
import { queryClient } from "@/app/ClientProviders";
export default function NotificationDropdown() {
  const formatOrderDate = (seconds: number) => {
    try {
      const date = new Date(seconds * 1000);
      const timeString = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const dateString = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `${timeString} - ${dateString}`;
    } catch (error) {
      return "Invalid date";
    }
  };
  const { data, isLoading } = useQuery({
    queryKey: ["notifications_admin"],
    queryFn: async () => {
      const data = await getnotification_admin();
      return data;
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="border-none ring-0 outline-none">
        <Button
          variant="ghost"
          className="rounded-full relative border-none  outline-none ring-0"
          size="icon"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {data?.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 border-none outline-none -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {data?.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 bg-white">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {data?.length > 0 && !isLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                markAllNotificationsAsRead();
                queryClient.setQueryData(
                  ["notifications_admin"],
                  (oldData: any) => {
                    return [];
                  }
                );
              }}
              className="text-xs h-7"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          data.length >= 0 &&
          data.map((notification: any) => (
            <DropdownMenuItem key={notification.id} className="p-0">
              <Link
                onClick={() => {
                  queryClient.setQueryData(
                    ["notifications_admin"],
                    (oldData: any) => {
                      return oldData.filter(
                        (item: any) => item.id !== notification.id
                      );
                    }
                  );
                  markNotificationAsRead(notification.id);
                }}
                href={
                  notification.type === "order"
                    ? `/dashboard/order/${notification.id}`
                    : "#"
                }
                className={`w-full p-3 ${notification.read ? "" : "bg-muted"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-6 min-h-6 max-w-6 max-h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell
                      size={16}
                      className="text-primary min-w-4 min-h-4 max-w-4 max-h-4"
                    />
                  </div>
                  <div>
                    <p className="text-sm line-clamp-1">
                      {notification.message}aaaaa
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatOrderDate(notification.timestamp?.seconds as any)}
                      aaa
                    </p>
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
