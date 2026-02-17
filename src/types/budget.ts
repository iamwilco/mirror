export type BudgetStatus = "verified" | "partial" | "missing";

export interface Budget {
  id?: string;
  category: string;
  subcategory?: string | null;
  adaAmount: number;
  status: BudgetStatus;
  sourceUrl?: string | null;
  verifiedBy?: string | null;
  updatedAt?: string;
}
