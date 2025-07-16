import AuthForm from "@/app/components/AuthForm";

const Register = () => {
  return (
    <div className="max-w-md mx-auto my-5">
      <h2 className="text-2xl font-bold mb-5">Register</h2>
      <AuthForm login={false} />
    </div>
  );
};

export default Register;
