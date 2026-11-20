const mongoose = require('mongoose');

const INITIAL_SEQUENCE = 999;

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: INITIAL_SEQUENCE }
});

const Counter = mongoose.model('Counter', counterSchema, 'counters');

function addSequence(schema, field) {
  // Allocate once per new document, even if it is validated again before save.
  schema.pre('validate', async function () {
    if (this.isNew && this.$locals.sequenceId === undefined) {
      // Initialize only missing counters so existing sequences are never reset.
      await Counter.updateOne(
        { _id: field },
        { $setOnInsert: { seq: INITIAL_SEQUENCE } },
        { upsert: true }
      );
      const counter = await Counter.findByIdAndUpdate(
        field,
        { $inc: { seq: 1 } },
        { new: true }
      );
      this.$locals.sequenceId = counter.seq;
    }
    if (this.isNew) {
      this[field] = this.$locals.sequenceId;
    }
  });
}

module.exports = { Counter, addSequence };
