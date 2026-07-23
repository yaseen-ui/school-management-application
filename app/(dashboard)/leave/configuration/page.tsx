"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as leaveApi from "@/lib/api/leave";
import type { TenantLeaveConfig } from "@/lib/api/leave";

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export default function LeaveConfigurationPage() {
  const [config, setConfig] = useState<TenantLeaveConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    allowSaturdayHalfDay: false,
    allowLeaveWithoutApproval: false,
    enableLowBalanceAlert: false,
    lowBalanceAlertThreshold: "",
  });

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await leaveApi.getTenantLeaveConfig();
      setConfig(data);
      setForm({
        workingDays: data.workingDays || [],
        allowSaturdayHalfDay: data.allowSaturdayHalfDay ?? false,
        allowLeaveWithoutApproval: data.allowLeaveWithoutApproval ?? false,
        enableLowBalanceAlert: data.enableLowBalanceAlert ?? false,
        lowBalanceAlertThreshold: data.lowBalanceAlertThreshold?.toString() || "",
      });
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await leaveApi.updateTenantLeaveConfig({
        workingDays: form.workingDays,
        allowSaturdayHalfDay: form.allowSaturdayHalfDay,
        allowLeaveWithoutApproval: form.allowLeaveWithoutApproval,
        enableLowBalanceAlert: form.enableLowBalanceAlert,
        lowBalanceAlertThreshold: form.lowBalanceAlertThreshold ? Number(form.lowBalanceAlertThreshold) : null,
      });
      setConfig(updated);
      alert("Configuration saved successfully.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Leave Configuration</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Working Days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Select which days of the week are working days.</p>
            <div className="flex flex-wrap gap-3">
              {DAYS.map((day) => (
                <label key={day.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.workingDays.includes(day.key)}
                    onChange={() => toggleDay(day.key)}
                  />
                  <span className="text-sm">{day.label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.allowSaturdayHalfDay}
                onChange={(e) => setForm({ ...form, allowSaturdayHalfDay: e.target.checked })}
              />
              <span className="text-sm font-medium">Allow Saturday Half Day</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.allowLeaveWithoutApproval}
                onChange={(e) => setForm({ ...form, allowLeaveWithoutApproval: e.target.checked })}
              />
              <span className="text-sm font-medium">Allow Leave Without Approval</span>
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Balance Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.enableLowBalanceAlert}
                onChange={(e) => setForm({ ...form, enableLowBalanceAlert: e.target.checked })}
              />
              <span className="text-sm font-medium">Enable Low Balance Alerts</span>
            </label>
            {form.enableLowBalanceAlert && (
              <div>
                <Label>Alert Threshold (days)</Label>
                <input
                  type="number"
                  className="w-full border rounded-md p-2 mt-1 text-sm"
                  value={form.lowBalanceAlertThreshold}
                  onChange={(e) => setForm({ ...form, lowBalanceAlertThreshold: e.target.value })}
                  placeholder="e.g. 3"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
}