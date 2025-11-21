# API Documentation

Base URL: `http://localhost:5000/api`

## Endpoints

### Health Check

#### GET /health
Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Rate-My-Client API is running"
}
```

---

## Clients

### GET /clients
Get all clients with their review statistics.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Client Name",
    "company": "Company Name",
    "industry": "Tech",
    "created_at": "2025-11-21 06:00:00",
    "review_count": 5,
    "average_rating": 3.5
  }
]
```

### GET /clients/:id
Get a specific client by ID.

**Parameters:**
- `id` (path): Client ID

**Response:**
```json
{
  "id": 1,
  "name": "Client Name",
  "company": "Company Name",
  "industry": "Tech",
  "created_at": "2025-11-21 06:00:00"
}
```

### GET /clients/search/:query
Search for clients by name or company.

**Parameters:**
- `query` (path): Search term

**Response:**
```json
[
  {
    "id": 1,
    "name": "Client Name",
    "company": "Company Name",
    "industry": "Tech",
    "created_at": "2025-11-21 06:00:00",
    "review_count": 5,
    "average_rating": 3.5
  }
]
```

### POST /clients
Create a new client.

**Request Body:**
```json
{
  "name": "Client Name",
  "company": "Company Name (optional)",
  "industry": "Industry Type (optional)"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Client Name",
  "company": "Company Name",
  "industry": "Industry Type"
}
```

### GET /clients/:id/stats
Get detailed statistics for a client.

**Parameters:**
- `id` (path): Client ID

**Response:**
```json
{
  "total_reviews": 10,
  "average_rating": 3.5,
  "avg_payment_promptness": 4.2,
  "avg_communication_quality": 3.8,
  "would_work_again_count": 6,
  "scope_creep_count": 3
}
```

---

## Reviews

### GET /reviews
Get all reviews with client information.

**Response:**
```json
[
  {
    "id": 1,
    "client_id": 1,
    "rating": 4,
    "title": "Great to work with",
    "description": "Detailed review text...",
    "red_flags": "[\"Late payments\"]",
    "would_work_again": true,
    "payment_promptness": 4,
    "communication_quality": 5,
    "scope_creep_issue": false,
    "created_at": "2025-11-21 06:00:00",
    "client_name": "Client Name",
    "client_company": "Company Name"
  }
]
```

### GET /reviews/:id
Get a specific review by ID.

**Parameters:**
- `id` (path): Review ID

**Response:**
```json
{
  "id": 1,
  "client_id": 1,
  "rating": 4,
  "title": "Great to work with",
  "description": "Detailed review text...",
  "red_flags": "[\"Late payments\"]",
  "would_work_again": true,
  "payment_promptness": 4,
  "communication_quality": 5,
  "scope_creep_issue": false,
  "created_at": "2025-11-21 06:00:00",
  "client_name": "Client Name",
  "client_company": "Company Name"
}
```

### GET /reviews/client/:clientId
Get all reviews for a specific client.

**Parameters:**
- `clientId` (path): Client ID

**Response:**
```json
[
  {
    "id": 1,
    "client_id": 1,
    "rating": 4,
    "title": "Great to work with",
    "description": "Detailed review text...",
    "red_flags": "[\"Late payments\"]",
    "would_work_again": true,
    "payment_promptness": 4,
    "communication_quality": 5,
    "scope_creep_issue": false,
    "created_at": "2025-11-21 06:00:00",
    "client_name": "Client Name",
    "client_company": "Company Name"
  }
]
```

### POST /reviews
Create a new review.

**Request Body:**
```json
{
  "client_id": 1,
  "rating": 4,
  "title": "Great to work with",
  "description": "Detailed review text...",
  "red_flags": ["Late payments", "Scope creep"],
  "would_work_again": true,
  "payment_promptness": 4,
  "communication_quality": 5,
  "scope_creep_issue": false
}
```

