import { prisma } from "../../lib/prisma.js";

// ─── Vehicle Categories ─────────────────────────────────────────────────────

// Valid VehicleAmenity enum values
const VALID_AMENITIES = ["ac", "non_ac", "deluxe", "standard"];

function normalizeAmenities(amenities) {
  if (!amenities) return [];
  // If it's already an array, filter valid values
  if (Array.isArray(amenities)) {
    return amenities
      .map((a) => a.toLowerCase().replace(/[\s-]+/g, "_"))
      .filter((a) => VALID_AMENITIES.includes(a));
  }
  // If it's a string, split by comma and normalize
  if (typeof amenities === "string") {
    return amenities
      .split(",")
      .map((a) => a.trim().toLowerCase().replace(/[\s-]+/g, "_"))
      .filter((a) => VALID_AMENITIES.includes(a));
  }
  return [];
}

function mapVehicleCategoryIn(data = {}, tenantId) {
  const out = { tenantId };
  if (data.name !== undefined) out.name = data.name;
  if (data.type !== undefined) out.type = String(data.type).toLowerCase();
  if (data.occupancy !== undefined) out.occupancy = data.occupancy;
  if (data.amenities !== undefined) out.amenities = normalizeAmenities(data.amenities);
  if (data.description !== undefined) out.description = data.description || null;
  if (data.isActive !== undefined) out.isActive = data.isActive ?? true;
  return out;
}

function mapVehicleCategoryOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    type: row.type,
    occupancy: row.occupancy,
    amenities: row.amenities,
    description: row.description,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    _count: row._count
      ? { vehicles: row._count.vehicles }
      : null,
  };
}

async function createVehicleCategory(data, tenantId) {
  const payload = mapVehicleCategoryIn(data, tenantId);
  const category = await prisma.vehicleCategory.create({ data: payload });
  return mapVehicleCategoryOut(category);
}

async function getVehicleCategoryById(id, tenantId) {
  const category = await prisma.vehicleCategory.findFirst({
    where: { id, tenantId },
    include: { _count: { select: { vehicles: true } } },
  });
  return mapVehicleCategoryOut(category);
}

async function getAllVehicleCategories(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.search) {
    where.name = { contains: filters.search, mode: "insensitive" };
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === "true" || filters.isActive === true;
  }
  if (filters.type) {
    where.type = filters.type;
  }
  const categories = await prisma.vehicleCategory.findMany({
    where,
    include: { _count: { select: { vehicles: true } } },
    orderBy: { name: "asc" },
  });
  return categories.map(mapVehicleCategoryOut);
}

async function updateVehicleCategory(id, data, tenantId) {
  const existing = await prisma.vehicleCategory.findFirst({
    where: { id, tenantId },
  });
  if (!existing) throw new Error("Vehicle category not found.");
  const payload = mapVehicleCategoryIn(data, tenantId);
  const updated = await prisma.vehicleCategory.update({
    where: { id },
    data: payload,
  });
  return mapVehicleCategoryOut(updated);
}

async function deleteVehicleCategory(id, tenantId) {
  const existing = await prisma.vehicleCategory.findFirst({
    where: { id, tenantId },
  });
  if (!existing) throw new Error("Vehicle category not found.");
  await prisma.vehicleCategory.delete({ where: { id } });
  return { id };
}

// ─── Vehicles ────────────────────────────────────────────────────────────────

function mapVehicleIn(data = {}, tenantId) {
  const out = { tenantId };
  if (data.categoryId !== undefined) out.categoryId = data.categoryId;
  if (data.name !== undefined) out.name = data.name;
  if (data.registrationNumber !== undefined) out.registrationNumber = data.registrationNumber || null;
  if (data.capacity !== undefined) out.capacity = data.capacity;
  if (data.description !== undefined) out.description = data.description || null;
  if (data.status !== undefined) out.status = String(data.status).toLowerCase();
  return out;
}

function mapVehicleOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    categoryId: row.categoryId,
    category: row.category ? { id: row.category.id, name: row.category.name, type: row.category.type } : null,
    name: row.name,
    registrationNumber: row.registrationNumber,
    capacity: row.capacity,
    description: row.description,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    _count: row._count
      ? {
          driverAssignments: row._count.driverAssignments,
          transportAssignments: row._count.transportAssignments,
        }
      : null,
  };
}

