'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Download, Mail } from 'lucide-react';

const SOLUTION_BASE = 'https://docroi.marketing/doc-roi-consultation-2/';

const LEVELS = {
  1: {
    label: 'Ausente',
    text: 'La organizacion no dispone todavia de una capacidad estructurada en esta dimension. La toma de decisiones depende de intuicion, esfuerzo manual o criterios dispersos.'
  },
  2: {
    label: 'Debil',
    text: 'Existen practicas parciales, pero no estan sistematizadas ni conectadas con decisiones economicas. Hay riesgo de perdida de eficiencia, fuga de valor o dependencia de personas concretas.'
  },
  3: {
    label: 'Parcial',
    text: 'La capacidad existe, pero todavia no es suficientemente consistente, medible o accionable. El negocio tiene base para evolucionar, pero aun no puede convertir esta variable en ventaja competitiva estable.'
  },
  4: {
    label: 'Maduro',
    text: 'La organizacion trabaja esta dimension con criterios definidos, datos suficientes y procesos relativamente estables. La oportunidad esta en automatizar, conectar y escalar.'
  },
  5: {
    label: 'Optimizado',
    text: 'La variable esta integrada en la toma de decisiones, se mide de forma continua y contribuye activamente a la creacion de valor economico.'
  }
};

const QUESTIONS = [
  {
    id: 'strategic_alignment',
    variable: 'phi_i',
    variableName: 'phi_i - Alineacion estrategica',
    question: 'La direccion dispone de objetivos comerciales y metricas unificadas para todas las areas?',
    measures: 'Coherencia estrategica',
    executiveMeaning: 'Evalua si la direccion convierte estrategia, objetivos comerciales y metricas en un lenguaje comun para ventas, marketing, operaciones y finanzas.',
    businessRisk: 'Si esta capacidad es baja, cada area puede optimizar indicadores distintos y perder foco en Customer Equity, margen y retorno real.',
    probableCause: 'Objetivos definidos por area, cuadros de mando desconectados o ausencia de una arquitectura comun de KPIs.',
    recommendation: 'Alinear objetivos comerciales, metricas economicas y responsabilidades ejecutivas en un mapa unico de decision.',
    solutionName: 'Vitamina Strategic Alignment',
    solutionUrl: `${SOLUTION_BASE}?solution=strategic-alignment`,
    action: 'Workshop estrategico + mapa de KPIs'
  },
  {
    id: 'decision_intelligence',
    variable: 'u_i',
    variableName: 'u_i - Madurez decisional',
    question: 'Las decisiones comerciales se priorizan mediante criterios definidos y repetibles?',
    measures: 'Madurez decisional',
    executiveMeaning: 'Mide si la empresa decide con criterios repetibles, no solo por urgencia, intuicion o presion comercial.',
    businessRisk: 'Puede producir inversiones comerciales inconsistentes, priorizacion reactiva y perdida de oportunidades de mayor retorno.',
    probableCause: 'Falta de scoring, reglas de priorizacion o gobierno ejecutivo sobre oportunidades, clientes y acciones.',
    recommendation: 'Implantar un sistema de scoring y priorizacion que conecte oportunidad, valor, riesgo y coste de accion.',
    solutionName: 'Vitamina Decision Intelligence',
    solutionUrl: `${SOLUTION_BASE}?solution=decision-intelligence`,
    action: 'Sistema de scoring y priorizacion'
  },
  {
    id: 'customer_activation',
    variable: 'f_i',
    variableName: 'f_i - Activacion relacional',
    question: 'La empresa mide frecuencia, recurrencia y calidad de interaccion con clientes?',
    measures: 'Activacion relacional',
    executiveMeaning: 'Indica si la relacion con el cliente se observa como un activo economico medible y activable, no como una suma de contactos aislados.',
    businessRisk: 'La empresa puede no detectar perdida de recurrencia, deterioro de engagement o clientes con potencial dormido.',
    probableCause: 'Journeys poco medidos, CRM incompleto o ausencia de indicadores de recurrencia y calidad de interaccion.',
    recommendation: 'Automatizar journeys relacionales y medir frecuencia, recurrencia y calidad para activar clientes con mayor potencial.',
    solutionName: 'Vitamina Customer Activation',
    solutionUrl: `${SOLUTION_BASE}?solution=customer-activation`,
    action: 'Automatizacion relacional y journeys'
  },
  {
    id: 'data_intelligence',
    variable: 'psi_i',
    variableName: 'psi_i - Dato + inteligencia',
    question: 'Los datos comerciales estan centralizados y convertidos en informacion util para decision?',
    measures: 'Inteligencia operativa del dato',
    executiveMeaning: 'Evalua si el dato comercial esta disponible, normalizado y convertido en inteligencia accionable para tomar decisiones economicas.',
    businessRisk: 'La organizacion puede tener datos, pero no capacidad de convertirlos en accion, prioridad o valor monetizable.',
    probableCause: 'Fuentes dispersas, baja calidad de dato, reporting descriptivo o falta de integracion CRM, ventas y servicio.',
    recommendation: 'Centralizar y normalizar datos comerciales en una capa BI/CDP orientada a decision y activacion.',
    solutionName: 'Vitamina Data Intelligence',
    solutionUrl: `${SOLUTION_BASE}?solution=data-intelligence`,
    action: 'CDP/BI + normalizacion de datos'
  },
  {
    id: 'rfm_engine',
    variable: 'CC_i',
    variableName: 'SPO_i - RFM',
    question: 'La empresa segmenta clientes segun recencia, frecuencia y valor economico?',
    measures: 'Comportamiento cliente',
    executiveMeaning: 'Mide la capacidad de leer comportamiento real de clientes mediante recencia, frecuencia y valor economico.',
    businessRisk: 'Puede estar tratando igual a clientes con valor, frecuencia y riesgo de fuga muy diferentes.',
    probableCause: 'Datos de compra o interaccion dispersos, sin segmentacion dinamica ni motor RFM operativo.',
    recommendation: 'Activar un motor RFM que clasifique clientes por recencia, frecuencia y valor para priorizar acciones comerciales.',
    solutionName: 'Vitamina RFM Engine',
    solutionUrl: `${SOLUTION_BASE}?solution=rfm-engine`,
    action: 'Motor RFM y automatizacion de segmentos'
  },
  {
    id: 'portfolio_intelligence',
    variable: 'ABCD_i',
    variableName: 'SPO_i - ABC',
    question: 'Existe una clasificacion clara de productos/servicios segun rentabilidad y demanda?',
    measures: 'Optimizacion portfolio',
    executiveMeaning: 'Indica si la empresa distingue que productos, servicios u ofertas merecen mayor prioridad por margen, demanda y valor estrategico.',
    businessRisk: 'Puede dedicar recursos comerciales y operativos a ofertas de bajo retorno mientras infradesarrolla las de mayor valor.',
    probableCause: 'Portfolio sin matriz ABC actualizada, baja visibilidad de margen o desconexion entre demanda y rentabilidad.',
    recommendation: 'Implantar una matriz ABC automatizada para orientar foco comercial, servicio y recursos hacia mayor retorno.',
    solutionName: 'Vitamina Portfolio Intelligence',
    solutionUrl: `${SOLUTION_BASE}?solution=portfolio-intelligence`,
    action: 'Matriz ABC automatizada'
  },
  {
    id: 'cx_nps',
    variable: 'NPS_i',
    variableName: 'SPO_i - NPS',
    question: 'La satisfaccion y recomendacion del cliente se mide de forma continua?',
    measures: 'Experiencia cliente',
    executiveMeaning: 'Evalua si la satisfaccion y recomendacion del cliente funcionan como senal continua de riesgo, lealtad y oportunidad.',
    businessRisk: 'La empresa puede reaccionar tarde ante insatisfaccion, fuga o deterioro de experiencia en clientes de alto valor.',
    probableCause: 'Medicion NPS puntual, sin alertas SLA, sin conexion con segmento, valor economico o accion comercial.',
    recommendation: 'Implantar medicion NPS continua con alertas SLA y conexion directa con segmentos y prioridad comercial.',
    solutionName: 'Vitamina CX/NPS',
    solutionUrl: `${SOLUTION_BASE}?solution=cx-nps`,
    action: 'Sistema NPS + alertas SLA'
  },
  {
    id: 'spo_model',
    variable: 'SPO_model',
    variableName: 'SPO_i - Modelo SPO',
    question: 'Existe un modelo operativo que conecte clientes, oferta y rentabilidad?',
    measures: 'Orquestacion comercial',
    executiveMeaning: 'Mide si la empresa conecta cliente, oferta, satisfaccion y rentabilidad en un modelo operativo de prioridad. No sustituye SPO_i: lo operativiza.',
    businessRisk: 'Las senales pueden existir, pero sin orquestacion se convierten en reporting, no en decisiones comerciales de valor.',
    probableCause: 'RFM, ABC, NPS y productividad se gestionan por separado, sin una regla comun de prioridad y accion.',
    recommendation: 'Implantar un modelo SPO que conecte cliente, oferta, experiencia y rentabilidad en una logica unica de actuacion.',
    solutionName: 'Vitamina SPO Model',
    solutionUrl: `${SOLUTION_BASE}?solution=spo-model`,
    action: 'Implantacion modelo SPO'
  },
  {
    id: 'productivity_os',
    variable: 'P_i',
    variableName: 'P_i - Productividad',
    question: 'La productividad comercial y operativa se mide mediante SLAs y eficiencia real?',
    measures: 'Productividad empresarial',
    executiveMeaning: 'Evalua si la empresa convierte prioridad comercial en ejecucion eficiente, medible y gobernada por SLAs.',
    businessRisk: 'Puede existir buena estrategia, pero perderse valor en tiempos de respuesta, coste operativo o baja eficiencia de ejecucion.',
    probableCause: 'Ausencia de SLAs, baja automatizacion, dashboards operativos incompletos o falta de medicion de eficiencia real.',
    recommendation: 'Construir un sistema de productividad comercial con SLAs, eficiencia por accion y dashboard ejecutivo.',
    solutionName: 'Vitamina Productivity OS',
    solutionUrl: `${SOLUTION_BASE}?solution=productivity-os`,
    action: 'Dashboard productividad + SLA'
  },
  {
    id: 'customer_equity_control',
    variable: 'Gamma_g(i),t',
    variableName: 'Gamma_g(i),t - Cartera/contexto',
    question: 'La empresa monitoriza la evolucion y riesgo de su cartera de clientes?',
    measures: 'Salud de cartera',
    executiveMeaning: 'Indica si la cartera se gestiona como un activo economico vivo, con evolucion, riesgo, churn y potencial de Customer Equity.',
    businessRisk: 'Puede crecer en volumen mientras deteriora calidad de cartera, recurrencia, margen o valor economico de clientes.',
    probableCause: 'Falta de monitor de cartera, baja visibilidad de churn/riesgo o ausencia de indicadores de Customer Equity.',
    recommendation: 'Activar un monitor de cartera que conecte evolucion, riesgo, churn y valor economico por segmento.',
    solutionName: 'Vitamina Customer Equity Control',
    solutionUrl: `${SOLUTION_BASE}?solution=customer-equity-control`,
    action: 'Monitor cartera + churn/riesgo'
  }
];

