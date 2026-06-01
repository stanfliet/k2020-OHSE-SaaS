# ⚡ QUICK INTEGRATION GUIDE: Add Free APIs to Your Platform

## 🎯 FASTEST PATH: Email + Error Logging (10 minutes total)

---

## 1️⃣ EMAIL NOTIFICATIONS (Resend) - 5 MINUTES

### A. Create Resend Account
1. Go to https://resend.com
2. Sign up (free)
3. Copy API key from dashboard
4. Add to `.env`: `RESEND_API_KEY=your_key_here`

### B. Install Package
```bash
cd backend
npm install resend
```

### C. Create Email Service
Create `backend/emailService.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTrainingExpiryAlert(
  email: string,
  trainingName: string,
  expiryDate: string
) {
  try {
    await resend.emails.send({
      from: 'alerts@k2020-ohse.com',
      to: email,
      subject: `⚠️ ${trainingName} Expires on ${expiryDate}`,
      html: `
        <h2>Training Certification Expiring Soon</h2>
        <p>Your <strong>${trainingName}</strong> certification expires on <strong>${expiryDate}</strong></p>
        <p>Please renew your certification to maintain compliance.</p>
        <a href="https://yourapp.com/training">Manage Training</a>
      `
    });
  } catch (error) {
    console.error('Email send failed:', error);
  }
}

export async function sendIncidentAlert(
  email: string,
  incident: any
) {
  try {
    await resend.emails.send({
      from: 'alerts@k2020-ohse.com',
      to: email,
      subject: `🚨 Critical Incident: ${incident.title}`,
      html: `
        <h2>New Incident Report</h2>
        <p><strong>Title:</strong> ${incident.title}</p>
        <p><strong>Description:</strong> ${incident.description}</p>
        <p><strong>Project:</strong> ${incident.project_id}</p>
        <a href="https://yourapp.com/incidents/${incident.id}">View Incident</a>
      `
    });
  } catch (error) {
    console.error('Email send failed:', error);
  }
}

export async function sendComplianceReminder(
  email: string,
  complianceItem: any
) {
  try {
    await resend.emails.send({
      from: 'alerts@k2020-ohse.com',
      to: email,
      subject: `📋 Compliance Deadline: ${complianceItem.name}`,
      html: `
        <h2>Compliance Deadline Approaching</h2>
        <p><strong>${complianceItem.name}</strong> is due soon.</p>
        <p>Deadline: <strong>${complianceItem.due_date}</strong></p>
        <a href="https://yourapp.com/compliance">View Compliance</a>
      `
    });
  } catch (error) {
    console.error('Email send failed:', error);
  }
}
```

### D. Wire to Routes
In `backend/routes.ts`, update training endpoint:
```typescript
// Add this at top
import { sendTrainingExpiryAlert } from './emailService';

// In training POST endpoint, add:
trainingRouter.post('/', async (req: Request & { user?: any }, res: Response) => {
  try {
    const { project_id, training_type, completion_date, expiry_date } = req.body;

    const { data, error } = await supabase
      .from('training_records')
      .insert({
        user_id: req.user.id,
        project_id,
        training_type,
        completion_date,
        expiry_date,
      })
      .select()
      .single();

    if (error) throw error;

    // Send email alert for expiry
    if (req.user.email && expiry_date) {
      await sendTrainingExpiryAlert(req.user.email, training_type, expiry_date);
    }

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
```

### E. Test It
```bash
npm start
# Create a training record via API
# Check your email (check spam folder)
```

---

## 2️⃣ ERROR LOGGING (Sentry) - 5 MINUTES

### A. Create Sentry Account
1. Go to https://sentry.io
2. Sign up (free)
3. Create new project → Select Node.js for backend, React for frontend
4. Copy DSN (looks like: `https://xxxxx@xxxxx.ingest.sentry.io/12345`)

### B. Install Packages
```bash
# Backend
cd backend
npm install @sentry/node @sentry/integrations

# Frontend
cd ../frontend
npm install @sentry/react @sentry/tracing
```

### C. Configure Backend
At top of `backend/index.ts`, add:
```typescript
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Initialize SENTRY BEFORE other middleware
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
    new Sentry.Integrations.Http({ tracing: true }),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

// Add Sentry error handler (AFTER all routes, BEFORE app.listen)
app.use(Sentry.Handlers.errorHandler());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Sentry initialized');
});
```

