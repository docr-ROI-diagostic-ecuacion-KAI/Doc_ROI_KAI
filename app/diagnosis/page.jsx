'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Download, Mail } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'strategic_alignment',
    variable: 'phi_i',
    label: 'phi_i (alineacion estrategica)',
    question: 'La direccion dispone de objetivos comerciales y metricas unificadas para todas las areas?',
    measures: 'Coherencia estrategica',
    vitamin: 'Vitamina Strategic Alignment',
    action: 'Recomendar workshop estrategico + mapa de KPIs'
  },
  {
    id: 'decision_intelligence',
    variable: 'u_i',
    label: 'u_i (variable estructural oficial)',
    question: 'Las decisiones comerciales se priorizan mediante criterios definidos y repetibles?',
    measures: 'Madurez decisional',
    vitamin: 'Vitamina Decision Intelligence',
    action: 'Recomendar sistema de scoring y priorizacion'
  },
  {
    id: 'customer_activation',
    variable: 'f_i',
    label: 'f_i',
    question: 'La empresa mide frecuencia, recurrencia y calidad de interaccion con clientes?',
    measures: 'Activacion relacional',
    vitamin: 'Vitamina Customer Activation',
    action: 'Recomendar automatizacion relacional y journeys'
  },
  {
    id: 'data_intelligence',
    variable: 'psi_source_i',
    label: 'psi_i (dato + inteligencia)',
    question: 'Los datos comerciales estan centralizados y convertidos en informacion util para decision?',
    measures: 'Inteligencia operativa del dato',
    vitamin: 'Vitamina Data Intelligence',
    action: 'Recomendar CDP/BI + normalizacion de datos'
  },
  {
    id: 'rfm_engine',
    variable: 'CC_i',
    label: 'SPO_i -> RFM',
    question: 'La empresa segmenta clientes segun recencia, frecuencia y valor economico?',
    measures: 'Comportamiento cliente',
    vitamin: 'Vitamina RFM Engine',
    action: 'Recomendar motor RFM y automatizacion de segmentos'
  },
  {
    id: 'portfolio_intelligence',
    variable: 'ABCD_i',
    label: 'SPO_i -> ABC',
    question: 'Existe una clasificacion clara de productos/servicios segun rentabilidad y demanda?',
    measures: 'Optimizacion portfolio',
    vitamin: 'Vitamina Portfolio Intelligence',
    action: 'Recomendar matriz ABC automatizada'
  },
  {
    id: 'cx_nps',
    variable: 'NPS_i',
    label: 'SPO_i -> NPS',
    question: 'La satisfaccion y recomendacion del cliente se mide de forma continua?',
    measures: 'Experiencia cliente',
    vitamin: 'Vitamina CX/NPS',
    action: 'Recomendar sistema NPS + alertas SLA'
  },
  {
    id: 'spo_model',
    variable: 'PrioritySystem_i',
    label: 'SPO_i -> Modelo SPO',
    question: 'Existe un modelo operativo que conecte clientes, oferta y rentabilidad?',
    measures: 'Orquestacion comercial',
    vitamin: 'Vitamina SPO Model',
    action: 'Recomendar implantacion modelo SPO'
  },
  {
    id: 'productivity_os',
    variable: 'P_i',
    label: 'P_i (productividad)',
    question: 'La productividad comercial y operativa se mide mediante SLAs y eficiencia real?',
    measures: 'Productividad empresarial',
    vitamin: 'Vitamina Productivity OS',
    action: 'Recomendar dashboard productividad + SLA'
  },
  {
    id: 'customer_equity_control',
    variable: 'Gamma_g_i_t',
    label: 'Gamma_g(i),t (cartera/contexto)',
    question: 'La empresa monitoriza la evolucion y riesgo de su cartera de clientes?',
    measures: 'Salud de cartera',
    vitamin: 'Vitamina Customer Equity Control',
    action: 'Recomendar monitor cartera + churn/riesgo'
  }
];

const STEPS = ['Identity', 'C-Level diagnosis', 'Business impact'];
const SCALE = [1, 2, 3, 4, 5];

