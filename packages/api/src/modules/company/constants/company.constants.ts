/**
 * Organization member roles
 */
export const MEMBER_ROLE = {
  OWNER: "owner",
  ADMIN: "admin",
  EMPLOYEE: "employee",
} as const;

export type MemberRole = (typeof MEMBER_ROLE)[keyof typeof MEMBER_ROLE];

/**
 * Roles that have admin permissions (same as Owner)
 */
export const ADMIN_ROLES: MemberRole[] = [MEMBER_ROLE.OWNER, MEMBER_ROLE.ADMIN];

/**
 * Check if a role has admin permissions
 */
export function hasAdminPermissions(role: string): boolean {
  return ADMIN_ROLES.includes(role as MemberRole);
}