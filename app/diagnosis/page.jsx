'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Download, Mail } from 'lucide-react';

const SOLUTION_BASE = 'https://docroi.marketing/doc-roi-consultation-2/';
const PRIVACY_URL = 'https://docroi.marketing/politica-de-privacidad/';
const RGPD_TEXT = 'Acepto que Doc ROI trate mis datos para generar el diagnostico KAI·ROI, conservar la trazabilidad del resultado y contactarme con recomendaciones o acciones comerciales relacionadas con las soluciones sugeridas. Puedo retirar mi consentimiento en cualquier momento.';

const LEVELS = {
  1: ['Ausente', 'La organizacion no dispone todavia de una capacidad estructurada en esta dimension. La toma de decisiones depende de intuicion, esfuerzo manual o criterios dispersos.'],
  2: ['Debil', 'Existen practicas parciales, pero no estan sistematizadas ni conectadas con decisiones economicas. Hay riesgo de perdida de eficiencia, fuga de valor o dependencia de personas concretas.'],
  3: ['Parcial', 'La capacidad existe, pero todavia no es suficientemente consistente, medible o accionable. El negocio tiene base para evolucionar, pero aun no puede convertir esta capacidad en ventaja competitiva estable.'],
  4: ['Maduro', 'La organizacion trabaja esta dimension con criterios definidos, datos suficientes y procesos relativamente estables. La oportunidad esta en automatizar, conectar y escalar.'],
  5: ['Optimizado', 'La capacidad esta integrada en la toma de decisiones, se mide de forma continua y contribuye activamente a la creacion de valor economico.']
};
const SCALE_LABELS = { 1: 'Ausente', 2: 'Debil', 3: 'Parcial', 4: 'Maduro', 5: 'Optimizado' };

