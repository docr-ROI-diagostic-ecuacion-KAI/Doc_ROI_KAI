import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function supabaseAdmin(){
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(request){
  try{
    const body = await request.json();
    if(!body?.rgpdConsent?.accepted){
      return NextResponse.json({ ok:false, error:'RGPD consent is required' }, { status:400 });
    }

    const supabase = supabaseAdmin();
    if(!supabase){
      return NextResponse.json({ ok:true, mode:'no-db-configured', warning:'Supabase env vars are not configured yet.' });
    }

    const companyName = body.company || 'Company';
    const email = body.email || '';
    const context = body.context || {};
    const rgpd = body.rgpdConsent;

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .upsert({
        name: companyName,
        contact_email: email,
        sector: context.sector || null,
        company_size: context.companySize || null,
        digital_maturity: context.digitalMaturity || null,
        rgpd_consent: true,
        rgpd_consent_at: rgpd.acceptedAt,
        rgpd_consent_text: rgpd.text,
        marketing_consent: true,
        privacy_policy_url: rgpd.privacyPolicyUrl
      }, { onConflict: 'contact_email' })
      .select('id')
      .single();

    if(companyError) return NextResponse.json({ ok:false, error:companyError.message }, { status:500 });

    const { data: session, error: sessionError } = await supabase
      .from('diagnosis_sessions')
      .insert({
        company_id: company.id,
        email,
        raw_answers: body.raw_answers || {},
        normalized_inputs: body.normalized_inputs || {},
        calculated_outputs: body.calculated_outputs || {},
        rgpd_consent: true,
        rgpd_consent_at: rgpd.acceptedAt,
        rgpd_consent_text: rgpd.text,
        rgpd_legal_basis: rgpd.legalBasis,
        marketing_consent: true,
        privacy_policy_url: rgpd.privacyPolicyUrl
      })
      .select('id')
      .single();

    if(sessionError) return NextResponse.json({ ok:false, error:sessionError.message }, { status:500 });

    const score = body.score || {};
    const cards = body.variable_cards || [];
    if(cards.length){
      await supabase.from('questionnaire_answers').insert(cards.map((card) => ({
        session_id: session.id,
        question_id: card.id,
        block: 'C-Level diagnosis',
        variable: card.variable,
        question_text: card.question,
        raw_value: score[card.id] || card.raw || 0,
        normalized_value: card.normalized || 0,
        weight: 1
      })));
    }

    const out = body.calculated_outputs || {};
    await supabase.from('kai_results').insert({
      session_id: session.id,
      kai_i_star: out.KAI_i_star || 0,
      psi_i: out.psi_i || 0,
      spo_i: out.SPO_i || 0,
      md_i: out.MD_i || 0,
      va_i: out.VA_i || 0,
      roi_i: out.ROI_i ?? null,
      ce_i: out.CE_i ?? null,
      calculated_outputs: out
    });

    return NextResponse.json({ ok:true, session_id: session.id });
  }catch(error){
    return NextResponse.json({ ok:false, error:error instanceof Error ? error.message : 'Unexpected error' }, { status:500 });
  }
}
