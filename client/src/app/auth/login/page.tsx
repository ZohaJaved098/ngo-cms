import AuthForm from "@/app/components/AuthForm";

const Login = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-5">Login</h2>
      <AuthForm login={true} />
    </div>
  );
};

export default Login;