const QUESTIONS = [
  { id: 'strategy_alignment', variable: 'phi_i', area: 'Alineacion estrategica', title: '¿Tu empresa toma decisiones basadas en objetivos realmente compartidos?', explanation: 'Evalua hasta que punto direccion, ventas, marketing, operaciones y finanzas trabajan con prioridades comunes.', solutionName: 'Strategic Alignment', businessRisk: 'Las areas pueden generar actividad sin crear valor consistente ni proteger el ROI.', recommendation: 'Crear un marco unificado de objetivos, KPIs y prioridades ejecutivas.', solutionUrl: `${SOLUTION_BASE}?solution=strategic-alignment` },
  { id: 'decision_criteria', variable: 'u_i', area: 'Calidad de decision', title: '¿Las prioridades comerciales y operativas se deciden con criterios claros y repetibles?', explanation: 'Mide si la organizacion prioriza clientes, acciones e inversiones con reglas comprensibles y trazables.', solutionName: 'Decision Intelligence', businessRisk: 'La empresa puede depender demasiado de urgencias, intuicion o criterios cambiantes.', recommendation: 'Implantar un sistema simple de scoring ejecutivo y priorizacion de oportunidades.', solutionUrl: `${SOLUTION_BASE}?solution=decision-intelligence` },
  { id: 'customer_activation', variable: 'f_i', area: 'Relacion y activacion cliente', title: '¿La empresa mantiene una relacion activa y recurrente con sus clientes?', explanation: 'Observa si la relacion con el cliente se gestiona de forma continua, no solo en momentos de venta.', solutionName: 'Customer Activation', businessRisk: 'Se pueden perder recurrencia, oportunidades de expansion y senales tempranas de fuga.', recommendation: 'Diseñar recorridos de relacion y activacion con seguimiento comercial continuo.', solutionUrl: `${SOLUTION_BASE}?solution=customer-activation` },
  { id: 'data_intelligence', variable: 'psi_i', area: 'Inteligencia de datos', title: '¿Los datos de clientes y negocio se convierten realmente en informacion util para decidir?', explanation: 'Evalua si los datos estan disponibles, ordenados y transformados en informacion accionable para direccion.', solutionName: 'Data Intelligence', businessRisk: 'La organizacion puede tener datos, pero no capacidad real de convertirlos en decisiones economicas.', recommendation: 'Normalizar datos clave y conectarlos a cuadros de decision y activacion.', solutionUrl: `${SOLUTION_BASE}?solution=data-intelligence` },
  { id: 'rfm_behavior', variable: 'CC_i', area: 'Comportamiento cliente', title: '¿La empresa diferencia clientes segun frecuencia, valor y nivel de actividad?', explanation: 'Ayuda a saber si la empresa distingue clientes activos, recurrentes, dormidos o de alto valor.', solutionName: 'RFM Engine', businessRisk: 'Clientes con valor, frecuencia o riesgo muy distintos pueden recibir el mismo trato comercial.', recommendation: 'Activar una lectura RFM para priorizar acciones comerciales y proteger recurrencia.', solutionUrl: `${SOLUTION_BASE}?solution=rfm-engine` },
  { id: 'portfolio_value', variable: 'ABCD_i', area: 'Rentabilidad de oferta', title: '¿Tus productos o servicios estan clasificados segun rentabilidad e impacto real?', explanation: 'Mide si el portfolio se gestiona segun margen, demanda, valor estrategico y capacidad de crecimiento.', solutionName: 'ABCD Portfolio Engine', businessRisk: 'La empresa puede dedicar recursos a ofertas con bajo retorno o bajo impacto en Customer Equity.', recommendation: 'Clasificar productos y servicios por contribucion, demanda y prioridad comercial.', solutionUrl: `${SOLUTION_BASE}?solution=abcd-portfolio` },
  { id: 'customer_satisfaction', variable: 'NPS_i', area: 'Satisfaccion cliente', title: '¿La satisfaccion del cliente se mide y utiliza para mejorar decisiones?', explanation: 'Evalua si la experiencia del cliente se convierte en senal de riesgo, lealtad y oportunidad.', solutionName: 'CX/NPS System', businessRisk: 'La empresa puede reaccionar tarde ante insatisfaccion, fuga o deterioro de clientes valiosos.', recommendation: 'Conectar medicion de satisfaccion con alertas, segmentos y acciones comerciales.', solutionUrl: `${SOLUTION_BASE}?solution=cx-nps` },
  { id: 'spo_model', variable: 'SPO_operational_model', area: 'Modelo de priorizacion', title: '¿Existe una forma estructurada de priorizar clientes, oferta y acciones?', explanation: 'Evalua si la empresa conecta clientes, oferta, satisfaccion y rentabilidad en una misma logica de actuacion.', solutionName: 'SPO Model', businessRisk: 'Las senales pueden quedar dispersas y convertirse en informes, no en decisiones de negocio.', recommendation: 'Diseñar un modelo operativo SPO para orquestar prioridades comerciales.', solutionUrl: `${SOLUTION_BASE}?solution=spo-model`, operationalOnly: true },
  { id: 'productivity', variable: 'P_i', area: 'Productividad', title: '¿La organizacion mide realmente productividad y eficiencia operativa?', explanation: 'Mide si las decisiones se ejecutan con tiempos, recursos y eficiencia observables.', solutionName: 'Productivity OS', businessRisk: 'Buenas decisiones pueden perder impacto por friccion operativa, retrasos o baja eficiencia.', recommendation: 'Crear un tablero de productividad con SLAs, eficiencia y seguimiento de ejecucion.', solutionUrl: `${SOLUTION_BASE}?solution=productivity-os` },
  { id: 'portfolio_health', variable: 'Gamma_g_i_t', area: 'Salud de cartera', title: '¿La empresa monitoriza la salud y evolucion de su cartera de clientes?', explanation: 'Observa si la direccion entiende evolucion, riesgo, recurrencia y valor futuro de su cartera.', solutionName: 'Customer Equity Control', businessRisk: 'La empresa puede crecer en volumen mientras deteriora recurrencia, margen o valor futuro.', recommendation: 'Implantar un monitor de cartera orientado a Customer Equity, riesgo y evolucion temporal.', solutionUrl: `${SOLUTION_BASE}?solution=customer-equity-control` }
];

const STEPS = ['Identidad', 'Diagnostico C-Level', 'Impacto economico'];
const SCALE = [1, 2, 3, 4, 5];
const ECONOMIC_FIELDS = [
  ['Ingresos o margen potencial estimado', 'I_i_s', '100.000', true],
  ['Porcentaje estimado que podria capturarse', 'R_i_s', '25', false],
  ['Eficiencia economica potencial', 'E_i_s', '12.000', true],
  ['Porcentaje estimado de eficiencia capturable', 'Q_i_s', '30', false],
  ['Coste atribuible de la iniciativa', 'C_i', '18.000', true],
  ['Coste de capital o referencia financiera (%)', 'WACC_t', '14', false]
];

