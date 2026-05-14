# Doc ROI · KAI Diagnosis System

Aplicacion web Next.js para el diagnostico ejecutivo KAI ROI.

## URL principal

Cuando este desplegado en Vercel, abrir:

```text
/diagnosis
```

## Que incluye

- Landing de diagnostico estilo Doc ROI.
- Formulario multipaso con 30 preguntas.
- Escala del Excel final: 0 a 5.
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

- Informe ejecutivo HTML.
- Boton Download PDF mediante imprimir/guardar como PDF.
- CTA para consulta Doc ROI.

## Deploy en Vercel

1. Entrar en Vercel.
2. Add New Project.
3. Importar este repositorio GitHub.
4. Framework detectado: Next.js.
5. Pulsar Deploy.

No requiere variables de entorno para la beta inicial.

## Siguiente fase

En una fase posterior se puede conectar Supabase para guardar diagnosticos en base de datos y n8n para enviar emails automaticamente.
