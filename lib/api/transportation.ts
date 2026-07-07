import { apiClient } from "./client"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VehicleCategory {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  occupancy: number;
  amenities: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { vehicles: number } | null;
}

export interface Vehicle {
  id: string;
  tenantId: string;
  categoryId: string;
  category: { id: string; name: string; type: string } | null;
  name: string;
  registrationNumber: string | null;
  capacity: number;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count?: { driverAssignments: number; transportAssignments: number } | null;
}

export interface DriverAssignment {
  id: string;
  tenantId: string;
  vehicleId: string;
  vehicle: { id: string; name: string; registrationNumber: string } | null;
  driverId: string;
  driver: { id: string; fullName: string; employeeCode: string } | null;
  isPrimaryDriver: boolean;
  assignedDate: string;
  endDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PickupPoint {
  id: string;
  tenantId: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { transportAssignments: number } | null;
}

export interface TransportAssignment {
  id: string;
  tenantId: string;
  enrollmentId: string;
  enrollment: {
    id: string;
    student: { id: string; firstName: string; lastName: string } | null;
    grade: { id: string; gradeName: string } | null;
    section: { id: string; sectionName: string } | null;
  } | null;
  pickupPointId: string;
  pickupPoint: { id: string; name: string; latitude: number; longitude: number } | null;
  vehicleId: string | null;
  vehicle: { id: string; name: string; registrationNumber: string } | null;
  categoryId: string | null;
  category: { id: string; name: string; type: string } | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleAvailability {
  vehicleId: string;
  vehicleName: string;
  totalCapacity: number;
  assignedCount: number;
  availableSeats: number;
  isFull: boolean;
}

export interface NearestPickupPoint extends PickupPoint {
  distance: number;
}

export interface AutoAssignResult {
  message: string;
  assignments: Array<{
    pickupPointId: string;
    pickupPointName: string;
    vehicleId: string;
    vehicleName: string;
    studentId: string;
  }>;
}

// ─── Vehicle Categories ──────────────────────────────────────────────────────

export const getVehicleCategories = async (params?: Record<string, string>) => {
  const searchParams = new URLSearchParams(params || {});
  const query = searchParams.toString();
  return apiClient.get<{ status: string; data: { columns: any[]; rows: VehicleCategory[] }; message: string }>(
    `/transportation/vehicle-categories${query ? `?${query}` : ""}`
  );
};

export const getVehicleCategory = async (id: string) => {
  return apiClient.get<{ status: string; data: VehicleCategory; message: string }>(`/transportation/vehicle-categories/${id}`);
};

export const createVehicleCategory = async (data: Partial<VehicleCategory>) => {
  return apiClient.post<{ status: string; data: VehicleCategory; message: string }>("/transportation/vehicle-categories", data);
};

export const updateVehicleCategory = async (id: string, data: Partial<VehicleCategory>) => {
  return apiClient.put<{ status: string; data: VehicleCategory; message: string }>(`/transportation/vehicle-categories/${id}`, data);
};

export const deleteVehicleCategory = async (id: string) => {
  return apiClient.delete<{ status: string; data: null; message: string }>(`/transportation/vehicle-categories/${id}`);
};

// ─── Vehicles ────────────────────────────────────────────────────────────────

export const getVehicles = async (params?: Record<string, string>) => {
  const searchParams = new URLSearchParams(params || {});
  const query = searchParams.toString();
  return apiClient.get<{ status: string; data: { columns: any[]; rows: Vehicle[] }; message: string }>(
    `/transportation/vehicles${query ? `?${query}` : ""}`
  );
};

export const getVehicle = async (id: string) => {
  return apiClient.get<{ status: string; data: Vehicle; message: string }>(`/transportation/vehicles/${id}`);
};

export const createVehicle = async (data: Partial<Vehicle>) => {
  return apiClient.post<{ status: string; data: Vehicle; message: string }>("/transportation/vehicles", data);
};

export const updateVehicle = async (id: string, data: Partial<Vehicle>) => {
  return apiClient.put<{ status: string; data: Vehicle; message: string }>(`/transportation/vehicles/${id}`, data);
};

export const deleteVehicle = async (id: string) => {
  return apiClient.delete<{ status: string; data: null; message: string }>(`/transportation/vehicles/${id}`);
};

// ─── Driver Assignments ──────────────────────────────────────────────────────

export const getDriverAssignments = async (params?: Record<string, string>) => {
  const searchParams = new URLSearchParams(params || {});
  const query = searchParams.toString();
  return apiClient.get<{ status: string; data: { columns: any[]; rows: DriverAssignment[] }; message: string }>(
    `/transportation/driver-assignments${query ? `?${query}` : ""}`
  );
};

export const getDriverAssignment = async (id: string) => {
  return apiClient.get<{ status: string; data: DriverAssignment; message: string }>(`/transportation/driver-assignments/${id}`);
};

export const createDriverAssignment = async (data: Partial<DriverAssignment>) => {
  return apiClient.post<{ status: string; data: DriverAssignment; message: string }>("/transportation/driver-assignments", data);
};

export const updateDriverAssignment = async (id: string, data: Partial<DriverAssignment>) => {
  return apiClient.put<{ status: string; data: DriverAssignment; message: string }>(`/transportation/driver-assignments/${id}`, data);
};

export const deleteDriverAssignment = async (id: string) => {
  return apiClient.delete<{ status: string; data: null; message: string }>(`/transportation/driver-assignments/${id}`);
};

// ─── Pickup Points ───────────────────────────────────────────────────────────

export const getPickupPoints = async (params?: Record<string, string>) => {
  const searchParams = new URLSearchParams(params || {});
  const query = searchParams.toString();
  return apiClient.get<{ status: string; data: { columns: any[]; rows: PickupPoint[] }; message: string }>(
    `/transportation/pickup-points${query ? `?${query}` : ""}`
  );
};

export const getPickupPoint = async (id: string) => {
  return apiClient.get<{ status: string; data: PickupPoint; message: string }>(`/transportation/pickup-points/${id}`);
};

export const createPickupPoint = async (data: Partial<PickupPoint>) => {
  return apiClient.post<{ status: string; data: PickupPoint; message: string }>("/transportation/pickup-points", data);
};

export const updatePickupPoint = async (id: string, data: Partial<PickupPoint>) => {
  return apiClient.put<{ status: string; data: PickupPoint; message: string }>(`/transportation/pickup-points/${id}`, data);
};

export const deletePickupPoint = async (id: string) => {
  return apiClient.delete<{ status: string; data: null; message: string }>(`/transportation/pickup-points/${id}`);
};

// ─── Transport Assignments ───────────────────────────────────────────────────

export const getTransportAssignments = async (params?: Record<string, string>) => {
  const searchParams = new URLSearchParams(params || {});
  const query = searchParams.toString();
  return apiClient.get<{ status: string; data: { columns: any[]; rows: TransportAssignment[] }; message: string }>(
    `/transportation/assignments${query ? `?${query}` : ""}`
  );
};

export const getTransportAssignment = async (id: string) => {
  return apiClient.get<{ status: string; data: TransportAssignment; message: string }>(`/transportation/assignments/${id}`);
};

export const createTransportAssignment = async (data: Partial<TransportAssignment>) => {
  return apiClient.post<{ status: string; data: TransportAssignment; message: string }>("/transportation/assignments", data);
};

export const updateTransportAssignment = async (id: string, data: Partial<TransportAssignment>) => {
  return apiClient.put<{ status: string; data: TransportAssignment; message: string }>(`/transportation/assignments/${id}`, data);
};

export const deleteTransportAssignment = async (id: string) => {
  return apiClient.delete<{ status: string; data: null; message: string }>(`/transportation/assignments/${id}`);
};

// ─── Smart Features ──────────────────────────────────────────────────────────

export const autoAssignVehicles = async () => {
  return apiClient.post<{ status: string; data: AutoAssignResult; message: string }>("/transportation/auto-assign");
};

export const findNearestPickupPoint = async (latitude: number, longitude: number) => {
  return apiClient.get<{ status: string; data: NearestPickupPoint; message: string }>(
    `/transportation/nearest-pickup-point?latitude=${latitude}&longitude=${longitude}`
  );
};

export const checkVehicleAvailability = async (vehicleId: string) => {
  return apiClient.get<{ status: string; data: VehicleAvailability; message: string }>(
    `/transportation/vehicles/${vehicleId}/availability`
  );
};