function parseNumber(value) { if (value === null || value === undefined || String(value).trim() === '') return null; return Number(String(value).replace(/\./g, '').replace(',', '.')); }
function asRate(value) { const n = parseNumber(value); return n === null || Number.isNaN(n) ? null : n / 100; }
function norm(value) { return value === null || value === undefined || value === '' ? null : Math.max(1, Math.min(5, Number(value))) / 5; }
function pct(value, decimals = 1) { return value === null || value === undefined || Number.isNaN(Number(value)) ? 'no calculable' : `${(Number(value) * 100).toFixed(decimals)}%`; }
function money(value) { return value === null || value === undefined || Number.isNaN(Number(value)) ? 'no calculable' : new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(value)); }
function formatThousands(value) { const digits = String(value || '').replace(/\D/g, ''); return digits ? new Intl.NumberFormat('es-ES').format(Number(digits)) : ''; }
function indicator(value) { return typeof value === 'number' && value > 0 ? 1 : 0; }
function priority(score) { if (score <= 1) return 'Critica'; if (score === 2) return 'Alta'; if (score === 3) return 'Media-alta'; if (score === 4) return 'Optimizacion'; return 'Escalado'; }
function band(kai) {
  if (kai === null) return ['No calculable', 'Hay variables pendientes; el sistema no convierte datos desconocidos en cero.'];
  if (kai < 0.0001) return ['Bloqueo critico', 'La arquitectura de activacion esta bloqueada en varios puntos y la capacidad real de monetizar valor es casi nula.'];
  if (kai < 0.0005) return ['Muy fragil', 'Existe una base minima, pero el sistema esta limitado por varios cuellos de botella simultaneos.'];
  if (kai < 0.002) return ['Emergente', 'Hay senales de capacidad, pero el valor todavia no se activa de forma consistente.'];
  if (kai < 0.0075) return ['Base operativa', 'La organizacion empieza a ser activable, aunque siguen existiendo debilidades relevantes.'];
  if (kai < 0.02) return ['Consistente', 'Existe una capacidad razonable de monetizacion, con margen claro de mejora.'];
  if (kai < 0.05) return ['Solido', 'La cadena funciona de forma bastante alineada y genera capacidad real de activacion.'];
  return ['Avanzado', 'La organizacion muestra una capacidad robusta, integrada y repetible para activar valor.'];
}

function buildVariableCard(q, score, context, globalScore) {
  const [levelLabel, levelText] = LEVELS[score];
  const weak = score <= 3;
  const sector = context.sector ? ` en el sector ${context.sector}` : '';
  const size = context.companySize ? `, con tamano ${context.companySize}` : '';
  const maturity = context.digitalMaturity ? ` y madurez digital ${context.digitalMaturity}` : '';
  return {
    ...q,
    raw: score,
    normalized: norm(score),
    levelLabel,
    executiveMeaning: `Tu diagnostico en ${q.area} es ${score}/5, nivel ${levelLabel}. ${levelText} Para una organizacion${sector}${size}${maturity}, esta lectura ayuda a entender como la empresa convierte decisiones en valor economico. Promedio operativo de respuestas: ${globalScore.toFixed(1)}/5.`,
    probableCause: weak ? 'La capacidad existe de forma incompleta, poco conectada o dependiente de criterios dispersos.' : 'Existe una base gobernable que puede escalarse con automatizacion y mejor trazabilidad.',
    recommendationText: weak ? `${q.recommendation} Prioridad de actuacion: ${priority(score)}.` : `${q.recommendation} En este caso se recomienda optimizar y escalar sin tono de alarma.`,
    priority: priority(score),
    reportTone: weak ? 'Area prioritaria de mejora' : 'Fortaleza actual'
  };
}

function comboInsights(score) {
  const items = [];
  if (score.rfm_behavior <= 2 && score.customer_satisfaction <= 2) items.push('La organizacion tiene limitada visibilidad tanto de satisfaccion como de comportamiento cliente, lo que dificulta priorizar relaciones de valor y proteger recurrencia.');
  if (score.portfolio_value <= 3 && score.productivity <= 3) items.push('La oferta y la eficiencia operativa aparecen debilitadas a la vez. Hay riesgo de dedicar recursos a productos, servicios o clientes con bajo retorno.');
  if (score.data_intelligence <= 3 && score.decision_criteria <= 3) items.push('La empresa puede disponer de datos, pero todavia no convertirlos en una disciplina clara de decision y priorizacion.');
  return items;
}

