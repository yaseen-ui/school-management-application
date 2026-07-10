"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import * as leaveApi from "@/lib/api/leave";
import type { LeaveCategory } from "@/lib/api/leave";

export default function ApplyLeavePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<LeaveCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    applicantType: "employee",
    leaveCategoryId: "",
    startDate: "",
    endDate: "",
    startFraction: "full_day",
    endFraction: "full_day",
    reason: "",
  });

  useEffect(() => {
    leaveApi.getLeaveCategories("employee").then(setCategories).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await leaveApi.createLeaveRequest({
        applicantType: form.applicantType as "employee" | "student",
        leaveCategoryId: form.leaveCategoryId,
        startDate: form.startDate,
        endDate: form.endDate,
        startFraction: form.startFraction,
        endFraction: form.endFraction,
        reason: form.reason,
      });
      router.push("/leave/requests");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Apply for Leave</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Leave Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Leave Category</Label>
              <select
                className="w-full border rounded-md p-2 mt-1"
                value={form.leaveCategoryId}
                onChange={(e) => setForm({ ...form, leaveCategoryId: e.target.value })}
                required
              >
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Day</Label>
                <select className="w-full border rounded-md p-2 mt-1" value={form.startFraction} onChange={(e) => setForm({ ...form, startFraction: e.target.value })}>
                  <option value="full_day">Full Day</option>
                  <option value="first_half">First Half</option>
                  <option value="second_half">Second Half</option>
                </select>
              </div>
              <div>
                <Label>End Day</Label>
                <select className="w-full border rounded-md p-2 mt-1" value={form.endFraction} onChange={(e) => setForm({ ...form, endFraction: e.target.value })}>
                  <option value="full_day">Full Day</option>
                  <option value="first_half">First Half</option>
                  <option value="second_half">Second Half</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea rows={4} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required placeholder="Enter reason for leave..." />
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Draft"}</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}