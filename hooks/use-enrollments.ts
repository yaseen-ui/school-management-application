import { useQuery } from "@tanstack/react-query"
import { enrollmentsApi } from "@/lib/api/enrollments"

export function useEnrollments(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["enrollments", filters],
    queryFn: async () => {
      const response = await enrollmentsApi.getEnrollments(filters)
      return response.data
    },
  })
}
