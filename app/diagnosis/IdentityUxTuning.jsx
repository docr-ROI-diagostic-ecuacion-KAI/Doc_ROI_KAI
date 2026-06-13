'use client';

import { useEffect } from 'react';

const NEW_CONSENT_TEXT = 'Acepto que Doc ROI trate estos datos para generar el diagnostico KAI·ROI y conservar la trazabilidad tecnica del resultado. Los datos se usan para el analisis del diagnostico y no es necesario facilitar email.';

function relabelField(label, nextText) {
  const firstTextNode = Array.from(label.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  if (firstTextNode) {
    firstTextNode.textContent = nextText;
  } else {
    label.insertBefore(document.createTextNode(nextText), label.firstChild);
  }
}

function tuneIdentityStep() {
  const labels = Array.from(document.querySelectorAll('.field label'));
  const emailLabel = labels.find((label) => /^\s*Email\s*/i.test(label.textContent || ''));

  if (emailLabel && emailLabel.dataset.docroiTerritoryTuned !== 'true') {
    emailLabel.dataset.docroiTerritoryTuned = 'true';
    relabelField(emailLabel, 'Pais o territorio');
    const input = emailLabel.querySelector('input');
    if (input) {
      input.type = 'text';
      input.inputMode = 'text';
      input.autocomplete = 'country-name';
      input.placeholder = 'Espana, Mexico, Colombia, USA...';
      input.setAttribute('aria-label', 'Pais o territorio');
    }
  }

  const consent = document.querySelector('.field.consent span');
  if (consent && consent.dataset.docroiConsentTuned !== 'true') {
    const privacyLink = consent.querySelector('a');
    consent.dataset.docroiConsentTuned = 'true';
    consent.textContent = `${NEW_CONSENT_TEXT} `;
    if (privacyLink) {
      privacyLink.textContent = 'Politica de privacidad';
      consent.appendChild(privacyLink);
    }
  }
}

export default function IdentityUxTuning() {
  useEffect(() => {
    tuneIdentityStep();
    const observer = new MutationObserver(tuneIdentityStep);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
