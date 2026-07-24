"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface AudienceCriteria {
  targetUserIds?: { userId: string }[]
  targetRoles?: { roleId: string }[]
  targetGroups?: { groupId: string }[]
  targetGrades?: { gradeId: string }[]
  targetSections?: { sectionId: string }[]
  targetEmployeeTypes?: string[]
  targetAudience?: string[]
}

interface AudienceSelectorProps {
  value: AudienceCriteria
  onChange: (value: AudienceCriteria) => void
}

const audienceOptions = [
  { value: "student", label: "Students" },
  { value: "parent", label: "Parents" },
  { value: "employee", label: "Employees" },
]

const employeeTypeOptions = [
  { value: "teacher", label: "Teachers" },
  { value: "admin", label: "Admin Staff" },
  { value: "driver", label: "Drivers" },
  { value: "librarian", label: "Librarians" },
  { value: "accountant", label: "Accountants" },
  { value: "security", label: "Security" },
  { value: "maintenance", label: "Maintenance" },
]

export function AudienceSelector({ value, onChange }: AudienceSelectorProps) {
  const [searchUser, setSearchUser] = useState("")
  const [searchRole, setSearchRole] = useState("")
  const [searchGrade, setSearchGrade] = useState("")
  const [searchSection, setSearchSection] = useState("")

  const toggleAudience = (val: string) => {
    const current = value.targetAudience || []
    const next = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val]
    onChange({ ...value, targetAudience: next })
  }

  const toggleEmployeeType = (val: string) => {
    const current = value.targetEmployeeTypes || []
    const next = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val]
    onChange({ ...value, targetEmployeeTypes: next })
  }

  const removeUser = (userId: string) => {
    onChange({
      ...value,
      targetUserIds: (value.targetUserIds || []).filter((u) => u.userId !== userId),
    })
  }

  const removeRole = (roleId: string) => {
    onChange({
      ...value,
      targetRoles: (value.targetRoles || []).filter((r) => r.roleId !== roleId),
    })
  }

  const removeGrade = (gradeId: string) => {
    onChange({
      ...value,
      targetGrades: (value.targetGrades || []).filter((g) => g.gradeId !== gradeId),
    })
  }

  const removeSection = (sectionId: string) => {
    onChange({
      ...value,
      targetSections: (value.targetSections || []).filter((s) => s.sectionId !== sectionId),
    })
  }

  const selectedCount =
    (value.targetUserIds?.length || 0) +
    (value.targetRoles?.length || 0) +
    (value.targetGroups?.length || 0) +
    (value.targetGrades?.length || 0) +
    (value.targetSections?.length || 0) +
    (value.targetEmployeeTypes?.length || 0) +
    (value.targetAudience?.length || 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Target Audience</Label>
        {selectedCount > 0 && (
          <Badge variant="secondary">{selectedCount} criteria selected</Badge>
        )}
      </div>

      <Tabs defaultValue="audience" className="w-full">
        <TabsList className="w-full flex-wrap h-auto">
          <TabsTrigger value="audience" className="text-xs">Audience</TabsTrigger>
          <TabsTrigger value="users" className="text-xs">Users</TabsTrigger>
          <TabsTrigger value="roles" className="text-xs">Roles</TabsTrigger>
          <TabsTrigger value="grades" className="text-xs">Grades</TabsTrigger>
          <TabsTrigger value="sections" className="text-xs">Sections</TabsTrigger>
          <TabsTrigger value="employee" className="text-xs">Employee</TabsTrigger>
        </TabsList>

        <TabsContent value="audience" className="space-y-2 pt-2">
          {audienceOptions.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <Checkbox
                id={`audience-${opt.value}`}
                checked={(value.targetAudience || []).includes(opt.value)}
                onCheckedChange={() => toggleAudience(opt.value)}
              />
              <Label htmlFor={`audience-${opt.value}`} className="text-sm cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="users" className="space-y-2 pt-2">
          <Input
            placeholder="Search users..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <ScrollArea className="h-40">
            <p className="text-xs text-muted-foreground p-2">
              Type to search for users. User search requires a backend endpoint.
            </p>
          </ScrollArea>
          {(value.targetUserIds || []).length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {(value.targetUserIds || []).map((u) => (
                <Badge key={u.userId} variant="secondary" className="gap-1">
                  {u.userId}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeUser(u.userId)} />
                </Badge>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="roles" className="space-y-2 pt-2">
          <Input
            placeholder="Search roles..."
            value={searchRole}
            onChange={(e) => setSearchRole(e.target.value)}
          />
          <ScrollArea className="h-40">
            <p className="text-xs text-muted-foreground p-2">
              Type to search for roles. Role search requires a backend endpoint.
            </p>
          </ScrollArea>
          {(value.targetRoles || []).length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {(value.targetRoles || []).map((r) => (
                <Badge key={r.roleId} variant="secondary" className="gap-1">
                  {r.roleId}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeRole(r.roleId)} />
                </Badge>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="grades" className="space-y-2 pt-2">
          <Input
            placeholder="Search grades..."
            value={searchGrade}
            onChange={(e) => setSearchGrade(e.target.value)}
          />
          <ScrollArea className="h-40">
            <p className="text-xs text-muted-foreground p-2">
              Type to search for grades. Grade search requires a backend endpoint.
            </p>
          </ScrollArea>
          {(value.targetGrades || []).length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {(value.targetGrades || []).map((g) => (
                <Badge key={g.gradeId} variant="secondary" className="gap-1">
                  {g.gradeId}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeGrade(g.gradeId)} />
                </Badge>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sections" className="space-y-2 pt-2">
          <Input
            placeholder="Search sections..."
            value={searchSection}
            onChange={(e) => setSearchSection(e.target.value)}
          />
          <ScrollArea className="h-40">
            <p className="text-xs text-muted-foreground p-2">
              Type to search for sections. Section search requires a backend endpoint.
            </p>
          </ScrollArea>
          {(value.targetSections || []).length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {(value.targetSections || []).map((s) => (
                <Badge key={s.sectionId} variant="secondary" className="gap-1">
                  {s.sectionId}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSection(s.sectionId)} />
                </Badge>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="employee" className="space-y-2 pt-2">
          {employeeTypeOptions.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <Checkbox
                id={`emp-${opt.value}`}
                checked={(value.targetEmployeeTypes || []).includes(opt.value)}
                onCheckedChange={() => toggleEmployeeType(opt.value)}
              />
              <Label htmlFor={`emp-${opt.value}`} className="text-sm cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}