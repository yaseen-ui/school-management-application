import ExamService from "./exam.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class ExamController {
  // ─── Exam CRUD (Admin Flow) ───────────────────────────────────────────────

  static async createExam(req, res) {
    try {
      const exam = await ExamService.createExam(req.body, req.tenantId);
      logger.info(`Exam created: ${exam.name}`);
      return responseHandler(res, "success", exam, "Exam created successfully.");
    } catch (error) {
      logger.error(`Error creating exam: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getExams(req, res) {
    try {
      const { academicYearId, examType } = req.query;
      const exams = await ExamService.getExams(
        req.tenantId,
        academicYearId,
        examType
      );
      const result = {
        rows: exams,
        columns: tableColumns.exams,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Exams retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving exams: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getExamById(req, res) {
    try {
      const exam = await ExamService.getExamById(
        req.params.id,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        exam,
        "Exam retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving exam: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateExam(req, res) {
    try {
      const exam = await ExamService.updateExam(
        req.params.id,
        req.body,
        req.tenantId
      );
      logger.info(`Exam updated: ${exam.name}`);
      return responseHandler(res, "success", exam, "Exam updated successfully.");
    } catch (error) {
      logger.error(`Error updating exam: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteExam(req, res) {
    try {
      await ExamService.deleteExam(req.params.id, req.tenantId);
      logger.info(`Exam deleted: ID=${req.params.id}`);
      return responseHandler(
        res,
        "success",
        null,
        "Exam deleted successfully."
      );
    } catch (error) {
      logger.error(`Error deleting exam: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  // ─── Exam Schedule CRUD (Faculty Flow) ────────────────────────────────────

  static async createSchedule(req, res) {
    try {
      const schedule = await ExamService.createSchedule(req.body, req.tenantId);
      logger.info(`Exam schedule created: ${schedule.name}`);
      return responseHandler(
        res,
        "success",
        schedule,
        "Schedule created successfully."
      );
    } catch (error) {
      logger.error(`Error creating schedule: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getSchedules(req, res) {
    try {
      const { examId, sectionId } = req.query;
      const schedules = await ExamService.getSchedules(
        req.tenantId,
        examId,
        sectionId
      );
      const result = {
        rows: schedules,
        columns: tableColumns.examSchedules,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Schedules retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving schedules: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getScheduleById(req, res) {
    try {
      const schedule = await ExamService.getScheduleById(
        req.params.id,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        schedule,
        "Schedule retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving schedule: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateSchedule(req, res) {
    try {
      const schedule = await ExamService.updateSchedule(
        req.params.id,
        req.body,
        req.tenantId
      );
      logger.info(`Schedule updated: ${schedule.name}`);
      return responseHandler(
        res,
        "success",
        schedule,
        "Schedule updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating schedule: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteSchedule(req, res) {
    try {
      await ExamService.deleteSchedule(req.params.id, req.tenantId);
      logger.info(`Schedule deleted: ID=${req.params.id}`);
      return responseHandler(
        res,
        "success",
        null,
        "Schedule deleted successfully."
      );
    } catch (error) {
      logger.error(`Error deleting schedule: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  // ─── Exam Schedule Papers ─────────────────────────────────────────────────

  static async upsertPapers(req, res) {
    try {
      const schedule = await ExamService.upsertPapers(
        req.params.scheduleId,
        req.body.papers,
        req.tenantId
      );
      logger.info(`Papers updated for schedule: ${schedule.name}`);
      return responseHandler(
        res,
        "success",
        schedule,
        "Papers updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating papers: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getPapers(req, res) {
    try {
      const papers = await ExamService.getPapers(
        req.params.scheduleId,
        req.tenantId
      );
      const result = {
        rows: papers,
        columns: tableColumns.examSchedulePapers,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Papers retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving papers: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getPaperById(req, res) {
    try {
      const paper = await ExamService.getPaperById(
        req.params.id,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        paper,
        "Paper retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving paper: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updatePaper(req, res) {
    try {
      const paper = await ExamService.updatePaper(
        req.params.id,
        req.body,
        req.tenantId
      );
      logger.info(`Paper updated: ID=${req.params.id}`);
      return responseHandler(
        res,
        "success",
        paper,
        "Paper updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating paper: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deletePaper(req, res) {
    try {
      await ExamService.deletePaper(req.params.id, req.tenantId);
      logger.info(`Paper deleted: ID=${req.params.id}`);
      return responseHandler(
        res,
        "success",
        null,
        "Paper deleted successfully."
      );
    } catch (error) {
      logger.error(`Error deleting paper: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  // ─── Exam Marks ───────────────────────────────────────────────────────────

  static async upsertMarks(req, res) {
    try {
      const marks = await ExamService.upsertMarks(
        req.params.paperId,
        req.body.marks,
        req.tenantId
      );
      logger.info(`Marks updated for paper: ${req.params.paperId}`);
      return responseHandler(
        res,
        "success",
        marks,
        "Marks updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating marks: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getMarks(req, res) {
    try {
      const marks = await ExamService.getMarks(
        req.params.paperId,
        req.tenantId
      );
      const result = {
        rows: marks,
        columns: tableColumns.examMarks,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Marks retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving marks: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getStudentMarks(req, res) {
    try {
      const marks = await ExamService.getStudentMarks(
        req.params.enrollmentId,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        marks,
        "Student marks retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving student marks: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  // ─── Marks Entry Grid ──────────────────────────────────────────────────────

  static async getScheduleMarksGrid(req, res) {
    try {
      const grid = await ExamService.getScheduleMarksGrid(
        req.params.scheduleId,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        grid,
        "Schedule marks grid retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving schedule marks grid: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async upsertStudentScheduleMarks(req, res) {
    try {
      const { scheduleId, enrollmentId } = req.params;
      const marks = await ExamService.upsertStudentScheduleMarks(
        scheduleId,
        enrollmentId,
        req.body.marks,
        req.tenantId
      );
      logger.info(`Marks saved for student enrollment: ${enrollmentId}`);
      return responseHandler(
        res,
        "success",
        marks,
        "Student marks saved successfully."
      );
    } catch (error) {
      logger.error(`Error saving student marks: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  // ─── Results ───────────────────────────────────────────────────────────────

  static async getScheduleResults(req, res) {
    try {
      const results = await ExamService.getScheduleResults(
        req.params.scheduleId,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        results,
        "Schedule results retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving schedule results: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default ExamController;
