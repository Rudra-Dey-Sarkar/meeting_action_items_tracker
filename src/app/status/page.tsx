"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AppWindowMac, BrainCircuit, Database } from "lucide-react";

interface StatusResponse {
    app: string;
    db: string;
    llm: string;
    timestamp: string;
}

export default function StatusPage() {
    const [status, setStatus] = useState<StatusResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            const res = await fetch("/api/status");
            const data = await res.json();
            setStatus(data);
        } catch (error) {
            console.error("Failed to fetch status:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();

        // Auto refresh every 10 seconds
        const interval = setInterval(fetchStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (value: string) => {
        if (value === "running" || value === "connected" || value === "configured")
            return "bg-green-100 text-green-700 border-green-300";

        if (value === "missing_key")
            return "bg-yellow-100 text-yellow-700 border-yellow-300";

        return "bg-red-100 text-red-700 border-red-300";
    };

    return (
        <main className="flex-1 p-6 max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    System Health Monitor
                </h1>
                <p className="text-sm text-muted-foreground">
                    Real-time backend, database, and LLM connectivity status.
                </p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="space-y-6">
                    {/* Top Cards Skeleton */}
                    <div className="grid gap-6 sm:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card
                                key={i}
                                className="p-6 space-y-4 animate-pulse border bg-muted/30"
                            >
                                <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                                <Skeleton className="h-8 w-16 bg-gray-300 dark:bg-gray-600" />
                            </Card>
                        ))}
                    </div>

                    {/* Footer Skeleton */}
                    <Card className="p-4 text-center border bg-muted/30 animate-pulse">
                        <Skeleton className="h-3 w-40 mx-auto bg-gray-200 dark:bg-gray-700" />
                    </Card>
                </div>
            )}


            {/* Status Cards */}
            {status && (
                <>
                    <div className="grid gap-6 sm:grid-cols-3">

                        {/* App */}
                        <Card className="p-6 flex flex-col justify-between border shadow-sm transition hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <AppWindowMac size={14} />
                                    Application
                                </span>
                                <span className={`h-2 w-2 rounded-full animate-pulse ${status.app === "running"
                                    ? "bg-green-500"
                                    : status.app === "missing_key"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`} />
                            </div>
                            <Badge
                                className={`mt-3 w-fit border font-semibold tracking-wide ${getStatusColor(status.app)}`}
                            >
                                {status.app.toUpperCase()}
                            </Badge>
                        </Card>

                        {/* DB */}
                        <Card className="p-6 flex flex-col justify-between border shadow-sm transition hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Database size={14} />
                                    Database
                                </span>
                                <span className={`h-2 w-2 rounded-full animate-pulse ${status.app === "running"
                                    ? "bg-green-500"
                                    : status.app === "missing_key"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`} />
                            </div>
                            <Badge
                                className={`mt-3 w-fit border font-semibold tracking-wide ${getStatusColor(status.app)}`}
                            >
                                {status.db.toUpperCase()}
                            </Badge>
                        </Card>

                        {/* LLM */}
                        <Card className="p-6 flex flex-col justify-between border shadow-sm transition hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <BrainCircuit size={14} />
                                    LLM Service
                                </span>
                                <span className={`h-2 w-2 rounded-full animate-pulse ${status.app === "running"
                                    ? "bg-green-500"
                                    : status.app === "missing_key"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`} />
                            </div>
                            <Badge
                                className={`mt-3 w-fit border font-semibold tracking-wide ${getStatusColor(status.app)}`}
                            >
                                {status.llm.toUpperCase()}
                            </Badge>
                        </Card>

                    </div>

                    {/* Footer Info */}
                    <Card className="p-4 text-xs text-muted-foreground text-center border bg-muted/30">
                        Last health check:
                        <span className="ml-1 font-medium text-foreground">
                            {new Date(status.timestamp).toLocaleString()}
                        </span>
                    </Card>
                </>
            )}
        </main>
    );
}
