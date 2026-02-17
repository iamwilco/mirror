/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const ENV_PATH = path.join(__dirname, "../.env.local");

const loadEnv = () => {
  if (!fs.existsSync(ENV_PATH)) {
    throw new Error("Missing apps/web/.env.local. Create it before running this script.");
  }

  const raw = fs.readFileSync(ENV_PATH, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    if (!line || line.startsWith("#")) return;
    const [key, ...rest] = line.split("=");
    if (!key) return;
    const value = rest.join("=").trim();
    if (!process.env[key]) {
      process.env[key] = value.replace(/^"|"$/g, "");
    }
  });
};

const run = async () => {
  loadEnv();

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const dataPath = path.join(__dirname, "../src/data/input.json");
  const raw = fs.readFileSync(dataPath, "utf8");
  const inputData = JSON.parse(raw);

  const graphPath = path.join(__dirname, "../src/data/network-nodes.json");
  const graphRaw = fs.readFileSync(graphPath, "utf8");
  const graphData = JSON.parse(graphRaw);

  const peopleRows = inputData.people.map((person) => ({
    name: person.name,
    role: person.role,
    affiliation: person.affiliations.join(", "),
    source_url: person.source,
    verified_by: person.verifiedBy ?? null,
  }));

  const committeeRows = inputData.committees.map((committee) => ({
    name: committee.name,
    description: committee.description,
    elections: committee.elections,
    transparency: committee.transparency,
    source_url: committee.source,
    verified_by: committee.verifiedBy ?? null,
  }));

  const relationshipRows = inputData.relationships.map((relationship) => ({
    from_entity: relationship.from,
    to_entity: relationship.to,
    relation_type: `${relationship.type} — ${relationship.details}`,
    source_url: relationship.source,
    verified_by: relationship.verifiedBy ?? null,
  }));

  const graphRelationshipRows = (graphData.links || []).map((link) => {
    const sourceNode = (graphData.nodes || []).find((node) => node.id === link.source);
    const targetNode = (graphData.nodes || []).find((node) => node.id === link.target);

    return {
      from_entity: sourceNode?.label || link.source,
      to_entity: targetNode?.label || link.target,
      relation_type: link.type,
      source_url: link.source_detail ?? null,
      verified_by: null,
    };
  });

  console.log("Seeding people...", peopleRows.length);
  const peopleResult = await supabase.from("people").insert(peopleRows);
  if (peopleResult.error) {
    console.error("People insert error:", peopleResult.error.message);
  }

  console.log("Seeding committees...", committeeRows.length);
  const committeeResult = await supabase.from("committees").insert(committeeRows);
  if (committeeResult.error) {
    console.error("Committees insert error:", committeeResult.error.message);
  }

  console.log("Seeding relationships...", relationshipRows.length);
  const relationshipResult = await supabase.from("relationships").insert(relationshipRows);
  if (relationshipResult.error) {
    console.error("Relationships insert error:", relationshipResult.error.message);
  }

  if (graphRelationshipRows.length > 0) {
    console.log("Seeding graph relationships...", graphRelationshipRows.length);
    const graphRelationshipResult = await supabase
      .from("relationships")
      .insert(graphRelationshipRows);
    if (graphRelationshipResult.error) {
      console.error("Graph relationships insert error:", graphRelationshipResult.error.message);
    }
  }

  console.log("Seed complete.");
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
