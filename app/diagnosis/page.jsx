'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Download, Mail } from 'lucide-react';

const QUESTIONS = [
  ['decision_governance','Decision','phi_i','In your company, is it clear who decides which customers deserve the most attention?','Business Intelligence (BSC) Vitamin'],
  ['decision_speed','Decision','phi_i','When your business sees an important customer signal, can your team react quickly?','Business Intelligence (BSC) Vitamin'],
  ['decision_discipline','Decision','phi_i','Are key business decisions clearly recorded, followed through, and reviewed over time?','Business Intelligence (BSC) Vitamin'],
  ['strategic_clarity','Objectives','u_i','Are your business goals around revenue, efficiency, and customers clear to the whole company?','Customer Centric Vitamin'],
  ['objective_alignment','Objectives','u_i','Are sales, operations, and customer service moving in the same direction?','Customer Centric Vitamin'],
  ['value_focus','Objectives','u_i','Are your goals focused on creating real business value, not just keeping people busy?','Customer Centric Vitamin'],
  ['analytical_capability','Intelligence','f_i','Do you have clear ways to understand what your customers are doing and what it means?','Prompts Vitamin'],
  ['actionable_insights','Intelligence','f_i','Do your reports help your team decide what to do next, not just explain the past?','Prompts Vitamin'],
  ['ai_automation_usage','Intelligence','f_i','Is your business already using AI or automation to support better decisions?','Prompts Vitamin'],
  ['customer_data_quality','Data & Digital Activation','DataActivation_i','Is your customer information complete, reliable, and kept up to date?','Keywords & Cohorts Vitamin'],
  ['data_integration','Data & Digital Activation','DataActivation_i','Are your customer data sources connected, such as CRM, website, ecommerce, sales, and service?','Keywords & Cohorts Vitamin'],
  ['digital_traceability','Data & Digital Activation','DataActivation_i','Can you follow important customer actions across the different channels you use?','Keywords & Cohorts Vitamin'],
  ['capture_capability','Data & Digital Activation','I_net_i','Are you consistently capturing useful signals from customers and prospects in your digital channels?','Contents MQL Vitamin'],
  ['feedback_loops','Data & Digital Activation','I_net_i','When customers react to your campaigns or communications, does your business learn from it and improve?','Contents MQL Vitamin'],
  ['channel_enablement','Data & Digital Activation','I_net_i','Do your digital channels help you generate useful information and respond in time?','Contents MQL Vitamin'],
  ['automation_level','Productivity','P_i','Are routine customer-related tasks automated wherever they reasonably could be?','SQL + Omnichannel + ATC Vitamin'],
  ['resource_efficiency','Productivity','P_i','Do your teams use their time and budget well when working on customer actions?','SQL + Omnichannel + ATC Vitamin'],
  ['execution_speed','Productivity','P_i','Once a priority is clear, can your company put it into action quickly?','SQL + Omnichannel + ATC Vitamin'],
  ['customer_purchase_history','Customer Value, Priority & Portfolio Health','CC_i','Do you clearly know which customers bought recently, how often they buy, and how much they spend?','RFM Vitamin'],
  ['customer_ranking','Customer Value, Priority & Portfolio Health','CC_i','Do you have a simple and reliable way to identify your most valuable customers?','Customer Centric & Cohorts Vitamin'],
  ['customer_evolution','Customer Value, Priority & Portfolio Health','CC_i','Can you tell when a customer is getting better, staying stable, or starting to decline?','RFM Dynamic Vitamin'],
  ['customer_risk','Customer Value, Priority & Portfolio Health','CC_i','Can you spot customers who may leave before you actually lose them?','LTV / Churn Control Vitamin'],
  ['customer_groups','Customer Value, Priority & Portfolio Health','CC_i','Do you group customers by behavior, value, or risk and follow how those groups change over time?','Cohorts Vitamin'],
  ['customer_satisfaction','Customer Value, Priority & Portfolio Health','NPS_i','Do you regularly check how satisfied your customers really are?','NPS Vitamin'],
  ['satisfaction_into_action','Customer Value, Priority & Portfolio Health','NPS_i','When customers show satisfaction or dissatisfaction, does your team do something with that information?','NPS Vitamin'],
  ['product_service_profitability','Customer Value, Priority & Portfolio Health','ABCD_i','Do you know which products or services bring the most margin or strategic value?','ABC Vitamin'],
  ['service_priority','Customer Value, Priority & Portfolio Health','ABCD_i','Do your best customers or most valuable offers receive the right level of service and attention?','ABC + SLA Vitamin'],
  ['priority_system','Customer Value, Priority & Portfolio Health','PrioritySystem_i','Do you combine customer value, customer behavior, satisfaction, and product value when deciding what to do first?','SPO Orchestration Vitamin'],
  ['portfolio_quality','Customer Value, Priority & Portfolio Health','Gamma_g_i_t','Is your customer base healthy, active, and well balanced from a commercial point of view?','LTV Vitamin'],
  ['churn_control','Customer Value, Priority & Portfolio Health','Gamma_g_i_t','Do you measure customer loss and keep it under control?','LTV / Churn Control Vitamin']
].map(([id, block, variable, question, vitamin]) => ({ id, block, variable, question, vitamin, weight: 1 }));

