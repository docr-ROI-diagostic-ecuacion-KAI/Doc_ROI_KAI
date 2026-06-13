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
                }
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', run);
                } else {
                  run();
                }
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

                  if (!prepared) {
                    prepared = true;
                    setTimeout(run, 250);
                    setTimeout(run, 900);
                  }
                }

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
