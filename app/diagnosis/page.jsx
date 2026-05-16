'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Download, Mail } from 'lucide-react';

const SOLUTION_BASE = 'https://docroi.marketing/doc-roi-consultation-2/';
const PRIVACY_URL = 'https://docroi.marketing/politica-de-privacidad/';
const RGPD_TEXT = 'Acepto que Doc ROI trate mis datos para generar el diagnostico KAI·ROI, conservar la trazabilidad del resultado y contactarme con recomendaciones o acciones comerciales relacionadas con las soluciones sugeridas. Puedo retirar mi consentimiento en cualquier momento.';

const LEVELS = {
  1: ['Ausente', 'La organizacion no dispone todavia de una capacidad estructurada en esta dimension. La toma de decisiones depende de intuicion, esfuerzo manual o criterios dispersos.'],
  2: ['Debil', 'Existen practicas parciales, pero no estan sistematizadas ni conectadas con decisiones economicas. Hay riesgo de perdida de eficiencia, fuga de valor o dependencia de personas concretas.'],
  3: ['Parcial', 'La capacidad existe, pero todavia no es suficientemente consistente, medible o accionable. El negocio tiene base para evolucionar, pero aun no puede convertir esta variable en ventaja competitiva estable.'],
  4: ['Maduro', 'La organizacion trabaja esta dimension con criterios definidos, datos suficientes y procesos relativamente estables. La oportunidad esta en automatizar, conectar y escalar.'],
  5: ['Optimizado', 'La variable esta integrada en la toma de decisiones, se mide de forma continua y contribuye activamente a la creacion de valor economico.']
};