const STEPS = ['Identity', 'C-Level diagnosis', 'Business impact'];
const SCALE = [1, 2, 3, 4, 5];

function band(kai){
  if(kai < .0001) return ['Critical blockage','0.000% - 0.010%','La arquitectura de activacion esta rota en varios puntos y la capacidad real de monetizar valor es casi nula.'];
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
function level(score){return LEVELS[Math.max(1,Math.min(5,Number(score||3)))]}
function priority(score){if(score<=1)return 'Critica'; if(score===2)return 'Alta'; if(score===3)return 'Media-alta'; if(score===4)return 'Optimizacion'; return 'Escalado'}

function variableInterpretation(q, score, context, globalScore){
  const l = level(score);
  const weak = score <= 3;
  const sizeText = context.companySize ? ` en una empresa ${context.companySize}` : '';
  const sectorText = context.sector ? ` del sector ${context.sector}` : '';
  const maturityText = context.digitalMaturity ? ` con madurez digital ${context.digitalMaturity}` : '';
  const globalText = `El score global medio es ${globalScore.toFixed(1)}/5, por lo que esta lectura debe interpretarse como parte de una arquitectura de decision, no como un indicador aislado.`;
  return {
    levelLabel: l.label,
    executiveMeaning: `Tu diagnostico en ${q.variableName} es ${score}/5, nivel ${l.label}. ${l.text} En el contexto${sectorText}${sizeText}${maturityText}, esto significa que ${q.executiveMeaning.toLowerCase()} ${globalText}`,
    businessRisk: q.businessRisk,
    probableCause: q.probableCause,
    recommendationText: weak
      ? `${q.recommendation} Esta accion es prioritaria porque la puntuacion esta en ${score}/5 y todavia limita la conversion de dato, decision y ejecucion en valor economico.`
      : `${q.recommendation} En este caso no se plantea como alarma, sino como oportunidad de optimizacion, automatizacion y escalado.`,
    priority: priority(score),
    reportTone: weak ? 'Area prioritaria de mejora' : 'Fortaleza actual',
    cLevelSummary: weak
      ? `La direccion deberia tratar ${q.measures.toLowerCase()} como una palanca prioritaria para proteger Customer Equity y reducir perdida de valor.`
      : `${q.measures} ya funciona como base de gestion. La oportunidad esta en conectarla mejor con automatizacion, SPO y retorno economico.`
  };
}

function comboInsights(score){
  const insights = [];
  if(score.rfm_engine <= 3 && score.cx_nps <= 3){
    insights.push('La empresa no solo tiene baja visibilidad sobre el comportamiento del cliente, sino tambien una lectura insuficiente de su satisfaccion. Esto limita la capacidad de anticipar fuga, priorizar clientes y proteger Customer Equity.');
  }
  if(score.portfolio_intelligence <= 3 && score.productivity_os <= 3){
    insights.push('El problema no esta solo en la oferta, sino en la eficiencia con la que se gestiona. Hay riesgo de dedicar recursos a productos, servicios o clientes con bajo retorno.');
  }
  if(score.data_intelligence <= 3 && score.decision_intelligence <= 3){
    insights.push('La organizacion puede tener informacion, pero todavia no la convierte en una disciplina repetible de decision. Esto reduce la capacidad de transformar datos en acciones economicas.');
  }
  if(score.strategic_alignment <= 3 && score.customer_equity_control <= 3){
    insights.push('La direccion no esta conectando suficientemente objetivos comerciales con salud de cartera. Esto puede hacer crecer actividad sin mejorar valor economico real.');
  }
  return insights;
}

function calculate(company,email,context,answers,business){
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
  const globalScore = QUESTIONS.reduce((sum,q) => sum + score[q.id], 0) / QUESTIONS.length;
  const variableCards = QUESTIONS.map(q => ({...q, raw: score[q.id], normalized: norm(score[q.id]), ...variableInterpretation(q, score[q.id], context, globalScore)}));
  const weak = variableCards.filter(q => q.raw <= 3).sort((a,b) => a.raw - b.raw);
  const combos = comboInsights(score);

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
      CE_empresa: CE_i,
      V_percent_CE: CE_i && CE_i > 0 ? 100 : 0,
      band: { name: b[0], range: b[1] },
      interpretation: b[2],
      globalScore,
      variableCards,
      weak,
      combos,
      recommendation: weak.length
        ? `El diagnostico muestra ${weak.length} palancas en 3/5 o menos. Antes de escalar inversion comercial, conviene reforzar estas capacidades para que KAI ROI funcione como arquitectura de decision economica.`
        : 'El sistema muestra una base C-Level solida. El siguiente paso es escalar precision, automatizacion y control de Customer Equity.'
    }
  };
}

