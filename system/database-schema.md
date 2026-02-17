# Intersect Mirror — Database Schema (Draft)

## Tables

### budgets
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (pk) | Supabase generated |
| category | text | e.g. "Treasury", "Committees" |
| subcategory | text | optional |
| ada_amount | numeric | ADA amount |
| status | text | `verified` | `partial` | `missing` |
| source_url | text | link to source |
| verified_by | text | community verifier handle or org |
| updated_at | timestamptz | last update |

### people
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (pk) | Supabase generated |
| name | text | full name |
| role | text | e.g. "Executive Director" |
| affiliation | text | e.g. "Intersect", "IOG" |
| source_url | text | link to profile/source |
| verified_by | text | community verifier handle or org |
| updated_at | timestamptz | last update |

### committees
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (pk) | Supabase generated |
| name | text | committee name |
| description | text | mandate/summary |
| elections | text | elections cadence/notes |
| transparency | text | `verified` | `partial` | `missing` |
| source_url | text | link to source |
| verified_by | text | community verifier handle or org |
| updated_at | timestamptz | last update |

### relationships
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (pk) | Supabase generated |
| from_entity | text | person/org name |
| to_entity | text | person/org name |
| relation_type | text | e.g. "board member", "committee" |
| source_url | text | link to source |
| verified_by | text | community verifier handle or org |
| updated_at | timestamptz | last update |

### transparency_scores
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (pk) | Supabase generated |
| category | text | matches scoring category |
| score | numeric | 0–100 |
| weight | numeric | weight from PRD |
| data_points_verified | int | optional |
| data_points_total | int | optional |
| verified_by | text | community verifier handle or org |
| updated_at | timestamptz | last update |

## Indexes
- budgets(category)
- people(affiliation)
- relationships(from_entity, to_entity)
