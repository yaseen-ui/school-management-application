import { NextReqT(rei: NextRequest, { params }: { params: Promise<{ employeeId: string }> }) {
  return invokeBackendController(LeaveController, "getEmployeeBalances", req, params);
}
