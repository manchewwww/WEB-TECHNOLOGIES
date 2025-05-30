export const RoleValues = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
} as const;

export type RoleType = typeof RoleValues[keyof typeof RoleValues];
