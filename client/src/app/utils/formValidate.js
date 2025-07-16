export const validateForm = (form, isLogin, fieldsToValidate = []) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
  const emailRegex = /\S+@\S+\.\S+/;
  //   const phoneRegex = /^\+92 3\d{2} \d{7}$/;
  const errors = {};

  const shouldValidate = (field) =>
    fieldsToValidate.length === 0 || fieldsToValidate.includes(field);

  if (shouldValidate("userName") && !isLogin && !form.userName) {
    errors.userName = "Name is required";
  }

  if (shouldValidate("userEmail")) {
    if (!form.userEmail) {
      errors.userEmail = "Email is required";
    } else if (!emailRegex.test(form.userEmail)) {
      errors.userEmail = "Email is invalid";
    }
  }

  if (shouldValidate("userPassword")) {
    if (!form.userPassword) {
      errors.userPassword = "Password is required";
    } else if (form.userPassword.length < 8) {
      errors.userPassword = "Password must be at least 8 characters long";
    } else if (form.userPassword.length > 20) {
      errors.userPassword = "Password must be at most 20 characters long";
    } else if (!passwordRegex.test(form.userPassword)) {
      errors.userPassword =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
  }

  if (
    shouldValidate("confirmPassword") &&
    form.userPassword !== form.confirmPassword &&
    !isLogin
  ) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (shouldValidate("role") && !isLogin && !form.role) {
    errors.role = "Choose a role";
  }

  //   if (
  //     shouldValidate("userContact") &&
  //     form.userContact &&
  //     !phoneRegex.test(form.userContact)
  //   ) {
  //     errors.userContact = "Phone number must be as Format: +92 3XX XXXXXXX";
  //   }

  return errors;
};
