import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const read = (path) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
const workflow = read("../src/LifecycleWorkflow.jsx");
const partner = read("../src/SupplyChainPartnerDashboard.jsx");
const manufacturer = read("../src/ManufacturerDashboard.jsx");
const admin = read("../src/AdminDashboard.jsx");

test("role dashboards expose real lifecycle actions and honest loading, error, and empty states", () => {
  for (const label of ["Loading assigned products", "No assigned product records", "aria-live", "Retry confirmation", "Current custodian", "Legacy registry", "Previous transaction reverted", "failedActions", "LEGACY_REVERTED_CANDIDATE", "Verify existing hash"]) {
    assert.ok(workflow.includes(label), `Missing lifecycle UI state: ${label}`);
  }
  assert.match(partner, /<LifecycleWorkflow role=\{user\.role\}/);
  assert.match(manufacturer, /<LifecycleWorkflow role="MANUFACTURER"/);
  assert.match(workflow, /DISPATCH_TO_DISTRIBUTOR/);
  assert.match(workflow, /RECEIVE_BY_DISTRIBUTOR/);
  assert.match(workflow, /DISPATCH_TO_RETAILER/);
  assert.match(workflow, /RECEIVE_BY_RETAILER/);
  assert.match(workflow, /RECORD_SALE/);
  assert.match(workflow, /QR verification never changes the product state/);
});

test("partner dashboards surface role-specific live inventory and functional QR access", () => {
  for (const label of ["Incoming from manufacturers", "Incoming from distributors", "Distributor inventory", "Retail inventory", "Not live V2-confirmed", "LIVE V2 STATE", "Open product QR", "View mint transaction"]) {
    assert.ok(workflow.includes(label), `Missing partner lifecycle detail: ${label}`);
  }
  assert.match(workflow, /RECEIVED_BY_DISTRIBUTOR/);
  assert.match(workflow, /DISPATCHED_TO_RETAILER/);
  assert.match(workflow, /RECEIVED_BY_RETAILER/);
  assert.match(workflow, /window\.open\(`https:\/\/api\.qrserver\.com/);
  assert.match(partner, /partner-lifecycle/);
  assert.match(partner, /partner-wallet/);
  assert.match(partner, /LIVE V2 STATE|ProductRegistry V2/);
});

test("admin lifecycle drill-down distinguishes registry state, custody, verification, and scoring", () => {
  for (const label of ["Lifecycle details", "Confirmed custody events", "Failed transaction attempts", "Current chain state", "Stored verification and AI assessments", "NOT_INDEXED_FOR_LEGACY_REGISTRY", "NOT_APPLICABLE"]) {
    assert.ok(admin.includes(label), `Missing admin lifecycle evidence: ${label}`);
  }
  assert.match(admin, /lifecycleDetailLoading/);
  assert.match(admin, /lifecycleDetailError/);
});