const QUESTIONS = [
  ['phi_i_factor', 'phi_i', 'phi_i - factor de inteligencia aplicado', 'Cuando priorizais clientes, oportunidades o acciones, ¿la decision incorpora criterios de inteligencia claros y comparables?', 'Intensidad de inteligencia aplicada a la decision sobre la unidad i', 'Decision Intelligence Layer', 'Una baja capacidad en phi_i puede provocar decisiones poco comparables y menor trazabilidad economica.', 'Definir una capa de criterio inteligente para comparar unidades, clientes u oportunidades con trazabilidad economica.', 'phi-i'],
  ['u_i_structural', 'u_i', 'u_i - input estructural oficial', '¿La organizacion puede parametrizar de forma consistente el factor estructural u_i para la unidad analizada?', 'Input estructural multiplicativo oficial', 'Structural Parameter Governance', 'Si u_i no esta gobernada, el modelo pierde consistencia y comparabilidad entre unidades o escenarios.', 'Documentar y gobernar u_i como input estructural parametrizable dentro del producto KAI·ROI.', 'u-i'],
  ['f_i_factor', 'f_i', 'f_i - funcion o factor operativo', '¿Existe una funcion operativa definida para modular la informacion del cliente o unidad dentro del nucleo KAI?', 'Funcion/factor operativo parametrizable', 'Operational Factor Design', 'Un f_i debil reduce la capacidad de transformar informacion en una senal operativa util para crear valor.', 'Parametrizar f_i como funcion o factor operativo gobernado y auditable.', 'f-i'],
  ['data_activation', 'DataActivation_i', 'DataActivation_i', '¿Los datos relevantes estan activados y disponibles para alimentar decisiones economicas sin depender de trabajo manual?', 'Activacion del dato para psi_i', 'Data Activation', 'Si el dato no esta activado, la informacion queda retenida, lenta o poco util para decidir.', 'Activar datos comerciales y economicos en una capa conectada, trazable y accionable.', 'data-activation'],
  ['inet_factor', 'I_net_i', 'I_net_i', '¿La informacion neta disponible es suficientemente limpia, fiable y util para decidir?', 'Calidad/inteligencia neta para psi_i', 'Net Intelligence Quality', 'Una I_net_i baja puede contaminar recomendaciones, priorizacion y lectura de Customer Equity.', 'Mejorar calidad, deduplicacion y normalizacion de la informacion neta.', 'i-net'],
  ['cc_component', 'CC_i', 'CC_i - componente oficial de SPO_i', '¿La empresa puede clasificar y comparar clientes o unidades segun criterios comerciales consistentes?', 'Componente CC_i de SPO_i', 'Customer Classification', 'Si CC_i es debil, SPO_i queda limitado y la priorizacion comercial pierde base estructurada.', 'Crear una clasificacion comercial consistente y conectada al modelo SPO_i.', 'cc-i'],
  ['abcd_component', 'ABCD_i', 'ABCD_i - componente oficial de SPO_i', '¿La oferta, producto o servicio se clasifica con claridad segun valor, demanda y contribucion economica?', 'Componente ABCD_i de SPO_i', 'ABCD Portfolio Engine', 'Un ABCD_i bajo puede dirigir recursos hacia ofertas o servicios con menor contribucion al valor economico.', 'Implantar una clasificacion ABCD conectada a rentabilidad y demanda.', 'abcd-i'],
  ['nps_component', 'NPS_i', 'NPS_i - componente oficial de SPO_i', '¿La satisfaccion y recomendacion del cliente se mide de forma continua y accionable?', 'Componente NPS_i de SPO_i', 'CX/NPS System', 'Un NPS_i bajo reduce la lectura de lealtad, riesgo y sostenibilidad del valor futuro.', 'Conectar NPS continuo con alertas, segmentos y decision comercial.', 'nps-i'],
  ['p_i_factor', 'P_i', 'P_i - variable multiplicativa oficial', '¿La ejecucion comercial y operativa convierte las decisiones priorizadas en resultados medibles y eficientes?', 'Variable multiplicativa oficial P_i', 'Productivity OS', 'Una P_i baja puede hacer que buenas decisiones no se traduzcan en resultados por friccion operativa.', 'Medir y mejorar P_i con SLAs, productividad y seguimiento de ejecucion.', 'p-i'],
  ['gamma_group_time', 'Gamma_g_i_t', 'Gamma_g(i),t - grupo y tiempo', '¿El modelo diferencia el contexto de grupo, segmento y momento temporal al evaluar la unidad?', 'Variable multiplicativa oficial de grupo/segmento y tiempo', 'Segment & Time Context', 'Sin Gamma_g(i),t, el diagnostico puede ignorar contexto, ciclo, segmento o riesgo temporal relevante.', 'Parametrizar Gamma_g(i),t por segmento, grupo y periodo de analisis.', 'gamma']
].map(([id, variable, title, question, measures, solutionName, businessRisk, recommendation, slug]) => ({
  id,
  variable,
  title,
  question,
  measures,
  solutionName,
  businessRisk,
  recommendation,
  solutionUrl: `${SOLUTION_BASE}?solution=${slug}`
}));

const STEPS = ['Identidad', 'Diagnostico C-Level', 'Impacto economico'];
const SCALE = [1, 2, 3, 4, 5];
const ECONOMIC_FIELDS = [
  ['I_i,s - ingreso o margen potencial del escenario s', 'I_i_s', '100.000', true],
  ['R_i,s - tasa de realizacion del ingreso (%)', 'R_i_s', '25', false],
  ['E_i,s - eficiencia monetizable del escenario s', 'E_i_s', '12.000', true],
  ['Q_i,s - tasa de realizacion de eficiencia (%)', 'Q_i_s', '30', false],
  ['C_i - coste atribuible', 'C_i', '18.000', true],
  ['WACC_t - coste de capital del periodo (%)', 'WACC_t', '14', false]
];