function calculate(company, email, context, answers, business) {
  const score = Object.fromEntries(QUESTIONS.map((q) => [q.id, Number(answers[q.id])]));
  const input = {
    phi_i: norm(score.strategy_alignment),
    u_i: norm(score.decision_criteria),
    f_i: norm(score.customer_activation),
    DataActivation_i: norm(score.data_intelligence),
    I_net_i: norm(score.data_intelligence),
    CC_i: norm(score.rfm_behavior),
    ABCD_i: norm(score.portfolio_value),
    NPS_i: norm(score.customer_satisfaction),
    P_i: norm(score.productivity),
    Gamma_g_i_t: norm(score.portfolio_health),
    SPO_operational_model: norm(score.spo_model),
    C_i: parseNumber(business.C_i),
    WACC_t: asRate(business.WACC_t)
  };
  input.psi_i = input.DataActivation_i !== null && input.I_net_i !== null ? (input.DataActivation_i + input.I_net_i) / 2 : null;
  input.SPO_i = [input.CC_i, input.ABCD_i, input.NPS_i].every((v) => v !== null) ? input.CC_i * input.ABCD_i * input.NPS_i : null;
  input.scenarios = [{ s: 's1', I_i_s: parseNumber(business.I_i_s), R_i_s: asRate(business.R_i_s), E_i_s: parseNumber(business.E_i_s), Q_i_s: asRate(business.Q_i_s), status: 'declared' }];

  const kaiParts = [input.phi_i, input.u_i, input.f_i, input.psi_i, input.SPO_i, input.P_i, input.Gamma_g_i_t];
  const KAI_i_star = kaiParts.every((v) => v !== null) ? kaiParts.reduce((a, b) => a * b, 1) : null;
  const MD_i = input.scenarios.every((s) => [s.I_i_s, s.R_i_s, s.E_i_s, s.Q_i_s].every((v) => v !== null && !Number.isNaN(v))) ? input.scenarios.reduce((sum, s) => sum + (s.I_i_s * s.R_i_s + s.E_i_s * s.Q_i_s), 0) : null;
  const VA_i = KAI_i_star !== null && MD_i !== null ? KAI_i_star * MD_i : null;
  const ROI_i = VA_i !== null && input.C_i !== null && input.C_i !== 0 ? (VA_i - input.C_i) / input.C_i : null;
  const CE_i = ROI_i !== null && input.WACC_t !== null && input.WACC_t !== 0 ? (ROI_i - input.WACC_t) / input.WACC_t : null;
  const CE_units = [CE_i];
  const CE_empresa = CE_units.every((v) => v !== null) ? CE_units.reduce((sum, v) => sum + v, 0) : null;
  const V_percent_CE = CE_units.every((v) => v !== null) ? (100 / CE_units.length) * CE_units.reduce((sum, v) => sum + indicator(v), 0) : null;
  const globalScore = QUESTIONS.reduce((sum, q) => sum + score[q.id], 0) / QUESTIONS.length;
  const variableCards = QUESTIONS.map((q) => buildVariableCard(q, score[q.id], context, globalScore));
  const weak = variableCards.filter((q) => q.raw <= 3).sort((a, b) => a.raw - b.raw);
  const b = band(KAI_i_star);
  return { company, email, context, score, input, out: { KAI_i_star, psi_i: input.psi_i, SPO_i: input.SPO_i, MD_i, VA_i, ROI_i, CE_i, CE_empresa, V_percent_CE, band: { name: b[0] }, interpretation: b[1], globalScore, variableCards, weak, combos: comboInsights(score), exportPayload: { company, email, context, score, normalized_inputs: input, calculated_outputs: { KAI_i_star, psi_i: input.psi_i, SPO_i: input.SPO_i, MD_i, VA_i, ROI_i, CE_i, CE_empresa, V_percent_CE }, destination_ready: ['Google Sheets', 'Looker Studio', 'n8n'] }, recommendation: weak.length ? `El diagnostico KAI·ROI identifica ${weak.length} capacidades en 3/5 o menos. La recomendacion es priorizarlas sin alterar la estructura formal de la ecuacion.` : 'El sistema muestra una base C-Level solida. El siguiente paso es escalar precision, automatizacion y control de Customer Equity manteniendo intacta la formula oficial.' } };
}

