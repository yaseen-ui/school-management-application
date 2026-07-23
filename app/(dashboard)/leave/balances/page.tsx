"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as leaveApi from "@/lib/api/leave";
import type { EmployeeLeaveBalance } from "@/lib/api/leave";

export default function LeaveBalancesPage() {
  const [balances, setBalances] = useState<EmployeeLeaveBalance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    leaveApi.getAllBalances().then(setBalances).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Leave Balances</h1>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : balances.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No balances found.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Employee Leave Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Allocated</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Available</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balances.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.employee?.fullName || "N/A"}</TableCell>
                    <TableCell>{b.leaveCategory?.name || "N/A"}</TableCell>
                    <TableCell>{b.academicYear?.name || "N/A"}</TableCell>
                    <TableCell>{b.allocated}</TableCell>
                    <TableCell>{b.used}</TableCell>
                    <TableCell>{b.pending}</TableCell>
                    <TableCell className="font-semibold">{b.available ?? (b.allocated + b.carriedForward + b.manualAdjustment - b.used - b.pending)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}