function band(kai){
  if(kai < .0001) return ['Critical blockage','0.000% - 0.010%','La cadena de activacion esta rota en varios puntos y la capacidad real de monetizar valor es casi nula.'];
  if(kai < .0005) return ['Very fragile','>0.010% - 0.050%','Existe una base minima, pero el sistema esta limitado por varios cuellos de botella simultaneos.'];
  if(kai < .002) return ['Emerging','>0.050% - 0.200%','Hay senales de capacidad, pero el valor todavia no se activa de forma consistente.'];
  if(kai < .0075) return ['Operable base','>0.200% - 0.750%','La organizacion empieza a ser activable, aunque siguen existiendo debilidades relevantes.'];
  if(kai < .02) return ['Consistent','>0.750% - 2.000%','Existe una capacidad razonable de monetizacion, con margen claro de mejora.'];
  if(kai < .05) return ['Solid','>2.000% - 5.000%','La cadena funciona de forma bastante alineada y genera capacidad real de activacion.'];
  return ['Advanced','>5.000%','La organizacion muestra una capacidad robusta, integrada y repetible para activar valor.'];
}

function pct(v,d=1){return v===null||v===undefined||Number.isNaN(Number(v))?'n/a':`${(Number(v)*100).toFixed(d)}%`}
function money(v){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(v||0))}
function norm(v){return Math.max(1,Math.min(5,Number(v||3)))/5}

function calculate(company,email,answers,business){
  const score = Object.fromEntries(QUESTIONS.map(q => [q.id, Number(answers[q.id] || 3)]));
  const input = {
    phi_i: norm(score.strategic_alignment),
    u_i: norm(score.decision_intelligence),
    f_i: norm(score.customer_activation),
    DataActivation_i: norm(score.data_intelligence),
    I_net_i: norm(score.data_intelligence),
    CC_i: norm(score.rfm_engine),
    ABCD_i: norm(score.portfolio_intelligence),
    NPS_i: norm(score.cx_nps),
    PrioritySystem_i: norm(score.spo_model),
    P_i: norm(score.productivity_os),
    Gamma_g_i_t: norm(score.customer_equity_control)
  };
  input.psi_i = (input.DataActivation_i + input.I_net_i) / 2;
  input.SPO_i = input.CC_i * input.ABCD_i * input.NPS_i;
  input.I_i_s = Number(business.potentialRevenue || 0);
  input.R_i_s = Number(business.revenueRealizationPct || 0) / 100;
  input.E_i_s = Number(business.potentialEfficiency || 0);
  input.Q_i_s = Number(business.efficiencyRealizationPct || 0) / 100;
  input.C_i = Number(business.attributableCost || 0);
  input.WACC_t = Number(business.waccPct || 0) / 100;

  const KAI_i_star = input.phi_i * input.u_i * input.f_i * input.psi_i * input.SPO_i * input.P_i * input.Gamma_g_i_t;
  const MD_i = input.I_i_s * input.R_i_s + input.E_i_s * input.Q_i_s;
  const VA_i = KAI_i_star * MD_i;
  const ROI_i = input.C_i > 0 ? (VA_i - input.C_i) / input.C_i : null;
  const CE_i = ROI_i !== null && input.WACC_t > 0 ? (ROI_i - input.WACC_t) / input.WACC_t : null;
  const b = band(KAI_i_star);
  const weak = QUESTIONS
    .filter(q => score[q.id] <= 3)
    .map(q => ({...q, raw: score[q.id], normalized: norm(score[q.id])}))
    .sort((a,b) => a.raw - b.raw);

  return {
    company,
    email,
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
      CE_empresa: CE_i,
      V_percent_CE: CE_i && CE_i > 0 ? 100 : 0,
      band: { name: b[0], range: b[1] },
      interpretation: b[2],
      weak,
      recommendation: weak.length
        ? 'El sistema requiere intervencion sobre las palancas con puntuacion 3 o inferior antes de escalar adquisicion o automatizacion comercial.'
        : 'El sistema muestra una base C-Level solida. El siguiente paso es escalar precision, automatizacion y control de Customer Equity.'
    }
  };
}

