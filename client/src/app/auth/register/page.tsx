import AuthForm from "@/app/components/AuthForm";
import Title from "@/app/components/Title";

const Register = () => {
  return (
    <div className="w-full h-full">
      <Title text="Register" className="text-white" />
      <AuthForm login={false} />
    </div>
  );
};

export default Register;
