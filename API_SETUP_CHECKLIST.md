# Free APIs - Setup & Installation Checklist

## 🚀 Quick Start (15 Minutes)

### Step 1: Get API Keys (5 min)

**Groq (AI):**
- [ ] Go to: https://console.groq.com/keys
- [ ] Sign up (free, no CC)
- [ ] Create API Key
- [ ] Copy key

**Resend (Email):**
- [ ] Go to: https://resend.com
- [ ] Sign up (free)
- [ ] Get API Key from dashboard
- [ ] Copy key

**Sentry (Error Tracking - Optional):**
- [ ] Go to: https://sentry.io
- [ ] Create free project
- [ ] Get DSN

---

### Step 2: Update .env

**File: `backend/.env`**
```
# Add these lines:
GROQ_API_KEY=gsk_...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@k2020-ohse.com
SENTRY_DSN=https://...@sentry.io/...
FRONTEND_URL=http://localhost:5173
```

---

### Step 3: Install Packages

```bash
cd backend

npm install \
  groq-sdk \
  resend \
  puppeteer \
  tesseract.js \
  qrcode \
  xlsx \
  chart.js \
  @sentry/node \
  @sentry/tracing

cd ../frontend

npm install \
  leaflet \
  leaflet-react \
  tesseract.js \
  qrcode.react \
  chart.js \
  react-chartjs-2 \
  @sentry/react \
  @sentry/tracing
```

Takes ~3-5 minutes

---

### Step 4: Create Service Files

Copy these to backend:
- [ ] `services/groqService.ts`
- [ ] `services/emailService.ts`
- [ ] `services/pdfService.ts`
- [ ] `services/ocrService.ts`
- [ ] `services/qrcodeService.ts`
- [ ] `services/excelService.ts`

---

### Step 5: Add API Routes

Add new endpoints to `backend/routes.ts`:
- [ ] POST `/api/analyze/boq`
- [ ] POST `/api/generate/risk-assessment`
- [ ] POST `/api/generate/method-statement`
- [ ] POST `/api/send/alert`
- [ ] POST `/api/generate/pdf/risk-assessment`
- [ ] POST `/api/ocr/extract`
- [ ] POST `/api/generate/qr`
- [ ] POST `/api/export/boq`

---

### Step 6: Test

```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Test endpoints
curl -X POST http://localhost:5000/api/analyze/boq \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"boqText":"Item 1 - Excavation 100 m3 @ R50/m3"}'
```

---

## Complete API List

### AI (Groq) ⭐
- ✅ Document analysis
- ✅ Risk assessment generation
- ✅ Method statement creation
- ✅ Compliance checklist
- ✅ Cost estimation

### Email (Resend)
- ✅ Compliance alerts
- ✅ Training reminders
- ✅ Certificate expiry
- ✅ Incident notifications
- ✅ Report delivery

### Documents
- ✅ PDF generation (Puppeteer)
- ✅ Excel export (SheetJS)
- ✅ Word documents (future)
- ✅ OCR scanning (Tesseract.js)

### Utilities
- ✅ QR codes (QRCode.js)
- ✅ Charts (Chart.js)
- ✅ Maps (Leaflet + OSM)
- ✅ Error tracking (Sentry)
- ✅ Analytics (Umami)

### Coming Soon (Ready to implement)
- [ ] SMS alerts (Vonage)
- [ ] Virus scanning (ClamAV)
- [ ] Advanced scheduling (Cron)

---

## Cost Breakdown

| Service | Cost | Limit |
|---------|------|-------|
| Groq | FREE | Unlimited |
| Resend | FREE | 100 emails/day |
| Puppeteer | FREE | Unlimited PDFs |
| Tesseract.js | FREE | Unlimited OCR |
| QRCode.js | FREE | Unlimited QR |
| SheetJS | FREE | Unlimited exports |
| Chart.js | FREE | Unlimited charts |
| Leaflet | FREE | Unlimited maps |
| Sentry | FREE | 10k errors/month |
| Umami | FREE | Unlimited (self-hosted) |

