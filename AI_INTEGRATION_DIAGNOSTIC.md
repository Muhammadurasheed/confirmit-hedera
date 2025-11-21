# 🔬 AI Integration Diagnostic Plan

**Created**: 2025-11-21
**Status**: Debugging Phase
**Issue**: OCR text empty, forensic_findings missing, heatmap data invalid

---

## 🎯 What We've Added

### 1. AI Service Logging (`ai-service/app/routers/receipts.py`)
```python
# Now logs exact data being returned:
- ocr_text length and preview
- forensic_findings count
- technical_details keys
- heatmap shape
```

### 2. Orchestrator Logging (`ai-service/app/agents/orchestrator.py`)
```python
# Logs each agent's output:
- Vision Agent: ocr_text, merchant, amount, confidence
- Forensic Agent: manipulation_score, findings count, ELA data
- Final Response: Complete structure before returning
```

### 3. Backend Logging (`backend/src/modules/receipts/receipts.service.ts`)
```typescript
// Logs exact response from AI service:
- Full response keys
- ocr_text content and length
- forensic_details structure
- technical_details keys
- heatmap type and shape
```

---

## 📋 How to Test

### Step 1: Clear Previous Logs
- Stop backend and AI service
- Clear terminal logs

### Step 2: Restart Services
```bash
# Terminal 1: AI Service
cd ai-service
python run.py

# Terminal 2: Backend
cd backend
npm run start:dev
```

### Step 3: Scan a Receipt
1. Go to QuickScan page
2. Upload a receipt image
3. **WATCH THE LOGS CAREFULLY**

---

## 🔍 What to Look For in Logs

### AI Service Logs (Python)
Look for these markers:
```
✅ Vision Agent Result:
  - ocr_text length: XXX
  - ocr_text preview: "..."
  
✅ Forensic Agent Result:
  - forensic_findings: X items
  - technical_details keys: [...]
  - ELA heatmap: X rows
  
📊 ORCHESTRATOR FINAL RESPONSE:
  - ocr_text length: XXX
  - forensic_findings: X items
  - heatmap: X rows
```

### Backend Logs (NestJS)
Look for these markers:
```
🔍 BACKEND RECEIVED FROM AI SERVICE:
  - Full response keys: [...]
  - ocr_text: "..." (XXX chars)
  - forensic_details keys: [...]
  - technical_details keys: [...]
  - heatmap: X rows
```

---

## 🚨 Possible Issues & Solutions

### Issue 1: Empty OCR Text
**Symptom**: `ocr_text length: 0` in logs

**Possible Causes**:
- Tesseract not installed or not in PATH
- Image quality too poor
- Vision agent throwing exception

**Solution**:
- Check Tesseract installation: `tesseract --version`
- Check vision agent exception logs
- Verify Gemini API key is valid

### Issue 2: Missing forensic_findings
**Symptom**: `forensic_findings: 0 items` or missing in backend logs

**Possible Causes**:
- Forensic agent returning wrong structure
- Data not being serialized correctly
- Firestore not storing arrays properly

**Solution**:
- Check forensic agent's `_synthesize_forensic_verdict` return value
- Verify JSON serialization in orchestrator

### Issue 3: Invalid Heatmap
**Symptom**: `heatmap: 0 rows` or not a 2D array

**Possible Causes**:
- ELA analysis failing silently
- Heatmap generation error
- Data type mismatch (string instead of array)

**Solution**:
- Check ELA analysis logs
- Verify `_generate_ela_heatmap` returns `List[List[float]]`

---

## 🔧 Quick Fixes

### If Vision Agent Fails (Empty OCR):
```bash
# Install Tesseract (Ubuntu/Debian)
sudo apt-get install tesseract-ocr

# Windows: Download from
# https://github.com/UB-Mannheim/tesseract/wiki
```

### If Forensic Data Missing:
Check `ai-service/app/agents/forensic_agent.py` line 671-684:
```python
return {
    'forensic_findings': forensic_findings,  # Must be present
    'technical_details': {...}  # Must contain ela_analysis
}
```

### If Backend Not Receiving Data:
Check AI service is running on correct port:
```bash
# Should show: Running on http://127.0.0.1:8000
```

---

## 📊 Expected Log Output (Success Case)

### AI Service:
```
✅ Vision Agent Result:
  - ocr_text length: 450
  - ocr_text preview: "OPAY Transaction Receipt..."
  - merchant_name: OPAY
  - total_amount: 1500.00
  - confidence: 92

✅ Forensic Agent Result:
  - manipulation_score: 100
  - verdict: fraudulent
  - forensic_findings: 6 items
  - technical_details keys: ['pixel_results', 'ela_analysis', 'template_results', 'metadata_results']
  - ELA heatmap: 32 rows
  - ELA suspicious_regions: 17

📊 ORCHESTRATOR FINAL RESPONSE:
  - receipt_id: RCP-XXX
  - ocr_text length: 450
  - trust_score: 30
  - verdict: fraudulent
  - forensic_findings: 6 items
  - heatmap: 32 rows
  - suspicious_regions: 17
```

### Backend:
```
🔍 BACKEND RECEIVED FROM AI SERVICE:
  - Full response keys: ["receipt_id","trust_score","verdict","ocr_text","forensic_details",...]
  - ocr_text: "OPAY Transaction Receipt..." (450 chars)
  - Has forensic_details: true
  - forensic_details keys: ["ocr_confidence","manipulation_score","forensic_findings","technical_details",...]
  - forensic_findings: 6 items
  - technical_details: object
  - technical_details keys: ["pixel_results","ela_analysis","template_results","metadata_results"]
  - heatmap: 32 rows
```

---

## ✅ Next Steps

1. **Scan a receipt** and collect the logs
2. **Share the logs** showing the markers above
3. **Identify which stage** is failing (Vision? Forensic? Transfer? Storage?)
4. **Apply targeted fix** based on diagnosis

---

## 🙏 Bismillah - May Allah guide us to the solution

This diagnostic approach will pinpoint EXACTLY where data is being lost.
