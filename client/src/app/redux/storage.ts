"use client";

import type { WebStorage } from "redux-persist";
import localStorage from "redux-persist/lib/storage";

const storage: WebStorage | undefined =
  typeof window !== "undefined" ? localStorage : undefined;

export default storage;
