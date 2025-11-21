# ConfirmIT Cloud Run Deployment Guide

## Prerequisites
- Google Cloud CLI installed (`gcloud`)
- Docker installed
- Google Cloud Project with billing enabled
- Artifact Registry API enabled

## Environment Setup

### 1. Set Environment Variables
```bash
export PROJECT_ID="your-gcp-project-id"
export REGION="us-central1"  # or your preferred region
export SERVICE_NAME="confirmit-ai-service"
export IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
```

### 2. Configure gcloud
```bash
gcloud config set project ${PROJECT_ID}
gcloud auth configure-docker
```

## Build and Deploy

### Option A: Build Locally and Push
```bash
# Navigate to AI service directory
cd ai-service

# Build Docker image
docker build -t ${IMAGE_NAME}:latest --platform linux/amd64 .

# Push to Google Container Registry
docker push ${IMAGE_NAME}:latest

# Deploy to Cloud Run
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --region ${REGION} \
  --platform managed \
  --memory 4Gi \
  --cpu 2 \
  --timeout 300s \
  --concurrency 10 \
  --max-instances 100 \
  --min-instances 1 \
  --set-env-vars ENVIRONMENT=production \
  --set-env-vars PORT=8080 \
  --allow-unauthenticated
```

### Option B: Cloud Build (Recommended)
```bash
# Submit build to Cloud Build
gcloud builds submit --tag ${IMAGE_NAME}:latest

# Deploy from Artifact Registry
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --region ${REGION} \
  --platform managed \
  --memory 4Gi \
  --cpu 2 \
  --timeout 300s \
  --concurrency 10 \
  --max-instances 100 \
  --min-instances 1 \
  --allow-unauthenticated
```

## Configure Secrets

### Using Secret Manager
```bash
# Create secrets
echo -n "your-gemini-api-key" | gcloud secrets create GEMINI_API_KEY --data-file=-
echo -n "your-firebase-project-id" | gcloud secrets create FIREBASE_PROJECT_ID --data-file=-
echo -n "your-cloudinary-url" | gcloud secrets create CLOUDINARY_URL --data-file=-

# Grant Cloud Run service account access
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Deploy with secrets
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --region ${REGION} \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest,FIREBASE_PROJECT_ID=FIREBASE_PROJECT_ID:latest,CLOUDINARY_URL=CLOUDINARY_URL:latest"
```

## Performance Optimization

### Resource Configuration
- **Memory**: 4Gi (for CV operations)
- **CPU**: 2 vCPUs (for parallel processing)
- **Timeout**: 300s (for complex forensic analysis)
- **Concurrency**: 10 (balance memory/requests)
- **Min Instances**: 1 (reduce cold starts)
- **Max Instances**: 100 (scale to demand)

### Monitoring
```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=${SERVICE_NAME}" \
  --limit 50 \
  --format "table(timestamp,textPayload)"

# Monitor metrics
gcloud monitoring dashboards list
```

## Cost Optimization

### 1. Request/Response Optimization
- Compressed image uploads (max 10MB)
- Efficient heatmap generation (32x32 grid)
- Smart caching of frequent analyses

### 2. Auto-scaling Configuration
```bash
gcloud run services update ${SERVICE_NAME} \
  --min-instances 0 \
  --max-instances 50 \
  --region ${REGION}
```

### 3. Budget Alerts
```bash
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT_ID \
  --display-name="ConfirmIT AI Service Budget" \
  --budget-amount=500USD \
  --threshold-rule=percent=90 \
  --threshold-rule=percent=100
```

## Health Checks

### Add Health Endpoint
The service includes:
- `/health` - Basic health check
- `/ready` - Readiness probe

### Configure in Cloud Run
```bash
gcloud run services update ${SERVICE_NAME} \
  --region ${REGION} \
  --startup-probe http,path=/health,period=10 \
  --liveness-probe http,path=/health,period=30
```

## CI/CD with GitHub Actions

Create `.github/workflows/deploy-ai-service.yml`:

```yaml
name: Deploy AI Service to Cloud Run

on:
  push:
    branches:
      - main
    paths:
      - 'ai-service/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - id: auth
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
      
      - name: Build and push
        run: |
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/confirmit-ai-service ai-service/
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy confirmit-ai-service \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/confirmit-ai-service \
            --region us-central1 \
            --platform managed \
            --memory 4Gi \
            --cpu 2 \
            --timeout 300s
```

## Troubleshooting

### Common Issues

1. **Out of Memory**
   - Increase memory to 8Gi
   - Reduce image processing size
   - Optimize numpy operations

2. **Cold Start Latency**
   - Set `--min-instances 1`
   - Use warm-up requests
   - Optimize dependencies

3. **Timeout Errors**
   - Increase `--timeout` to 540s (max)
   - Optimize forensic algorithms
   - Use async processing

### Debug Commands
```bash
# View service details
gcloud run services describe ${SERVICE_NAME} --region ${REGION}

# Stream logs
gcloud alpha run services logs tail ${SERVICE_NAME} --region ${REGION}

# Check revisions
gcloud run revisions list --service ${SERVICE_NAME} --region ${REGION}
```

## Production Checklist

- [ ] Secrets configured via Secret Manager
- [ ] Health checks configured
- [ ] Monitoring and alerts set up
- [ ] Budget alerts configured
- [ ] Min instances set to 1
- [ ] Concurrency tuned for workload
- [ ] Logging configured
- [ ] Error tracking (Sentry) integrated
- [ ] Load testing completed
- [ ] Backup/disaster recovery plan
- [ ] Documentation updated

## Estimated Costs

Based on typical usage:
- **Compute**: $0.024/vCPU-hour + $0.0025/GiB-hour
- **Requests**: $0.40 per million
- **Networking**: $0.12/GiB (egress)

**Example (10,000 receipts/month)**:
- Avg 15s processing time
- 4Gi memory, 2 vCPUs
- Estimated: ~$50-100/month

**Scale (100,000 receipts/month)**:
- With optimizations
- Min instances: 1, Max: 50
- Estimated: ~$300-500/month

---

Allahu Musta'an! 🚀
