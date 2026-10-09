import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const Signup = () => {
  const [ShowPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formdata,setformdata]=useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })

const navigate=useNavigate()

  const HandleChange=(e)=>{
    const { name, value } = e.target;
    setformdata((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }

  const submitHandler=async (e)=>{
    e.preventDefault();
    try{
      setLoading(true)
      const res=await axios.post("http://localhost:3005/api/v1/user/signup",formdata,{
        headers:{
          "Content-Type":"application/json"
        }
      })
if(res.data.success){
   toast.success(res.data.message)
  navigate("/verify")
 
}
    }catch(err){
      console.log(err)
      toast.error(err.response.data.message)
    }finally
  {
    setLoading(false)
  }
  }
  console.log(formdata)
  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
        
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name='firstName'
                    type="text"
                    placeholder="Iqbal"
                    value={formdata.firstName}
                    onChange={HandleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Hussain"
                     value={formdata.lastName}
                    onChange={HandleChange}
                    required
                  />
                </div>
              </div>

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

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input 
                  id="password"
                  name="password"
                   value={formdata.password}
                    onChange={HandleChange}
                  placeholder="Enter your password"
                   type={ShowPassword ? "text" : "password"}
                    required />
                    
{
  ShowPassword ? <EyeOff onClick={()=>setShowPassword(false)} className="h-5 w-5 text-gray-700 absolute right-5 bottom-2" /> : <Eye onClick={()=>setShowPassword(true)} className="h-5 w-5 text-gray-700 absolute right-5 bottom-2"/>
}

                </div>
              </div>
            </div>
        
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button onClick={submitHandler} type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={loading}>
           {loading ? <>
           <Loader2 className="h-4 w-4 animate-spin">Please wait</Loader2>
           </>:"signup"}
          </Button>
         <p className="text-gray-500">Already have an account ? <Link to="/login" className="text-pink-800 hover:underline">Login</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
