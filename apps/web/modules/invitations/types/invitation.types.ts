export interface Invitation {
  id: string;
  organizationId: string;
  email: string;
  role: string | null;
  status: string;
  token: string;
  expiresAt: string;
  inviterId: string;
  createdAt: string;
  updatedAt: string;
}
