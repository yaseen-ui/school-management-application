"use client";

import { useState, useCallback } from "react";
import type {
  Publication,
  PublicationCreatePayload,
  PublicationUpdatePayload,
  PublicationRevision,
} from "@/lib/api/communication";
import * as communicationApi from "@/lib/api/communication";

export function useCreatePublication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: PublicationCreatePayload): Promise<Publication | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.createPublication(data);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function usePublications(filters?: { type?: string; status?: string; published?: boolean }) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await communicationApi.getPublications(filters);
      setPublications(result.items);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  return { publications, total, loading, error, refetch: fetch };
}

export function usePublication(id: string | null) {
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await communicationApi.getPublicationById(id);
      setPublication(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { publication, loading, error, refetch: fetch };
}

export function useUpdatePublication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: string, data: PublicationUpdatePayload): Promise<Publication | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.updatePublication(id, data);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeletePublication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await communicationApi.deletePublication(id);
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

export function useSubmitPublication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (id: string): Promise<Publication | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.submitPublication(id);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error };
}

export function useApprovePublication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approve = useCallback(async (id: string, remarks?: string): Promise<Publication | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.approvePublication(id, remarks);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { approve, loading, error };
}

export function useRejectPublication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reject = useCallback(async (id: string, reason?: string): Promise<Publication | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.rejectPublication(id, reason);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reject, loading, error };
}

export function usePublishPublication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publish = useCallback(async (id: string): Promise<Publication | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.publishPublication(id);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { publish, loading, error };
}

export function useArchivePublication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const archive = useCallback(async (id: string): Promise<Publication | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.archivePublication(id);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { archive, loading, error };
}

export function useWithdrawPublication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withdraw = useCallback(async (id: string): Promise<Publication | null> => {
    setLoading(true);
    setError(null);
    try {
      return await communicationApi.withdrawPublication(id);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { withdraw, loading, error };
}

export function usePublicationRevisions(publicationId: string | null) {
  const [data, setData] = useState<{ publication: { id: string; title: string }; revisions: PublicationRevision[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!publicationId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await communicationApi.getPublicationRevisions(publicationId);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [publicationId]);

  return { data, loading, error, refetch: fetch };
}