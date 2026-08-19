const ASPECT_KEYWORDS = {
  Battery: ['battery', 'charge', 'charging', 'backup', 'power'],
  Price: ['price', 'cost', 'money', 'value', 'worth', 'cheap', 'expensive'],
  Quality: ['quality', 'build', 'material', 'durability', 'durable'],
  Delivery: ['delivery', 'shipping', 'packaging', 'arrived', 'package'],
};

export const extractAspects = (reviews) => {
  const aspectStats = {
    Battery: { positive: 0, negative: 0 },
    Price: { positive: 0, negative: 0 },
    Quality: { positive: 0, negative: 0 },
    Delivery: { positive: 0, negative: 0 },
  };

  reviews.forEach(({ review, sentiment }) => {
    const text = review.toLowerCase();
    const isPositive = sentiment === 'POSITIVE';

    Object.entries(ASPECT_KEYWORDS).forEach(([aspect, keywords]) => {
      const matches = keywords.some((kw) => text.includes(kw));
      if (matches) {
        if (isPositive) aspectStats[aspect].positive += 1;
        else aspectStats[aspect].negative += 1;
      }
    });
  });

  return aspectStats;
};