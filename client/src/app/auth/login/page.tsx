import AuthForm from "@/app/components/AuthForm";

const Login = () => {
  return (
    <div className="max-w-md mx-auto my-5">
      <h2 className="text-2xl font-bold mb-5">Login</h2>
      <AuthForm login={true} />
    </div>
  );
};

export default Login;
