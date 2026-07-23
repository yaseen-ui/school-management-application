"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as leaveApi from "@/lib/api/leave";
import type { LeaveCategory } from "@/lib/api/leave";

export default function LeaveCategoriesPage() {
  const [categories, setCategories] = useState<LeaveCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<LeaveCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    daysAllocated: "",
    isPaid: true,
    requiresApproval: true,
    allowHalfDay: false,
  });

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await leaveApi.getLeaveCategories();
      setCategories(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", daysAllocated: "", isPaid: true, requiresApproval: true, allowHalfDay: false });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        daysAllocated: form.daysAllocated ? Number(form.daysAllocated) : null,
        isPaid: form.isPaid,
        requiresApproval: form.requiresApproval,
        allowHalfDay: form.allowHalfDay,
        applicantType: "employee" as const,
        isActive: true,
      };
      if (editing) {
        await leaveApi.updateLeaveCategory(editing.id, payload);
      } else {
        await leaveApi.createLeaveCategory(payload);
      }
      resetForm();
      fetch();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (cat: LeaveCategory) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      description: cat.description || "",
      daysAllocated: cat.daysAllocated?.toString() || "",
      isPaid: cat.isPaid,
      requiresApproval: cat.requiresApproval,
      allowHalfDay: cat.allowHalfDay,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await leaveApi.deleteLeaveCategory(id);
      fetch();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leave Categories</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>Add Category</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editing ? "Edit Category" : "New Category"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <Label>Days Allocated</Label>
                <Input type="number" value={form.daysAllocated} onChange={(e) => setForm({ ...form, daysAllocated: e.target.value })} />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isPaid} onChange={(e) => setForm({ ...form, isPaid: e.target.checked })} />
                  <span className="text-sm">Paid</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.requiresApproval} onChange={(e) => setForm({ ...form, requiresApproval: e.target.checked })} />
                  <span className="text-sm">Requires Approval</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.allowHalfDay} onChange={(e) => setForm({ ...form, allowHalfDay: e.target.checked })} />
                  <span className="text-sm">Allow Half Day</span>
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editing ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No categories found.</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Days Allocated</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Half Day</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-semibold">{c.name}</TableCell>
                    <TableCell>{c.description || "-"}</TableCell>
                    <TableCell>{c.daysAllocated ?? "-"}</TableCell>
                    <TableCell>{c.isPaid ? "Yes" : "No"}</TableCell>
                    <TableCell>{c.requiresApproval ? "Yes" : "No"}</TableCell>
                    <TableCell>{c.allowHalfDay ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(c)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>Delete</Button>
                      </div>
                    </TableCell>
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