import { apiClient } from "@/utils/api-connection";

export interface ProgressStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface UserProgress {
  currentStep: number;
  totalSteps: number;
  progress: number;
  steps: ProgressStep[];
  onboardingCompleted: boolean;
}

export class ProgressService {
  async getUserProgress(): Promise<UserProgress> {
    const response = await apiClient.progress.get({
      fetch: {
        credentials: "include",
      },
    });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async updateProgressStep(stepId: number): Promise<void> {
    const response = await apiClient.progress.step({ stepId: stepId.toString() }).patch(null, {
      fetch: {
        credentials: "include",
      },
    });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }
}

export const progressService = new ProgressService();