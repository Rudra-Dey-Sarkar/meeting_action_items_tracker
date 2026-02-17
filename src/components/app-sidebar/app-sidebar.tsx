"use client";

import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { useTranscript } from "@/context/transcript-context";
import { Button } from "@/components/ui/button";
import { FileText, LayoutDashboard, MonitorCheck } from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
    const pathname = usePathname();
    const { currentTranscript, setCurrentTranscript, isHistoryLoading, history, fetchTranscrips } = useTranscript();

    return (
        <Sidebar className="border-r">

            {/* Header */}
            <SidebarHeader className="p-4 border-b">
                <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5" />
                    <h2 className="font-semibold text-lg">
                        Action Tracker
                    </h2>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    Manage meeting tasks efficiently
                </p>
            </SidebarHeader>

            {/* Content */}
            <SidebarContent>

                {/* Navigation Section */}
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent className="space-y-2 mt-2 pl-2.5">

                        <Link
                            href={"/"}
                            className={`flex gap-x-1 w-full justify-start items-center p-1 rounded-r-full ${pathname === "/" ? "bg-gray-200" : ""}`}>
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                        </Link>

                        <Link
                            href={"/status"}
                            className={`flex gap-x-1 w-full justify-start items-center p-1 rounded-r-full ${pathname === "/status" ? "bg-gray-200" : ""}`}>
                            <MonitorCheck className="w-4 h-4 mr-2" />
                            App Status
                        </Link>

                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Transcript History Section */}
                <SidebarGroup>
                    <SidebarGroupLabel>Recent Transcripts</SidebarGroupLabel>
                    <SidebarGroupContent className="space-y-1 mt-2">

                        {(isHistoryLoading && history.length === 0) ?
                            <p className="text-sm text-muted-foreground px-2">
                                Loading transcripts.....
                            </p> : (!isHistoryLoading && history.length === 0) ?
                                <p className="text-sm text-muted-foreground px-2">
                                    No transcripts yet
                                </p> :
                                <div>
                                    {history.map((t) => (
                                        <Button
                                            key={t.id}
                                            variant="ghost"
                                            size="sm"
                                            className={`w-full justify-start text-left truncate cursor-pointer ${t.id === currentTranscript?.id ? "underline" : ""}`}
                                            onClick={() => {
                                                fetchTranscrips();
                                                setCurrentTranscript(t)
                                            }}
                                        >
                                            <FileText className="w-4 h-4 mr-2 shrink-0" />
                                            <span className="truncate">
                                                {t.content.substring(0, 30)}...
                                            </span>
                                        </Button>
                                    ))}
                                </div>
                        }

                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="p-4 border-t">
                <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Meeting Workspace
                </p>
            </SidebarFooter>

        </Sidebar>
    );
}
