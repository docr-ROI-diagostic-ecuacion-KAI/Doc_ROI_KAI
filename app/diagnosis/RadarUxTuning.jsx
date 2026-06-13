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
        grid-template-columns: minmax(0, 1.12fr) minmax(250px, .88fr) !important;
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

      .docroi-radar-premium > div:not(.docroi-radar-summary) > div:nth-child(2) b {
        color: #003b5c !important;
        font-size: 12.5px !important;
      }

      @media (max-width: 900px) {
        .docroi-radar-premium,
        .docroi-radar-premium > div:not(.docroi-radar-summary) > div:first-child,
        .docroi-radar-premium > div:not(.docroi-radar-summary) > div:nth-child(2) {
          padding: 14px !important;
        }

        .docroi-radar-summary,
        .docroi-radar-premium > div:not(.docroi-radar-summary) {
          grid-template-columns: 1fr !important;
        }
      }

      @media print {
        .docroi-radar-premium {
          box-shadow: none !important;
          padding: 14px !important;
        }

        .docroi-radar-premium > div:not(.docroi-radar-summary) {
          grid-template-columns: 1.1fr .9fr !important;
          gap: 12px !important;
        }

        .docroi-radar-summary-card p {
          font-size: 10.5px !important;
        }
      }
    `}</style>
  );
}
