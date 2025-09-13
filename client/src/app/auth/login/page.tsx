import AuthForm from "@/app/components/AuthForm";
import Title from "@/app/components/Title";

const Login = () => {
  return (
    <div className="w-full">
      <Title text="Login" className="text-white" />
      <AuthForm login={true} />
    </div>
  );
};

export default Login;
