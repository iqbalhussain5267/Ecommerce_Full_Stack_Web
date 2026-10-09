import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setuser } from "@/redux/userSlice";

export default function Profile() {
  const { user } = useSelector((store) => store.user);
  const fileInputRef = useRef(null);
  const params = useParams();
  const userId = params.userId;
  const dispatch = useDispatch();

  // FIX 1: Corrected useState syntax
  const [updateduser, setupdateduser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "", // FIX 2: Fixed typo (zipCOde -> zipCode)
    profilePic: user?.profilePic || "",
    role: user?.role || "",
  });

  const [loading, setLoading] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null); // FIX 5: Separated File object from component state

  // FIX 3: Dynamic syncing when Redux store updates or loads asynchronously
  useEffect(() => {
    if (user) {
      setupdateduser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        zipCode: user.zipCode || "",
        profilePic: user.profilePic || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setupdateduser({ ...updateduser, [e.target.name]: e.target.value });
  };

  const handlePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setupdateduser({ ...updateduser, profilePic: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    
    try {
      // FIX 4: Corrected native 'new FormData()' capitalization
      const formData = new FormData();
      formData.append("firstName", updateduser.firstName);
      formData.append("lastName", updateduser.lastName);
      formData.append("email", updateduser.email);
      formData.append("phone", updateduser.phone);
      formData.append("address", updateduser.address);
      formData.append("city", updateduser.city);
      formData.append("zipCode", updateduser.zipCode);
      formData.append("role", updateduser.role);
      
      // FIX 5: Appended the valid image binary file 
      if (profilePicFile) {
        formData.append("file",profilePicFile);
      }

      setLoading(true);
      const res = await axios.put(
        `http://localhost:3005/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data", // FIX 6: Capitalized 'form-data'
          },
        }
      );
console.log(res.data)
      if (res.data.success) {
        toast.success(res.data.message || "Profile updated successfully!");
        dispatch(setuser(res.data.user));
      }
    } catch (err) {
      console.error(err);
      
      // FIX 7: Safely checked error response structures to avoid crash
      const errorMsg = err.response?.data?.error?.message || err.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setLoading(false); // FIX 8: Moved state reset inside clean execution flow
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4 flex justify-center">
      <Card className="w-full max-w-3xl shadow-lg border-pink-100 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-pink-600">
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Hidden Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePicture}
            />
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-pink-200 bg-pink-100 flex items-center justify-center">
                {updateduser.profilePic ? (
                  <img
                    src={updateduser.profilePic}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-14 w-14 text-pink-400" />
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4 border-pink-300 text-pink-600 hover:bg-pink-50"
                onClick={() => fileInputRef.current.click()}
              >
                <Camera className="mr-2 h-4 w-4" /> Change Picture
              </Button>
            </div>
            {/* Form */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName" // FIX 9: Added 'name' attributes to inputs
                  value={updateduser.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={updateduser.lastName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={updateduser.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={updateduser.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={updateduser.address}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={updateduser.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipcode"
                  name="zipCode" // FIX 2: Synced naming variations
                  value={updateduser.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white h-11"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
