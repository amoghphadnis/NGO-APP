# ADR-002: Native Fetch over Axios

**Date:** 2025
**Status:** Accepted

## Context

VPApp needs an HTTP client for API calls including multipart/form-data file uploads, bearer token authentication, and timeout handling.

## Decision

Use **native `fetch`** with `AbortController` instead of axios.

## Rationale

- **No dependency** — `fetch` is built into React Native. Axios adds ~12KB to bundle.
- **Multipart support** — React Native's `fetch` handles `FormData` natively. Axios had issues with multipart uploads on Android.
- **Previous issues** — Axios "Network Error" was a recurring issue on Android with multipart/form-data. Native `fetch` resolved this.
- **AbortController** — Provides clean timeout implementation without external libraries.
- **Response handling** — `fetch` provides streaming and manual content-type handling, giving more control.

## Trade-offs

- **Error shape** — Axios has a rich error object. We replicate this with a custom `ApiError` class (`status`, `data`, `message`, `code`).
- **Interceptors** — Axios has request/response interceptors. We handle auth token injection and 401 logout manually in the `api` wrapper.
- **JSON parsing** — Axios auto-parses JSON. We call `response.json()` explicitly.

## Implementation

**File:** `src/api/client.ts` (~220 lines)
- `fetchWithTimeout()` using `AbortController`
- Custom `ApiError` class mirroring axios error shape
- `api.get()`, `api.post()`, `api.put()`, `api.delete()`, `api.patch()`
- Bearer token from `AsyncStorage` for protected paths
- Auto-logout on 401

## Cleanup

`axios` is still listed in `package.json` but is unused. Should be removed.