export default function DiagnosisPage() {
  const emptyAnswers = useMemo(() => Object.fromEntries(QUESTIONS.map((q) => [q.id, null])), []);
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [sector, setSector] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [digitalMaturity, setDigitalMaturity] = useState('');
  const [answers, setAnswers] = useState(emptyAnswers);
  const [business, setBusiness] = useState({ I_i_s: '', R_i_s: '', E_i_s: '', Q_i_s: '', C_i: '', WACC_t: '' });
  const [rgpd, setRgpd] = useState(false);
  const [result, setResult] = useState(null);
  const [saveState, setSaveState] = useState('');
  const current = STEPS[step];
  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  async function submit() {
    const missingQuestion = QUESTIONS.find((q) => !answers[q.id]);
    const missingBusiness = ECONOMIC_FIELDS.find(([, key]) => String(business[key] || '').trim() === '');
    if (missingQuestion) { alert('Falta responder una pregunta del diagnostico C-Level.'); setStep(1); return; }
    if (missingBusiness) { alert('Falta completar un dato economico. Los numeros grises son solo ejemplos, no valores guardados.'); setStep(2); return; }
    if (!rgpd) { alert('Para generar y guardar el diagnostico necesitamos tu consentimiento RGPD.'); setStep(0); return; }
    const rgpdConsent = { accepted: true, acceptedAt: new Date().toISOString(), text: RGPD_TEXT, legalBasis: 'consentimiento explicito RGPD para diagnostico y contacto comercial relacionado', privacyPolicyUrl: PRIVACY_URL };
    const r = calculate(company || 'Company', email, { sector, companySize, digitalMaturity }, answers, business);
    setResult(r);
    setSaveState('Guardando consentimiento y diagnostico...');
    try {
      const res = await fetch('/api/diagnosis', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ company: r.company, email: r.email, context: r.context, score: r.score, raw_answers: { answers, business, context: r.context, rgpdConsent }, normalized_inputs: r.input, calculated_outputs: r.out, variable_cards: r.out.variableCards, export_payload: r.out.exportPayload, rgpdConsent }) });
      const json = await res.json();
      setSaveState(json.ok ? 'Consentimiento RGPD y diagnostico guardados.' : 'Diagnostico generado. Falta configurar Supabase para guardar en BBDD.');
    } catch (e) { setSaveState('Diagnostico generado. No se pudo guardar todavia en BBDD.'); }
  }

  if (result) {
    const o = result.out;
    return <main className="page"><section className="hero"><div className="wrap"><div className="logo"><span>Doc ROI</span></div><p className="kicker">Doc ROI · informe ejecutivo · Customer Equity</p><h1 className="title">{result.company}</h1><p className="lead">{o.interpretation} Este informe no evalua personas: diagnostica madurez estructural, capacidad de decision y potencial de monetizacion del dato.</p><p className="small">{saveState}</p><div className="actions noPrint" style={{ justifyContent: 'flex-start', border: 0, paddingTop: 24 }}><button className="btn primary" onClick={() => window.print()}><Download size={16}/> Download PDF</button><a className="btn" href={SOLUTION_BASE}>Book consultation</a><button className="btn" onClick={() => alert('Solo se enviaran acciones comerciales porque existe consentimiento RGPD registrado.')}><Mail size={16}/> Send by email</button></div></div></section><section className="wrap"><div className="panel result"><div className="metrics"><Metric k="Potencial de activacion" v={pct(o.KAI_i_star, 3)} note="Capacidad estructural para convertir decision, dato y ejecucion en valor."/><Metric k="Inteligencia de datos" v={pct(o.psi_i)} note="Nivel combinado de activacion y calidad de informacion para decidir."/><Metric k="Orquestacion cliente-oferta" v={pct(o.SPO_i)} note="Lectura integrada de clientes, oferta y satisfaccion."/><Metric k="Margen diagnosticado" v={money(o.MD_i)} note="Dimension economica estimada del escenario analizado."/><Metric k="Customer Equity" v={pct(o.CE_i)} note="Exceso de retorno estimado frente a la referencia financiera."/><Metric k="Customer Equity empresa" v={pct(o.CE_empresa)} note="Suma de unidades evaluadas en esta version del diagnostico."/><Metric k="Cartera positiva" v={o.V_percent_CE === null ? 'no calculable' : `${o.V_percent_CE.toFixed(0)}%`} note="Porcentaje de unidades con Customer Equity positivo."/><Metric k="Madurez ejecutiva" v={`${o.globalScore.toFixed(1)}/5`} note="Lectura directiva de madurez; no sustituye la ecuacion formal."/></div><div className="card" style={{ marginTop: 18 }}><strong>Lectura ejecutiva integrada</strong><p>{o.recommendation}</p><p className="small">Los datos desconocidos no se convierten en cero; se consideran pendientes o no calculables.</p>{o.combos.map((t, i) => <p key={i}><b>Combinacion detectada:</b> {t}</p>)}</div><h2>Diagnostico ejecutivo por capacidad</h2>{o.variableCards.map((card) => <VariableCard key={card.id} card={card}/>)}</div></section></main>;
  }

  return <main className="page"><section className="hero"><div className="wrap grid"><div><div className="logo"><span>Doc ROI</span></div><p className="kicker">Doc ROI · diagnostico KAI·ROI</p><h1 className="title">Del dato a la decision. De la decision al ROI.</h1><p className="lead">Una conversacion ejecutiva para entender como tu organizacion convierte clientes, datos, decisiones y ejecucion en Customer Equity.</p><div className="visual"/></div><div className="panel form"><div className="stepHead"><div><p className="kicker" style={{ margin: 0 }}>Diagnosis cabinet</p><h2 className="stepTitle">{current}</h2></div><div className="progress"><span>{progress}%</span><div className="track"><div className="bar" style={{ width: `${progress}%` }}/></div></div></div>{current === 'Identidad' && <div className="fields"><Field label="Empresa" value={company} onChange={setCompany}/><Field label="Email" type="email" value={email} onChange={setEmail}/><Field label="Sector" value={sector} onChange={setSector}/><Field label="Tamano de empresa" value={companySize} onChange={setCompanySize} placeholder="pyme, mid-market, enterprise..."/><Field label="Madurez digital" value={digitalMaturity} onChange={setDigitalMaturity} placeholder="baja, media, alta..."/><label className="field consent"><input type="checkbox" checked={rgpd} onChange={(e) => setRgpd(e.target.checked)}/><span>{RGPD_TEXT} <a href={PRIVACY_URL} target="_blank">Politica de privacidad</a></span></label></div>}{current === 'Diagnostico C-Level' && QUESTIONS.map((q) => <QuestionCard key={q.id} question={q} value={answers[q.id]} onChange={(v) => setAnswers({ ...answers, [q.id]: v })}/>) }{current === 'Impacto economico' && <div className="fields">{ECONOMIC_FIELDS.map(([label, key, placeholder, isMoney]) => <Field key={key} label={label} type="text" inputMode="decimal" value={business[key]} placeholder={placeholder} onChange={(v) => setBusiness({ ...business, [key]: isMoney ? formatThousands(v) : v.replace(/[^0-9,.]/g, '') })}/>)}</div>}<div className="actions"><button className="btn" type="button" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}><ArrowLeft size={16}/> Back</button>{step < STEPS.length - 1 ? <button className="btn primary" type="button" onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}>Continue <ArrowRight size={16}/></button> : <button className="btn primary" type="button" onClick={submit}><CheckCircle2 size={16}/> Generate executive diagnosis</button>}</div><p className="small">Escala C-Level: 1 = ausente, 2 = debil, 3 = parcial, 4 = maduro, 5 = optimizado. El diagnostico evalua capacidades de la organizacion, no personas.</p></div></div></section></main>;
}

