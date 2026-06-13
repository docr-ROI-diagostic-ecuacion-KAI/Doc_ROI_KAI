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
                  cta.textContent = 'Ecuación KAI';
                  cta.setAttribute('href', 'https://docroi.marketing/kai-equation/');
                  cta.setAttribute('aria-label', 'Ecuación KAI');
                  cta.setAttribute('target', '_blank');
                  cta.setAttribute('rel', 'noopener noreferrer');
                }
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', run);
                } else {
                  run();
                }
                setTimeout(run, 250);
                setTimeout(run, 900);
                new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
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
                    input.setAttribute('autocomplete', 'off');
                  });

                  var consent = document.querySelector('.field.consent input[type="checkbox"]');
                  if (consent && !consent.checked) {
                    consent.click();
                  }

                  convertCustomerEquityToMultiples();

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
                    var percent = Number(raw.replace('%', '').replace('.', '').replace(',', '.'));
                    if (!Number.isFinite(percent)) return;
                    value.textContent = formatMultiple(percent / 100);
                    if (label === 'Customer Equity') {
                      note.textContent = 'Veces que el ROI estimado queda por encima del WACC. Ejemplo: 3,5x significa 3,5 veces sobre la referencia financiera.';
                    } else if (note) {
                      note.textContent = 'Suma ejecutiva de unidades evaluadas, expresada como veces sobre WACC en esta version del diagnostico.';
                    }
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
                }, true);

                var observer = new MutationObserver(convertCustomerEquityToMultiples);
                observer.observe(document.documentElement, { childList: true, subtree: true });

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
