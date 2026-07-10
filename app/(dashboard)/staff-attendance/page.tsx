"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { config } from "@/lib/config";

interface TeacherInfo {
  id: string;
  fullName: string;
  employeeCode: string | null;
  employeeType: string;
  phone: string | null;
}

interface SessionInfo {
  id: string;
  checkInTime: string;
  checkOutTime: string | null;
  checkInMethod: string | null;
  checkOutMethod: string | null;
  durationMinutes: number | null;
}

interface StaffAttendanceRecord {
  id: string;
  tenantId: string;
  teacherId: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string;
  totalMinutes: number;
  sessionCount: number;
  teacher: TeacherInfo | null;
  sessions: SessionInfo[];
}

interface MyTodayRecord {
  id?: string;
  status: string;
  teacher?: TeacherInfo;
  checkInTime?: string;
  checkOutTime?: string;
  totalMinutes?: number;
  sessionCount?: number;
  sessions: SessionInfo[];
}

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  checked_in: "bg-green-100 text-green-700",
  checked_out: "bg-blue-100 text-blue-700",
  absent: "bg-red-100 text-red-700",
  on_leave: "bg-yellow-100 text-yellow-700",
};

export default function StaffAttendancePage() {
  const [records, setRecords] = useState<StaffAttendanceRecord[]>([]);
  const [myToday, setMyToday] = useState<MyTodayRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const token = useAuthStore((s) => s.token);
  const tenantId = useAuthStore((s) => s.tenantId);

  const apiFetch = useCallback(
    async (path: string, options?: RequestInit) => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options?.headers as Record<string, string>),
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (tenantId) headers["x-tenant-id"] = tenantId;

      const res = await fetch(`${config.apiBaseUrl}${path}`, {
        ...options,
        headers,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Request failed");
      return json.data ?? json;
    },
    [token, tenantId],
  );

  const fetchData = useCallback(async () => {
    try {
      const [recordsData, myTodayData] = await Promise.all([
        apiFetch("/staff-attendance/today"),
        apiFetch("/staff-attendance/my-today"),
      ]);
      setRecords(recordsData.rows ?? recordsData ?? []);
      setMyToday(myTodayData);
    } catch (err) {
      console.error("Failed to fetch staff attendance:", err);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });
  };

  const handleCheckIn = async () => {
    setActionLoading(true);
    setGeolocationError(null);
    try {
      const pos = await getCurrentPosition();
      await apiFetch("/staff-attendance/check-in", {
        method: "POST",
        body: JSON.stringify({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          checkInMethod: "gps",
        }),
      });
      await fetchData();
    } catch (err: any) {
      setGeolocationError(err.message || "Failed to check in");
      console.error("Check-in failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setGeolocationError(null);
    try {
      const pos = await getCurrentPosition();
      await apiFetch("/staff-attendance/check-out", {
        method: "POST",
        body: JSON.stringify({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          checkOutMethod: "gps",
        }),
      });
      await fetchData();
    } catch (err: any) {
      setGeolocationError(err.message || "Failed to check out");
      console.error("Check-out failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const canCheckIn = !myToday || myToday.status === "pending" || myToday.status === "checked_out";
  const canCheckOut = myToday?.status === "checked_in";

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatTime = (dt: string | null | undefined) => {
    if (!dt) return "-";
    return new Date(dt).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (min: number) => {
    if (min < 60) return `${min}m`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Staff Attendance</h1>
      </div>

      {/* My Today Card */}
      <Card>
        <CardHeader>
          <CardTitle>My Today's Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : myToday ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {myToday.teacher?.fullName ?? "You"}{" "}
                    {myToday.teacher?.employeeCode
                      ? `(${myToday.teacher.employeeCode})`
                      : ""}
                  </p>
                  <Badge
                    className={
                      statusColors[myToday.status] ?? "bg-gray-100 text-gray-700"
                    }
                  >
                    {myToday.status === "checked_in"
                      ? "Checked In"
                      : myToday.status === "checked_out"
                        ? "Checked Out"
                        : myToday.status === "pending"
                          ? "Not Checked In"
                          : myToday.status}
                  </Badge>
                  {myToday.totalMinutes != null && myToday.totalMinutes > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Total: {formatDuration(myToday.totalMinutes)}
                    </p>
                  )}
                  {myToday.sessionCount != null && myToday.sessionCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Sessions: {myToday.sessionCount}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCheckIn}
                    disabled={!canCheckIn || actionLoading}
                    variant="default"
                    size="sm"
                  >
                    {actionLoading ? "..." : "Check In"}
                  </Button>
                  <Button
                    onClick={handleCheckOut}
                    disabled={!canCheckOut || actionLoading}
                    variant="outline"
                    size="sm"
                  >
                    {actionLoading ? "..." : "Check Out"}
                  </Button>
                </div>
              </div>
              {myToday.sessions && myToday.sessions.length > 0 && (
                <div className="rounded-md border bg-muted/30 p-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Session History
                  </p>
                  <div className="space-y-1">
                    {myToday.sessions.map((s, i) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between text-xs text-muted-foreground"
                      >
                        <span>
                          #{i + 1}: {formatTime(s.checkInTime)} →{" "}
                          {formatTime(s.checkOutTime)}
                        </span>
                        <span>
                          {s.durationMinutes != null
                            ? formatDuration(s.durationMinutes)
                            : s.checkOutTime
                              ? "—"
                              : "Ongoing"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No staff profile linked to your account. Contact admin.
            </p>
          )}
          {geolocationError && (
            <p className="mt-2 text-sm text-red-600">{geolocationError}</p>
          )}
        </CardContent>
      </Card>

      {/* Today's All Staff */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Staff Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No attendance records for today.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Last In</TableHead>
                  <TableHead>Last Out</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <>
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.teacher?.fullName ?? "-"}
                      </TableCell>
                      <TableCell>
                        {record.teacher?.employeeCode ?? "-"}
                      </TableCell>
                      <TableCell className="capitalize">
                        {record.teacher?.employeeType?.replace("_", " ") ?? "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            statusColors[record.status] ??
                            "bg-gray-100 text-gray-700"
                          }
                        >
                          {record.status === "checked_in"
                            ? "Checked In"
                            : record.status === "checked_out"
                              ? "Checked Out"
                              : record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.totalMinutes > 0
                          ? formatDuration(record.totalMinutes)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {formatTime(record.checkInTime)}
                      </TableCell>
                      <TableCell>
                        {formatTime(record.checkOutTime)}
                      </TableCell>
                      <TableCell>
                        {record.sessions && record.sessions.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(record.id)}
                          >
                            {expandedRows.has(record.id)
                              ? "Collapse"
                              : `History (${record.sessions.length})`}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(record.id) && record.sessions && (
                      <TableRow key={`${record.id}-sessions`}>
                        <TableCell colSpan={8} className="bg-muted/30">
                          <div className="space-y-1 py-2">
                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                              Session History ({record.sessions.length} session
                              {record.sessions.length > 1 ? "s" : ""})
                            </p>
                            {record.sessions.map((s, i) => (
                              <div
                                key={s.id}
                                className="flex items-center justify-between text-xs text-muted-foreground"
                              >
                                <span>
                                  #{i + 1}: {formatTime(s.checkInTime)} →{" "}
                                  {formatTime(s.checkOutTime)}
                                </span>
                                <span>
                                  {s.durationMinutes != null
                                    ? formatDuration(s.durationMinutes)
                                    : s.checkOutTime
                                      ? "—"
                                      : "Ongoing"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}