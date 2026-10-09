import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// import axios from "ajax"; // Note: Fixed potential typo from your import if needed, change back to "axios" if local config differs
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setuser } from "@/redux/userSlice"; 

const Login = () => {
  const [ShowPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formdata, setformdata] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setformdata((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3005/api/v1/user/login", formdata, {
        headers: { "Content-Type": "application/json" }
      });
      
      if (res.data.success) {
        toast.success(res.data.message);
        if (res.data.user) {
          dispatch(setuser(res.data.user)); 
          localStorage.setItem("accessToken", res.data.accessToken);
        }
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login To Your Account</CardTitle>
          <CardDescription>
            Enter your details below to login your account
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={submitHandler}>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  name="email" 
                  placeholder="m@example.com" 
                  value={formdata.email} 
                  onChange={HandleChange} 
                  required 
                />
              </div>
              
              {/* Password Field */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-pink-600 hover:text-pink-700 hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    value={formdata.password} 
                    onChange={HandleChange} 
                    placeholder="Enter your password" 
                    type={ShowPassword ? "text" : "password"} 
                    className="pr-12"
                    required 
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                    {ShowPassword ? (
                      <EyeOff onClick={() => setShowPassword(false)} className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
                    ) : (
                      <Eye onClick={() => setShowPassword(true)} className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
                    )}
                  </div>
                  
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait
                </div>
              ) : (
                "Login"
              )}
            </Button>
            
            <p className="text-gray-500 text-sm mt-2 text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="text-pink-700 font-medium hover:underline">
                Create Your Account
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
