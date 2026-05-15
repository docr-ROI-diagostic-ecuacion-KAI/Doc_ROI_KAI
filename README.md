# Doc ROI · KAI Diagnosis System

Aplicacion web Next.js para el diagnostico ejecutivo KAI ROI.

## URL principal

Cuando este desplegado en Vercel, abrir:

```text
/diagnosis
```

## Version actual

Cuestionario C-Level reducido a 10 preguntas, alineado con la tabla KAI/JAI indicada.

## Que incluye

- Landing de diagnostico estilo Doc ROI.
- Formulario multipaso con 10 preguntas C-Level.
- Escala ejecutiva 1 a 5.
- Consentimiento RGPD obligatorio antes de enviar el diagnostico.
- Guardado de consentimiento, fecha, texto legal y URL de politica de privacidad.
- Accion recomendada automatica cuando una palanca puntua 3 o menos.
- Normalizacion a rango 0 a 1.
- Calculo oficial KAI ROI:

```text
KAI_i* = phi_i · u_i · f_i · psi_i · SPO_i · P_i · Gamma_g(i),t
psi_i = average(DataActivation_i, I_net_i)
SPO_i = CC_i · ABCD_i · NPS_i
MD_i = sum(I_i,s · R_i,s + E_i,s · Q_i,s)
VA_i = KAI_i* · MD_i
ROI_i = (VA_i - C_i) / C_i
CE_i = (ROI_i - WACC_t) / WACC_t
```

## Variables cubiertas

- phi_i: alineacion estrategica.
- u_i: madurez decisional.
- f_i: activacion relacional.
- psi_i: dato + inteligencia.
- SPO_i/RFM: comportamiento cliente.
- SPO_i/ABC: optimizacion portfolio.
- SPO_i/NPS: experiencia cliente.
- Modelo SPO: orquestacion comercial diagnostica.
- P_i: productividad empresarial.
- Gamma_g(i),t: salud de cartera.

## RGPD

El diagnostico pide consentimiento explicito antes de guardar o usar los datos para seguimiento comercial relacionado con las recomendaciones.

Se guarda:

- consentimiento aceptado.
- fecha y hora de aceptacion.
- texto legal mostrado al usuario.
- base legal: consentimiento explicito.
- URL de politica de privacidad.

URL configurada en la app:

```text
https://docroi.marketing/politica-de-privacidad/
```

## Supabase

Para guardar los diagnosticos en base de datos:

1. Entrar en Supabase.
2. Abrir el proyecto Doc ROI.
3. Ir a SQL Editor.
4. Ejecutar el contenido actualizado de `db/schema.sql`.
5. En Vercel, abrir el proyecto.
6. Ir a Settings > Environment Variables.
7. Crear estas variables:

```text
NEXT_PUBLIC_SUPABASE_URL=Project URL de Supabase
SUPABASE_SERVICE_ROLE_KEY=service_role key de Supabase
```

Despues de guardar las variables, hacer Redeploy en Vercel.

## Tablas principales

- companies
- diagnosis_sessions
- questionnaire_answers
- kai_results
- diagnosis_reports
- diagnostic_interpretation_rules

Los campos RGPD estan en `companies` y `diagnosis_sessions` para trazabilidad legal.

## Deploy en Vercel

1. Entrar en Vercel.
2. Add New Project.
3. Importar este repositorio GitHub.
4. Framework detectado: Next.js.
5. Pulsar Deploy.

Cada cambio enviado a GitHub despliega una nueva version automaticamente.

## n8n

La integracion de n8n puede usar los datos guardados para enviar emails, registrar leads o disparar acciones comerciales. Solo debe activarse para usuarios con RGPD aceptado.

## Prueba completa

1. Abrir `/diagnosis`.
2. Introducir empresa, email, sector, tamano y madurez digital.
3. Aceptar el consentimiento RGPD.
4. Responder las 10 preguntas.
5. Introducir los datos economicos.
6. Generar diagnostico.
7. Verificar que aparece el informe ejecutivo con lectura, riesgo, recomendacion, vitamina y prioridad por variable.
8. Comprobar en Supabase que se han guardado empresa, diagnostico, respuestas, resultados y consentimiento RGPD.
