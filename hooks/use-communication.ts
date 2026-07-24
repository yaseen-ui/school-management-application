"use client";

import { useState, useCallback } from "react";
import type {
  Communication,
  CommunicationSendPayload,
  CommunicationSendResult,
  DeliveryReport,
  AutomationRule,
  AutomationRuleCreatePayload,
  NotificationTemplate,
  TemplateCreatePayload,
  ChannelConfiguration,
  ChannelConfigUpdatePayload,
} from "@/lib/api/communication";
import * as communicationApi from "@/lib/api/communication";

// ─── Communications ─────────────────────────────────────────────────────

export function useSendCommunication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (data: CommunicationSendPayload): Promise<CommunicationSendResult | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.sendCommunication(data);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { send, loading, error };
}

export function useCommunications(filters?: Record<string, string>) {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await communicationApi.getCommunications(filters);
      setCommunications(result.items);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  return { communications, total, loading, error, refetch: fetch };
}

export function useCommunication(id: string | null) {
  const [communication, setCommunication] = useState<Communication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await communicationApi.getCommunicationById(id);
      setCommunication(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { communication, loading, error, refetch: fetch };
}

export function useUpdateCommunication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: string, data: Partial<CommunicationSendPayload>): Promise<Communication | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.updateCommunication(id, data);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteCommunication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await communicationApi.deleteCommunication(id);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}

export function useDeliveryReport(communicationId: string | null) {
  const [report, setReport] = useState<DeliveryReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!communicationId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await communicationApi.getDeliveryReport(communicationId);
      setReport(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [communicationId]);

  return { report, loading, error, refetch: fetch };
}

// ─── Automation Rules ───────────────────────────────────────────────────

export function useAutomationRules(filters?: { sourceModule?: string; isEnabled?: boolean }) {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await communicationApi.getAutomationRules(filters);
      setRules(result.items);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  return { rules, total, loading, error, refetch: fetch };
}

export function useAutomationRule(id: string | null) {
  const [rule, setRule] = useState<AutomationRule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await communicationApi.getAutomationRuleById(id);
      setRule(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { rule, loading, error, refetch: fetch };
}

export function useCreateAutomationRule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: AutomationRuleCreatePayload): Promise<AutomationRule | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.createAutomationRule(data);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateAutomationRule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: string, data: Partial<AutomationRuleCreatePayload>): Promise<AutomationRule | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.updateAutomationRule(id, data);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteAutomationRule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await communicationApi.deleteAutomationRule(id);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}

export function useToggleAutomationRule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(async (id: string, isEnabled?: boolean): Promise<AutomationRule | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.toggleAutomationRule(id, isEnabled);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { toggle, loading, error };
}

// ─── Templates ──────────────────────────────────────────────────────────

export function useTemplates(filters?: { type?: string; isActive?: boolean; isSystem?: boolean }) {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await communicationApi.getTemplates(filters);
      setTemplates(result.items);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  return { templates, total, loading, error, refetch: fetch };
}

export function useTemplate(id: string | null) {
  const [template, setTemplate] = useState<NotificationTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await communicationApi.getTemplateById(id);
      setTemplate(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { template, loading, error, refetch: fetch };
}

export function useCreateTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: TemplateCreatePayload): Promise<NotificationTemplate | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.createTemplate(data);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: string, data: Partial<TemplateCreatePayload>): Promise<NotificationTemplate | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.updateTemplate(id, data);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await communicationApi.deleteTemplate(id);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}

// ─── Channel Configuration ──────────────────────────────────────────────

export function useChannelConfigurations() {
  const [channels, setChannels] = useState<ChannelConfiguration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await communicationApi.getChannelConfigurations();
      setChannels(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { channels, loading, error, refetch: fetch };
}

export function useUpdateChannelConfigurations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (channels: ChannelConfigUpdatePayload[]): Promise<ChannelConfiguration[] | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.updateChannelConfigurations(channels);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}