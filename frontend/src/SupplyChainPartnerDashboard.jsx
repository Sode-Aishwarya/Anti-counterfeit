import React, { useState } from "react";
import WalletBinding from "./WalletBinding";
import LifecycleWorkflow from "./LifecycleWorkflow";
import "./ManufacturerDashboard.css";
import "./SupplyChainPartnerDashboard.css";

const readUser = () => {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
};

function SupplyChainPartnerDashboard({ onLogout }) {
  const user = readUser();
  const isDistributor = user.role === "DISTRIBUTOR";
  const roleLabel = isDistributor ? "Distributor" : "Retailer";
  const [activeSection, setActiveSection] = useState("overview");

  const navigate = (section) => {
    setActiveSection(section);
    document.getElementById(`partner-${section}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItem = (section, icon, label) => (
    <button
      className={`nav-item${activeSection === section ? " active" : ""}`}
      type="button"
      key={section}
      aria-current={activeSection === section ? "page" : undefined}
      aria-label={label}
      onClick={() => navigate(section)}
    >
      <span aria-hidden="true">{icon}</span>{label}
    </button>
  );

  return (
    <div className="manufacturer-app partner-app">
      <aside className="sidebar" aria-label={`${roleLabel} navigation`}>
        <div className="brand">
          <img src="/logo.png" alt="" />
          <div><h2>Anti-Counterfeit</h2><p>Blockchain product<br />verification</p></div>
        </div>
        <nav>
          {navItem("overview", "⌂", "Dashboard")}
          {navItem("lifecycle", "↔", "Product lifecycle")}
          {navItem("wallet", "◇", "Wallet security")}
        </nav>
        <div className="sidebar-bottom">
          <div className="partner-side-user">
            <span className="small-avatar" aria-hidden="true">{user.name?.charAt(0)?.toUpperCase() || roleLabel.charAt(0)}</span>
            <span><strong>{user.name || roleLabel}</strong><small>{roleLabel} account</small></span>
          </div>
          <button className="logout-button" type="button" onClick={onLogout}>Log out</button>
        </div>
      </aside>

      <main className="main-content partner-main">
        <header className="topbar partner-topbar">
          <div><span className="partner-topbar-label">SUPPLY CHAIN PORTAL</span><strong>{roleLabel} workspace</strong></div>
          <span className="partner-network-chip">Sepolia · V2 lifecycle</span>
        </header>

        <section className="page-content partner-page-content">
          <section id="partner-overview" className="partner-overview" aria-labelledby="partner-title">
            <div className="page-header">
              <h1 id="partner-title">{isDistributor ? "Distributor operations" : "Retailer operations"}</h1>
              <p>{isDistributor
                ? "Review manufacturer handoffs, confirm receipt, and dispatch assigned inventory to its retailer."
                : "Review distributor handoffs, confirm receipt, and access product QR and on-chain provenance."}</p>
            </div>
            <div className="partner-role-card">
              <span className="partner-role-icon" aria-hidden="true">{isDistributor ? "↔" : "✓"}</span>
              <div>
                <strong>{isDistributor ? "Distributor handoffs" : "Retailer receipt and provenance"}</strong>
                <p>{isDistributor
                  ? "Receive only products assigned to your verified wallet. Dispatch to the assigned retailer after on-chain receipt."
                  : "Receive only products assigned to your verified wallet. Product state changes only after Sepolia confirms the transaction."}</p>
              </div>
              <button type="button" className="secondary-button" onClick={() => navigate("lifecycle")}>View assigned products</button>
            </div>
            <div className="partner-chain-note" role="note">
              <strong>Live chain state and saved history are different.</strong>
              <span>Product states below are read from ProductRegistry V2. The partner feed also reports unresolved operations; confirmed event history is available in the existing administrator lifecycle view.</span>
            </div>
          </section>

          <section id="partner-lifecycle" className="partner-dashboard-section" aria-label="Assigned product lifecycle">
            <LifecycleWorkflow role={user.role} compact />
          </section>

          <section id="partner-wallet" className="partner-dashboard-section partner-wallet-section" aria-label="Wallet security">
            <WalletBinding />
            <section className="partner-notice" aria-label="Account approval information">
              <span className="partner-notice-icon" aria-hidden="true">i</span>
              <div>
                <h2>Account and contract approvals are separate</h2>
                <p>Application profile approval and wallet binding do not assign a V2 contract role. Product actions require the matching on-chain role and assigned wallet.</p>
              </div>
            </section>
          </section>
        </section>
      </main>
    </div>
  );
}

export default SupplyChainPartnerDashboard;
