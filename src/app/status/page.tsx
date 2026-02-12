"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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

    const getVariant = (value: string) => {
        if (value === "running" || value === "connected" || value === "configured")
            return "default";
        if (value === "missing_key") return "secondary";
        return "destructive";
    };

    return (
        <main className="flex-1 p-6 max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Application Status</h1>

            {loading && (
                <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            )}

            {status && (
                <>
                    <Card className="p-6 flex justify-between items-center">
                        <span className="font-medium">App Status</span>
                        <Badge variant={getVariant(status.app)}>
                            {status.app}
                        </Badge>
                    </Card>

                    <Card className="p-6 flex justify-between items-center">
                        <span className="font-medium">Database</span>
                        <Badge variant={getVariant(status.db)}>
                            {status.db}
                        </Badge>
                    </Card>

                    <Card className="p-6 flex justify-between items-center">
                        <span className="font-medium">LLM Configuration</span>
                        <Badge variant={getVariant(status.llm)}>
                            {status.llm}
                        </Badge>
                    </Card>

                    <Card className="p-4 text-sm text-muted-foreground text-center">
                        Last checked: {new Date(status.timestamp).toLocaleString()}
                    </Card>
                </>
            )}
        </main>
    );
}
