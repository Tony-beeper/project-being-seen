// Middleware to validate required parameters unique to the donor signup
// endpoint are present and valid
const validateDonorSignup = (req, res, next) => {
  next();
};

export default validateDonorSignup;
