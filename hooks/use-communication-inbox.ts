"use client";

import { useState, useCallback } from "react";
import type { CommunicationRecipient } from "@/lib/api/communication";
import * as communicationApi from "@/lib/api/communication";

export function useCommunicationInbox(params?: { isRead?: boolean; limit?: number; offset?: number }) {
  const [items, setItems] = useState<CommunicationRecipient[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await communicationApi.getInbox(params);
      setItems(result.items);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  return { items, total, loading, error, refetch: fetch };
}

export function useAcknowledgeCommunication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acknowledge = useCallback(async (communicationId: string, action?: "viewed" | "acknowledged"): Promise<CommunicationRecipient | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.acknowledgeCommunication(communicationId, action);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { acknowledge, loading, error };
}