const STEPS = ['Identity','Decision','Objectives','Intelligence','Data & Digital Activation','Productivity','Customer Value, Priority & Portfolio Health','Business impact'];

const RULES = {
  phi_i:['Business Intelligence (BSC) Vitamin',1.1,'Clarify ownership, decision rights, and BSC-style executive governance.','Decision is too weak; the company is not governing customer value with enough clarity or discipline.'],
  u_i:['Customer Centric Vitamin',1,'Rebuild objective clarity around buyer persona, decision maker and value creation.','Objectives are not aligned enough to translate strategy into focused customer value.'],
  f_i:['Prompts Vitamin',1,'Strengthen interpretive logic, prompt systems and decision-support routines.','The company sees data but still lacks strong interpretation and action logic.'],
  DataActivation_i:['Keywords & Cohorts Vitamin',1,'Improve data readiness through keywords, cohorts and usable customer traces.','Customer data exists, but it is not activated reliably enough for execution.'],
  I_net_i:['Contents (MQL) Vitamin',.95,'Use content and MQL logic to generate, capture and recycle digital signals.','The digital system is underused as a living source of demand and learning.'],
  P_i:['SQL + Omnichannel + ATC Vitamin',1,'Accelerate execution through SQL logic, omnichannel orchestration and customer care.','The company loses speed and efficiency when moving from decision to execution.'],
  Gamma_g_i_t:['LTV / Churn Control Vitamin',1,'Improve lifetime value, portfolio balance and churn visibility.','The portfolio is exposed to churn, imbalance or weak customer lifetime value.'],
  CC_i:['RFM Vitamin',1.25,'Build dynamic RFM and customer movement visibility.','The business does not yet read customer evolution, risk and cohort movement clearly.'],
  NPS_i:['NPS Vitamin',1.15,'Measure satisfaction and connect it to action.','Customer satisfaction is not yet measured or activated as a management signal.'],
  ABCD_i:['ABC + SLA Vitamin',1.15,'Prioritize margin, strategic value and service level by value.','The business does not yet align profitability and service logic well enough.'],
  PrioritySystem_i:['SPO Orchestration Vitamin',1.3,'Integrate customer value, satisfaction, behavior and product value into one decision system.','Signals exist but they are not integrated into a true priority engine.']
};

function band(kai){
  if(kai < .0001) return ['Critical blockage','0.000% - 0.010%','The activation chain is broken at several points, and the real capacity to monetize value is almost zero.'];
  if(kai < .0005) return ['Very fragile','>0.010% - 0.050%','There is a minimal foundation, but the system is heavily constrained by simultaneous bottlenecks.'];
  if(kai < .002) return ['Emerging','>0.050% - 0.200%','There are signs of capability, but value is still not being activated consistently.'];
  if(kai < .0075) return ['Operable base','>0.200% - 0.750%','The organization is starting to become activatable, although major weaknesses remain.'];
  if(kai < .02) return ['Consistent','>0.750% - 2.000%','There is a reasonable monetization capacity, with clear room for improvement.'];
  if(kai < .05) return ['Solid','>2.000% - 5.000%','The chain is working in a fairly aligned way and is generating real activation capacity.'];
  return ['Advanced','>5.000%','The organization shows a robust, integrated, and repeatable ability to activate value.'];
}
function pct(v,d=1){return v===null||v===undefined||Number.isNaN(Number(v))?'n/a':`${(Number(v)*100).toFixed(d)}%`}
function money(v){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(v||0))}
function avg(arr){return arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:0}

