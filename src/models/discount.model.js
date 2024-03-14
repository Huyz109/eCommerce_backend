'use strict'

const {model, Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';
// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    discount_name: {
        type: String,
        required: true
    },
    discount_description: {
        type: String,
        required: true
    },
    discount_type: {
        type: String,
        default: 'fixed_amount'
    },
    discount_value: {
        type: Number,
        required: true
    },
    discount_code: {
        type: String,
        required: true
    },
    discount_start_date: {
        type: Date,
        required: true
    },
    discount_end_date: {
        type: Date,
        required: true
    },
    discount_end_date: {
        type: Date,
        required: true
    },
    discount_used_count: {
        type: Number,
        required: true
    },
    discount_users_used: {
        type: Array,
        required: []
    },
    discount_max_use_per_user: {
        type: Number,
        required: true
    },
    discount_min_order_value: {
        type: Number,
        required: true
    },
    discount_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    discount_isActive: {
        type: Boolean,
        default: true
    },
    discount_applies_to: {
        type: String,
        required: true,
        enum: ['all', 'specific']
    },
    discount_productIds: {
        type: Array,
        default: []
    },

},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);