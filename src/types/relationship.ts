export interface Relationship {
  id?: string;
  fromEntity: string;
  toEntity: string;
  relationType: string;
  sourceUrl?: string | null;
  updatedAt?: string;
}
