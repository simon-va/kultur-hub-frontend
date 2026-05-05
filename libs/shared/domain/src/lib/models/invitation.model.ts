export interface Invitation {
  id: string;
  code: string;
  email?: string;
  createdAt: string;
  expiresAt?: string;
  usedAt?: string;
  createdByUserId: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  invitationCode: string;
}