async function createVehicle(data, tenantId) {
  const payload = mapVehicleIn(data, tenantId);
  const vehicle = await prisma.vehicle.create({
    data: payload,
    include: { category: { select: { id: true, name: true, type: true } } },
  });
  return mapVehicleOut(vehicle);
}

async function getVehicleById(id, tenantId) {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id, tenantId },
    include: {
      category: { select: { id: true, name: true, type: true } },
      _count: { select: { driverAssignments: true, transportAssignments: true } },
    },
  });
  return mapVehicleOut(vehicle);
}

async function getAllVehicles(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { registrationNumber: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  const vehicles = await prisma.vehicle.findMany({
    where,
    include: {
      category: { select: { id: true, name: true, type: true } },
      _count: { select: { driverAssignments: true, transportAssignments: true } },
    },
    orderBy: { name: "asc" },
  });
  return vehicles.map(mapVehicleOut);
}

async function updateVehicle(id, data, tenantId) {
  const existing = await prisma.vehicle.findFirst({
    where: { id, tenantId },
  });
  if (!existing) throw new Error("Vehicle not found.");
  const payload = mapVehicleIn(data, tenantId);
  const updated = await prisma.vehicle.update({
    where: { id },
    data: payload,
    include: { category: { select: { id: true, name: true, type: true } } },
  });
  return mapVehicleOut(updated);
}

async function deleteVehicle(id, tenantId) {
  const existing = await prisma.vehicle.findFirst({
    where: { id, tenantId },
  });
  if (!existing) throw new Error("Vehicle not found.");
  await prisma.vehicle.delete({ where: { id } });
  return { id };
}

// ─── Vehicle Driver Assignments ──────────────────────────────────────────────

function mapDriverAssignmentIn(data = {}, tenantId) {
  const out = { tenantId };
  if (data.vehicleId !== undefined) out.vehicleId = data.vehicleId;
  if (data.driverId !== undefined) out.driverId = data.driverId;
  if (data.isPrimaryDriver !== undefined) out.isPrimaryDriver = data.isPrimaryDriver ?? true;
  if (data.assignedDate !== undefined) out.assignedDate = data.assignedDate ? new Date(data.assignedDate) : new Date();
  if (data.endDate !== undefined) out.endDate = data.endDate ? new Date(data.endDate) : null;
  if (data.status !== undefined) out.status = String(data.status).toLowerCase();
  return out;
}

function mapDriverAssignmentOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    vehicleId: row.vehicleId,
    vehicle: row.vehicle ? { id: row.vehicle.id, name: row.vehicle.name, registrationNumber: row.vehicle.registrationNumber } : null,
    driverId: row.driverId,
    driver: row.driver ? { id: row.driver.id, fullName: row.driver.fullName, employeeCode: row.driver.employeeCode } : null,
    isPrimaryDriver: row.isPrimaryDriver,
    assignedDate: row.assignedDate,
    endDate: row.endDate,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function createDriverAssignment(data, tenantId) {
  const payload = mapDriverAssignmentIn(data, tenantId);
  const assignment = await prisma.vehicleDriverAssignment.create({
    data: payload,
    include: {
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
      driver: { select: { id: true, fullName: true, employeeCode: true } },
    },
  });
  return mapDriverAssignmentOut(assignment);
}

async function getDriverAssignmentById(id, tenantId) {
  const assignment = await prisma.vehicleDriverAssignment.findFirst({
    where: { id, tenantId },
    include: {
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
      driver: { select: { id: true, fullName: true, employeeCode: true } },
    },
  });
  return mapDriverAssignmentOut(assignment);
}

async function getAllDriverAssignments(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.vehicleId) {
    where.vehicleId = filters.vehicleId;
  }
  if (filters.driverId) {
    where.driverId = filters.driverId;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  const assignments = await prisma.vehicleDriverAssignment.findMany({
    where,
    include: {
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
      driver: { select: { id: true, fullName: true, employeeCode: true } },
    },
    orderBy: { assignedDate: "desc" },
  });
  return assignments.map(mapDriverAssignmentOut);
}

async function updateDriverAssignment(id, data, tenantId) {
  const existing = await prisma.vehicleDriverAssignment.findFirst({
    where: { id, tenantId },
  });
  if (!existing) throw new Error("Driver assignment not found.");
  const payload = mapDriverAssignmentIn(data, tenantId);
  const updated = await prisma.vehicleDriverAssignment.update({
    where: { id },
    data: payload,
    include: {
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
      driver: { select: { id: true, fullName: true, employeeCode: true } },
    },
  });
  return mapDriverAssignmentOut(updated);
}

async function deleteDriverAssignment(id, tenantId) {
  const existing = await prisma.vehicleDriverAssignment.findFirst({
    where: { id, tenantId },
  });
  if (!existing) throw new Error("Driver assignment not found.");
  await prisma.vehicleDriverAssignment.delete({ where: { id } });
  return { id };
}

// ─── Pickup Points ───────────────────────────────────────────────────────────

function mapPickupPointIn(data = {}, tenantId) {
  const out = { tenantId };
  if (data.name !== undefined) out.name = data.name;
  if (data.address !== undefined) out.address = data.address || null;
  if (data.latitude !== undefined) out.latitude = parseFloat(data.latitude);
  if (data.longitude !== undefined) out.longitude = parseFloat(data.longitude);
  if (data.isActive !== undefined) out.isActive = data.isActive ?? true;
  return out;
}

function mapPickupPointOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    _count: row._count
      ? { transportAssignments: row._count.transportAssignments }
      : null,
  };
}

