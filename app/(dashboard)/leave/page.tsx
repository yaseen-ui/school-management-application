"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, FileText, Users } from "lucide-react";
import * as leaveApi from "@/lib/api/leave";

export default function LeavePage() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    leaveApi.getLeaveSummary().then(setSummary).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Leave Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalRequests ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary?.pendingRequests ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary?.approvedRequests ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary?.rejectedRequests ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/leave/apply">
          <Card className="hover:bg-accent cursor-pointer transition-colors h-full">
            <CardContent className="flex items-center gap-4 p-6">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">Apply for Leave</h3>
                <p className="text-sm text-muted-foreground">Submit a new leave request</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/leave/requests">
          <Card className="hover:bg-accent cursor-pointer transition-colors h-full">
            <CardContent className="flex items-center gap-4 p-6">
              <Clock className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">Leave Requests</h3>
                <p className="text-sm text-muted-foreground">View and manage all requests</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/leave/categories">
          <Card className="hover:bg-accent cursor-pointer transition-colors h-full">
            <CardContent className="flex items-center gap-4 p-6">
              <Calendar className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">Leave Categories</h3>
                <p className="text-sm text-muted-foreground">Manage leave types and policies</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/leave/balances">
          <Card className="hover:bg-accent cursor-pointer transition-colors h-full">
            <CardContent className="flex items-center gap-4 p-6">
              <Users className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">Leave Balances</h3>
                <p className="text-sm text-muted-foreground">View employee leave balances</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/leave/configuration">
          <Card className="hover:bg-accent cursor-pointer transition-colors h-full">
            <CardContent className="flex items-center gap-4 p-6">
              <Calendar className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">Configuration</h3>
                <p className="text-sm text-muted-foreground">Working days and leave settings</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}