"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { coursesApi, type CreateCourseRequest, type UpdateCourseRequest } from "@/lib/api/courses"

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => coursesApi.getAll(),
  })
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: () => coursesApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCourseRequest) => coursesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      toast.success("Course created successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to create course", {
        description: error.message,
      })
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseRequest }) => coursesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      toast.success("Course updated successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to update course", {
        description: error.message,
      })
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => coursesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      toast.success("Course deleted successfully")
    },
    onError: (error: Error) => {
      toast.error("Failed to delete course", {
        description: error.message,
      })
    },
  })
}
