export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  organizationMemberships: OrganizationMembership[];
}

export interface OrganizationMembership {
  organizationId: string;
  organizationName: string;
  role: OrganizationRole;
}

export type OrganizationRole = 'owner' | 'member';
