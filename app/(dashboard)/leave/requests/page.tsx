"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as leaveApi from "@/lib/api/leave";
import type { LeaveRequest } from "@/lib/api/leave";
import Link from "next/link";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  partially_approved: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-purple-100 text-purple-700",
  cancelled: "bg-orange-100 text-orange-700",
};

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await leaveApi.getLeaveRequests();
      setRequests(data);
    } catch { }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSubmit = async (id: string) => {
    await leaveApi.submitLeaveRequest(id);
    fetch();
  };

  const handleWithdraw = async (id: string) => {
    const reason = prompt("Withdrawal reason:");
    if (reason) {
      await leaveApi.withdrawLeaveRequest(id, reason);
      fetch();
    }
  };

  const handleCancel = async (id: string) => {
    const reason = prompt("Cancellation reason:");
    if (reason) {
      await leaveApi.cancelLeaveRequest(id, reason);
      fetch();
    }
  };

  const handleApprove = async (id: string) => {
    await leaveApi.approveLeaveRequest(id);
    fetch();
  };

  const handleReject = async (id: string) => {
    const remarks = prompt("Rejection remarks:");
    await leaveApi.rejectLeaveRequest(id, 1, remarks || undefined);
    fetch();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leave Requests</h1>
        <Link href="/leave/apply"><Button>New Request</Button></Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No leave requests found.</div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {req.employee?.fullName || (req.student ? req.student.firstName + " " + req.student.lastName : null) || "Unknown"}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[req.status] || "bg-gray-100"}`}>
                        {req.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {req.leaveCategory?.name} • {req.startDate} to {req.endDate} • {req.calculatedDays} day(s)
                    </div>
                    <div className="text-sm truncate max-w-md">{req.reason}</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {req.status === "draft" && (
                      <Button size="sm" onClick={() => handleSubmit(req.id)}>Submit</Button>
                    )}
                    {(req.status === "pending" || req.status === "partially_approved") && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleWithdraw(req.id)}>Withdraw</Button>
                        <Button size="sm" onClick={() => handleApprove(req.id)}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(req.id)}>Reject</Button>
                      </>
                    )}
                    {req.status === "approved" && (
                      <Button size="sm" variant="outline" onClick={() => handleCancel(req.id)}>Cancel</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}