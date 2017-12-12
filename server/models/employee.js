const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  job_title: {
    type: String
  },
  password: {
    type: String
  },
  isBeverageFetcher: Boolean,
  companies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'company'
    }
  ],
  favorite_drinks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'drink'
    }
  ]
});
EmployeeSchema.pre('save', function save(next) {
  const employee = this;
  if (!employee.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(employee.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      employee.password = hash;
      next();
    });
  });
});

EmployeeSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

const Employee = mongoose.model('employee', EmployeeSchema);

module.exports = Employee;
