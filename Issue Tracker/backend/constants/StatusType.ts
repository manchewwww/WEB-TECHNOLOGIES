export const StatusValues = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  CLOSED: "closed",
} as const;

export type StatusType = typeof StatusValues[keyof typeof StatusValues];
