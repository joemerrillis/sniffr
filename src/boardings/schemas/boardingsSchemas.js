// src/boardings/schemas/boardingsSchemas.js

export const boardingSchemas = {
  Boarding: {
    $id: 'Boarding',
    type: 'object',
    properties: {
      id:                   { type: 'string', format: 'uuid' },
      tenant_id:            { type: 'string', format: 'uuid' },
      drop_off_day:         { type: 'string', format: 'date' },
      drop_off_block:       { type: ['string', 'null'] },
      drop_off_time:        { type: ['string', 'null'], pattern: '^([0-1]?\\d|2[0-3]):([0-5]\\d)(:[0-5]\\d)?$' },
      pick_up_day:          { type: 'string', format: 'date' },
      pick_up_block:        { type: ['string', 'null'] },
      pick_up_time:         { type: ['string', 'null'], pattern: '^([0-1]?\\d|2[0-3]):([0-5]\\d)(:[0-5]\\d)?$' },
      price:                { type: 'number' },
      status:               { type: 'string', enum: [
        'draft', 'approved', 'booked', 'purchased', 'scheduled', 'completed', 'canceled'
      ] },
      notes:                { type: ['string', 'null'] },
      proposed_drop_off_time: { type: ['string', 'null'], pattern: '^([0-1]?\\d|2[0-3]):([0-5]\\d)$' },
      proposed_pick_up_time:  { type: ['string', 'null'], pattern: '^([0-1]?\\d|2[0-3]):([0-5]\\d)$' },
      created_at:           { type: 'string', format: 'date-time' },
      proposed_changes:     { type: ['object', 'null'] },
      user_id:              { type: 'string', format: 'uuid' },
      is_draft:             { type: ['boolean', 'null'] },
      approved_by:          { type: ['string', 'null'], format: 'uuid' },
      approved_at:          { type: ['string', 'null'], format: 'date-time' },
      booking_id:           { type: ['string', 'null'], format: 'uuid' },
      final_price:          { type: ['number', 'null'] },
      dogs: {
        type: 'array',
        items: { type: 'string', format: 'uuid' },
        description: "Dog IDs associated with this boarding."
      }
    },
    required: [
      'id','tenant_id','drop_off_day',
      'pick_up_day','status','created_at','user_id'
    ]
  },

  // This is the new part for response envelopes
  BoardingResponseEnvelope: {
    $id: 'BoardingResponseEnvelope',
    type: 'object',
    properties: {
      boarding: { $ref: 'Boarding#' },
      service_dogs: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id:         { type: 'string', format: 'uuid' },
            service_type: { type: 'string' },
            service_id:   { type: 'string', format: 'uuid' },
            dog_id:       { type: 'string', format: 'uuid' }
          }
        }
      },
      breakdown: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            rule_type: { type: 'string' },
            description: { type: ['string', 'null'] },
            adjustment: { type: 'number' },
            price_so_far: { type: 'number' }
          }
        }
      }
    }
  },

  // ... (the rest of your schemas remain as before)

  CreateBoarding: {
    $id: 'CreateBoarding',
    type: 'object',
    properties: {
      tenant_id:      { type: 'string', format: 'uuid' },
      drop_off_day:   { type: 'string', format: 'date' },
      drop_off_block: { type: ['string', 'null'] },
      drop_off_time:  { type: ['string', 'null'], pattern: '^([0-1]?\\d|2[0-3]):([0-5]\\d)$' },
      pick_up_day:    { type: 'string', format: 'date' },
      pick_up_block:  { type: ['string', 'null'] },
      pick_up_time:   { type: ['string', 'null'], pattern: '^([0-1]?\\d|2[0-3]):([0-5]\\d)$' },
      notes:          { type: ['string', 'null'] },
      proposed_drop_off_time: { type: ['string', 'null'], pattern: '^([0-1]?\\d|2[0-3]):([0-5]\\d)$' },
      proposed_pick_up_time:  { type: ['string', 'null'], pattern: '^([0-1]?\\d|2[0-3]):([0-5]\\d)$' },
      proposed_changes:     { type: ['object', 'null'] },
      booking_id:           { type: ['string', 'null'], format: 'uuid' },
      is_draft:             { type: ['boolean', 'null'] },
      final_price:          { type: ['number', 'null'] },
      dogs: {
        type: 'array',
        items: { type: 'string', format: 'uuid' },
        description: "Dog IDs to associate with this boarding. If omitted, all dogs owned by the user will be included."
      }
    },
    required: [
      'tenant_id','drop_off_day','pick_up_day'
    ]
  },
  UpdateBoarding: {
    $id: 'UpdateBoarding',
    type: 'object',
    properties: {
      drop_off_day:   { type: 'string', format: 'date' },
      drop_off_block: { type: ['string', 'null'] },
      drop_off_time:  { type: ['string', 'null'], pattern: '^([0-1]?\\d|2[0-3]):([0-5]\\d)$' },
      pick_up_day:    { type: 'string', format: 'date' },
      pick_up_block:  { type: ['string', 'null'] },
      pick_up_time:   { type: ['string', 'null'], pattern: '^([0-1]?\\d|2[0-3]):([0-5]\\d)$' },
      price:          { type: 'number' },
      status:         { type: 'string', enum: [
        'draft', 'approved', 'booked', 'purchased', 'scheduled', 'completed', 'canceled'
      ] },
      notes:          { type: ['string', 'null'] },
      proposed_drop_off_time: { type: ['string', 'null'], pattern: '^([0-1]?\\d|2[0-3]):([0-5]\\d)$' },
      proposed_pick_up_time:  { type: ['string', 'null'], pattern: '^([0-1]?\\d|2[0-3]):([0-5]\\d)$' },
      proposed_changes:     { type: ['object', 'null'] },
      booking_id:           { type: ['string', 'null'], format: 'uuid' },
      is_draft:             { type: ['boolean', 'null'] },
      approved_by:          { type: ['string', 'null'], format: 'uuid' },
      approved_at:          { type: ['string', 'null'], format: 'date-time' },
      final_price:          { type: ['number', 'null'] },
      dogs: {
        type: 'array',
        items: { type: 'string', format: 'uuid' },
        description: "Dog IDs to associate with this boarding. If omitted, all dogs owned by the user will be included."
      }
    }
    // PATCH = partial, no required array
  }
};
