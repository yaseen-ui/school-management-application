import TransportationService from "./transportation.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class TransportationController {
  // ─── Vehicle Categories ────────────────────────────────────────────────────

  async createVehicleCategory(req, res) {
    try {
      const { tenantId } = req.user;
      const category = await TransportationService.createVehicleCategory(req.body, tenantId);
      return responseHandler(res, "success", category, "Vehicle category created successfully.");
    } catch (error) {
      logger.error("Error creating vehicle category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getVehicleCategoryById(req, res) {
    try {
      const { tenantId } = req.user;
      const category = await TransportationService.getVehicleCategoryById(req.params.id, tenantId);
      if (!category) {
        return responseHandler(res, "error", null, "Vehicle category not found.");
      }
      return responseHandler(res, "success", category, "Vehicle category retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving vehicle category:", error);
      return responseHandler(res, "error", null, "Failed to retrieve vehicle category.");
    }
  }

  async getAllVehicleCategories(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const categories = await TransportationService.getAllVehicleCategories(tenantId, filters);
      const result = {
        columns: tableColumns.vehicleCategories || [],
        rows: categories,
      };
      return responseHandler(res, "success", result, "Vehicle categories retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving vehicle categories:", error);
      return responseHandler(res, "error", null, "Failed to retrieve vehicle categories.");
    }
  }

  async updateVehicleCategory(req, res) {
    try {
      const { tenantId } = req.user;
      const category = await TransportationService.updateVehicleCategory(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", category, "Vehicle category updated successfully.");
    } catch (error) {
      logger.error("Error updating vehicle category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteVehicleCategory(req, res) {
    try {
      const { tenantId } = req.user;
      await TransportationService.deleteVehicleCategory(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Vehicle category deleted successfully.");
    } catch (error) {
      logger.error("Error deleting vehicle category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Vehicles ──────────────────────────────────────────────────────────────

  async createVehicle(req, res) {
    try {
      const { tenantId } = req.user;
      const vehicle = await TransportationService.createVehicle(req.body, tenantId);
      return responseHandler(res, "success", vehicle, "Vehicle created successfully.");
    } catch (error) {
      logger.error("Error creating vehicle:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getVehicleById(req, res) {
    try {
      const { tenantId } = req.user;
      const vehicle = await TransportationService.getVehicleById(req.params.id, tenantId);
      if (!vehicle) {
        return responseHandler(res, "error", null, "Vehicle not found.");
      }
      return responseHandler(res, "success", vehicle, "Vehicle retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving vehicle:", error);
      return responseHandler(res, "error", null, "Failed to retrieve vehicle.");
    }
  }

  async getAllVehicles(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const vehicles = await TransportationService.getAllVehicles(tenantId, filters);
      const result = {
        columns: tableColumns.vehicles || [],
        rows: vehicles,
      };
      return responseHandler(res, "success", result, "Vehicles retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving vehicles:", error);
      return responseHandler(res, "error", null, "Failed to retrieve vehicles.");
    }
  }

  async updateVehicle(req, res) {
    try {
      const { tenantId } = req.user;
      const vehicle = await TransportationService.updateVehicle(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", vehicle, "Vehicle updated successfully.");
    } catch (error) {
      logger.error("Error updating vehicle:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteVehicle(req, res) {
    try {
      const { tenantId } = req.user;
      await TransportationService.deleteVehicle(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Vehicle deleted successfully.");
    } catch (error) {
      logger.error("Error deleting vehicle:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Vehicle Driver Assignments ────────────────────────────────────────────

  async createDriverAssignment(req, res) {
    try {
      const { tenantId } = req.user;
      const assignment = await TransportationService.createDriverAssignment(req.body, tenantId);
      return responseHandler(res, "success", assignment, "Driver assignment created successfully.");
    } catch (error) {
      logger.error("Error creating driver assignment:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getDriverAssignmentById(req, res) {
    try {
      const { tenantId } = req.user;
      const assignment = await TransportationService.getDriverAssignmentById(req.params.id, tenantId);
      if (!assignment) {
        return responseHandler(res, "error", null, "Driver assignment not found.");
      }
      return responseHandler(res, "success", assignment, "Driver assignment retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving driver assignment:", error);
      return responseHandler(res, "error", null, "Failed to retrieve driver assignment.");
    }
  }

  async getAllDriverAssignments(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const assignments = await TransportationService.getAllDriverAssignments(tenantId, filters);
      const result = {
        columns: tableColumns.vehicleDriverAssignments || [],
        rows: assignments,
      };
      return responseHandler(res, "success", result, "Driver assignments retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving driver assignments:", error);
      return responseHandler(res, "error", null, "Failed to retrieve driver assignments.");
    }
  }

  async updateDriverAssignment(req, res) {
    try {
      const { tenantId } = req.user;
      const assignment = await TransportationService.updateDriverAssignment(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", assignment, "Driver assignment updated successfully.");
    } catch (error) {
      logger.error("Error updating driver assignment:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteDriverAssignment(req, res) {
    try {
      const { tenantId } = req.user;
      await TransportationService.deleteDriverAssignment(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Driver assignment deleted successfully.");
    } catch (error) {
      logger.error("Error deleting driver assignment:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Pickup Points ─────────────────────────────────────────────────────────

  async createPickupPoint(req, res) {
    try {
      const { tenantId } = req.user;
      const point = await TransportationService.createPickupPoint(req.body, tenantId);
      return responseHandler(res, "success", point, "Pickup point created successfully.");
    } catch (error) {
      logger.error("Error creating pickup point:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getPickupPointById(req, res) {
    try {
      const { tenantId } = req.user;
      const point = await TransportationService.getPickupPointById(req.params.id, tenantId);
      if (!point) {
        return responseHandler(res, "error", null, "Pickup point not found.");
      }
      return responseHandler(res, "success", point, "Pickup point retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving pickup point:", error);
      return responseHandler(res, "error", null, "Failed to retrieve pickup point.");
    }
  }

  async getAllPickupPoints(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const points = await TransportationService.getAllPickupPoints(tenantId, filters);
      const result = {
        columns: tableColumns.pickupPoints || [],
        rows: points,
      };
      return responseHandler(res, "success", result, "Pickup points retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving pickup points:", error);
      return responseHandler(res, "error", null, "Failed to retrieve pickup points.");
    }
  }

  async updatePickupPoint(req, res) {
    try {
      const { tenantId } = req.user;
      const point = await TransportationService.updatePickupPoint(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", point, "Pickup point updated successfully.");
    } catch (error) {
      logger.error("Error updating pickup point:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deletePickupPoint(req, res) {
    try {
      const { tenantId } = req.user;
      await TransportationService.deletePickupPoint(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Pickup point deleted successfully.");
    } catch (error) {
      logger.error("Error deleting pickup point:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Student Transport Assignments ─────────────────────────────────────────

  async createTransportAssignment(req, res) {
    try {
      const { tenantId } = req.user;
      const assignment = await TransportationService.createTransportAssignment(req.body, tenantId);
      return responseHandler(res, "success", assignment, "Transport assignment created successfully.");
    } catch (error) {
      logger.error("Error creating transport assignment:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getTransportAssignmentById(req, res) {
    try {
      const { tenantId } = req.user;
      const assignment = await TransportationService.getTransportAssignmentById(req.params.id, tenantId);
      if (!assignment) {
        return responseHandler(res, "error", null, "Transport assignment not found.");
      }
      return responseHandler(res, "success", assignment, "Transport assignment retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving transport assignment:", error);
      return responseHandler(res, "error", null, "Failed to retrieve transport assignment.");
    }
  }

  async getAllTransportAssignments(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const assignments = await TransportationService.getAllTransportAssignments(tenantId, filters);
      const result = {
        columns: tableColumns.studentTransportAssignments || [],
        rows: assignments,
      };
      return responseHandler(res, "success", result, "Transport assignments retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving transport assignments:", error);
      return responseHandler(res, "error", null, "Failed to retrieve transport assignments.");
    }
  }

  async updateTransportAssignment(req, res) {
    try {
      const { tenantId } = req.user;
      const assignment = await TransportationService.updateTransportAssignment(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", assignment, "Transport assignment updated successfully.");
    } catch (error) {
      logger.error("Error updating transport assignment:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteTransportAssignment(req, res) {
    try {
      const { tenantId } = req.user;
      await TransportationService.deleteTransportAssignment(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Transport assignment deleted successfully.");
    } catch (error) {
      logger.error("Error deleting transport assignment:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Smart Features ────────────────────────────────────────────────────────

  async autoAssignVehicles(req, res) {
    try {
      const { tenantId } = req.user;
      const result = await TransportationService.autoAssignVehicles(tenantId);
      return responseHandler(res, "success", result, result.message);
    } catch (error) {
      logger.error("Error auto-assigning vehicles:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async findNearestPickupPoint(req, res) {
    try {
      const { tenantId } = req.user;
      const { latitude, longitude } = req.query;
      if (!latitude || !longitude) {
        return responseHandler(res, "error", null, "Latitude and longitude are required.");
      }
      const nearest = await TransportationService.findNearestPickupPoint(
        tenantId,
        parseFloat(latitude),
        parseFloat(longitude)
      );
      if (!nearest) {
        return responseHandler(res, "error", null, "No pickup points found.");
      }
      return responseHandler(res, "success", nearest, "Nearest pickup point found.");
    } catch (error) {
      logger.error("Error finding nearest pickup point:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async checkVehicleAvailability(req, res) {
    try {
      const { tenantId } = req.user;
      const { vehicleId } = req.params;
      const availability = await TransportationService.checkVehicleAvailability(tenantId, vehicleId);
      return responseHandler(res, "success", availability, "Vehicle availability retrieved.");
    } catch (error) {
      logger.error("Error checking vehicle availability:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default TransportationController;
