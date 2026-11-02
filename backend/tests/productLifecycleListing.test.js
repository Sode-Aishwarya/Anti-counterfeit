const test = require("node:test");
const assert = require("node:assert/strict");
const { listAssignedProducts } = require("../services/productLifecycleService");

const registryAddress = "0x5555555555555555555555555555555555555555";
const manufacturer = "0x1111111111111111111111111111111111111111";
const distributor = "0x2222222222222222222222222222222222222222";
const retailer = "0x3333333333333333333333333333333333333333";

const makeHarness = (chainOverrides = {}) => {
  const product = {
    _id: "product-doc",
    productCode: "FPD-V2-LIST-1",
    productHash: "a".repeat(64),
    manufacturerId: "manufacturer-profile",
    manufacturerWallet: manufacturer,
    authorizedDistributor: distributor,
    authorizedDistributorId: "distributor-profile",
    authorizedRetailer: retailer,
    authorizedRetailerId: "retailer-profile",
    registryVersion: 2,
    registryAddress,
    chainId: 11155111
  };
  const chainProduct = {
    productId: product.productCode,
    productHash: product.productHash,
    manufacturerId: product.manufacturerId,
    manufacturer,
    authorizedDistributor: distributor,
    authorizedRetailer: retailer,
    currentCustodian: manufacturer,
    state: 1
  };
  const query = {
    sort() { return this; },
    skip() { return this; },
    limit() { return this; },
    lean: async () => [product]
  };
  const emptyOperationsQuery = {
    select() { return this; },
    sort() { return this; },
    limit() { return this; },
    lean: async () => []
  };
  const deps = {
    User: { findById: async () => ({ status: "ACTIVE", role: "DISTRIBUTOR", walletAddress: distributor, walletVerifiedAt: new Date() }) },
    Manufacturer: { findOne: async () => null },
    SupplyChainPartner: { findOne: async () => ({ _id: "distributor-profile", verificationStatus: "VERIFIED" }) },
    Product: { countDocuments: async () => 1, find: () => query },
    ProductRegistration: { findOne: async () => null },
    ProductLifecycleOperation: { find: () => emptyOperationsQuery },
    blockchainV1: { CONTRACT_ADDRESS: "0x6666666666666666666666666666666666666666", CHAIN_ID: 11155111 },
    blockchainV2: {
      CONTRACT_ADDRESS: registryAddress,
      SEPOLIA_CHAIN_ID: 11155111,
      ROLE: { DISTRIBUTOR: 2 },
      getRole: async () => 2,
      getProduct: async () => ({ ...chainProduct, ...chainOverrides })
    }
  };
  return { deps, product };
};

test("assigned product is actionable only when its live V2 identity matches the saved assignment", async () => {
  const matching = makeHarness();
  const result = await listAssignedProducts({ userId: "distributor", role: "DISTRIBUTOR" }, matching.deps);
  assert.equal(result.products[0].chainStatus, "AVAILABLE");
  assert.equal(result.products[0].lifecycleState, "DISPATCHED_TO_DISTRIBUTOR");

  for (const mismatch of [
    { productHash: "b".repeat(64) },
    { authorizedDistributor: retailer },
    { manufacturer: retailer }
  ]) {
    const h = makeHarness(mismatch);
    const unverified = await listAssignedProducts({ userId: "distributor", role: "DISTRIBUTOR" }, h.deps);
    assert.equal(unverified.products[0].chainStatus, "UNVERIFIED");
    assert.equal(unverified.products[0].lifecycleState, null);
    assert.equal(unverified.products[0].currentCustodian, null);
  }
});