**TOTAL: $0/month ✅**

---

## File Structure

```
backend/
├── services/
│   ├── groqService.ts          (NEW)
│   ├── emailService.ts          (NEW)
│   ├── pdfService.ts            (NEW)
│   ├── ocrService.ts            (NEW)
│   ├── qrcodeService.ts         (NEW)
│   ├── excelService.ts          (NEW)
│   └── (existing services)
├── routes.ts                    (UPDATE - add new endpoints)
├── index.ts                     (UPDATE - add Sentry)
└── .env                         (UPDATE - add keys)

frontend/
├── src/
│   ├── lib/
│   │   └── apiExtended.ts       (NEW - API client)
│   ├── components/
│   │   ├── MapComponent.tsx     (NEW)
│   │   ├── ChartComponent.tsx   (NEW)
│   │   └── (existing)
│   └── pages/
│       └── (existing)
└── .env.production              (UPDATE - if needed)
```

---

## Implementation Order (Recommended)

### Phase 1: Core AI & Email (Day 1)
1. Install Groq + Resend
2. Add groqService.ts + emailService.ts
3. Add `/api/analyze/boq` endpoint
4. Test with curl
5. Connect frontend

### Phase 2: Documents (Day 2)
6. Install Puppeteer + Tesseract.js + SheetJS
7. Add pdfService.ts + ocrService.ts + excelService.ts
8. Add `/api/generate/pdf/*` endpoints
9. Add `/api/export/*` endpoints
10. Test all

### Phase 3: Utilities (Day 3)
11. Add QR codes
12. Add Charts
13. Add Maps
14. Add Error tracking
15. Deploy!

---

## Usage Examples

### Generate Risk Assessment
```typescript
import { generateRiskAssessment } from './services/groqService';

const risks = await generateRiskAssessment("Excavation of 1000m³ of soil");
// Returns formatted risk assessment
```

### Send Email Alert
```typescript
import { sendComplianceAlert } from './services/emailService';

await sendComplianceAlert(
  "manager@company.com",
  "Training Expired",
  "HSE Level 1 training has expired"
);
```

### Generate PDF
```typescript
import { generateRiskAssessmentPDF } from './services/pdfService';

const pdfPath = await generateRiskAssessmentPDF(
  "Project ABC",
  "<h1>Risks</h1>...",
  "risk-assessment.pdf"
);
```

### Export to Excel
```typescript
import { exportBOQToExcel } from './services/excelService';

const filepath = await exportBOQToExcel(boqItems, "project-boq");
```

---

## Troubleshooting

### Groq Rate Limiting?
- Groq is unlimited for reasonable use
- If hitting limits, contact Groq support

### Resend Email Limit?
- Free tier: 100 emails/day
- Upgrade to paid: $20/month for unlimited
- Or: Use Mailgun (1000/month free)

### Puppeteer Slow?
- First run downloads Chromium (~150MB)
- Subsequent runs are fast
- Normal for first PDF generation

### Tesseract.js Taking Long?
- First run downloads models (~50MB)
- Cache in browser storage
- Normal for first OCR

---

## Next Steps

1. ✅ Read this checklist
2. ✅ Get API keys (5 min)
3. ✅ Update .env (2 min)
4. ✅ Run: `npm install` (5 min)
5. ✅ Copy service files (5 min)
6. ✅ Add routes (10 min)
7. ✅ Test with curl (5 min)
8. ✅ Connect frontend (15 min)
9. ✅ Deploy! 🚀

**Total time: ~60 minutes for complete setup**

---

## Support

Need help?
- Groq Docs: https://console.groq.com/docs
- Resend Docs: https://resend.com/docs
- Puppeteer: https://pptr.dev
- Tesseract.js: https://tesseract.projectnaptha.com

You're all set! Let's build! 🚀
