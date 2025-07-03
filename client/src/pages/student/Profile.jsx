import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Course from "./Course";
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const { data: userData, isLoading: isUserLoading, refetch } = useLoadUserQuery();
  const { data: purchasedData, isLoading: isPurchasedLoading } = useGetPurchasedCoursesQuery();

  const [updateUser, { data: updateUserData, isLoading: isUpdating, isError, error, isSuccess }] =
    useUpdateUserMutation();

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(updateUserData?.message || "Profile updated.");
    }
    if (isError) {
      toast.error(error?.message || "Failed to update profile");
    }
  }, [isSuccess, isError]);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  if (isUserLoading || isPurchasedLoading)
    return <h1 className="text-center mt-10">Loading Profile...</h1>;

  const user = userData?.user;
  const purchasedCourses = purchasedData?.purchasedCourse
    ?.map(p => p.courseId)
    ?.filter(Boolean) || [];

  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              src={
                user?.photoUrl ||
                "https://tse1.mm.bing.net/th?id=OIP.JI82FNKJMOX_56pzAY-TjQHaHa&pid=Api&P=0&h=180"
              }
              alt="User avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div className="w-full">
          <div className="mb-2 font-medium text-gray-900 dark:text-gray-100">
            Name: <span className="font-normal">{user?.name}</span>
          </div>
          <div className="mb-2 font-medium text-gray-900 dark:text-gray-100">
            Email: <span className="font-normal">{user?.email}</span>
          </div>
          <div className="mb-2 font-medium text-gray-900 dark:text-gray-100">
            Role: <span className="font-normal">{user?.role?.toUpperCase()}</span>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="New name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button disabled={isUpdating} onClick={handleUpdateProfile}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <h1 className="font-medium text-lg mb-3">Courses you're enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {purchasedCourses.length === 0 ? (
            <p>You haven't enrolled in any courses yet.</p>
          ) : (
            purchasedCourses.map((course) => (
              <Course key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
