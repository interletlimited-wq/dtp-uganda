import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  ArrowLeft, Shield, CheckCircle, Download, Eye,
  FileText, AlertCircle, Check, ChevronDown, ChevronUp,
  Link, Leaf
} from "lucide-react";
import { EUDR_DOCUMENTS, BATCHES, TRANSACTIONS, formatUGX } from "../data/demo";

function generateEudrPDF(doc, batch) {
  const date = new Date().toLocaleDateString("en-UG", { day: "2-digit", month: "long", year: "numeric" });
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>EUDR Due Diligence Statement - ${doc.id}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #1a1a1a; margin: 40px; line-height: 1.6; }
        .header { border-bottom: 3px solid #F7B90F; padding-bottom: 20px; margin-bottom: 24px; }
        .logo { font-size: 10px; font-weight: bold; letter-spacing: 2px; color: #888; margin-bottom: 8px; }
        h1 { font-size: 20px; font-weight: bold; margin: 0 0 4px 0; }
        h2 { font-size: 13px; font-weight: bold; margin: 20px 0 8px 0; color: #444; border-bottom: 1px solid #eee; padding-bottom: 4px; }
        .ref { font-family: monospace; color: #F7B90F; font-weight: bold; font-size: 14px; }
        .eu-ref { font-family: monospace; font-size: 11px; color: #666; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 12px 0; }
        .field { }
        .field label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; display: block; }
        .field span { font-weight: bold; font-size: 12px; }
        .chain { margin: 8px 0; }
        .chain-node { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f0f0f0; font-size: 11px; font-family: monospace; }
        .dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; flex-shrink: 0; }
        .badge { display: inline-block; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; margin: 4px 2px; }
        .declaration { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 11px; line-height: 1.8; }
        .score-bar { background: #f0f0f0; height: 8px; border-radius: 4px; margin: 6px 0; }
        .score-fill { background: #22c55e; height: 8px; border-radius: 4px; width: ${doc.complianceScore}%; }
        .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 16px; font-size: 10px; color: #888; }
        .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; color: rgba(247,185,15,0.06); font-weight: bold; pointer-events: none; }
        @media print { body { margin: 20px; } .watermark { display: block; } }
      </style>
    </head>
    <body>
      <div class="watermark">DTP UGANDA</div>
      <div class="header">
        <div class="logo">DIGITAL TRADE PLATFORM - UGANDA</div>
        <h1>EU Deforestation Regulation</h1>
        <h1>Due Diligence Statement</h1>
        <div style="margin-top:10px">
          <div class="ref">${doc.id}</div>
          <div class="eu-ref">EU Portal Reference: ${doc.euRefNumber}</div>
          <div style="margin-top:6px">
            <span class="badge">&#10003; Deforestation Free</span>
            <span class="badge">&#10003; Risk: Negligible</span>
            <span class="badge">Status: ${doc.status.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <h2>1. Commodity Information</h2>
      <div class="grid">
        <div class="field"><label>Product</label><span>${doc.product}</span></div>
        <div class="field"><label>Quantity</label><span>${doc.quantity.toLocaleString()} ${doc.unit}</span></div>
        <div class="field"><label>Verified Farmers</label><span>${doc.verifiedFarmers} of ${doc.totalFarmers}</span></div>
        <div class="field"><label>Compliance Score</label><span>${doc.complianceScore}%</span></div>
      </div>
      <div class="score-bar"><div class="score-fill"></div></div>

      ${batch ? `
      <h2>2. Export Batch Details</h2>
      <div class="grid">
        <div class="field"><label>Batch Reference</label><span>${batch.id}</span></div>
        <div class="field"><label>Destination</label><span>${batch.destination}</span></div>
        <div class="field"><label>EU Buyer</label><span>${batch.buyer}</span></div>
        <div class="field"><label>Port of Exit</label><span>${batch.portOfExit}</span></div>
        <div class="field"><label>Container</label><span>${batch.containerRef || "-"}</span></div>
        <div class="field"><label>Ship Date</label><span>${batch.shipDate || "-"}</span></div>
      </div>
      ` : ""}

      <h2>3. Chain of Custody</h2>
      <p style="font-size:11px;color:#666">The following actors form the verified supply chain for this shipment:</p>
      <div class="chain">
        ${doc.chainNodes.map((node, i) => `
          <div class="chain-node">
            <div class="dot" style="background:${i === doc.chainNodes.length-1 ? "#F7B90F" : "#22c55e"}"></div>
            <span>${node}</span>
          </div>
        `).join("")}
      </div>

      <h2>4. Compliance Assessment</h2>
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <tr style="background:#f9fafb"><th style="text-align:left;padding:8px;border:1px solid #e5e7eb">Requirement</th><th style="padding:8px;border:1px solid #e5e7eb;text-align:center">Status</th></tr>
        ${[
          ["All producing operators registered and verified", "Compliant"],
          ["GPS coordinates of production areas on file", "Compliant"],
          ["Deforestation risk assessment conducted", "Compliant - Negligible Risk"],
          ["Chain of custody documentation complete", "Compliant"],
          ["Processing batch reference linked", "Compliant"],
          ["Export documentation filed with UeSW", "Compliant"],
        ].map(([req, status]) => `
          <tr>
            <td style="padding:7px 8px;border:1px solid #e5e7eb">${req}</td>
            <td style="padding:7px 8px;border:1px solid #e5e7eb;text-align:center;color:#15803d;font-weight:bold">&#10003; ${status}</td>
          </tr>
        `).join("")}
      </table>

      <h2>5. Declaration</h2>
      <div class="declaration">
        The operator named in this document hereby declares that the products described above comply with the requirements of EU Regulation 2023/1115 on deforestation-free products. The information provided is accurate and complete to the best of the operator's knowledge. The products have not contributed to deforestation or forest degradation, and the relevant legislation of the country of production regarding land use rights, environmental protection, and human rights has been respected throughout the supply chain.
      </div>

      <div class="grid" style="margin-top:20px">
        <div class="field"><label>Document prepared by</label><span>DTP Uganda Platform</span></div>
        <div class="field"><label>Date generated</label><span>${date}</span></div>
        <div class="field"><label>Submission date</label><span>${doc.submittedDate}</span></div>
        <div class="field"><label>Document status</label><span style="text-transform:uppercase">${doc.status}</span></div>
      </div>

      <div class="footer">
        This document was generated by the Uganda Digital Trade Platform (DTP). Reference: ${doc.id}. For verification, visit verify.dtp.go.ug or contact the platform administrator.
        <br/>Digital Trade Platform - Uganda | Ministry of ICT and National Guidance | www.dtp.go.ug
      </div>
    </body>
    </html>
  `;
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}

function viewEudrDocument(doc, batch) {
  const date = new Date().toLocaleDateString("en-UG", { day: "2-digit", month: "long", year: "numeric" });
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>EUDR Document - ${doc.id}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f5f4f0; color: #292929; }
        .topbar { background: #292929; color: white; padding: 14px 32px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; }
        .topbar-left { display: flex; align-items: center; gap: 12px; }
        .dtp-logo { background: #F7B90F; color: #292929; font-weight: 900; font-size: 11px; padding: 5px 8px; border-radius: 6px; letter-spacing: 1px; }
        .topbar-title { font-size: 14px; font-weight: 600; }
        .topbar-sub { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; }
        .print-btn { background: #F7B90F; color: #292929; border: none; padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; }
        .container { max-width: 860px; margin: 32px auto; padding: 0 24px 64px; }
        .doc-header { background: #292929; border-radius: 16px; padding: 32px; color: white; margin-bottom: 24px; position: relative; overflow: hidden; }
        .doc-header::before { content: "DTP"; position: absolute; right: -20px; top: -20px; font-size: 120px; font-weight: 900; color: rgba(247,185,15,0.05); }
        .doc-label { font-size: 10px; letter-spacing: 2px; color: rgba(255,255,255,0.3); text-transform: uppercase; margin-bottom: 8px; }
        .doc-id { font-family: monospace; font-size: 22px; font-weight: 700; color: #F7B90F; margin-bottom: 4px; }
        .eu-ref { font-family: monospace; font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 16px; }
        .badges { display: flex; gap: 8px; flex-wrap: wrap; }
        .badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .badge-green { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #86efac; }
        .badge-blue { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); color: #93c5fd; }
        .badge-gold { background: rgba(247,185,15,0.1); border: 1px solid rgba(247,185,15,0.3); color: #F7B90F; }
        .card { background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px; border: 1px solid #e4e2da; }
        .card h2 { font-size: 13px; font-weight: 700; color: #5c5a56; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e4e2da; }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .field label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9c9891; display: block; margin-bottom: 3px; }
        .field span { font-weight: 600; font-size: 14px; color: #292929; }
        .score-wrap { display: flex; align-items: center; gap: 10px; margin: 8px 0; }
        .score-bar { flex: 1; height: 10px; background: #f0ede8; border-radius: 5px; overflow: hidden; }
        .score-fill { height: 100%; background: #22c55e; border-radius: 5px; width: ${doc.complianceScore}%; }
        .score-num { font-size: 20px; font-weight: 800; color: #16a34a; }
        .chain-node { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f5f4f0; }
        .chain-node:last-child { border-bottom: none; }
        .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .dot-green { background: #22c55e; }
        .dot-gold { background: #F7B90F; }
        .node-id { font-family: monospace; font-size: 12px; color: #292929; font-weight: 500; }
        .check-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f5f4f0; font-size: 13px; }
        .check-row:last-child { border-bottom: none; }
        .check-ok { color: #16a34a; font-weight: 700; font-size: 12px; }
        .declaration { background: #f9f8f5; border: 1px solid #e4e2da; border-radius: 8px; padding: 20px; font-size: 13px; line-height: 1.8; color: #5c5a56; }
        .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e4e2da; font-size: 11px; color: #9c9891; line-height: 1.8; }
        @media print { .topbar { display: none; } body { background: white; } .container { margin: 0; padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="topbar">
        <div class="topbar-left">
          <div class="dtp-logo">DTP</div>
          <div>
            <div class="topbar-title">EUDR Due Diligence Statement</div>
            <div class="topbar-sub">${doc.id} - ${doc.status.toUpperCase()}</div>
          </div>
        </div>
        <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
      </div>

      <div class="container">
        <div class="doc-header">
          <div class="doc-label">Digital Trade Platform - Uganda</div>
          <div class="doc-label">EU Deforestation Regulation (EUDR) 2023/1115</div>
          <div class="doc-id">${doc.id}</div>
          <div class="eu-ref">EU Portal Reference: ${doc.euRefNumber}</div>
          <div class="badges">
            <span class="badge badge-green">&#10003; Deforestation Free</span>
            <span class="badge badge-blue">&#9632; Risk: Negligible</span>
            <span class="badge badge-gold">&#9733; ${doc.status.toUpperCase()}</span>
          </div>
        </div>

        <div class="card">
          <h2>Commodity Information</h2>
          <div class="grid3">
            <div class="field"><label>Product</label><span>${doc.product}</span></div>
            <div class="field"><label>Quantity</label><span>${doc.quantity.toLocaleString()} ${doc.unit}</span></div>
            <div class="field"><label>Submission date</label><span>${doc.submittedDate}</span></div>
          </div>
          <div style="margin-top:16px">
            <div class="field" style="margin-bottom:6px"><label>Compliance score</label></div>
            <div class="score-wrap">
              <div class="score-bar"><div class="score-fill"></div></div>
              <div class="score-num">${doc.complianceScore}%</div>
            </div>
          </div>
          <div style="margin-top:12px">
            <div class="field"><label>Farmers verified</label><span>${doc.verifiedFarmers} of ${doc.totalFarmers} verified on DTP</span></div>
          </div>
        </div>

        ${batch ? `
        <div class="card">
          <h2>Export Batch Details</h2>
          <div class="grid3">
            <div class="field"><label>Batch Reference</label><span>${batch.id}</span></div>
            <div class="field"><label>Destination</label><span>${batch.destination}</span></div>
            <div class="field"><label>EU Buyer / Importer</label><span>${batch.buyer}</span></div>
            <div class="field"><label>Port of Exit</label><span>${batch.portOfExit}</span></div>
            <div class="field"><label>Shipping Line</label><span>${batch.shippingLine || "-"}</span></div>
            <div class="field"><label>Container Reference</label><span>${batch.containerRef || "-"}</span></div>
            <div class="field"><label>Ship Date</label><span>${batch.shipDate || "-"}</span></div>
            <div class="field"><label>ETA Destination</label><span>${batch.etaDestination || "-"}</span></div>
          </div>
        </div>
        ` : ""}

        <div class="card">
          <h2>Chain of Custody</h2>
          ${doc.chainNodes.map((node, i) => `
            <div class="chain-node">
              <div class="dot ${i === doc.chainNodes.length-1 ? "dot-gold" : "dot-green"}"></div>
              <div class="node-id">${node}</div>
              ${i === doc.chainNodes.length-1 ? '<span style="margin-left:auto;font-size:11px;font-weight:700;color:#F7B90F">THIS EXPORTER</span>' : '<span style="margin-left:auto;font-size:11px;color:#16a34a;font-weight:600">&#10003; Verified</span>'}
            </div>
          `).join("")}
        </div>

        <div class="card">
          <h2>Compliance Checklist</h2>
          ${[
            ["All producing operators registered and verified on DTP", true],
            ["GPS coordinates of all production areas on file", true],
            ["Deforestation risk assessment conducted - result: negligible", true],
            ["Full chain of custody documentation available", true],
            ["Processing batch reference linked to this document", !!batch],
            ["Export documentation filed with Uganda Electronic Single Window", true],
          ].map(([label, ok]) => `
            <div class="check-row">
              <span>${label}</span>
              <span class="check-ok">${ok ? "&#10003; Compliant" : "&#9888; Pending"}</span>
            </div>
          `).join("")}
        </div>

        <div class="card">
          <h2>Operator Declaration</h2>
          <div class="declaration">
            The operator named in this document hereby declares that the products described above comply with the requirements of EU Regulation 2023/1115 on deforestation-free products. The information provided is accurate and complete to the best of the operator's knowledge. The products have not contributed to deforestation or forest degradation, and the relevant legislation of the country of production regarding land use rights, environmental protection, and human rights has been respected throughout the supply chain covered by this statement.
          </div>
          <div class="grid2" style="margin-top:16px">
            <div class="field"><label>Document prepared by</label><span>Uganda Digital Trade Platform</span></div>
            <div class="field"><label>Date generated</label><span>${date}</span></div>
          </div>
        </div>

        <div class="footer">
          This document was generated by the Uganda Digital Trade Platform (DTP) - Ministry of ICT and National Guidance<br/>
          Document ID: ${doc.id} | EU Portal Reference: ${doc.euRefNumber}<br/>
          For verification: verify.dtp.go.ug | platform@dtp.go.ug | +256 414 123 456
        </div>
      </div>
    </body>
    </html>
  `;
  const win = window.open("", "_blank", "width=900,height=700");
  win.document.write(html);
  win.document.close();
  win.focus();
}

const STATUS_STYLES = {
  approved: "bg-green-50 text-green-700 border-green-200",
  submitted: "bg-blue-50 text-blue-700 border-blue-200",
  draft: "bg-warm-bg text-warm-muted border-warm-border",
  rejected: "bg-red-50 text-red-600 border-red-200",
};

function ComplianceBar({ score }) {
  const color = score >= 95 ? "bg-green-500" : score >= 80 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-warm-bg rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{width:`${score}%`}} />
      </div>
      <span className={`text-xs font-bold ${score >= 95 ? "text-green-600" : score >= 80 ? "text-amber-600" : "text-red-500"}`}>{score}%</span>
    </div>
  );
}

function EudrDocCard({ doc, batch, expanded, onToggle }) {
  return (
    <div className="bg-white border border-warm-border rounded-xl overflow-hidden">
      <div className="p-5 cursor-pointer hover:bg-warm-bg/30 transition-colors" onClick={onToggle}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${doc.status === "approved" ? "bg-green-50" : "bg-blue-50"}`}>
              <Shield size={18} className={doc.status === "approved" ? "text-green-600" : "text-blue-600"} />
            </div>
            <div>
              <div className="font-bold text-ink">{doc.id}</div>
              <div className="text-xs text-warm-muted font-mono">EU Ref: {doc.euRefNumber}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`text-[10px] font-bold px-2 py-1 rounded-full border ${STATUS_STYLES[doc.status]}`}>
              {doc.status}
            </div>
            {expanded ? <ChevronUp size={16} className="text-warm-muted" /> : <ChevronDown size={16} className="text-warm-muted" />}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
          <div><span className="text-warm-muted">Product:</span> <span className="font-semibold text-ink ml-1">{doc.product}</span></div>
          <div><span className="text-warm-muted">Quantity:</span> <span className="font-semibold text-ink ml-1">{doc.quantity.toLocaleString()} {doc.unit}</span></div>
          <div><span className="text-warm-muted">Farmers:</span> <span className="font-semibold text-ink ml-1">{doc.verifiedFarmers}/{doc.totalFarmers} verified</span></div>
          <div><span className="text-warm-muted">Submitted:</span> <span className="font-semibold text-ink ml-1">{doc.submittedDate}</span></div>
        </div>
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-warm-muted">Compliance score</span>
            {doc.deforestationFree && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                <Leaf size={9} /> Deforestation free
              </span>
            )}
          </div>
          <ComplianceBar score={doc.complianceScore} />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-warm-border">
          <div className="p-5 space-y-5">
            <div>
              <h4 className="text-xs font-bold text-warm-text uppercase tracking-wider mb-3">Chain of custody</h4>
              <div className="flex flex-col gap-0">
                {doc.chainNodes.map((node, i) => (
                  <div key={node} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${i < doc.chainNodes.length - 1 ? "bg-green-50 border-green-300" : "bg-gold/10 border-gold"}`}>
                        <Check size={12} className={i < doc.chainNodes.length - 1 ? "text-green-600" : "text-gold"} />
                      </div>
                      {i < doc.chainNodes.length - 1 && <div className="w-0.5 h-4 bg-warm-border" />}
                    </div>
                    <div className={`py-1 text-xs font-mono ${i === doc.chainNodes.length - 1 ? "font-bold text-ink" : "text-warm-text"}`}>
                      {node}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-warm-text uppercase tracking-wider mb-3">Compliance checklist</h4>
              <div className="space-y-2">
                {[
                  ["All farmers registered on DTP", doc.verifiedFarmers === doc.totalFarmers],
                  ["GPS coordinates on file", true],
                  ["Deforestation risk assessment", doc.deforestationFree],
                  ["Chain of custody complete", doc.chainNodes.length >= 3],
                  ["Processing batch linked", !!batch],
                  ["Export documentation filed", doc.status !== "draft"],
                ].map(([label, ok]) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-warm-border last:border-0">
                    <span className="text-sm text-warm-text">{label}</span>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${ok ? "text-green-600" : "text-red-500"}`}>
                      {ok ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
                      {ok ? "Compliant" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {batch && (
              <div>
                <h4 className="text-xs font-bold text-warm-text uppercase tracking-wider mb-3">Linked batch</h4>
                <div className="p-3 bg-warm-bg border border-warm-border rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div><div className="text-warm-muted">Batch ID</div><div className="font-semibold text-ink font-mono">{batch.id}</div></div>
                  <div><div className="text-warm-muted">Quantity</div><div className="font-semibold text-ink">{batch.inputQuantity?.toLocaleString()} kg</div></div>
                  <div><div className="text-warm-muted">Destination</div><div className="font-semibold text-ink">{batch.destination}</div></div>
                  <div><div className="text-warm-muted">Buyer</div><div className="font-semibold text-ink">{batch.buyer}</div></div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button onClick={() => generateEudrPDF(doc, batch)}
                className="flex items-center gap-2 bg-ink hover:bg-ink-mid text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all">
                <Download size={14} /> Download PDF
              </button>
              <button onClick={() => viewEudrDocument(doc, batch)}
                className="flex items-center gap-2 border border-warm-border text-warm-text hover:text-ink px-4 py-2 rounded-lg text-sm transition-all">
                <Eye size={14} /> View full document
              </button>
              <button className="flex items-center gap-2 border border-warm-border text-warm-text hover:text-ink px-4 py-2 rounded-lg text-sm transition-all">
                <Link size={14} /> EU portal link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GenerateForm({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ batchId: "", product: "Coffee (Arabica)", quantity: "", destination: "", buyer: "", declaration: false });
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const batches = BATCHES.filter(b => b.type === "export");

  async function handleGenerate() {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(false);
    setGenerated(true);
  }

  if (generated) {
    const newRef = `EUDR-UG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`;
    return (
      <div className="bg-white border border-warm-border rounded-xl p-6 mb-6">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-green-500" />
          </div>
          <h3 className="font-bold text-ink text-lg mb-1">EUDR document generated</h3>
          <p className="text-warm-text text-sm mb-4">Your due diligence statement has been prepared and is ready for submission to the EU portal.</p>
          <div className="bg-warm-bg border border-warm-border rounded-xl p-4 mb-5 text-left">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Document ID", newRef], ["Product", form.product], ["Quantity", `${parseInt(form.quantity).toLocaleString()} kg`], ["Destination", form.destination], ["Buyer", form.buyer], ["Status", "Draft - ready to submit"]].map(([l,v]) => (
                <div key={l}><div className="text-xs text-warm-muted">{l}</div><div className="font-semibold text-ink">{v}</div></div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            <button className="flex items-center gap-2 bg-ink text-white font-semibold px-5 py-2.5 rounded-lg text-sm">
              <Download size={14} /> Download PDF
            </button>
            <button onClick={onClose} className="border border-warm-border text-warm-text hover:text-ink px-5 py-2.5 rounded-lg text-sm">
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-warm-border rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-ink">Generate new EUDR document</h3>
        <button onClick={onClose} className="text-warm-muted hover:text-ink"><AlertCircle size={16} /></button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Linked export batch</label>
          <select value={form.batchId} onChange={e => setForm({...form, batchId: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white">
            <option value="">Select batch</option>
            {batches.map(b => <option key={b.id} value={b.id}>{b.id} - {b.buyer}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Product</label>
          <input value={form.product} onChange={e => setForm({...form, product: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Quantity (kg)</label>
          <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
            placeholder="e.g. 40000" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">Destination country</label>
          <input value={form.destination} onChange={e => setForm({...form, destination: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
            placeholder="e.g. Germany" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-warm-text uppercase tracking-wider mb-1.5">EU buyer / importer</label>
          <input value={form.buyer} onChange={e => setForm({...form, buyer: e.target.value})}
            className="w-full px-3 py-2.5 border border-warm-border rounded-lg text-sm text-ink bg-white"
            placeholder="e.g. Neumann Gruppe GmbH" />
        </div>
        <div className="md:col-span-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.declaration}
              onChange={e => setForm({...form, declaration: e.target.checked})}
              className="mt-0.5 w-4 h-4 accent-gold" />
            <span className="text-sm text-warm-text leading-relaxed">
              I declare that the information provided is accurate and complete. The products covered by this statement comply with the EU Deforestation Regulation (EUDR) requirements and have not contributed to deforestation or forest degradation.
            </span>
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button onClick={handleGenerate}
          disabled={!form.declaration || !form.quantity || !form.destination || !form.buyer || generating}
          className="flex items-center gap-2 bg-gold hover:bg-gold-mid disabled:opacity-50 text-ink font-bold px-5 py-2.5 rounded-lg text-sm transition-all">
          {generating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Generating...
            </span>
          ) : <><Shield size={15} /> Generate EUDR document</>}
        </button>
        <button onClick={onClose} className="border border-warm-border text-warm-text hover:text-ink px-5 py-2.5 rounded-lg text-sm transition-all">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function EudrDocs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const [showGenerate, setShowGenerate] = useState(false);

  const docs = EUDR_DOCUMENTS.filter(d => {
    const batch = BATCHES.find(b => b.id === d.batchId);
    return !batch || batch.actor === user?.username || batch.actor === "kahawa_exports";
  });

  const compliant = docs.filter(d => d.status === "approved" || d.status === "submitted").length;
  const avgScore = docs.length ? Math.round(docs.reduce((s, d) => s + d.complianceScore, 0) / docs.length) : 0;

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-warm-muted hover:text-ink text-sm transition-colors mb-1">
            <ArrowLeft size={15} /> Dashboard
          </button>
          <h1 className="text-xl font-bold text-ink">EUDR Documents</h1>
          <p className="text-sm text-warm-text">EU Deforestation Regulation due diligence statements</p>
        </div>
        <button onClick={() => setShowGenerate(true)}
          className="flex items-center gap-2 bg-gold hover:bg-gold-mid text-ink font-semibold px-4 py-2.5 rounded-lg text-sm transition-all">
          <Shield size={16} /> Generate new document
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          ["Total documents", docs.length, "All time"],
          ["Compliant", compliant, "Approved or submitted"],
          ["Avg compliance score", `${avgScore}%`, "Across all documents"],
          ["Risk level", "Negligible", "All batches assessed"],
        ].map(([label, value, sub]) => (
          <div key={label} className="bg-white border border-warm-border rounded-xl p-5">
            <div className="text-2xl font-bold text-ink">{value}</div>
            <div className="text-xs font-semibold text-warm-text mt-1">{label}</div>
            <div className="text-xs text-warm-muted mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {showGenerate && <GenerateForm onClose={() => setShowGenerate(false)} />}

      <div className="space-y-4">
        {docs.map(doc => {
          const batch = BATCHES.find(b => b.id === doc.batchId);
          return (
            <EudrDocCard key={doc.id} doc={doc} batch={batch}
              expanded={expanded === doc.id}
              onToggle={() => setExpanded(expanded === doc.id ? null : doc.id)} />
          );
        })}
        {docs.length === 0 && (
          <div className="text-center py-16 bg-white border border-warm-border rounded-xl">
            <Shield size={32} className="text-warm-muted mx-auto mb-3" />
            <h3 className="font-semibold text-ink mb-2">No EUDR documents yet</h3>
            <p className="text-sm text-warm-text max-w-sm mx-auto mb-4">Generate your first due diligence statement for an export batch.</p>
            <button onClick={() => setShowGenerate(true)}
              className="bg-gold hover:bg-gold-mid text-ink font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 mx-auto">
              <Shield size={15} /> Generate first document
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
