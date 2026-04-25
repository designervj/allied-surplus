import { createAsyncThunk } from "@reduxjs/toolkit";
import { BusinessBlueprint } from "./businessBlueprintSlice";

const tenantHeader = process.env.NEXT_PUBLIC_TENANT_ID;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchBusinessBlueprint = createAsyncThunk(
  "businessblueprint/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/platform/business-blueprint`, {
        headers: {
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch: ${resp.status}`);
      }

      const data = await resp.json();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateBusinessBlueprint = createAsyncThunk(
  "businessblueprint/update",
  async (payload: Partial<BusinessBlueprint>, { rejectWithValue }) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/platform/business-blueprint`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-db": tenantHeader || "",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update: ${resp.status}`);
      }

      const data = await resp.json();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
