"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { X, Loader2 } from "lucide-react"
import { searchUsers, searchRoles, searchGrades, searchSections } from "@/lib/api/communication"
import type { UserSearchResult, RoleSearchResult, GradeSearchResult, SectionSearchResult } from "@/lib/api/communication"
import { useDebounce } from "@/hooks/use-debounce"

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

  const debouncedUserQuery = useDebounce(searchUser, 300)
  const debouncedRoleQuery = useDebounce(searchRole, 300)
  const debouncedGradeQuery = useDebounce(searchGrade, 300)
  const debouncedSectionQuery = useDebounce(searchSection, 300)

  // Search results
  const [users, setUsers] = useState<UserSearchResult[]>([])
  const [roles, setRoles] = useState<RoleSearchResult[]>([])
  const [grades, setGrades] = useState<GradeSearchResult[]>([])
  const [sections, setSections] = useState<SectionSearchResult[]>([])

  const [searchingUsers, setSearchingUsers] = useState(false)
  const [searchingRoles, setSearchingRoles] = useState(false)
  const [searchingGrades, setSearchingGrades] = useState(false)
  const [searchingSections, setSearchingSections] = useState(false)

  useEffect(() => {
    if (!debouncedUserQuery) {
      setUsers([])
      return
    }
    let cancelled = false
    setSearchingUsers(true)
    searchUsers(debouncedUserQuery)
      .then((results) => { if (!cancelled) setUsers(results) })
      .finally(() => { if (!cancelled) setSearchingUsers(false) })
    return () => { cancelled = true }
  }, [debouncedUserQuery])

  useEffect(() => {
    if (!debouncedRoleQuery) {
      setRoles([])
      return
    }
    let cancelled = false
    setSearchingRoles(true)
    searchRoles(debouncedRoleQuery)
      .then((results) => { if (!cancelled) setRoles(results) })
      .finally(() => { if (!cancelled) setSearchingRoles(false) })
    return () => { cancelled = true }
  }, [debouncedRoleQuery])

  useEffect(() => {
    if (!debouncedGradeQuery) {
      setGrades([])
      return
    }
    let cancelled = false
    setSearchingGrades(true)
    searchGrades(debouncedGradeQuery)
      .then((results) => { if (!cancelled) setGrades(results) })
      .finally(() => { if (!cancelled) setSearchingGrades(false) })
    return () => { cancelled = true }
  }, [debouncedGradeQuery])

  useEffect(() => {
    if (!debouncedSectionQuery) {
      setSections([])
      return
    }
    let cancelled = false
    setSearchingSections(true)
    searchSections(debouncedSectionQuery)
      .then((results) => { if (!cancelled) setSections(results) })
      .finally(() => { if (!cancelled) setSearchingSections(false) })
    return () => { cancelled = true }
  }, [debouncedSectionQuery])

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

  const addUser = (userId: string) => {
    const current = value.targetUserIds || []
    if (current.some((u) => u.userId === userId)) return
    onChange({ ...value, targetUserIds: [...current, { userId }] })
  }

  const addRole = (roleId: string) => {
    const current = value.targetRoles || []
    if (current.some((r) => r.roleId === roleId)) return
    onChange({ ...value, targetRoles: [...current, { roleId }] })
  }

  const addGrade = (gradeId: string) => {
    const current = value.targetGrades || []
    if (current.some((g) => g.gradeId === gradeId)) return
    onChange({ ...value, targetGrades: [...current, { gradeId }] })
  }

  const addSection = (sectionId: string) => {
    const current = value.targetSections || []
    if (current.some((s) => s.sectionId === sectionId)) return
    onChange({ ...value, targetSections: [...current, { sectionId }] })
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
            placeholder="Search users by name or email..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <ScrollArea className="h-40">
            {searchingUsers ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-xs text-muted-foreground p-2">
                {searchUser ? "No users found." : "Type to search for users."}
              </p>
            ) : (
              <div className="space-y-1">
                {users.map((u) => {
                  const isSelected = (value.targetUserIds || []).some((x) => x.userId === u.id)
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => isSelected ? removeUser(u.id) : addUser(u.id)}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="font-medium">{u.fullName}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </button>
                  )
                })}
              </div>
            )}
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
            {searchingRoles ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : roles.length === 0 ? (
              <p className="text-xs text-muted-foreground p-2">
                {searchRole ? "No roles found." : "Type to search for roles."}
              </p>
            ) : (
              <div className="space-y-1">
                {roles.map((r) => {
                  const isSelected = (value.targetRoles || []).some((x) => x.roleId === r.id)
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => isSelected ? removeRole(r.id) : addRole(r.id)}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      {r.roleName}
                    </button>
                  )
                })}
              </div>
            )}
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
            {searchingGrades ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : grades.length === 0 ? (
              <p className="text-xs text-muted-foreground p-2">
                {searchGrade ? "No grades found." : "Type to search for grades."}
              </p>
            ) : (
              <div className="space-y-1">
                {grades.map((g) => {
                  const isSelected = (value.targetGrades || []).some((x) => x.gradeId === g.id)
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => isSelected ? removeGrade(g.id) : addGrade(g.id)}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span>{g.gradeName}</span>
                      {g.course?.courseName && (
                        <span className="text-xs text-muted-foreground ml-1">({g.course.courseName})</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
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
            {searchingSections ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : sections.length === 0 ? (
              <p className="text-xs text-muted-foreground p-2">
                {searchSection ? "No sections found." : "Type to search for sections."}
              </p>
            ) : (
              <div className="space-y-1">
                {sections.map((s) => {
                  const isSelected = (value.targetSections || []).some((x) => x.sectionId === s.id)
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => isSelected ? removeSection(s.id) : addSection(s.id)}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span>{s.sectionName}</span>
                      {s.grade?.gradeName && (
                        <span className="text-xs text-muted-foreground ml-1">({s.grade.gradeName})</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
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