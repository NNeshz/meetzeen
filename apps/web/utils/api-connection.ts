import { createApiClient } from "@meetzeen/api/src/eden";

export const apiClient = createApiClient(process.env.NEXT_PUBLIC_BACKEND_URL)