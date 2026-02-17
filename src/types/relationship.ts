export interface Relationship {
  id?: string;
  fromEntity: string;
  toEntity: string;
  relationType: string;
  sourceUrl?: string | null;
  verifiedBy?: string | null;
  updatedAt?: string;
}
