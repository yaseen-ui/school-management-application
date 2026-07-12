import { apiClient } from "./client";

const BASE_PATH = "/settings/id-sequences";

export interface IdSequencePattern {
  id: string;
  tenantId: string;
  academicYearId: string | null;
  entityType: "admission" | "employee_code";
  pattern: string;
  currentSeq: number;
  seqLength: number;
  isActive: boolean;
  nextPreview: string | null;
  academicYear?: { id: string; name: string } | null;
  logs?: IdSequenceLog[];
  createdAt: string;
  updatedAt: string;
}

export interface IdSequenceLog {
  id: string;
  tenantId: string;
  patternId: string;
  generatedValue: string;
  entityType: string;
  entityId: string | null;
  createdAt: string;
}

export interface UpsertPatternPayload {
  entityType: "admission" | "employee_code";
  academicYearId?: string | null;
  pattern: string;
  isActive?: boolean;
}

export interface UpdatePatternPayload {
  pattern?: string;
  isActive?: boolean;
  academicYearId?: string | null;
}

export interface IdSequenceListResponse {
  status: string;
  data: IdSequencePattern[];
  message: string;
}

export interface IdSequenceSingleResponse {
  status: string;
  data: IdSequencePattern;
  message: string;
}

export interface IdSequenceLogsResponse {
  status: string;
  data: IdSequenceLog[];
  message: string;
}

const idSequencesApi = {
  getAll: async (entityType?: string): Promise<IdSequencePattern[]> => {
    const params: Record<string, string> = {};
    if (entityType) params.entityType = entityType;
    const res = await apiClient.get<IdSequenceListResponse>(BASE_PATH, params);
    return res.data;
  },

  getById: async (id: string): Promise<IdSequencePattern> => {
    const res = await apiClient.get<IdSequenceSingleResponse>(`${BASE_PATH}/${id}`);
    return res.data;
  },

  upsert: async (payload: UpsertPatternPayload): Promise<IdSequencePattern> => {
    const res = await apiClient.post<IdSequenceSingleResponse>(BASE_PATH, payload);
    return res.data;
  },

  update: async (id: string, payload: UpdatePatternPayload): Promise<IdSequencePattern> => {
    const res = await apiClient.put<IdSequenceSingleResponse>(`${BASE_PATH}/${id}`, payload);
    return res.data;
  },

  getLogs: async (entityType?: string, limit = 50): Promise<IdSequenceLog[]> => {
    const params: Record<string, string> = { limit: String(limit) };
    if (entityType) params.entityType = entityType;
    const res = await apiClient.get<IdSequenceLogsResponse>(`${BASE_PATH}/logs`, params);
    return res.data;
  },
};

export default idSequencesApi;