async function createPickupPoint(data, tenantId) {
  const payload = mapPickupPointIn(data, tenantId);
  const point = await prisma.pickupPoint.create({ data: payload });
  return mapPickupPointOut(point);
}

async function getPickupPointById(id, tenantId) {
  const point = await prisma.pickupPoint.findFirst({
    where: { id, tenantId },
    include: { _count: { select: { transportAssignments: true } } },
  });
  return mapPickupPointOut(point);
}

async function getAllPickupPoints(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { address: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === "true" || filters.isActive === true;
  }
  const points = await prisma.pickupPoint.findMany({
    where,
    include: { _count: { select: { transportAssignments: true } } },
    orderBy: { name: "asc" },
  });
  return points.map(mapPickupPointOut);
}

async function updatePickupPoint(id, data, tenantId) {
  const existing = await prisma.pickupPoint.findFirst({
    where: { id, tenantId },
  });
  if (!existing) throw new Error("Pickup point not found.");
  const payload = mapPickupPointIn(data, tenantId);
  const updated = await prisma.pickupPoint.update({
    where: { id },
    data: payload,
  });
  return mapPickupPointOut(updated);
}

async function deletePickupPoint(id, tenantId) {
  const existing = await prisma.pickupPoint.findFirst({
    where: { id, tenantId },
  });
  if (!existing) throw new Error("Pickup point not found.");
  await prisma.pickupPoint.delete({ where: { id } });
  return { id };
}

// ─── Student Transport Assignments ───────────────────────────────────────────

function mapTransportAssignmentIn(data = {}, tenantId) {
  const out = { tenantId };
  if (data.enrollmentId !== undefined) out.enrollmentId = data.enrollmentId;
  if (data.pickupPointId !== undefined) out.pickupPointId = data.pickupPointId;
  if (data.vehicleId !== undefined) out.vehicleId = data.vehicleId || null;
  if (data.categoryId !== undefined) out.categoryId = data.categoryId || null;
  if (data.isActive !== undefined) out.isActive = data.isActive ?? true;
  return out;
}

function mapTransportAssignmentOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    enrollmentId: row.enrollmentId,
    enrollment: row.enrollment
      ? {
          id: row.enrollment.id,
          student: row.enrollment.student
            ? { id: row.enrollment.student.id, firstName: row.enrollment.student.firstName, lastName: row.enrollment.student.lastName }
            : null,
          grade: row.enrollment.grade ? { id: row.enrollment.grade.id, gradeName: row.enrollment.grade.gradeName } : null,
          section: row.enrollment.section ? { id: row.enrollment.section.id, sectionName: row.enrollment.section.sectionName } : null,
        }
      : null,
    pickupPointId: row.pickupPointId,
    pickupPoint: row.pickupPoint ? { id: row.pickupPoint.id, name: row.pickupPoint.name, latitude: row.pickupPoint.latitude, longitude: row.pickupPoint.longitude } : null,
    vehicleId: row.vehicleId,
    vehicle: row.vehicle ? { id: row.vehicle.id, name: row.vehicle.name, registrationNumber: row.vehicle.registrationNumber } : null,
    categoryId: row.categoryId,
    category: row.category ? { id: row.category.id, name: row.category.name, type: row.category.type } : null,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function createTransportAssignment(data, tenantId) {
  const payload = mapTransportAssignmentIn(data, tenantId);
  const assignment = await prisma.studentTransportAssignment.create({
    data: payload,
    include: {
      enrollment: {
        select: {
          id: true,
          student: { select: { id: true, firstName: true, lastName: true } },
          grade: { select: { id: true, gradeName: true } },
          section: { select: { id: true, sectionName: true } },
        },
      },
      pickupPoint: { select: { id: true, name: true, latitude: true, longitude: true } },
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
      category: { select: { id: true, name: true, type: true } },
    },
  });
  return mapTransportAssignmentOut(assignment);
}

async function getTransportAssignmentById(id, tenantId) {
  const assignment = await prisma.studentTransportAssignment.findFirst({
    where: { id, tenantId },
    include: {
      enrollment: {
        select: {
          id: true,
          student: { select: { id: true, firstName: true, lastName: true } },
          grade: { select: { id: true, gradeName: true } },
          section: { select: { id: true, sectionName: true } },
        },
      },
      pickupPoint: { select: { id: true, name: true, latitude: true, longitude: true } },
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
      category: { select: { id: true, name: true, type: true } },
    },
  });
  return mapTransportAssignmentOut(assignment);
}