function Field({ label, value, onChange, type = 'text', placeholder = '', inputMode }) { return <div className="field"><label>{label}<input type={type} inputMode={inputMode} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}/></label></div>; }
function QuestionCard({ question, value, onChange }) { return <div className="question"><div className="qtitle">{question.title}</div><p className="questionHelp">{question.explanation}</p><div className="scale">{SCALE.map((v) => <button key={v} type="button" className={value === v ? 'active' : ''} onClick={() => onChange(v)}><span>{v}</span><small>{SCALE_LABELS[v]}</small></button>)}</div></div>; }
function Metric({ k, v, note }) { return <div className="card"><strong>{k}</strong><span>{v}</span><p className="small">{note}</p></div>; }
function VariableCard({ card }) { const weak = card.raw <= 3; return <div className={`vitamin ${weak ? 'priority' : 'strength'}`}><strong>{card.area} - {card.raw}/5 - {card.levelLabel}</strong><p><b>Interpretacion:</b> {card.executiveMeaning}</p><p><b>Riesgo:</b> {card.businessRisk}</p><p><b>Causa probable:</b> {card.probableCause}</p><p><b>Recomendacion:</b> {card.recommendationText}</p><p><b>Solucion orientativa:</b> {card.solutionName}</p><p><b>Prioridad:</b> {card.priority}</p><p><b>{card.reportTone}:</b> Esta lectura es una capa ejecutiva de negocio y no redefine la formula oficial.</p>{weak && <p><a className="btn primary" href={card.solutionUrl}>Ver solucion recomendada</a></p>}</div>; }
