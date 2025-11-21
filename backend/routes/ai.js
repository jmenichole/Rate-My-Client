import express from 'express';
import db from '../database.js';

const router = express.Router();

// AI-based red flag detection for job posts
router.post('/analyze-job-post', async (req, res) => {
  const { jobPostText } = req.body;
  
  if (!jobPostText) {
    res.status(400).json({ error: 'Job post text is required' });
    return;
  }
  
  try {
    // Simple rule-based red flag detection
    // In production, this would integrate with OpenAI or similar API
    const analysis = analyzeJobPost(jobPostText);
    
    // Save to database
    db.run(
      `INSERT INTO ai_scans (job_post_text, red_flag_score, detected_flags, analysis)
       VALUES (?, ?, ?, ?)`,
      [jobPostText, analysis.score, JSON.stringify(analysis.flags), JSON.stringify(analysis.details)],
      function(err) {
        if (err) {
          console.error('Error saving scan:', err);
        }
      }
    );
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get scan history
router.get('/scans', (req, res) => {
  db.all(
    'SELECT * FROM ai_scans ORDER BY created_at DESC LIMIT 50',
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Helper function for red flag detection
function analyzeJobPost(text) {
  const textLower = text.toLowerCase();
  const flags = [];
  let score = 0;
  
  // Red flag patterns and their severity
  const redFlagPatterns = [
    { pattern: /exposure|portfolio piece|good for your resume|visibility/i, 
      flag: 'Offers "exposure" instead of payment', severity: 10 },
    { pattern: /24\/7|always available|round the clock|anytime/i, 
      flag: 'Unrealistic availability expectations (24/7)', severity: 8 },
    { pattern: /urgent|asap|immediately|right away|today/i, 
      flag: 'Unrealistic urgency/timeline', severity: 5 },
    { pattern: /low budget|cheap|inexpensive|minimal cost/i, 
      flag: 'Emphasizes low budget', severity: 6 },
    { pattern: /free|no budget|unpaid|volunteer/i, 
      flag: 'No or minimal payment offered', severity: 10 },
    { pattern: /revisions|unlimited changes|as many changes/i, 
      flag: 'Unlimited revisions mentioned', severity: 7 },
    { pattern: /equity|profit share|when we make money/i, 
      flag: 'Payment based on equity/profit instead of guaranteed', severity: 8 },
    { pattern: /small task|quick job|simple|easy/i, 
      flag: 'Downplays work complexity', severity: 4 },
    { pattern: /family member|friend|help me out/i, 
      flag: 'Personal favor language', severity: 6 },
    { pattern: /passionate|dedicated|committed|go the extra mile/i, 
      flag: 'Expects unpaid overtime/extra work', severity: 5 },
    { pattern: /startup|new business|just starting/i, 
      flag: 'Startup (may have payment reliability issues)', severity: 3 },
    { pattern: /we\'ll pay later|payment after launch|deferred payment/i, 
      flag: 'Deferred or conditional payment', severity: 9 }
  ];
  
  const details = [];
  
  redFlagPatterns.forEach(({ pattern, flag, severity }) => {
    if (pattern.test(text)) {
      flags.push(flag);
      score += severity;
      details.push({
        flag,
        severity,
        matched: true
      });
    }
  });
  
  // Normalize score to 0-100
  const normalizedScore = Math.min(100, score);
  
  // Determine risk level
  let riskLevel = 'Low';
  if (normalizedScore > 60) riskLevel = 'Critical';
  else if (normalizedScore > 40) riskLevel = 'High';
  else if (normalizedScore > 20) riskLevel = 'Medium';
  
  return {
    score: normalizedScore,
    riskLevel,
    flags,
    details,
    summary: flags.length > 0 
      ? `Found ${flags.length} red flag(s) in this job post.`
      : 'No major red flags detected.',
    recommendations: getRecommendations(normalizedScore, flags)
  };
}

function getRecommendations(score, flags) {
  if (score === 0) {
    return ['This job post looks relatively safe. Still, verify payment terms before starting work.'];
  }
  
  const recommendations = [];
  
  if (score > 60) {
    recommendations.push('🚨 CRITICAL: High risk job post. Proceed with extreme caution.');
  } else if (score > 40) {
    recommendations.push('⚠️ HIGH RISK: Multiple red flags detected. Carefully evaluate before proceeding.');
  } else if (score > 20) {
    recommendations.push('⚠️ MEDIUM RISK: Some concerning elements. Ask clarifying questions.');
  }
  
  if (flags.some(f => f.includes('exposure') || f.includes('unpaid'))) {
    recommendations.push('Request clear payment terms in writing before starting.');
  }
  
  if (flags.some(f => f.includes('24/7') || f.includes('availability'))) {
    recommendations.push('Set clear boundaries about working hours and availability.');
  }
  
  if (flags.some(f => f.includes('unlimited revisions'))) {
    recommendations.push('Define a specific number of revisions in your contract.');
  }
  
  if (flags.some(f => f.includes('equity') || f.includes('deferred'))) {
    recommendations.push('Insist on upfront payment or milestone-based payments.');
  }
  
  recommendations.push('Always use a written contract with clear scope and payment terms.');
  
  return recommendations;
}

export default router;