function calculate(company,email,answers,business){
  const g={};
  QUESTIONS.forEach(q=>{(g[q.variable] ||= []).push(Math.max(0,Math.min(5,Number(answers[q.id]??3)))/5)});
  const input={phi_i:avg(g.phi_i||[]),u_i:avg(g.u_i||[]),f_i:avg(g.f_i||[]),DataActivation_i:avg(g.DataActivation_i||[]),I_net_i:avg(g.I_net_i||[]),CC_i:avg(g.CC_i||[]),ABCD_i:avg(g.ABCD_i||[]),NPS_i:avg(g.NPS_i||[]),P_i:avg(g.P_i||[]),Gamma_g_i_t:avg(g.Gamma_g_i_t||[]),PrioritySystem_i:avg(g.PrioritySystem_i||[])};
  input.psi_i=(input.DataActivation_i+input.I_net_i)/2;
  input.SPO_i=input.CC_i*input.ABCD_i*input.NPS_i;
  input.I_i_s=Number(business.potentialRevenue||0);
  input.R_i_s=Number(business.revenueRealizationPct||0)/100;
  input.E_i_s=Number(business.potentialEfficiency||0);
  input.Q_i_s=Number(business.efficiencyRealizationPct||0)/100;
  input.C_i=Number(business.attributableCost||0);
  input.WACC_t=Number(business.waccPct||0)/100;
  const KAI_i_star=input.phi_i*input.u_i*input.f_i*input.psi_i*input.SPO_i*input.P_i*input.Gamma_g_i_t;
  const MD_i=input.I_i_s*input.R_i_s+input.E_i_s*input.Q_i_s;
  const VA_i=KAI_i_star*MD_i;
  const ROI_i=input.C_i>0?(VA_i-input.C_i)/input.C_i:null;
  const CE_i=ROI_i!==null&&input.WACC_t>0?(ROI_i-input.WACC_t)/input.WACC_t:null;
  const b=band(KAI_i_star);
  const weak=Object.entries(RULES).map(([key,r])=>({key,score:input[key]||0,vitamin:r[0],action:r[2],reading:r[3],priority:(1-(input[key]||0))*r[1]})).sort((a,b)=>b.priority-a.priority).slice(0,5);
  return {company,email,input,out:{KAI_i_star,psi_i:input.psi_i,SPO_i:input.SPO_i,MD_i,VA_i,ROI_i,CE_i,CE_empresa:CE_i,V_percent_CE:CE_i&&CE_i>0?100:0,band:{name:b[0],range:b[1]},interpretation:b[2],weak,recommendation:CE_i!==null&&CE_i<0?'Prioritize the weakest structural levers before scaling acquisition. The current chain does not yet convert potential value into Customer Equity above capital cost.':'Scale the operating model carefully: protect the strongest KAI levers, improve SPO precision, and expand the diagnosis to more customer cohorts.'}};
}

