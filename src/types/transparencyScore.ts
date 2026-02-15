export interface TransparencyScore {
  id?: string;
  category: string;
  score: number; // 0-100
  weight: number; // percent
  dataPointsVerified?: number;
  dataPointsTotal?: number;
  updatedAt?: string;
}
