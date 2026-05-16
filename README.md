# Doc ROI · KAI Diagnosis System

Aplicacion web Next.js para el diagnostico ejecutivo KAI ROI.

## URL principal

Cuando este desplegado en Vercel, abrir:

```text
/diagnosis
```

## Version actual

Diagnosticador C-Level breve para alimentar la Ecuacion KAI ROI v1 respetando su estructura formal. La capa de cuestionario e interpretacion es operativa y no redefine la formula oficial.

## Regla formal

La formula oficial no se modifica, no se simplifica y no se sustituye por conceptos operativos.

```text
KAI_i* = phi_i · u_i · f_i · psi_i · SPO_i · P_i · Gamma_g(i),t
psi_i = promedio(DataActivation_i, I_net_i)
SPO_i = CC_i · ABCD_i · NPS_i
MD_i = sum_s(I_i,s · R_i,s + E_i,s · Q_i,s)
CE_i = ((((KAI_i* · MD_i) - C_i) / C_i) - WACC_t) / WACC_t
CE_empresa = sum_i CE_i
V%CE = (100 / N) · sum_i 1(CE_i > 0)
```

## Que incluye

- Landing de diagnostico estilo Doc ROI.
- Formulario multipaso C-Level.
- Escala ejecutiva 1 a 5 sin respuestas preseleccionadas.
- Consentimiento RGPD obligatorio antes de enviar el diagnostico.
- Guardado de consentimiento, fecha, texto legal y URL de politica de privacidad.
- Normalizacion a rango 0 a 1.
- Validacion de datos faltantes antes del calculo.
- Diferenciacion entre dato faltante y cero real declarado por el usuario.
- Calculo de variables intermedias: psi_i, SPO_i, MD_i y KAI_i*.
- Calculo de CE_i, CE_empresa y V%CE.
- Resultado ejecutivo interpretado.
- Payload estructurado preparado para Google Sheets, Looker Studio y n8n.

## Mapeo del cuestionario

- phi_i: factor de inteligencia aplicado a la decision sobre la unidad i. No se interpreta como relacion, frecuencia ni engagement.
- u_i: input estructural multiplicativo oficial y parametrizable. No se redefine semanticamente.
- f_i: funcion o factor operativo parametrizable dentro del nucleo KAI.
- DataActivation_i: primera entrada oficial para calcular psi_i.
- I_net_i: segunda entrada oficial para calcular psi_i.
- CC_i: primer componente oficial de SPO_i.
- ABCD_i: segundo componente oficial de SPO_i.
- NPS_i: tercer componente oficial de SPO_i.
- P_i: variable multiplicativa oficial independiente.
- Gamma_g(i),t: variable oficial de grupo/segmento y tiempo.

## Datos economicos

El bloque economico captura un escenario s inicial:

- I_i,s
- R_i,s
- E_i,s
- Q_i,s
- C_i
- WACC_t

MD_i se calcula como sumatorio sobre escenarios s. La beta usa un escenario inicial `s1`, dejando la estructura preparada para multiples escenarios.

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
4. Responder las preguntas C-Level.
5. Introducir los datos economicos.
6. Generar diagnostico.
7. Verificar que aparecen KAI_i*, psi_i, SPO_i, MD_i, CE_i, CE_empresa y V%CE con interpretacion ejecutiva.
8. Comprobar en Supabase que se han guardado empresa, diagnostico, respuestas, resultados y consentimiento RGPD.