### D. Configure Frontend
In `frontend/src/main.tsx`, add:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### E. Add Environment Variables
In `backend/.env`:
```
SENTRY_DSN=your_sentry_dsn_here
```

In `frontend/.env`:
```
VITE_SENTRY_DSN=your_sentry_dsn_here
```

### F. Test It
```bash
# Backend
curl http://localhost:3000/api/test-error

# Frontend (in browser console)
throw new Error('Test error');

# Check Sentry dashboard - errors appear in real-time!
```

---

## 3️⃣ MAPS (Leaflet) - 5 MINUTES

### A. Install Packages
```bash
cd frontend
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
```

### B. Add CSS to `frontend/src/App.tsx`
```typescript
import 'leaflet/dist/leaflet.css';
```

### C. Create Map Component
Create `frontend/src/components/MapComponent.tsx`:
```typescript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix marker icons (Leaflet quirk)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapProps {
  latitude?: number;
  longitude?: number;
  title?: string;
}

export function MapComponent({ latitude = -25.7461, longitude = 28.2313, title = 'Site Location' }: MapProps) {
  return (
    <MapContainer center={[latitude, longitude]} zoom={15} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[latitude, longitude]}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  );
}
```

### D. Use in Projects Page
In `frontend/src/pages/Projects.tsx`:
```typescript
import { MapComponent } from '../components/MapComponent';

// In your project detail view, add:
<MapComponent 
  latitude={selectedProject?.latitude || -25.7461}
  longitude={selectedProject?.longitude || 28.2313}
  title={selectedProject?.name}
/>
```

### E. Test It
```bash
npm run dev
# Go to Projects page - see map with site locations!
```

---

## 4️⃣ SUPABASE REALTIME (Already Included!) - 2 MINUTES

### A. Enable in Frontend
In any component that needs real-time updates:
```typescript
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Listen for new incidents in real-time
useEffect(() => {
  const subscription = supabase
    .from('incident_reports')
    .on('INSERT', (payload) => {
      console.log('New incident:', payload.new);
      // Update your state here
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

### B. That's It!
No setup needed - Supabase realtime is already configured!

---

## 📋 PRIORITY ORDER

```
1. Deploy current app (HIGHEST PRIORITY)
   └─ Time: 60-90 minutes
   └─ No new APIs needed

2. Add Email (NEXT)
   └─ Time: 5 minutes
   └─ Setup Resend account: 2 min
   └─ Add code: 3 min

3. Add Error Logging (NEXT)
   └─ Time: 5 minutes
   └─ Setup Sentry: 2 min
   └─ Add code: 3 min

4. Add Maps (NICE TO HAVE)
   └─ Time: 5 minutes
   └─ No account needed
   └─ Just add code

5. Add SMS (LATER)
   └─ Time: 10 minutes
   └─ For emergencies only
```

---

## 🚀 DEPLOYMENT SEQUENCE

### Week 1: Deploy Core App
1. `npm start` (backend)
2. Deploy to Render
3. Deploy to Vercel
4. Test all pages

### Week 2: Add Email
1. Create Resend account (2 min)
2. Add emailService.ts (3 min)
3. Wire to endpoints (2 min)
4. Test and deploy (2 min)

### Week 3: Add Error Tracking
1. Create Sentry account (2 min)
2. Add Sentry to backend (3 min)
3. Add Sentry to frontend (2 min)
4. Deploy and verify (2 min)

### Optional: Add Maps
1. Install leaflet (1 min)
2. Create MapComponent (2 min)
3. Add to Projects page (2 min)
4. Deploy and verify (1 min)

---

## 💾 ALL REQUIRED ENVIRONMENT VARIABLES

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
RESEND_API_KEY=your_resend_key
SENTRY_DSN=your_sentry_dsn
NODE_ENV=production
```

### Frontend (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://your-backend.onrender.com
VITE_SENTRY_DSN=your_sentry_dsn
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Email sending works
- [ ] Errors logged to Sentry
- [ ] Maps display correctly
- [ ] Realtime updates working
- [ ] All modules still functional
- [ ] No breaking changes
- [ ] Ready to show to customers!

---

## 📞 SUPPORT

If any API fails to integrate:
1. Check environment variables are set
2. Check API keys are valid
3. Check npm packages installed
4. Check no typos in code
5. Restart `npm start`

All APIs are optional - app works without them!

---

**You can implement all of these in under 1 hour!** ⚡
