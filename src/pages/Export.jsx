import { useState } from 'react';
import { FileDown, FileJson, FileSpreadsheet, FileText, ArrowLeft, CheckCircle, Package, BarChart3, Shield, Target, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

const exportSections = [
  { id: 'overview', label: 'Executive Summary', icon: FileText, desc: 'Company overview + market data' },
  { id: 'competitors', label: 'Competitor Profiles', icon: Target, desc: 'All competitors with details' },
  { id: 'comparison', label: 'Feature Comparison', icon: Layers, desc: 'Feature matrix with scores' },
  { id: 'swot', label: 'SWOT Analysis', icon: Shield, desc: 'Strengths, weaknesses, opportunities, threats' },
  { id: 'scoring', label: 'Scoring Rankings', icon: BarChart3, desc: 'Weighted scores and rankings' },
  { id: 'monopoly', label: 'Market Analysis', icon: Package, desc: 'HHI, market share, barriers' },
];

export default function Export() {
  const competitors = useStore((s) => s.competitors);
  const features = useStore((s) => s.features);
  const featureScores = useStore((s) => s.featureScores);
  const monopoly = useStore((s) => s.monopoly);
  const marketOverview = useStore((s) => s.marketOverview);
  const currentResearchQuery = useStore((s) => s.currentResearchQuery);

  const [selectedSections, setSelectedSections] = useState(exportSections.map((s) => s.id));
  const [exporting, setExporting] = useState(false);
  const [lastExport, setLastExport] = useState(null);

  const toggleSection = (id) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedSections(exportSections.map((s) => s.id));
  const selectNone = () => setSelectedSections([]);

  // === EXPORT AS JSON ===
  const exportJSON = () => {
    setExporting(true);
    const data = buildExportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadFile(blob, `competitoriq-${slugify(currentResearchQuery || 'report')}.json`);
    setLastExport('JSON');
    setExporting(false);
  };

  // === EXPORT AS CSV ===
  const exportCSV = () => {
    setExporting(true);
    const csvContent = buildCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, `competitoriq-${slugify(currentResearchQuery || 'report')}.csv`);
    setLastExport('CSV');
    setExporting(false);
  };

  // === EXPORT AS HTML REPORT ===
  const exportHTML = () => {
    setExporting(true);
    const html = buildHTMLReport();
    const blob = new Blob([html], { type: 'text/html' });
    downloadFile(blob, `competitoriq-${slugify(currentResearchQuery || 'report')}.html`);
    setLastExport('HTML');
    setExporting(false);
  };

  // === PRINT PDF (via HTML) ===
  const exportPDF = () => {
    setExporting(true);
    const html = buildHTMLReport();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      setLastExport('PDF');
      setExporting(false);
    }, 500);
  };

  function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'report';
  }

  function buildExportData() {
    const data = {};
    if (selectedSections.includes('overview')) {
      data.overview = {
        query: currentResearchQuery,
        exportDate: new Date().toISOString(),
        market: marketOverview,
        totalCompetitors: competitors.length,
      };
    }
    if (selectedSections.includes('competitors')) {
      data.competitors = competitors.map((c) => ({
        name: c.name, industry: c.industry, founded: c.founded, hq: c.hq,
        employees: c.employees, description: c.description,
        estimatedRevenue: c.estimatedRevenue, marketShare: c.marketShare,
        score: c.score, status: c.status,
      }));
    }
    if (selectedSections.includes('comparison')) {
      data.featureComparison = {
        features: features.map((f) => f.name),
        scores: competitors.map((c) => ({
          competitor: c.name,
          features: features.map((f) => ({
            feature: f.name,
            score: featureScores[c.id]?.[f.id] || 'no',
          })),
        })),
      };
    }
    if (selectedSections.includes('swot')) {
      data.swotAnalysis = competitors.map((c) => ({
        competitor: c.name,
        strengths: c.strengths || [],
        weaknesses: c.weaknesses || [],
        opportunities: c.opportunities || [],
        threats: c.threats || [],
      }));
    }
    if (selectedSections.includes('scoring')) {
      data.scoring = competitors
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .map((c, i) => ({
          rank: i + 1, name: c.name, score: c.score,
          trend: c.trend, status: c.status,
        }));
    }
    if (selectedSections.includes('monopoly')) {
      data.marketAnalysis = {
        ...monopoly,
        marketOverview,
        competitorShares: competitors.map((c) => ({
          name: c.name, share: c.marketShare,
        })),
      };
    }
    return data;
  }

  function buildCSV() {
    const rows = [];
    // Header
    const featureNames = features.map((f) => f.name);
    rows.push([
      'Name', 'Industry', 'Founded', 'HQ', 'Score', 'Status', 'Market Share',
      'Strengths', 'Weaknesses', 'Opportunities', 'Threats',
      ...featureNames,
    ].join(','));
    // Data rows
    competitors.forEach((c) => {
      const row = [
        `"${c.name}"`, `"${c.industry || ''}"`, `"${c.founded || ''}"`,
        `"${c.hq || ''}"`, c.score || 0, `"${c.status || ''}"`,
        `"${c.marketShare || ''}"`,
        `"${(c.strengths || []).join('; ')}"`,
        `"${(c.weaknesses || []).join('; ')}"`,
        `"${(c.opportunities || []).join('; ')}"`,
        `"${(c.threats || []).join('; ')}"`,
        ...features.map((f) => `"${featureScores[c.id]?.[f.id] || 'no'}"`),
      ];
      rows.push(row.join(','));
    });
    return rows.join('\n');
  }

  function buildHTMLReport() {
    const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const sorted = [...competitors].sort((a, b) => (b.score || 0) - (a.score || 0));

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CompetitorIQ Report — ${currentResearchQuery || 'Analysis'}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e293b; line-height: 1.6; padding: 40px; max-width: 900px; margin: 0 auto; }
  h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
  h2 { font-size: 20px; font-weight: 700; margin: 32px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; color: #0f172a; }
  h3 { font-size: 15px; font-weight: 600; margin: 16px 0 8px; color: #334155; }
  p { margin-bottom: 8px; font-size: 14px; color: #475569; }
  .subtitle { color: #94a3b8; font-size: 14px; margin-bottom: 24px; }
  .meta { display: flex; gap: 24px; margin-bottom: 32px; }
  .meta-item { background: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; flex: 1; }
  .meta-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; }
  .meta-value { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
  th { background: #0f172a; color: #fff; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
  tr:nth-child(even) { background: #f8fafc; }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; }
  .badge-yes { background: #d1fae5; color: #065f46; }
  .badge-partial { background: #fef3c7; color: #92400e; }
  .badge-no { background: #fee2e2; color: #991b1b; }
  .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 12px 0; }
  .swot-box { padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; }
  .swot-box h4 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .swot-box ul { list-style: none; padding: 0; }
  .swot-box li { font-size: 13px; padding: 3px 0; color: #475569; }
  .swot-box li::before { content: '→ '; color: #94a3b8; }
  .strengths { background: #f0fdf4; } .strengths h4 { color: #16a34a; }
  .weaknesses { background: #fef2f2; } .weaknesses h4 { color: #dc2626; }
  .opportunities { background: #eff6ff; } .opportunities h4 { color: #2563eb; }
  .threats { background: #fffbeb; } .threats h4 { color: #d97706; }
  .rank { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; font-weight: 700; font-size: 13px; }
  .rank-1 { background: #fef3c7; color: #92400e; }
  .rank-2 { background: #e2e8f0; color: #475569; }
  .rank-3 { background: #fed7aa; color: #9a3412; }
  .rank-other { background: #f1f5f9; color: #94a3b8; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
  @media print { body { padding: 20px; } h2 { break-before: auto; } }
</style>
</head>
<body>
<h1>CompetitorIQ Report</h1>
<p class="subtitle">${currentResearchQuery || 'Competitive Analysis'} · Generated ${now}</p>

${selectedSections.includes('overview') ? `
<div class="meta">
  <div class="meta-item"><div class="meta-label">Competitors</div><div class="meta-value">${competitors.length}</div></div>
  <div class="meta-item"><div class="meta-label">Market Size</div><div class="meta-value">${marketOverview?.totalMarketSize || 'N/A'}</div></div>
  <div class="meta-item"><div class="meta-label">Growth Rate</div><div class="meta-value">${marketOverview?.growthRate || 'N/A'}</div></div>
  <div class="meta-item"><div class="meta-label">Market Type</div><div class="meta-value">${marketOverview?.marketType || 'N/A'}</div></div>
</div>
` : ''}

${selectedSections.includes('competitors') ? `
<h2>Competitor Profiles</h2>
<table>
  <tr><th>#</th><th>Name</th><th>Founded</th><th>HQ</th><th>Market Share</th><th>Score</th><th>Status</th></tr>
  ${sorted.map((c, i) => `<tr>
    <td><span class="rank ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}">${i + 1}</span></td>
    <td><strong>${c.name}</strong></td>
    <td>${c.founded || '—'}</td>
    <td>${c.hq || '—'}</td>
    <td>${c.marketShare || '—'}</td>
    <td><strong>${c.score || 0}</strong>/100</td>
    <td>${c.status || '—'}</td>
  </tr>`).join('')}
</table>
` : ''}

${selectedSections.includes('comparison') ? `
<h2>Feature Comparison</h2>
<table>
  <tr><th>Feature</th>${competitors.map((c) => `<th>${c.name}</th>`).join('')}</tr>
  ${features.map((f) => `<tr>
    <td><strong>${f.name}</strong></td>
    ${competitors.map((c) => {
      const score = featureScores[c.id]?.[f.id] || 'no';
      return `<td><span class="badge badge-${score}">${score === 'yes' ? '✓ Yes' : score === 'partial' ? '◐ Partial' : '✗ No'}</span></td>`;
    }).join('')}
  </tr>`).join('')}
</table>
` : ''}

${selectedSections.includes('swot') ? `
<h2>SWOT Analysis</h2>
${competitors.slice(0, 3).map((c) => `
<h3>${c.name}</h3>
<div class="swot-grid">
  <div class="swot-box strengths"><h4>Strengths</h4><ul>${(c.strengths || []).map((s) => `<li>${s}</li>`).join('') || '<li>No data</li>'}</ul></div>
  <div class="swot-box weaknesses"><h4>Weaknesses</h4><ul>${(c.weaknesses || []).map((s) => `<li>${s}</li>`).join('') || '<li>No data</li>'}</ul></div>
  <div class="swot-box opportunities"><h4>Opportunities</h4><ul>${(c.opportunities || []).map((s) => `<li>${s}</li>`).join('') || '<li>No data</li>'}</ul></div>
  <div class="swot-box threats"><h4>Threats</h4><ul>${(c.threats || []).map((s) => `<li>${s}</li>`).join('') || '<li>No data</li>'}</ul></div>
</div>
`).join('')}
` : ''}

${selectedSections.includes('scoring') ? `
<h2>Scoring Rankings</h2>
<table>
  <tr><th>Rank</th><th>Competitor</th><th>Score</th><th>Trend</th><th>Status</th></tr>
  ${sorted.map((c, i) => `<tr>
    <td><span class="rank ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}">${i + 1}</span></td>
    <td><strong>${c.name}</strong></td>
    <td><strong>${c.score || 0}</strong>/100</td>
    <td>${c.trend || '—'}</td>
    <td>${c.status || '—'}</td>
  </tr>`).join('')}
</table>
` : ''}

${selectedSections.includes('monopoly') ? `
<h2>Market Analysis</h2>
<table>
  <tr><th>Metric</th><th>Value</th></tr>
  <tr><td>HHI Score</td><td><strong>${monopoly?.hhi || 'N/A'}</strong></td></tr>
  <tr><td>Concentration</td><td>${monopoly?.concentrationLevel || 'N/A'}</td></tr>
  <tr><td>Dominant Player</td><td>${monopoly?.dominantPlayer || 'N/A'} (${monopoly?.dominantPlayerShare || 'N/A'})</td></tr>
  <tr><td>Market Trend</td><td>${monopoly?.marketTrend || 'N/A'}</td></tr>
</table>
<h3>Barriers to Entry</h3>
<ul style="padding-left:20px;margin:8px 0">${(monopoly?.barriers || []).map((b) => `<li style="font-size:13px;color:#475569;padding:2px 0">${b}</li>`).join('')}</ul>
<h3>Disruption Opportunities</h3>
<ul style="padding-left:20px;margin:8px 0">${(monopoly?.disruptionOpportunities || []).map((d) => `<li style="font-size:13px;color:#475569;padding:2px 0">${d}</li>`).join('')}</ul>
` : ''}

<div class="footer">
  Generated by CompetitorIQ · ${now} · Powered by Wikipedia + Curated Database
</div>
</body>
</html>`;
  }

  return (
    <div className="max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Export & Reports</h1>
          <p className="text-sm text-slate-400 mt-1">
            Download your competitive analysis in multiple formats
            {currentResearchQuery && <span> · <strong>{currentResearchQuery}</strong></span>}
          </p>
        </div>
      </div>

      {/* Select Sections */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Include in export</span>
          <div className="flex gap-2">
            <button onClick={selectAll} className="text-xs text-blue-500 hover:underline">Select all</button>
            <span className="text-xs text-slate-300">·</span>
            <button onClick={selectNone} className="text-xs text-slate-400 hover:underline">None</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {exportSections.map((section) => {
            const isSelected = selectedSections.includes(section.id);
            return (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-blue-100' : 'bg-slate-100'}`}>
                  <section.icon size={15} className={isSelected ? 'text-blue-500' : 'text-slate-400'} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                    {section.label}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{section.desc}</div>
                </div>
                {isSelected && <CheckCircle size={16} className="text-blue-500 ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Buttons */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 mb-5">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Export format</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={exportPDF}
            disabled={exporting || selectedSections.length === 0}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 transition-all disabled:opacity-40"
          >
            <FileText size={24} className="text-red-500" />
            <span className="text-sm font-semibold text-red-700">PDF</span>
            <span className="text-[10px] text-red-400">Print to PDF</span>
          </button>

          <button
            onClick={exportHTML}
            disabled={exporting || selectedSections.length === 0}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all disabled:opacity-40"
          >
            <FileText size={24} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700">HTML</span>
            <span className="text-[10px] text-blue-400">Web report</span>
          </button>

          <button
            onClick={exportCSV}
            disabled={exporting || selectedSections.length === 0}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-all disabled:opacity-40"
          >
            <FileSpreadsheet size={24} className="text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700">CSV</span>
            <span className="text-[10px] text-emerald-400">Spreadsheet</span>
          </button>

          <button
            onClick={exportJSON}
            disabled={exporting || selectedSections.length === 0}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-violet-200 bg-violet-50 hover:bg-violet-100 transition-all disabled:opacity-40"
          >
            <FileJson size={24} className="text-violet-500" />
            <span className="text-sm font-semibold text-violet-700">JSON</span>
            <span className="text-[10px] text-violet-400">Raw data</span>
          </button>
        </div>

        {lastExport && (
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
            <CheckCircle size={14} />
            {lastExport} exported successfully! Check your downloads folder.
          </div>
        )}

        {selectedSections.length === 0 && (
          <div className="mt-4 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
            Select at least one section above to export.
          </div>
        )}
      </div>

      {/* Preview Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Export preview</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-xl font-bold text-slate-700">{competitors.length}</div>
            <div className="text-xs text-slate-400">Competitors</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-xl font-bold text-slate-700">{features.length}</div>
            <div className="text-xs text-slate-400">Features tracked</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-xl font-bold text-slate-700">{selectedSections.length}</div>
            <div className="text-xs text-slate-400">Sections selected</div>
          </div>
        </div>
      </div>
    </div>
  );
}
