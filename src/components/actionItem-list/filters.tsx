"use client";

import React, { Dispatch, SetStateAction } from 'react'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { BrushCleaning } from 'lucide-react';

type FiltersProps = {
    filter: "all" | "pending" | "done";
    setFilter: Dispatch<SetStateAction<"all" | "pending" | "done">>;
    dateFilter: string;
    setDateFilter: Dispatch<SetStateAction<string>>;
}

function Filters({ filter, setFilter, dateFilter, setDateFilter }: FiltersProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <Button
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
            >
                All
            </Button>
            <Button
                size="sm"
                variant={filter === "pending" ? "default" : "outline"}
                onClick={() => setFilter("pending")}
            >
                Pending
            </Button>
            <Button
                size="sm"
                variant={filter === "done" ? "default" : "outline"}
                onClick={() => setFilter("done")}
            >
                Done
            </Button>

            <Input
                type="date"
                className="w-auto"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
            />
            <Button
                className='cursor-pointer'
                onClick={() => {
                    setFilter("all");
                    setDateFilter("");
                }} >
                <BrushCleaning />
                Clear
            </Button>
        </div>
    )
}

export default Filters