**Validation:**
- `client_id` (required): Must be a valid client ID
- `rating` (required): Integer between 1 and 5
- `title` (required): String
- `description` (required): String
- `red_flags` (optional): Array of strings
- `would_work_again` (optional): Boolean
- `payment_promptness` (optional): Integer between 1 and 5
- `communication_quality` (optional): Integer between 1 and 5
- `scope_creep_issue` (optional): Boolean

**Response:**
```json
{
  "id": 1,
  "client_id": 1,
  "rating": 4,
  "title": "Great to work with",
  "description": "Detailed review text..."
}
```

### PUT /reviews/:id
Update an existing review.

**Parameters:**
- `id` (path): Review ID

**Request Body:**
Same as POST /reviews (all fields optional except those you want to update)

**Response:**
```json
{
  "message": "Review updated successfully"
}
```

### DELETE /reviews/:id
Delete a review.

**Parameters:**
- `id` (path): Review ID

**Response:**
```json
{
  "message": "Review deleted successfully"
}
```

---

## AI Analysis

### POST /ai/analyze-job-post
Analyze a job post for red flags.

**Request Body:**
```json
{
  "jobPostText": "Looking for a passionate developer willing to work for exposure..."
}
```

**Response:**
```json
{
  "score": 43,
  "riskLevel": "High",
  "flags": [
    "Offers \"exposure\" instead of payment",
    "Unrealistic availability expectations (24/7)",
    "Unlimited revisions mentioned"
  ],
  "details": [
    {
      "flag": "Offers \"exposure\" instead of payment",
      "severity": 10,
      "matched": true
    }
  ],
  "summary": "Found 3 red flag(s) in this job post.",
  "recommendations": [
    "⚠️ HIGH RISK: Multiple red flags detected. Carefully evaluate before proceeding.",
    "Request clear payment terms in writing before starting.",
    "Always use a written contract with clear scope and payment terms."
  ]
}
```

**Risk Levels:**
- **Low** (0-20): Generally safe, minor concerns
- **Medium** (21-40): Some warning signs, ask clarifying questions
- **High** (41-60): Multiple red flags, proceed with caution
- **Critical** (61-100): Severe red flags, high risk

**Red Flag Types Detected:**
1. Exposure/portfolio mentions
2. 24/7 availability expectations
3. Urgent/ASAP language
4. Low budget emphasis
5. Free/unpaid work
6. Unlimited revisions
7. Equity/profit share payment
8. Downplays work complexity
9. Personal favor language
10. Unpaid overtime expectations
11. Startup warnings
12. Deferred payment

### GET /ai/scans
Get history of AI scans (last 50).

**Response:**
```json
[
  {
    "id": 1,
    "job_post_text": "Original job post text...",
    "red_flag_score": 43,
    "detected_flags": "[\"flag1\", \"flag2\"]",
    "analysis": "{\"score\": 43, ...}",
    "created_at": "2025-11-21 06:00:00"
  }
]
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message"
}
```

---

## Examples

### Complete Workflow Example

1. **Create a client:**
```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Corp","company":"Acme Inc","industry":"Tech"}'
```

2. **Submit a review:**
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": 1,
    "rating": 2,
    "title": "Poor experience",
    "description": "Client changed requirements constantly...",
    "red_flags": ["Scope creep", "Poor communication"],
    "would_work_again": false,
    "payment_promptness": 1,
    "communication_quality": 2,
    "scope_creep_issue": true
  }'
```

3. **Search for the client:**
```bash
curl http://localhost:5000/api/clients/search/Acme
```

4. **Analyze a suspicious job post:**
```bash
curl -X POST http://localhost:5000/api/ai/analyze-job-post \
  -H "Content-Type: application/json" \
  -d '{"jobPostText":"Need developer ASAP! Great exposure opportunity. Must be available 24/7!"}'
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing rate limiting to prevent abuse.

## CORS

The API currently accepts requests from all origins. For production, configure CORS to only allow requests from your frontend domain.
