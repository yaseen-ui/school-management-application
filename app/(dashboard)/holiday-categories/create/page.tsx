"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Tag, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateHolidayCategory } from "@/hooks/use-holidays";

interface FormData {
  name: string;
  description: string;
  sortOrder: number;
}

export default function CreateCategoryPage() {
  const router = useRouter();
  const createCategory = useCreateHolidayCategory();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { name: "", description: "", sortOrder: 0 },
  });

  const onSubmit = async (data: FormData) => {
    await createCategory.mutateAsync({ name: data.name, description: data.description || undefined, sortOrder: Number(data.sortOrder) || 0 });
    router.push("/holiday-categories");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-2xl font-semibold">Add Category</h1><p className="text-sm text-muted-foreground">Create a new holiday category</p></div>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Tag className="h-5 w-5 text-primary" /></div>
            <div><CardTitle>Category Details</CardTitle><CardDescription>Fill in the information below</CardDescription></div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input id="name" placeholder="e.g., Festival" {...register("name", { required: "Name is required" })} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Optional description..." {...register("description")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input id="sortOrder" type="number" {...register("sortOrder")} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={createCategory.isPending}>Cancel</Button>
            <Button type="submit" disabled={createCategory.isPending}>
              {createCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Category
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}