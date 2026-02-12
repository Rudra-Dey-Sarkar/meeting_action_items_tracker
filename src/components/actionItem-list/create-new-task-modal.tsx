"use client";

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { FormValues } from './actionItem-list';
import { Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { ActionItem } from '@/types/action-item';

function CreateNewTaskModal({ onAdd }: { onAdd: (data: Partial<ActionItem>) => void }) {
    const { register, handleSubmit, reset } = useForm<FormValues>();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus size={16} className="mr-2" />
                    Create New
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit((data) => {
                        onAdd(data);
                        reset();
                    })}
                    className="space-y-4"
                >
                    <Input
                        {...register("task", { required: true })}
                        placeholder="Task"
                    />
                    <Input {...register("owner")} placeholder="Owner" />
                    <Input {...register("due_date")} type="date" />

                    <Button type="submit" className="w-full">
                        Add Task
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateNewTaskModal