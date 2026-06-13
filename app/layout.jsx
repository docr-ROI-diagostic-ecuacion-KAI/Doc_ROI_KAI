import './globals.css';

export const metadata = {
  title: 'Doc ROI · KAI Diagnosis System',
  description: 'Executive KAI ROI diagnosis for Customer Equity and data monetization.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <style>{`.siteHeader .navLinks a:not(.navCta){display:none!important;}`}</style>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function normalizeDocRoiHeader(){
                function run(){
                  var cta = document.querySelector('.siteHeader .navCta');
                  if (!cta) return;
                  if (cta.textContent !== 'Ecuación KAI') cta.textContent = 'Ecuación KAI';
                  if (cta.getAttribute('href') !== 'https://docroi.marketing/kai-equation/') cta.setAttribute('href', 'https://docroi.marketing/kai-equation/');
                  if (cta.getAttribute('aria-label') !== 'Ecuación KAI') cta.setAttribute('aria-label', 'Ecuación KAI');
                  if (cta.getAttribute('target') !== '_blank') cta.setAttribute('target', '_blank');
                  if (cta.getAttribute('rel') !== 'noopener noreferrer') cta.setAttribute('rel', 'noopener noreferrer');
                }
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', run);
                } else {
                  run();
                }
                setTimeout(run, 250);
                setTimeout(run, 900);
              })();

              (function prepareDiagnosisSession(){
                if (!location.pathname || !location.pathname.startsWith('/diagnosis')) return;
                try {
                  sessionStorage.removeItem('docroi-kai-diagnosis');
                  localStorage.removeItem('docroi-kai-diagnosis');
                } catch (e) {}

                var prepared = false;
                function run(){
                  document.querySelectorAll('.field input').forEach(function(input){
                    if (input.getAttribute('autocomplete') !== 'off') input.setAttribute('autocomplete', 'off');
                  });

                  var consent = document.querySelector('.field.consent input[type="checkbox"]');
                  if (consent && !consent.checked) {
                    consent.click();
                  }

                  convertCustomerEquityToMultiples();
                  explainMetricCards();

                  if (!prepared) {
                    prepared = true;
                    setTimeout(run, 250);
                    setTimeout(run, 900);
                  }
                }

                function formatMultiple(value){
                  if (!Number.isFinite(value)) return 'no calculable';
                  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(value) + 'x';
                }

                function readNumber(text){
                  if (!text) return null;
                  var raw = String(text).trim().replace(/[−–—]/g, '-');
                  var cleaned = raw.replace(/[^0-9,.-]/g, '');
                  if (!cleaned) return null;
                  var hasComma = cleaned.indexOf(',') > -1;
                  var hasDot = cleaned.indexOf('.') > -1;
                  if (hasComma && hasDot) {
                    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
                  } else if (hasComma) {
                    cleaned = cleaned.replace(',', '.');
                  }
                  var n = Number(cleaned);
                  return Number.isFinite(n) ? n : null;
                }

                function readMetric(label){
                  var found = null;
                  document.querySelectorAll('.metrics .card').forEach(function(card){
                    var title = card.querySelector('strong');
                    var value = card.querySelector('span');
                    if (title && value && title.textContent.trim() === label) found = value.textContent.trim();
                  });
                  return found;
                }

                function convertCustomerEquityToMultiples(){
                  document.querySelectorAll('.metrics .card').forEach(function(card){
                    var title = card.querySelector('strong');
                    var value = card.querySelector('span');
                    var note = card.querySelector('p.small');
                    if (!title || !value) return;
                    var label = title.textContent.trim();
                    if (label !== 'Customer Equity' && label !== 'Customer Equity empresa') return;
                    var raw = value.textContent.trim();
                    if (!raw || raw.indexOf('%') === -1) return;
                    var percent = readNumber(raw);
                    if (!Number.isFinite(percent)) return;
                    value.textContent = formatMultiple(percent / 100);
                    if (label === 'Customer Equity' && note) {
                      note.textContent = percent < 0 ? 'Veces que el ROI estimado queda por debajo del WACC. Un valor negativo indica que el escenario todavia no crea Customer Equity.' : 'Veces que el ROI estimado queda por encima del WACC. Ejemplo: 3,5x significa 3,5 veces sobre la referencia financiera.';
                    } else if (note) {
                      note.textContent = percent < 0 ? 'Suma ejecutiva negativa de las unidades evaluadas: el escenario todavia no supera la referencia financiera.' : 'Suma ejecutiva de unidades evaluadas, expresada como veces sobre WACC en esta version del diagnostico.';
                    }
                  });
                }

                function explanationFor(label, rawValue){
                  var kai = readNumber(readMetric('Potencial de activacion'));
                  var data = readNumber(readMetric('Inteligencia de datos'));
                  var spo = readNumber(readMetric('Orquestacion cliente-oferta'));
                  var md = readNumber(readMetric('Margen diagnosticado'));
                  var maturity = readNumber(readMetric('Madurez ejecutiva'));
                  var ce = rawValue && rawValue.indexOf('x') > -1 ? readNumber(rawValue) : null;

                  if (label === 'Potencial de activacion') {
                    if (kai !== null && kai < 1) return 'Sale bajo porque KAI·ROI es multiplicativo: si una capacidad es débil, reduce todo el resultado. Suele venir de datos, SPO, productividad o cartera poco conectados.';
                    if (kai !== null && kai < 5) return 'Hay base, pero todavía no toda la cadena convierte decisión, dato y ejecución en valor. Una mejora pequeña en varias capacidades puede mover mucho el resultado.';
                    return 'El sistema muestra buena capacidad de activación: las respuestas indican que la organización ya conecta mejor decisión, datos y ejecución.';
                  }
                  if (label === 'Inteligencia de datos') {
                    if (data !== null && data <= 60) return 'El dato todavía ayuda solo de forma parcial. Hay señales útiles, pero aún falta convertirlas en decisiones repetibles, priorización y acciones comerciales conectadas.';
                    return 'El dato ya empieza a trabajar para la dirección. La oportunidad está en automatizarlo y llevarlo a decisiones repetibles.';
                  }
                  if (label === 'Orquestacion cliente-oferta') {
                    if (spo !== null && spo < 40) return 'Este valor baja cuando comportamiento cliente, rentabilidad de oferta o satisfacción no están bien conectados. Si una de esas piezas falla, SPO cae mucho.';
                    return 'Clientes, oferta y satisfacción están razonablemente conectados. El siguiente paso es usarlo para priorizar cartera y acciones.';
                  }
                  if (label === 'Margen diagnosticado') {
                    return 'Este importe viene de lo declarado como ingresos/margen potencial y eficiencia capturable. No es promesa: es la base económica sobre la que la fórmula calcula valor activable.';
                  }
                  if (label === 'Customer Equity') {
                    if (ce !== null && ce < 0) return 'Sale negativo porque el valor activado por la fórmula es muy pequeño frente al coste y no llega a superar el WACC. En este caso pesan especialmente un KAI activable bajo, SPO débil y una madurez ejecutiva todavía parcial.';
                    if (ce !== null && ce < 1) return 'Es positivo, pero todavía bajo: el ROI supera el WACC, aunque con poco margen. La mejora suele venir de subir KAI, aumentar margen capturable o controlar coste.';
                    if (ce !== null && ce < 3) return 'El resultado ya supera la referencia financiera. Probablemente ayudan un coste razonable, un WACC no demasiado exigente y margen activable suficiente.';
                    return 'Resultado fuerte: el ROI estimado queda varias veces por encima del WACC. Suele explicarse por alto margen activable, coste controlado y una cadena KAI suficientemente conectada.';
                  }
                  if (label === 'Customer Equity empresa') {
                    if (ce !== null && ce < 0) return 'Como esta beta evalúa una unidad principal, la lectura de empresa replica ese Customer Equity negativo. Al añadir clientes o segmentos, este dato mostrará qué partes de la cartera crean valor y cuáles lo destruyen.';
                    return 'Resume el Customer Equity de las unidades evaluadas. En esta beta hay una unidad principal; cuando añadamos clientes o segmentos, aquí se verá la suma real de cartera.';
                  }
                  if (label === 'Cartera positiva') {
                    return 'Indica qué parte de la cartera evaluada crea Customer Equity positivo. Aquí aparece 0% porque la unidad analizada no supera todavía la referencia financiera.';
                  }
                  if (label === 'Madurez ejecutiva') {
                    if (maturity !== null && maturity < 3) return 'La madurez sale baja porque varias respuestas están en zona inicial o parcial. No es un juicio: señala dónde ordenar decisiones, datos y ejecución.';
                    if (maturity !== null && maturity < 4) return 'Hay una base ejecutiva razonable, pero todavía con capacidades a medio construir. El foco es convertir práctica en sistema.';
                    return 'La madurez directiva es sólida. El reto no es empezar, sino escalar, automatizar y medir impacto económico.';
                  }
                  return 'Lectura orientativa del indicador para explicar qué está empujando el resultado.';
                }

                function explainMetricCards(){
                  document.querySelectorAll('.metrics .card').forEach(function(card){
                    var title = card.querySelector('strong');
                    var value = card.querySelector('span');
                    if (!title || !value) return;
                    var label = title.textContent.trim();
                    var comment = card.querySelector('.metricComment');
                    if (!comment) {
                      comment = document.createElement('div');
                      comment.className = 'metricComment';
                      comment.style.cssText = 'margin-top:12px;padding:12px 13px;border-top:1px solid rgba(199,206,216,.72);border-radius:14px;background:#F6F7F9;color:#111827;font-size:13px;line-height:1.55;';
                      card.appendChild(comment);
                    }
                    comment.innerHTML = '<b style="display:block;color:#003B5C;margin-bottom:4px;">Lectura simple</b>' + explanationFor(label, value.textContent.trim());
                  });
                }

                function scrollToCabinet(){
                  var panel = document.querySelector('.panel.form');
                  if (!panel) return;
                  var header = document.querySelector('.siteHeader');
                  var headerHeight = header ? header.offsetHeight : 0;
                  var target = panel.getBoundingClientRect().top + window.scrollY - headerHeight - 18;
                  window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
                }

                document.addEventListener('click', function(event){
                  var button = event.target && event.target.closest ? event.target.closest('.actions button') : null;
                  if (!button || button.disabled) return;
                  setTimeout(scrollToCabinet, 90);
                  setTimeout(scrollToCabinet, 260);
                  setTimeout(function(){ convertCustomerEquityToMultiples(); explainMetricCards(); }, 500);
                  setTimeout(function(){ convertCustomerEquityToMultiples(); explainMetricCards(); }, 1200);
                }, true);

                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', run);
                } else {
                  run();
                }
              })();
            `
          }}
        />
      </body>
    </html>
  );
}