async function getAllTransportAssignments(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.pickupPointId) {
    where.pickupPointId = filters.pickupPointId;
  }
  if (filters.vehicleId) {
    where.vehicleId = filters.vehicleId;
  }
  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }
  if (filters.enrollmentId) {
    where.enrollmentId = filters.enrollmentId;
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === "true" || filters.isActive === true;
  }
  const assignments = await prisma.studentTransportAssignment.findMany({
    where,
    include: {
      enrollment: {
        select: {
          id: true,
          student: { select: { id: true, firstName: true, lastName: true } },
          grade: { select: { id: true, gradeName: true } },
          section: { select: { id: true, sectionName: true } },
        },
      },
      pickupPoint: { select: { id: true, name: true, latitude: true, longitude: true } },
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
      category: { select: { id: true, name: true, type: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return assignments.map(mapTransportAssignmentOut);
}

async function updateTransportAssignment(id, data, tenantId) {
  const existing = await prisma.studentTransportAssignment.findFirst({
    where: { id, tenantId },
  });
  if (!existing) throw new Error("Transport assignment not found.");
  const payload = mapTransportAssignmentIn(data, tenantId);
  const updated = await prisma.studentTransportAssignment.update({
    where: { id },
    data: payload,
    include: {
      enrollment: {
        select: {
          id: true,
          student: { select: { id: true, firstName: true, lastName: true } },
          grade: { select: { id: true, gradeName: true } },
          section: { select: { id: true, sectionName: true } },
        },
      },
      pickupPoint: { select: { id: true, name: true, latitude: true, longitude: true } },
      vehicle: { select: { id: true, name: true, registrationNumber: true } },
      category: { select: { id: true, name: true, type: true } },
    },
  });
  return mapTransportAssignmentOut(updated);
}

async function deleteTransportAssignment(id, tenantId) {
  const existing = await prisma.studentTransportAssignment.findFirst({
    where: { id, tenantId },
  });
  if (!existing) throw new Error("Transport assignment not found.");
  await prisma.studentTransportAssignment.delete({ where: { id } });
  return { id };
}

// ─── Auto-Assign Vehicles to Pickup Points ───────────────────────────────────
// Algorithm: For each pickup point, find available vehicles (not fully assigned)
// and assign them based on capacity. This is a simple greedy approach.

async function autoAssignVehicles(tenantId) {
  // Get all active pickup points with their current assignment counts
  const pickupPoints = await prisma.pickupPoint.findMany({
    where: { tenantId, isActive: true },
    include: {
      _count: { select: { transportAssignments: true } },
    },
  });

  // Get all active vehicles with their current assignment counts
  const vehicles = await prisma.vehicle.findMany({
    where: { tenantId, status: "active" },
    include: {
      category: { select: { id: true, name: true, occupancy: true } },
      _count: { select: { transportAssignments: true } },
    },
  });

  if (pickupPoints.length === 0 || vehicles.length === 0) {
    return { message: "No pickup points or vehicles available for auto-assignment.", assignments: [] };
  }

  const assignments = [];
  let vehicleIndex = 0;

  for (const point of pickupPoints) {
    // Find a vehicle that still has capacity
    let assigned = false;
    let attempts = 0;

    while (!assigned && attempts < vehicles.length) {
      const vehicle = vehicles[vehicleIndex % vehicles.length];
      const occupancy = vehicle.category?.occupancy || vehicle.capacity;
      const currentAssignments = vehicle._count.transportAssignments;

      if (currentAssignments < occupancy) {
        // Assign this vehicle to all students at this pickup point who don't have a vehicle yet
        const unassignedStudents = await prisma.studentTransportAssignment.findMany({
          where: {
            tenantId,
            pickupPointId: point.id,
            vehicleId: null,
            isActive: true,
          },
        });

        for (const student of unassignedStudents) {
          if (currentAssignments + assignments.length < occupancy) {
            await prisma.studentTransportAssignment.update({
              where: { id: student.id },
              data: { vehicleId: vehicle.id },
            });
            assignments.push({
              pickupPointId: point.id,
              pickupPointName: point.name,
              vehicleId: vehicle.id,
              vehicleName: vehicle.name,
              studentId: student.id,
            });
          }
        }
        assigned = true;
      }
      vehicleIndex++;
      attempts++;
    }
  }

  return {
    message: `Auto-assignment completed. ${assignments.length} students assigned to vehicles.`,
    assignments,
  };
}

// ─── Find Nearest Pickup Point ───────────────────────────────────────────────
// Uses the Haversine formula to calculate distance between coordinates.

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function findNearestPickupPoint(tenantId, latitude, longitude) {
  const points = await prisma.pickupPoint.findMany({
    where: { tenantId, isActive: true },
    include: {
      _count: { select: { transportAssignments: true } },
    },
  });

  if (points.length === 0) {
    return null;
  }

  let nearest = null;
  let minDistance = Infinity;

  for (const point of points) {
    const distance = haversineDistance(
      latitude,
      longitude,
      point.latitude,
      point.longitude
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = {
        ...point,
        distance: Math.round(distance * 1000) / 1000, // distance in km, rounded to 3 decimals
      };
    }
  }

  return nearest;
}

// ─── Check Vehicle Availability ──────────────────────────────────────────────

async function checkVehicleAvailability(tenantId, vehicleId) {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, tenantId },
    include: {
      category: { select: { id: true, name: true, occupancy: true } },
      _count: { select: { transportAssignments: true } },
    },
  });

  if (!vehicle) {
    throw new Error("Vehicle not found.");
  }

  const occupancy = vehicle.category?.occupancy || vehicle.capacity;
  const assignedCount = vehicle._count.transportAssignments;
  const availableSeats = occupancy - assignedCount;

  return {
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    totalCapacity: occupancy,
    assignedCount,
    availableSeats: Math.max(0, availableSeats),
    isFull: availableSeats <= 0,
  };
}

export default {
  // Vehicle Categories
  createVehicleCategory,
  getVehicleCategoryById,
  getAllVehicleCategories,
  updateVehicleCategory,
  deleteVehicleCategory,

  // Vehicles
  createVehicle,
  getVehicleById,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,

  // Driver Assignments
  createDriverAssignment,
  getDriverAssignmentById,
  getAllDriverAssignments,
  updateDriverAssignment,
  deleteDriverAssignment,

  // Pickup Points
  createPickupPoint,
  getPickupPointById,
  getAllPickupPoints,
  updatePickupPoint,
  deletePickupPoint,

  // Transport Assignments
  createTransportAssignment,
  getTransportAssignmentById,
  getAllTransportAssignments,
  updateTransportAssignment,
  deleteTransportAssignment,

  // Smart Features
  autoAssignVehicles,
  findNearestPickupPoint,
  checkVehicleAvailability,
};
