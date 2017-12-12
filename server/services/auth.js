const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Employee = mongoose.model('employee');

passport.serializeUser((employee, done) => {
  done(null,employee.id);
});

passport.deserializeUser((id, done) => {
  Employee.findById(id, (err, employee) => {
    done(err, employee);
  });
});

passport.use(new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
  Employee.findOne({ email: email.toLowerCase() }, (err, employee) => {
    // console.log("passport.use:",employee);
    if(err) { return done(err); }
    if(!employee) { return done(null, false, 'Invalid Crendentials'); }
    employee.comparePassword(password, (err, isMatch) => {
      if(err) { return done(err); }
      if(isMatch) { return done(null, employee); }
      return done(null, false, 'Invalid crendentials.');
    });
  });
}));

function signup({ email, password, first_name, last_name, req }) {
  const employee = new Employee({ email, password, first_name, last_name});
  if(!email || !password) { throw new Error('You must provide an email and password.');}

  return Employee.findOne({ email })
  .then(existingUser => {
    if(existingUser) { throw new Error('Email in use'); }
    return employee.save();
  })
  .then(employee => {
    return new Promise((resolve, reject) => {
      req.logIn(employee,(err) => {
        if(err) {reject(err); }
        resolve(employee);
      });
    });
  });
}

function login({ email, password, req }) {
  // console.log('email:',email);
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, employee) => {
      // console.log(employee);
      if (!employee) { reject('Invalid credentials.') }
      req.login(employee, () => resolve(employee));
    })({ body: { email, password } });
  });
}

module.exports = { signup, login };
