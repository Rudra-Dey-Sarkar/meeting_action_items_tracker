"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    onSubmit: (transcript: string) => void;
    isLoading: boolean
}

export function TranscriptInput({ onSubmit, isLoading }: Props) {
    const { register, handleSubmit, reset } = useForm<{ transcript: string }>();

    return (
        <form
            onSubmit={handleSubmit((data) => {
                onSubmit(data.transcript);
                reset();
            })}
            className="space-y-4 border p-4 rounded-lg"
        >
            <Textarea
                {...register("transcript", { required: true })}
                placeholder="Paste transcript..."
                className="min-h-[150px]"
            />

            <Button 
            disabled={isLoading}
            type="submit" 
            className="w-full">
                {isLoading ? 
                "Extracting Actions....."
                :
                "Extract Action Items"
                }
            </Button>
        </form>
    );
}