export default function DiagnosisPage(){
  const defaults = useMemo(() => Object.fromEntries(QUESTIONS.map(q => [q.id, 3])), []);
  const [step,setStep] = useState(0);
  const [company,setCompany] = useState('');
  const [email,setEmail] = useState('');
  const [answers,setAnswers] = useState(defaults);
  const [business,setBusiness] = useState({potentialRevenue:100000,revenueRealizationPct:25,potentialEfficiency:12000,efficiencyRealizationPct:30,attributableCost:18000,waccPct:14});
  const [result,setResult] = useState(null);
  const current = STEPS[step];
  const progress = Math.round(((step + 1) / STEPS.length) * 100);
  function submit(){setResult(calculate(company || 'Company', email, answers, business));}

  if(result){
    const o = result.out;
    return <main className="page"><section className="hero"><div className="wrap"><div className="logo"><span className="mark">DR</span><span>Doc ROI</span></div><p className="kicker">Executive diagnosis · KAI ROI equation</p><h1 className="title">{result.company}</h1><p className="lead">{o.interpretation}</p><div className="actions noPrint" style={{justifyContent:'flex-start',border:0,paddingTop:24}}><button className="btn primary" onClick={()=>window.print()}><Download size={16}/> Download PDF</button><a className="btn" href="https://docroi.marketing/doc-roi-consultation-2/">Book consultation</a><button className="btn" onClick={()=>alert('Email automation endpoint ready for n8n handoff.')}><Mail size={16}/> Send by email</button></div></div></section><section className="wrap"><div className="panel result"><div className="metrics"><Metric k="KAI_i*" v={pct(o.KAI_i_star,3)}/><Metric k="psi_i" v={pct(o.psi_i)}/><Metric k="SPO_i" v={pct(o.SPO_i)}/><Metric k="MD_i" v={money(o.MD_i)}/><Metric k="VA_i" v={money(o.VA_i)}/><Metric k="ROI_i" v={pct(o.ROI_i)}/><Metric k="CE_i" v={pct(o.CE_i)}/><Metric k="Range" v={o.band.name}/></div><div className="card" style={{marginTop:18}}><strong>Customer Equity diagnosis</strong><p>{o.recommendation}</p><p className="small">Official range: {o.band.range}</p></div><h2>Acciones automaticas recomendadas</h2>{o.weak.length ? o.weak.map(l => <div className="vitamin" key={l.id}><strong>{l.vitamin} · score {l.raw}/5</strong><p><b>Que mide:</b> {l.measures}</p><p><b>Accion automatica:</b> {l.action}</p></div>) : <div className="vitamin"><strong>Sin alertas criticas</strong><p>Todas las palancas C-Level estan por encima de 3/5.</p></div>}</div></section></main>
  }

  return <main className="page"><section className="hero"><div className="wrap grid"><div><div className="logo"><span className="mark">DR</span><span>Doc ROI</span></div><p className="kicker">Doc ROI · Diagnosis System</p><h1 className="title">Executive KAI·ROI diagnosis</h1><p className="lead">Diagnostico C-Level de 10 preguntas para medir alineacion, decision, dato, SPO, productividad y salud de cartera.</p><div className="visual"/></div><div className="panel form"><div className="stepHead"><div><p className="kicker" style={{margin:0}}>Clinical questionnaire</p><h2 className="stepTitle">{current}</h2></div><div className="progress"><span>{progress}%</span><div className="track"><div className="bar" style={{width:`${progress}%`}}/></div></div></div>{current==='Identity'&&<div className="fields"><Field label="Empresa" value={company} onChange={setCompany}/><Field label="Email" type="email" value={email} onChange={setEmail}/></div>}{current==='C-Level diagnosis'&&QUESTIONS.map(q => <div className="question" key={q.id}><div className="qtitle">{q.question}</div><div className="meta">{q.label} · {q.measures} · {q.vitamin}</div><div className="scale">{SCALE.map(v => <button key={v} type="button" className={answers[q.id]===v?'active':''} onClick={()=>setAnswers({...answers,[q.id]:v})}>{v}</button>)}</div></div>)}{current==='Business impact'&&<div className="fields">{[['Potential revenue per strategic client/service','potentialRevenue'],['Revenue realization percentage','revenueRealizationPct'],['Potential monetizable efficiency','potentialEfficiency'],['Efficiency realization percentage','efficiencyRealizationPct'],['Attributable cost','attributableCost'],['WACC percentage','waccPct']].map(([label,key]) => <Field key={key} label={label} type="number" value={business[key]} onChange={v=>setBusiness({...business,[key]:Number(v)})}/>)}</div>}<div className="actions"><button className="btn" type="button" disabled={step===0} onClick={()=>setStep(Math.max(0,step-1))}><ArrowLeft size={16}/> Back</button>{step<STEPS.length-1?<button className="btn primary" type="button" onClick={()=>setStep(Math.min(STEPS.length-1,step+1))}>Continue <ArrowRight size={16}/></button>:<button className="btn primary" type="button" onClick={submit}><CheckCircle2 size={16}/> Generate executive diagnosis</button>}</div><p className="small">Escala C-Level: 1 = muy bajo, 5 = excelente. Si una palanca puntua 3 o menos, el informe activa una accion recomendada.</p></div></div></section></main>
}

function Field({label,value,onChange,type='text'}){return <div className="field"><label>{label}<input type={type} value={value} onChange={e=>onChange(e.target.value)} /></label></div>}
function Metric({k,v}){return <div className="card"><strong>{k}</strong><span>{v}</span></div>}
