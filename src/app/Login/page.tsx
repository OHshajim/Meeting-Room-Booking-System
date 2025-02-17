import { SignIn } from "@clerk/nextjs";

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  );
};

export default Login;
