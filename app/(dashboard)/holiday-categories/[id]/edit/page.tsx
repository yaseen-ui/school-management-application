"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Tag, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useHolidayCategory, useUpdateHolidayCategory } from "@/hooks/use-holidays";

interface FormData { name: string; description: string; sortOrder: number; }

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data: category, isLoading } = useHolidayCategory(id);
  const updateCategory = useUpdateHolidayCategory();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    values: category ? { name: category.name, description: category.description || "", sortOrder: category.sortOrder } : undefined,
  });

  const onSubmit = async (data: FormData) => {
    await updateCategory.mutateAsync({ id, data: { name: data.name, description: data.description || undefined, sortOrder: Number(data.sortOrder) } });
    router.push("/holiday-categories");
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  if (!category) return <div className="flex flex-col items-center justify-center h-64 gap-4"><p className="text-muted-foreground">Category not found</p><Button onClick={() => router.push("/holiday-categories")}>Back</Button></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-2xl font-semibold">Edit Category</h1><p className="text-sm text-muted-foreground">Update category details</p></div>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Tag className="h-5 w-5 text-primary" /></div>
            <div><CardTitle>Category Details</CardTitle><CardDescription>Update the information below</CardDescription></div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input id="name" {...register("name", { required: "Name is required" })} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input id="sortOrder" type="number" {...register("sortOrder")} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={updateCategory.isPending}>Cancel</Button>
            <Button type="submit" disabled={updateCategory.isPending}>
              {updateCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Update Category
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}