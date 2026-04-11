import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const title = "Tabs with Forms";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const navigate = useNavigate();
  
  const [
    registerUser,
    {
      data: registerUserData,
      error: registerUserError,
      isLoading: registerUserIsLoading,
      isSuccess: registerUserIsSuccess,
    },
  ] = useRegisterUserMutation();

  const [
    loginUser,
    {
      data: loginUserData,
      error: loginUserError,
      isLoading: loginUserIsLoading,
      isSuccess: loginUserIsSuccess,
    },
  ] = useLoginUserMutation();

  const handleRegistration = async (e, type) => {
    e.preventDefault();
    const inputData = type === "signup" ? signupData : loginData;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if (registerUserIsSuccess) {
      toast.success("Registration successful! You can now login.");
      setSignupData({ name: "", email: "", password: "", role: "student" });

    }
    if (registerUserError) {
      const errorMsg = registerUserError?.data?.message || "Registration failed. User may already exist.";
      toast.error(errorMsg);
    }
  }, [registerUserIsSuccess, registerUserError]);

  useEffect(() => {
    if (loginUserIsSuccess) {
      toast.success("Login successful!");
      navigate("/");
    }
    if (loginUserError) {
      const errorMsg = loginUserError?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMsg);
    }
  }, [loginUserIsSuccess, loginUserError]);

  const changeInputHandler = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "login") {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setSignupData({ ...signupData, [name]: value });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Tabs className="w-full max-w-md " defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Login</h3>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access your account.
              </p>
            </div>
            <form className="space-y-4" onSubmit={(e) => handleRegistration(e, "login")}>
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  placeholder="name@example.com"
                  type="email"
                  required={true}
                  name="email"
                  value={loginData.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  required={true}
                  name="password"
                  value={loginData.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                />
              </div>
              <Button
                disabled={loginUserIsLoading}
                className="w-full"
                type="submit"
              >
                {loginUserIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </div>
        </TabsContent>
        <TabsContent value="register">
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Signup</h3>
              <p className="text-sm text-muted-foreground">
                Fill in the details below to create your account.
              </p>
            </div>
            <form className="space-y-4" onSubmit={(e) => handleRegistration(e, "signup")}>
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <Input
                  id="register-name"
                  placeholder="John Doe"
                  type="text"
                  required={true}
                  name="name"
                  value={signupData.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  placeholder="name@example.com"
                  type="email"
                  required={true}
                  name="email"
                  value={signupData.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  required={true}
                  name="password"
                  value={signupData.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>
              <div className="space-y-3">
                <Label>Register as</Label>
                <RadioGroup
                  value={signupData.role}
                  onValueChange={(value) => setSignupData({ ...signupData, role: value })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="cursor-pointer font-normal">
                      Student
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="instructor" id="instructor" />
                    <Label htmlFor="instructor" className="cursor-pointer font-normal">
                      Instructor
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button
                disabled={registerUserIsLoading}
                className="w-full"
                type="submit"
              >
                {registerUserIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