function parseNumber(value) {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  return Number(String(value).replace(/\./g, '').replace(',', '.'));
}
function asRate(value) { const n = parseNumber(value); return n === null || Number.isNaN(n) ? null : n / 100; }
function norm(value) { return value === null || value === undefined || value === '' ? null : Math.max(1, Math.min(5, Number(value))) / 5; }
function pct(value, decimals = 1) { return value === null || value === undefined || Number.isNaN(Number(value)) ? 'no calculable' : `${(Number(value) * 100).toFixed(decimals)}%`; }
function money(value) { return value === null || value === undefined || Number.isNaN(Number(value)) ? 'no calculable' : new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(value)); }
function formatThousands(value) { const digits = String(value || '').replace(/\D/g, ''); return digits ? new Intl.NumberFormat('es-ES').format(Number(digits)) : ''; }
function indicator(value) { return typeof value === 'number' && value > 0 ? 1 : 0; }
function priority(score) { if (score <= 1) return 'Critica'; if (score === 2) return 'Alta'; if (score === 3) return 'Media-alta'; if (score === 4) return 'Optimizacion'; return 'Escalado'; }
function band(kai) {
  if (kai === null) return ['No calculable', 'missing', 'Hay variables pendientes; el sistema no convierte datos desconocidos en cero.'];
  if (kai < 0.0001) return ['Critical blockage', '0.000% - 0.010%', 'La arquitectura de activacion esta bloqueada en varios puntos y la capacidad real de monetizar valor es casi nula.'];
  if (kai < 0.0005) return ['Very fragile', '>0.010% - 0.050%', 'Existe una base minima, pero el sistema esta limitado por varios cuellos de botella simultaneos.'];
  if (kai < 0.002) return ['Emerging', '>0.050% - 0.200%', 'Hay senales de capacidad, pero el valor todavia no se activa de forma consistente.'];
  if (kai < 0.0075) return ['Operable base', '>0.200% - 0.750%', 'La organizacion empieza a ser activable, aunque siguen existiendo debilidades relevantes.'];
  if (kai < 0.02) return ['Consistent', '>0.750% - 2.000%', 'Existe una capacidad razonable de monetizacion, con margen claro de mejora.'];
  if (kai < 0.05) return ['Solid', '>2.000% - 5.000%', 'La cadena funciona de forma bastante alineada y genera capacidad real de activacion.'];
  return ['Advanced', '>5.000%', 'La organizacion muestra una capacidad robusta, integrada y repetible para activar valor.'];
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
    executiveMeaning: `Tu diagnostico en ${q.title} es ${score}/5, nivel ${levelLabel}. ${levelText} Para una organizacion${sector}${size}${maturity}, esta lectura ayuda a entender una entrada operativa de la arquitectura KAI·ROI, pero no redefine la formula oficial. Promedio operativo de respuestas: ${globalScore.toFixed(1)}/5.`,
    probableCause: weak ? 'Gobierno incompleto, baja trazabilidad o criterios todavia no sistematizados.' : 'Existe una base gobernable que puede escalarse con automatizacion y mejor trazabilidad.',
    recommendationText: weak ? `${q.recommendation} Prioridad de actuacion: ${priority(score)}.` : `${q.recommendation} En este caso se recomienda optimizar y escalar sin tono de alarma.`,
    priority: priority(score),
    reportTone: weak ? 'Area prioritaria de mejora' : 'Fortaleza actual'
  };
}

function comboInsights(score) {
  const items = [];
  if (score.data_activation <= 3 && score.inet_factor <= 3) items.push('DataActivation_i e I_net_i estan debilitados a la vez; por tanto psi_i queda limitado exactamente por sus dos entradas oficiales.');
  if (score.cc_component <= 3 && score.abcd_component <= 3) items.push('CC_i y ABCD_i reducen simultaneamente SPO_i. La intervencion debe mejorar clasificacion de clientes y portfolio sin sustituir SPO_i.');
  if (score.phi_i_factor <= 3 && score.u_i_structural <= 3) items.push('phi_i y u_i muestran debilidad conjunta: conviene reforzar criterio inteligente y gobierno del input estructural sin reinterpretar u_i.');
  return items;
}

