const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const invoiceSchema = new Schema({
  orderId: Number,
  userEmail : {type: String, required: true},
  delivery: {
    to: {type: String, required: true},
    address: {type: String, required: true},
    phone: String
  },
  requestedGoods:[{
    name : {type: String, required: true},
    code : {type: String, required: true},
    qutt : {type: Number, required: true}
  }],
  requestedDate : { type: Date, default: Date.now },
  requestDesc: String
});

// module.exports = mongoose.model('invoice', invoiceSchema)


const InvoiceClass = mongoose.model('invoice', invoiceSchema)

module.exports = InvoiceClass;
