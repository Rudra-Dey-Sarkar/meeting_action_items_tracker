"use client";

import React, { Dispatch, SetStateAction } from 'react'
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


type CreateNewTaskModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
    onAdd: (data: Partial<ActionItem>) => void
}

function CreateNewTaskModal({ onAdd, isModalOpen, setIsModalOpen }: CreateNewTaskModalProps) {
    const { register, handleSubmit, reset } = useForm<FormValues>();

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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