function calculate(company, email, context, answers, business) {
  const score = Object.fromEntries(QUESTIONS.map((q) => [q.id, Number(answers[q.id])]));
  const input = {
    phi_i: norm(score.phi_i_factor),
    u_i: norm(score.u_i_structural),
    f_i: norm(score.f_i_factor),
    DataActivation_i: norm(score.data_activation),
    I_net_i: norm(score.inet_factor),
    CC_i: norm(score.cc_component),
    ABCD_i: norm(score.abcd_component),
    NPS_i: norm(score.nps_component),
    P_i: norm(score.p_i_factor),
    Gamma_g_i_t: norm(score.gamma_group_time),
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

  return {
    company,
    email,
    context,
    score,
    input,
    out: {
      KAI_i_star,
      psi_i: input.psi_i,
      SPO_i: input.SPO_i,
      MD_i,
      VA_i,
      ROI_i,
      CE_i,
      CE_empresa,
      V_percent_CE,
      band: { name: b[0], range: b[1] },
      interpretation: b[2],
      globalScore,
      variableCards,
      weak,
      combos: comboInsights(score),
      exportPayload: { company, email, context, score, normalized_inputs: input, calculated_outputs: { KAI_i_star, psi_i: input.psi_i, SPO_i: input.SPO_i, MD_i, VA_i, ROI_i, CE_i, CE_empresa, V_percent_CE }, destination_ready: ['Google Sheets', 'Looker Studio', 'n8n'] },
      recommendation: weak.length ? `El diagnostico KAI·ROI identifica ${weak.length} entradas operativas en 3/5 o menos. La recomendacion es intervenirlas sin alterar la estructura formal de la ecuacion.` : 'El sistema muestra una base C-Level solida. El siguiente paso es escalar precision, automatizacion y control de Customer Equity manteniendo intacta la formula oficial.'
    }
  };
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
    } catch (e) {
      setSaveState('Diagnostico generado. No se pudo guardar todavia en BBDD.');
    }
  }

  if (result) {
    const o = result.out;
    return <main className="page"><section className="hero"><div className="wrap"><div className="logo"><span>Doc ROI</span></div><p className="kicker">Doc ROI · informe ejecutivo · Customer Equity</p><h1 className="title">{result.company}</h1><p className="lead">{o.interpretation} La interpretacion ejecutiva es una capa operativa: no modifica, simplifica ni sustituye la formula oficial KAI·ROI v1.</p><p className="small">{saveState}</p><div className="actions noPrint" style={{ justifyContent: 'flex-start', border: 0, paddingTop: 24 }}><button className="btn primary" onClick={() => window.print()}><Download size={16}/> Download PDF</button><a className="btn" href={SOLUTION_BASE}>Book consultation</a><button className="btn" onClick={() => alert('Solo se enviaran acciones comerciales porque existe consentimiento RGPD registrado.')}><Mail size={16}/> Send by email</button></div></div></section><section className="wrap"><div className="panel result"><div className="metrics"><Metric k="KAI_i*" v={pct(o.KAI_i_star, 3)} note="phi_i x u_i x f_i x psi_i x SPO_i x P_i x Gamma_g(i),t."/><Metric k="psi_i" v={pct(o.psi_i)} note="Promedio exacto de DataActivation_i e I_net_i."/><Metric k="SPO_i" v={pct(o.SPO_i)} note="Producto exacto CC_i x ABCD_i x NPS_i."/><Metric k="MD_i" v={money(o.MD_i)} note="Sumatorio sobre s: I_i,s x R_i,s + E_i,s x Q_i,s."/><Metric k="CE_i" v={pct(o.CE_i)} note="(((((KAI_i* x MD_i)-C_i)/C_i)-WACC_t)/WACC_t)."/><Metric k="CE_empresa" v={pct(o.CE_empresa)} note="Suma de los CE_i individuales evaluados."/><Metric k="V%CE" v={pct((o.V_percent_CE ?? null) / 100)} note="Porcentaje de unidades con CE_i positivo."/><Metric k="Promedio operativo" v={`${o.globalScore.toFixed(1)}/5`} note="Lectura ejecutiva; no sustituye la ecuacion oficial."/></div><div className="card" style={{ marginTop: 18 }}><strong>Lectura ejecutiva integrada</strong><p>{o.recommendation}</p><p className="small">Rango KAI_i*: {o.band.name} - {o.band.range}. Los datos desconocidos no se convierten en cero; se consideran pendientes o no calculables.</p>{o.combos.map((t, i) => <p key={i}><b>Combinacion detectada:</b> {t}</p>)}</div><h2>Diagnostico por variable oficial</h2>{o.variableCards.map((card) => <VariableCard key={card.id} card={card}/>)}</div></section></main>;
  }

  return <main className="page"><section className="hero"><div className="wrap grid"><div><div className="logo"><span>Doc ROI</span></div><p className="kicker">Doc ROI · diagnostico KAI·ROI</p><h1 className="title">Del dato a la decision. De la decision al ROI.</h1><p className="lead">Sistema ejecutivo para diagnosticar Customer Equity, activar decisiones y monetizar resultados dentro del ecosistema Kukulcan IA, KAIloop y neXus.</p><div className="visual"/></div><div className="panel form"><div className="stepHead"><div><p className="kicker" style={{ margin: 0 }}>Diagnosis cabinet</p><h2 className="stepTitle">{current}</h2></div><div className="progress"><span>{progress}%</span><div className="track"><div className="bar" style={{ width: `${progress}%` }}/></div></div></div>{current === 'Identidad' && <div className="fields"><Field label="Empresa" value={company} onChange={setCompany}/><Field label="Email" type="email" value={email} onChange={setEmail}/><Field label="Sector" value={sector} onChange={setSector}/><Field label="Tamano de empresa" value={companySize} onChange={setCompanySize} placeholder="pyme, mid-market, enterprise..."/><Field label="Madurez digital" value={digitalMaturity} onChange={setDigitalMaturity} placeholder="baja, media, alta..."/><label className="field consent"><input type="checkbox" checked={rgpd} onChange={(e) => setRgpd(e.target.checked)}/><span>{RGPD_TEXT} <a href={PRIVACY_URL} target="_blank">Politica de privacidad</a></span></label></div>}{current === 'Diagnostico C-Level' && QUESTIONS.map((q) => <div className="question" key={q.id}><div className="qtitle">{q.question}</div><div className="meta">{q.title} - {q.measures} - {q.solutionName}</div><div className="scale">{SCALE.map((v) => <button key={v} type="button" className={answers[q.id] === v ? 'active' : ''} onClick={() => setAnswers({ ...answers, [q.id]: v })}>{v}</button>)}</div></div>)}{current === 'Impacto economico' && <div className="fields">{ECONOMIC_FIELDS.map(([label, key, placeholder, isMoney]) => <Field key={key} label={label} type="text" inputMode="decimal" value={business[key]} placeholder={placeholder} onChange={(v) => setBusiness({ ...business, [key]: isMoney ? formatThousands(v) : v.replace(/[^0-9,.]/g, '') })}/>)}</div>}<div className="actions"><button className="btn" type="button" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}><ArrowLeft size={16}/> Back</button>{step < STEPS.length - 1 ? <button className="btn primary" type="button" onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}>Continue <ArrowRight size={16}/></button> : <button className="btn primary" type="button" onClick={submit}><CheckCircle2 size={16}/> Generate executive diagnosis</button>}</div><p className="small">Escala C-Level: 1 = ausente, 2 = debil, 3 = parcial, 4 = maduro, 5 = optimizado. Los importes en gris son ejemplos visuales; el diagnostico solo usa datos introducidos por el usuario.</p></div></div></section></main>;
}

function Field({ label, value, onChange, type = 'text', placeholder = '', inputMode }) {
  return <div className="field"><label>{label}<input type={type} inputMode={inputMode} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}/></label></div>;
}
function Metric({ k, v, note }) { return <div className="card"><strong>{k}</strong><span>{v}</span><p className="small">{note}</p></div>; }
function VariableCard({ card }) {
  const weak = card.raw <= 3;
  return <div className={`vitamin ${weak ? 'priority' : 'strength'}`}><strong>{card.title} - {card.raw}/5 - {card.levelLabel}</strong><p><b>Que significa:</b> {card.executiveMeaning}</p><p><b>Riesgo si no se actua:</b> {card.businessRisk}</p><p><b>Causa probable:</b> {card.probableCause}</p><p><b>Recomendacion:</b> {card.recommendationText}</p><p><b>Solucion orientativa:</b> {card.solutionName}</p><p><b>Prioridad:</b> {card.priority}</p><p><b>{card.reportTone}:</b> Esta lectura es operativa y no redefine la formula oficial.</p>{weak && <p><a className="btn primary" href={card.solutionUrl}>Ver solucion recomendada</a></p>}</div>;
}
