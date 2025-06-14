// src/pricingRules/schemas/pricePreviewSchemas.js

export const PricePreview = {
  $id: 'PricePreview',
  type: 'object',
  properties: {
    price:      { type: 'number' },
    breakdown:  { type: 'array', items: { type: 'object' } }
    // Add more fields if you want!
  },
  required: ['price']
};
