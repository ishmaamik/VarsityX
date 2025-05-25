import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'BDT'
  },
  status: {
    type: String,
    enum: ['Initiated', 'Processing', 'Completed', 'Failed', 'Cancelled', 'Refunded'],
    default: 'Initiated'
  },
  paymentDetails: {
    tran_id: String,
    val_id: String,
    amount: Number,
    card_type: String,
    store_amount: Number,
    card_no: String,
    bank_tran_id: String,
    status: String,
    tran_date: Date,
    error: String,
    currency: String,
    card_issuer: String,
    card_brand: String,
    card_issuer_country: String,
    card_issuer_country_code: String,
    store_id: String,
    verify_sign: String,
    verify_key: String,
    risk_level: Number,
    risk_title: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction; 