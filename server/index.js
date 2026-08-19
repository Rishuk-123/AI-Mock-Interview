import { extractAspects } from './aspects.js';

// Inside app.post('/api/analyze', ...)
const rawReviews = await scrapeReviews(url);
const analyzedReviews = await analyzeSentiments(rawReviews);
const aspectBreakdown = extractAspects(analyzedReviews);

const payload = {
  productUrl: url,
  summary: { totalReviews: total, positiveCount, negativeCount, positiveRatio },
  aspects: aspectBreakdown,
  data: analyzedReviews,
};