export default function DiagnosisPage(){
  const defaults=useMemo(()=>Object.fromEntries(QUESTIONS.map(q=>[q.id,3])),[]);
  const [step,setStep]=useState(0);
  const [company,setCompany]=useState('');
  const [email,setEmail]=useState('');
  const [answers,setAnswers]=useState(defaults);
  const [business,setBusiness]=useState({potentialRevenue:100000,revenueRealizationPct:25,potentialEfficiency:12000,efficiencyRealizationPct:30,attributableCost:18000,waccPct:14});
  const [result,setResult]=useState(null);
  const current=STEPS[step];
  const progress=Math.round(((step+1)/STEPS.length)*100);
  const qs=QUESTIONS.filter(q=>q.block===current);
  function submit(){setResult(calculate(company||'Company',email,answers,business));}
  if(result){const o=result.out;return <main className="page"><section className="hero"><div className="wrap"><div className="logo"><span className="mark">DR</span><span>Doc ROI</span></div><p className="kicker">Executive diagnosis · KAI ROI equation</p><h1 className="title">{result.company}</h1><p className="lead">{o.interpretation}</p><div className="actions noPrint" style={{justifyContent:'flex-start',border:0,paddingTop:24}}><button className="btn primary" onClick={()=>window.print()}><Download size={16}/> Download PDF</button><a className="btn" href="https://docroi.marketing/doc-roi-consultation-2/">Book consultation</a><button className="btn" onClick={()=>alert('Email automation endpoint ready for n8n handoff.')}><Mail size={16}/> Send by email</button></div></div></section><section className="wrap"><div className="panel result"><div className="metrics"><Metric k="KAI_i*" v={pct(o.KAI_i_star,3)}/><Metric k="psi_i" v={pct(o.psi_i)}/><Metric k="SPO_i" v={pct(o.SPO_i)}/><Metric k="MD_i" v={money(o.MD_i)}/><Metric k="VA_i" v={money(o.VA_i)}/><Metric k="ROI_i" v={pct(o.ROI_i)}/><Metric k="CE_i" v={pct(o.CE_i)}/><Metric k="Range" v={o.band.name}/></div><div className="card" style={{marginTop:18}}><strong>Customer Equity diagnosis</strong><p>{o.recommendation}</p><p className="small">Official range: {o.band.range}</p></div><h2>Vitamin priorities</h2>{o.weak.map(l=><div className="vitamin" key={l.key}><strong>{l.vitamin} · {pct(l.score)}</strong><p>{l.reading}</p><p><b>Action:</b> {l.action}</p></div>)}</div></section></main>}
  return <main className="page"><section className="hero"><div className="wrap grid"><div><div className="logo"><span className="mark">DR</span><span>Doc ROI</span></div><p className="kicker">Doc ROI · Diagnosis System</p><h1 className="title">Executive KAI·ROI diagnosis</h1><p className="lead">Clinical hub to measure how your organization transforms customer data, intelligence, priority and productivity into Customer Equity above the cost of capital.</p><div className="visual"/></div><div className="panel form"><div className="stepHead"><div><p className="kicker" style={{margin:0}}>Clinical questionnaire</p><h2 className="stepTitle">{current}</h2></div><div className="progress"><span>{progress}%</span><div className="track"><div className="bar" style={{width:`${progress}%`}}/></div></div></div>{current==='Identity'&&<div className="fields"><Field label="Empresa" value={company} onChange={setCompany}/><Field label="Email" type="email" value={email} onChange={setEmail}/></div>}{qs.length>0&&qs.map(q=><div className="question" key={q.id}><div className="qtitle">{q.question}</div><div className="meta">{q.variable} · {q.vitamin}</div><div className="scale">{[0,1,2,3,4,5].map(v=><button key={v} type="button" className={answers[q.id]===v?'active':''} onClick={()=>setAnswers({...answers,[q.id]:v})}>{v}</button>)}</div></div>)}{current==='Business impact'&&<div className="fields">{[['Potential revenue per strategic client/service','potentialRevenue'],['Revenue realization percentage','revenueRealizationPct'],['Potential monetizable efficiency','potentialEfficiency'],['Efficiency realization percentage','efficiencyRealizationPct'],['Attributable cost','attributableCost'],['WACC percentage','waccPct']].map(([label,key])=><Field key={key} label={label} type="number" value={business[key]} onChange={v=>setBusiness({...business,[key]:Number(v)})}/>)}</div>}<div className="actions"><button className="btn" type="button" disabled={step===0} onClick={()=>setStep(Math.max(0,step-1))}><ArrowLeft size={16}/> Back</button>{step<STEPS.length-1?<button className="btn primary" type="button" onClick={()=>setStep(Math.min(STEPS.length-1,step+1))}>Continue <ArrowRight size={16}/></button>:<button className="btn primary" type="button" onClick={submit}><CheckCircle2 size={16}/> Generate executive diagnosis</button>}</div><p className="small">Scores use the Excel final scale: 0 = not at all, 5 = excellent.</p></div></div></section></main>
}
function Field({label,value,onChange,type='text'}){return <div className="field"><label>{label}<input type={type} value={value} onChange={e=>onChange(e.target.value)} /></label></div>}
function Metric({k,v}){return <div className="card"><strong>{k}</strong><span>{v}</span></div>}
