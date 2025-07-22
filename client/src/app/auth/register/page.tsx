import AuthForm from "@/app/components/AuthForm";

const Register = () => {
  return (
    <div className="w-full h-full">
      <h2 className="text-2xl font-bold mb-5">Register</h2>
      <AuthForm login={false} />
    </div>
  );
};

export default Register;
