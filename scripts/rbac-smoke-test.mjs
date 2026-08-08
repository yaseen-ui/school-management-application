#!/usr/bin/env node
/**
 * RBAC smoke tests (P4) — no server / no DB required for core checks.
 *
 * Validates:
 *  1. Permission matching engine (admin:super, exact, module:*, scoped→base)
 *  2. Default role templates only reference catalog codes
 *  3. Frontend route-permissions map only references catalog codes
 *  4. API Guard.action strings only reference catalog codes
 *  5. Role matrix CAN/CANNOT expectations for default role templates
 *
 * Exit 0 on success, 1 on failure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const failures = [];
const passes = [];

function pass(msg) {
  passes.push(msg);
  console.log(`  ✓ ${msg}`);
}

function fail(msg) {
  failures.push(msg);
  console.error(`  ✗ ${msg}`);
}

function assert(cond, msg) {
  if (cond) pass(msg);
  else fail(msg);
}

// ─── Load catalog + engine ───────────────────────────────────────────
const { PERMISSIONS } = await import(
  pathToFileURL(path.join(root, 'lib/backend/rbac/permissions.js')).href
);
const { hasPermission } = await import(
  pathToFileURL(path.join(root, 'lib/backend/rbac/engine.js')).href
);

// seed-roles is ESM with prisma side effects on import of seedDefaultRoles only —
// we parse DEFAULT_ROLES from source to avoid DB.
const seedSource = fs.readFileSync(path.join(root, 'lib/backend/rbac/seed-roles.js'), 'utf8');

function extractRolePermissions(seedSrc) {
  /** @type {Record<string, string[]>} */
  const roles = {};
  // Match each role block: name: 'X' ... permissions: [ ... ]
  const roleBlocks = seedSrc.split(/\{\s*\n\s*name:\s*'/).slice(1);
  for (const block of roleBlocks) {
    const nameMatch = block.match(/^([^']+)'/);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    const permSection = block.match(/permissions:\s*\[([\s\S]*?)\]/);
    if (!permSection) continue;
    const codes = [...permSection[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
    roles[name] = codes;
  }
  return roles;
}

const defaultRoles = extractRolePermissions(seedSource);
const catalog = new Set(Object.keys(PERMISSIONS));

console.log('\n=== 1. Permission matching engine ===');
{
  const empty = new Set();
  const superA = new Set(['admin:super']);
  const exact = new Set(['students:read']);
  const wild = new Set(['students:*']);
  const scoped = new Set(['students:read:section', 'attendance:mark:section']);
  const writeOnly = new Set(['communication-notifications:write']);
  const readOnly = new Set(['communication-notifications:read']);

  assert(!hasPermission(empty, 'students:read'), 'empty set denies');
  assert(hasPermission(superA, 'anything:here'), 'admin:super grants all');
  assert(hasPermission(exact, 'students:read'), 'exact match');
  assert(!hasPermission(exact, 'students:write'), 'exact does not over-grant write');
  assert(hasPermission(wild, 'students:write'), 'module:* grants action');
  assert(hasPermission(scoped, 'students:read'), 'scoped grants base action');
  assert(hasPermission(scoped, 'attendance:mark'), 'scoped mark:section grants mark');
  assert(!hasPermission(scoped, 'students:write'), 'scoped read does not grant write');
  assert(hasPermission(writeOnly, 'communication-notifications:write'), '2-part write exact');
  assert(
    !hasPermission(writeOnly, 'communication-notifications:read'),
    'write does not grant read (2-part codes)'
  );
  assert(
    !hasPermission(readOnly, 'communication-notifications:write'),
    'read does not grant write (2-part codes)'
  );
}

console.log('\n=== 2. Default roles ⊆ catalog ===');
{
  assert(Object.keys(defaultRoles).length >= 8, `found ${Object.keys(defaultRoles).length} default roles (≥8)`);
  for (const [role, codes] of Object.entries(defaultRoles)) {
    const unknown = codes.filter((c) => !catalog.has(c));
    assert(unknown.length === 0, `${role}: all ${codes.length} codes in catalog`);
    if (unknown.length) {
      fail(`  unknown for ${role}: ${unknown.join(', ')}`);
    }
  }
}

console.log('\n=== 3. Frontend route map ⊆ catalog ===');
{
  const mapSrc = fs.readFileSync(path.join(root, 'lib/rbac/route-permissions.ts'), 'utf8');
  const codes = [...mapSrc.matchAll(/['"]([a-z][a-z0-9_-]*:[a-z][a-z0-9_-]*(?::[a-z][a-z0-9_-]*)?)['"]/g)].map(
    (m) => m[1]
  );
  // Filter to likely permission codes (contain colon, not paths)
  const permLike = [...new Set(codes)].filter((c) => c.includes(':') && !c.startsWith('/'));
  const unknown = permLike.filter((c) => !catalog.has(c));
  assert(unknown.length === 0, `route-permissions.ts: ${permLike.length} codes, 0 unknown`);
  if (unknown.length) fail(`  unknown route map codes: ${unknown.join(', ')}`);
}

console.log('\n=== 4. API Guard.action codes ⊆ catalog ===');
{
  const apiRoot = path.join(root, 'app/api');
  /** @type {string[]} */
  const files = [];
  function walk(d) {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.name === 'route.ts') files.push(p);
    }
  }
  walk(apiRoot);

  const used = new Set();
  for (const f of files) {
    const t = fs.readFileSync(f, 'utf8');
    for (const m of t.matchAll(/Guard\.action\(\s*req\s*,\s*['"]([^'"]+)['"]/g)) {
      used.add(m[1]);
    }
  }
  const unknown = [...used].filter((c) => !catalog.has(c));
  assert(used.size > 50, `Guard.action used for ${used.size} distinct codes`);
  assert(unknown.length === 0, `all Guard codes in catalog (unknown=${unknown.length})`);
  if (unknown.length) fail(`  unknown Guard codes: ${unknown.join(', ')}`);

  // Coverage: most non-public routes guarded
  let guarded = 0;
  let total = files.length;
  for (const f of files) {
    const rel = path.relative(apiRoot, f).replace(/\\/g, '/');
    const isPublic =
      /^(auth|public|webhooks)\//.test(rel) ||
      rel.startsWith('parents/invite/') ||
      rel === 'parents/register/route.ts' ||
      rel.startsWith('teachers/invite/') ||
      rel === 'teachers/register/route.ts' ||
      rel === 'communications/inbox/route.ts' ||
      rel === 'communications/acknowledge/route.ts';
    const t = fs.readFileSync(f, 'utf8');
    if (/Guard\.action/.test(t)) guarded++;
    else if (!isPublic) {
      fail(`unguarded non-public route: ${rel}`);
    }
  }
  assert(guarded >= 200, `guarded route files: ${guarded}/${total}`);
}

console.log('\n=== 5. Role matrix CAN / CANNOT (template simulation) ===');
{
  /**
   * Simulate effective permission set for a role template.
   * @param {string} roleName
   */
  function roleSet(roleName) {
    const codes = defaultRoles[roleName];
    if (!codes) {
      fail(`role template missing: ${roleName}`);
      return new Set();
    }
    return new Set(codes);
  }

  /** @type {Array<[string, string, string, boolean]>} role, label, code, expectAllow */
  const cases = [
    // School Admin
    ['School Admin', 'full access students write', 'students:write', true],
    ['School Admin', 'full access payroll process', 'payroll:process', true],
    ['School Admin', 'full access settings write', 'settings:write', true],

    // Principal
    ['Principal', 'can hostel read', 'hostel:read', true],
    ['Principal', 'can hostel manage', 'hostel:manage', true],
    ['Principal', 'can communication notifications write', 'communication-notifications:write', true],
    ['Principal', 'can payroll read', 'payroll:read', true],
    ['Principal', 'cannot payroll process', 'payroll:process', false],
    ['Principal', 'cannot settings write', 'settings:write', false],
    ['Principal', 'cannot roles delete', 'roles:delete', false],

    // Class Teacher
    ['Class Teacher', 'can students read via section scope', 'students:read', true],
    ['Class Teacher', 'can attendance mark via section', 'attendance:mark', true],
    ['Class Teacher', 'cannot fee payments collect', 'fee-payments:collect', false],
    ['Class Teacher', 'cannot users write', 'users:write', false],
    ['Class Teacher', 'cannot payroll process', 'payroll:process', false],

    // Subject Teacher
    ['Subject Teacher', 'can marks entry via section', 'marks:entry', true],
    ['Subject Teacher', 'cannot imports', 'imports:execute', false],

    // Accountant
    ['Accountant', 'can fee payments collect', 'fee-payments:collect', true],
    ['Accountant', 'can fee refunds process', 'fee-refunds:process', true],
    ['Accountant', 'can payroll process', 'payroll:process', true],
    ['Accountant', 'cannot teachers delete', 'teachers:delete', false],
    ['Accountant', 'cannot roles edit', 'roles:edit', false],

    // Receptionist
    ['Receptionist / Clerk', 'can students write', 'students:write', true],
    ['Receptionist / Clerk', 'can visitors write', 'visitors:write', true],
    ['Receptionist / Clerk', 'can imports', 'imports:execute', true],
    ['Receptionist / Clerk', 'cannot payroll process', 'payroll:process', false],
    ['Receptionist / Clerk', 'cannot roles edit', 'roles:edit', false],

    // Parent
    ['Parent', 'can parent portal', 'parent-portal:access', true],
    ['Parent', 'can students read via own scope', 'students:read', true],
    ['Parent', 'cannot students write', 'students:write', false],
    ['Parent', 'cannot fee payments collect', 'fee-payments:collect', false],

    // Driver
    ['Driver', 'can transport read via assigned scope base', 'transport:read', true],
    ['Driver', 'cannot transport write', 'transport:write', false],
    ['Driver', 'cannot students write', 'students:write', false],

    // Transport Manager
    ['Transport Manager', 'can transport write', 'transport:write', true],
    ['Transport Manager', 'can transport assign', 'transport:assign', true],
    ['Transport Manager', 'cannot payroll process', 'payroll:process', false],
    ['Transport Manager', 'cannot roles write', 'roles:write', false],
  ];

  for (const [role, label, code, expect] of cases) {
    const set = roleSet(role);
    const actual = hasPermission(set, code);
    assert(actual === expect, `${role}: ${label} (${code} → ${actual}, want ${expect})`);
  }
}

console.log('\n=== Summary ===');
console.log(`Passed: ${passes.length}`);
console.log(`Failed: ${failures.length}`);
if (failures.length) {
  console.error('\nFailures:');
  failures.forEach((f) => console.error(' -', f));
  process.exit(1);
}
console.log('\nAll RBAC smoke checks passed.\n');
process.exit(0);
