export const getTenantIdFromRequest = (req) => {
  const tenantId = req.headers["x-tenant-id"]; // Standard header for tenant ID
  if (!tenantId) {
    throw new Error("Tenant ID is missing in headers.");
  }
  return tenantId;
};

export default { getTenantIdFromRequest };
