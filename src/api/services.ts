import apiClient from "./client";

export interface GetServicesResponse {
  [key: string]: "ok" | "update" | "warning" | "failure"
}

export async function getServices(): Promise<GetServicesResponse> {
  const { data } = await apiClient.get<GetServicesResponse>('services')
  return data
}