export default function DiagnosisPage(){
  const defaults = useMemo(() => Object.fromEntries(QUESTIONS.map(q => [q.id, 3])), []);
  const [step,setStep] = useState(0);
  const [company,setCompany] = useState('');
  const [email,setEmail] = useState('');
  const [sector,setSector] = useState('');
  const [companySize,setCompanySize] = useState('');
  const [digitalMaturity,setDigitalMaturity] = useState('');
  const [answers,setAnswers] = useState(defaults);
  const [business,setBusiness] = useState({potentialRevenue:100000,revenueRealizationPct:25,potentialEfficiency:12000,efficiencyRealizationPct:30,attributableCost:18000,waccPct:14});
  const [result,setResult] = useState(null);
  const current = STEPS[step];
  const progress = Math.round(((step + 1) / STEPS.length) * 100);
  function submit(){setResult(calculate(company || 'Company', email, {sector, companySize, digitalMaturity}, answers, business));}

  if(result){
    const o = result.out;
    return <main className="page"><section className="hero"><div className="wrap"><div className="logo"><span className="mark">DR</span><span>Doc ROI</span></div><p className="kicker">Executive diagnosis · KAI ROI equation</p><h1 className="title">{result.company}</h1><p className="lead">{o.interpretation} KAI ROI se interpreta aqui como una arquitectura de decision para crear valor economico, no como un dashboard aislado.</p><div className="actions noPrint" style={{justifyContent:'flex-start',border:0,paddingTop:24}}><button className="btn primary" onClick={()=>window.print()}><Download size={16}/> Download PDF</button><a className="btn" href="https://docroi.marketing/doc-roi-consultation-2/">Book consultation</a><button className="btn" onClick={()=>alert('Email automation endpoint ready for n8n handoff.')}><Mail size={16}/> Send by email</button></div></div></section><section className="wrap"><div className="panel result"><div className="metrics"><Metric k="KAI_i*" v={pct(o.KAI_i_star,3)} note="Capacidad estructural activable segun la formula oficial multiplicativa."/><Metric k="psi_i" v={pct(o.psi_i)} note="Lectura combinada de activacion del dato e inteligencia operativa."/><Metric k="SPO_i" v={pct(o.SPO_i)} note="Motor oficial CC x ABCD x NPS; no se sustituye por el modelo operativo SPO."/><Metric k="MD_i" v={money(o.MD_i)} note="Monetizacion potencial del dato a partir de ingresos y eficiencias."/><Metric k="VA_i" v={money(o.VA_i)} note="Valor activado al aplicar KAI_i* sobre MD_i."/><Metric k="ROI_i" v={pct(o.ROI_i)} note="Retorno relativo frente al coste atribuible."/><Metric k="CE_i" v={pct(o.CE_i)} note="Exceso de retorno frente al WACC y Customer Equity individual."/><Metric k="Score global" v={`${o.globalScore.toFixed(1)}/5`} note="Promedio ejecutivo de madurez; no sustituye a la ecuacion oficial."/></div><div className="card" style={{marginTop:18}}><strong>Lectura ejecutiva integrada</strong><p>{o.recommendation}</p><p className="small">Rango oficial KAI: {o.band.name} · {o.band.range}. Los datos desconocidos no se tratan como cero; esta beta usa los valores introducidos en el formulario.</p>{o.combos.map((text,i)=><p key={i}><b>Combinacion detectada:</b> {text}</p>)}</div><h2>Interpretacion por variable</h2>{o.variableCards.map(card => <VariableCard key={card.id} card={card}/>)}</div></section></main>
  }

  return <main className="page"><section className="hero"><div className="wrap grid"><div><div className="logo"><span className="mark">DR</span><span>Doc ROI</span></div><p className="kicker">Doc ROI · Diagnosis System</p><h1 className="title">Executive KAI·ROI diagnosis</h1><p className="lead">Diagnostico C-Level de 10 preguntas para medir alineacion, decision, dato, SPO, productividad y salud de cartera.</p><div className="visual"/></div><div className="panel form"><div className="stepHead"><div><p className="kicker" style={{margin:0}}>Clinical questionnaire</p><h2 className="stepTitle">{current}</h2></div><div className="progress"><span>{progress}%</span><div className="track"><div className="bar" style={{width:`${progress}%`}}/></div></div></div>{current==='Identity'&&<div className="fields"><Field label="Empresa" value={company} onChange={setCompany}/><Field label="Email" type="email" value={email} onChange={setEmail}/><Field label="Sector" value={sector} onChange={setSector}/><Field label="Tamano de empresa" value={companySize} onChange={setCompanySize} placeholder="pyme, mid-market, enterprise..."/><Field label="Madurez digital" value={digitalMaturity} onChange={setDigitalMaturity} placeholder="baja, media, alta..."/></div>}{current==='C-Level diagnosis'&&QUESTIONS.map(q => <div className="question" key={q.id}><div className="qtitle">{q.question}</div><div className="meta">{q.variableName} · {q.measures} · {q.solutionName}</div><div className="scale">{SCALE.map(v => <button key={v} type="button" className={answers[q.id]===v?'active':''} onClick={()=>setAnswers({...answers,[q.id]:v})}>{v}</button>)}</div></div>)}{current==='Business impact'&&<div className="fields">{[['Potential revenue per strategic client/service','potentialRevenue'],['Revenue realization percentage','revenueRealizationPct'],['Potential monetizable efficiency','potentialEfficiency'],['Efficiency realization percentage','efficiencyRealizationPct'],['Attributable cost','attributableCost'],['WACC percentage','waccPct']].map(([label,key]) => <Field key={key} label={label} type="number" value={business[key]} onChange={v=>setBusiness({...business,[key]:Number(v)})}/>)}</div>}<div className="actions"><button className="btn" type="button" disabled={step===0} onClick={()=>setStep(Math.max(0,step-1))}><ArrowLeft size={16}/> Back</button>{step<STEPS.length-1?<button className="btn primary" type="button" onClick={()=>setStep(Math.min(STEPS.length-1,step+1))}>Continue <ArrowRight size={16}/></button>:<button className="btn primary" type="button" onClick={submit}><CheckCircle2 size={16}/> Generate executive diagnosis</button>}</div><p className="small">Escala C-Level: 1 = ausente, 2 = debil, 3 = parcial, 4 = maduro, 5 = optimizado. Cada score se traduce en lectura ejecutiva, riesgo y accion.</p></div></div></section></main>
}

function Field({label,value,onChange,type='text',placeholder=''}){return <div className="field"><label>{label}<input type={type} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} /></label></div>}
function Metric({k,v,note}){return <div className="card"><strong>{k}</strong><span>{v}</span><p className="small">{note}</p></div>}
function VariableCard({card}){const weak=card.raw<=3;return <div className={`vitamin ${weak?'priority':'strength'}`}><strong>{card.variableName} — {card.raw}/5 — {card.levelLabel}</strong><p><b>Que significa:</b> {card.executiveMeaning}</p><p><b>Riesgo si no se actua:</b> {card.businessRisk}</p><p><b>Causa probable:</b> {card.probableCause}</p><p><b>Recomendacion:</b> {card.recommendationText}</p><p><b>Vitamina recomendada:</b> {card.solutionName}</p><p><b>Prioridad:</b> {card.priority}</p><p><b>{card.reportTone}:</b> {card.cLevelSummary}</p>{weak&&<p><a className="btn primary" href={card.solutionUrl}>Ver solucion recomendada</a></p>}</div>}
