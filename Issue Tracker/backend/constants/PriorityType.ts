export const PriorityValues = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export type PriorityType = typeof PriorityValues[keyof typeof PriorityValues];
