'use client';

import { useEffect } from 'react';

function readRadarValues(svg) {
  const values = Array.from(svg.querySelectorAll('g text'))
    .map((node) => Number(node.textContent || 0))
    .filter((value) => Number.isFinite(value) && value >= 1 && value <= 5);

  if (!values.length) return { average: null, lowest: null };

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const lowest = Math.min(...values);
  return { average, lowest };
}

function tuneRadarCard() {
  const svg = document.querySelector('svg[aria-label="Radar de variables KAI ROI"]');
  if (!svg) return;

  const card = svg.closest('.card');
  if (!card || card.dataset.docroiRadarTuned === 'true') return;

  card.dataset.docroiRadarTuned = 'true';
  card.classList.add('docroi-radar-premium');

  const resultPanel = document.querySelector('.panel.result');
  if (resultPanel && !resultPanel.querySelector('.docroi-print-report-header')) {
    const printHeader = document.createElement('div');
    printHeader.className = 'docroi-print-report-header';
    printHeader.innerHTML = `
      <img src="https://docroi.marketing/wp-content/uploads/2026/05/Logo_Negro_DoC_ROI.jpg" alt="Doc ROI" />
      <div>
        <strong>Diagnostico KAI·ROI</strong>
        <span>Informe ejecutivo de Customer Equity</span>
      </div>`;
    resultPanel.insertBefore(printHeader, resultPanel.firstChild);
  }

  const { average, lowest } = readRadarValues(svg);
  const summary = document.createElement('div');
  summary.className = 'docroi-radar-summary';
  summary.innerHTML = `
    <div class="docroi-radar-summary-card">
      <span>Alcance diagnosticado</span>
      <strong>10 capacidades KAI·ROI</strong>
      <p>La lectura mantiene el alcance completo de la ecuacion: decision, dato, SPO, productividad y cartera.</p>
    </div>
    <div class="docroi-radar-summary-card">
      <span>Madurez media</span>
      <strong>${average === null ? 'Pendiente' : `${average.toFixed(1)}/5`}</strong>
      <p>Resume la posicion ejecutiva sin sustituir la interpretacion de cada variable.</p>
    </div>
    <div class="docroi-radar-summary-card">
      <span>Prioridad visual</span>
      <strong>${lowest === null ? 'Pendiente' : `${lowest}/5`}</strong>
      <p>Los ejes mas cercanos al centro senalan donde conviene actuar primero.</p>
    </div>`;

  const grid = Array.from(card.children).find((child) => child.tagName === 'DIV');
  if (grid && !card.querySelector('.docroi-radar-summary')) {
    card.insertBefore(summary, grid);
  }

  const title = card.querySelector('strong');
  if (title && title.textContent?.includes('Radar KAI')) {
    title.textContent = 'Mapa ejecutivo de capacidades KAI·ROI';
  }

  const intro = svg.parentElement?.querySelector('p.small');
  if (intro) {
    intro.textContent = 'Vista directiva de las capacidades que alimentan el diagnostico. El objetivo no es leer una formula, sino identificar que palancas sostienen o frenan la creacion de Customer Equity.';
  }

  const panels = card.querySelectorAll(':scope > div:not(.docroi-radar-summary) > div');
  const quickReadPanel = panels?.[1];
  const variableTable = quickReadPanel ? Array.from(quickReadPanel.children).find((child) => child.tagName === 'DIV') : null;
  if (variableTable) {
    variableTable.classList.add('docroi-radar-variable-table');
    Array.from(variableTable.children).forEach((row) => row.classList.add('docroi-radar-variable-row'));
  }
}

export default function RadarUxTuning() {
  useEffect(() => {
    tuneRadarCard();
    const observer = new MutationObserver(tuneRadarCard);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <style jsx global>{`
      .docroi-print-report-header {
        display: none !important;
      }

      .docroi-radar-premium {
        border: 1px solid rgba(199, 206, 216, .9) !important;
        border-radius: 18px !important;
        background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%) !important;
        box-shadow: 0 18px 44px rgba(11, 15, 25, .08) !important;
        padding: 22px !important;
        break-inside: avoid !important;
      }

      .docroi-radar-premium > div:not(.docroi-radar-summary) {
        display: grid !important;
        grid-template-columns: minmax(0, 1.08fr) minmax(360px, .92fr) !important;
        gap: 20px !important;
        align-items: stretch !important;
      }

      .docroi-radar-premium > div:not(.docroi-radar-summary) > div:first-child,
      .docroi-radar-premium > div:not(.docroi-radar-summary) > div:nth-child(2) {
        border: 1px solid rgba(199, 206, 216, .82) !important;
        border-radius: 16px !important;
        background: #ffffff !important;
        padding: 18px !important;
      }

      .docroi-radar-premium > div:not(.docroi-radar-summary) > div:nth-child(2) {
        background: #f6f7f9 !important;
      }

      .docroi-radar-premium strong {
        color: #0b0f19 !important;
        font-size: 18px !important;
        letter-spacing: 0 !important;
        line-height: 1.25 !important;
      }

      .docroi-radar-premium p.small {
        color: #4b5563 !important;
        font-size: 13px !important;
        line-height: 1.65 !important;
        max-width: 760px !important;
      }

      .docroi-radar-summary {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 12px !important;
        margin: 2px 0 18px !important;
      }

      .docroi-radar-summary-card {
        border: 1px solid rgba(199, 206, 216, .86) !important;
        border-radius: 14px !important;
        background: #ffffff !important;
        padding: 14px 15px !important;
      }

      .docroi-radar-summary-card span {
        display: block !important;
        color: #6b7280 !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        letter-spacing: .08em !important;
        text-transform: uppercase !important;
        margin-bottom: 5px !important;
      }

      .docroi-radar-summary-card strong {
        display: block !important;
        color: #003b5c !important;
        font-size: 17px !important;
        font-weight: 900 !important;
        margin-bottom: 6px !important;
      }

      .docroi-radar-summary-card p {
        color: #4b5563 !important;
        font-size: 12.5px !important;
        line-height: 1.5 !important;
        margin: 0 !important;
      }

      .docroi-radar-premium svg {
        max-width: 500px !important;
        margin: 0 auto !important;
      }

      .docroi-radar-premium svg polygon[fill="rgba(29,140,255,.20)"] {
        fill: rgba(29, 140, 255, .12) !important;
        stroke: #003b5c !important;
        stroke-width: 2px !important;
      }

      .docroi-radar-premium svg g circle[fill="#0B0F19"] {
        r: 7px !important;
        fill: #003b5c !important;
        stroke: #ffffff !important;
        stroke-width: 2px !important;
      }

      .docroi-radar-premium svg g text {
        font-size: 8.5px !important;
        font-weight: 900 !important;
        fill: #ffffff !important;
      }

      .docroi-radar-premium svg > text,
      .docroi-radar-premium svg > text tspan {
        font-size: 10px !important;
        font-weight: 760 !important;
        letter-spacing: 0 !important;
      }

      .docroi-radar-premium svg > text tspan:first-child {
        fill: #111827 !important;
      }

      .docroi-radar-premium svg > text tspan:last-child {
        fill: #003b5c !important;
        font-weight: 800 !important;
      }

      .docroi-radar-premium > div:not(.docroi-radar-summary) > div:nth-child(2) * {
        font-size: 12.5px !important;
        line-height: 1.35 !important;
      }

      .docroi-radar-premium > div:not(.docroi-radar-summary) > div:nth-child(2) strong {
        color: #003b5c !important;
        font-size: 15px !important;
      }

      .docroi-radar-premium > div:not(.docroi-radar-summary) > div:nth-child(2) > p {
        margin-bottom: 10px !important;
      }

      .docroi-radar-variable-table {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 0 14px !important;
        margin-top: 8px !important;
        border-top: 1px solid rgba(199, 206, 216, .82) !important;
      }

      .docroi-radar-variable-row {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) auto !important;
        gap: 8px !important;
        align-items: center !important;
        min-height: 44px !important;
        padding: 9px 0 !important;
        border-top: 0 !important;
        border-bottom: 1px solid rgba(199, 206, 216, .72) !important;
      }

      .docroi-radar-variable-row span {
        color: #111827 !important;
        font-size: 12px !important;
        font-weight: 800 !important;
        line-height: 1.25 !important;
      }

      .docroi-radar-variable-row span span {
        color: #003b5c !important;
        display: inline !important;
        font-size: 11.5px !important;
        white-space: nowrap !important;
      }

      .docroi-radar-variable-row b {
        align-self: center !important;
        border: 1px solid rgba(0, 59, 92, .18) !important;
        border-radius: 999px !important;
        background: #ffffff !important;
        color: #003b5c !important;
        font-size: 11.5px !important;
        font-weight: 900 !important;
        padding: 4px 7px !important;
        white-space: nowrap !important;
      }

      @media (max-width: 900px) {
        .docroi-radar-premium,
        .docroi-radar-premium > div:not(.docroi-radar-summary) > div:first-child,
        .docroi-radar-premium > div:not(.docroi-radar-summary) > div:nth-child(2) {
          padding: 14px !important;
        }

        .docroi-radar-summary,
        .docroi-radar-premium > div:not(.docroi-radar-summary),
        .docroi-radar-variable-table {
          grid-template-columns: 1fr !important;
        }
      }

      @media print {
        .docroi-print-report-header {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 18px !important;
          background: #000000 !important;
          color: #ffffff !important;
          border-radius: 14px !important;
          padding: 14px 18px !important;
          margin: 0 0 16px !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          break-inside: avoid !important;
        }

        .docroi-print-report-header img {
          display: block !important;
          width: auto !important;
          height: 42px !important;
          object-fit: contain !important;
        }

        .docroi-print-report-header div {
          text-align: right !important;
        }

        .docroi-print-report-header strong {
          display: block !important;
          color: #ffffff !important;
          font-size: 14px !important;
          font-weight: 900 !important;
          line-height: 1.25 !important;
        }

        .docroi-print-report-header span {
          display: block !important;
          color: #c7ced8 !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          line-height: 1.35 !important;
          margin-top: 2px !important;
        }

        .docroi-radar-premium {
          box-shadow: none !important;
          padding: 14px !important;
        }

        .docroi-radar-premium > div:not(.docroi-radar-summary) {
          grid-template-columns: 1.05fr .95fr !important;
          gap: 12px !important;
        }

        .docroi-radar-summary-card p {
          font-size: 10.5px !important;
        }

        .docroi-radar-variable-row {
          min-height: 34px !important;
          padding: 6px 0 !important;
        }
      }
    `}</style>
  );
}
