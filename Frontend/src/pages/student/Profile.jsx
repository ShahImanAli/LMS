import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  useLoadUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/features/api/authApi";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import { toast } from "sonner";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, error , refetch } = useLoadUserProfileQuery();

  const [
    updateUserProfile,
    {
      data: updateUserProfileData,
      error: updateUserProfileError,
      isLoading: updateUserProfileIsLoading,
      isSuccess: updateUserProfileIsSuccess,
    },
  ] = useUpdateUserProfileMutation();

  const user = data?.data?.user;

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (updateUserProfileIsSuccess) {
      refetch();
      toast.success("Profile updated successfully!");
      setIsDialogOpen(false); 
    }
    if (updateUserProfileError) {
      toast.error(
        updateUserProfileError?.data?.message ||
          updateUserProfileError?.message ||
          "Error updating profile",
      );
    }
  }, [updateUserProfileError, updateUserProfileIsSuccess]);

  const onChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);

    await updateUserProfile(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-[#020817]">
        <Loader2 className="animate-spin h-12 w-12 text-gray-900 dark:text-gray-100" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-[#020817]">
        <p className="text-red-500">Error loading profile: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#020817]">
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-10">
        <h1 className="font-extrabold text-center text-3xl mb-10 text-gray-900 dark:text-gray-100">Profile</h1>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
              <AvatarImage src={user?.photoUrl} alt={user?.name} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="mb-2">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 ">
                Name:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {" "}
                  {user?.name}
                </span>
              </h1>
            </div>
            <div className="mb-2">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 ">
                Email:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {" "}
                  {user?.email}
                </span>
              </h1>
            </div>
            <div className="mb-2">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 ">
                Role:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                  {" "}
                  {user?.role.toUpperCase()}
                </span>
              </h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="mt-2">
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Name</Label>
                    <Input
                      type="text "
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="col-span-3"
                    ></Input>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Profile Photo</Label>
                    <Input
                      type="file"
                      onChange={onChangeHandler}
                      accept="image/*"
                      className="col-span-3"
                    ></Input>
                  </div>
                </div>
                <DialogFooter>
                  <Button disabled={updateUserProfileIsLoading} onClick={updateUserHandler}>
                    {updateUserProfileIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
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
      </div>
      <div className="max-w-8xl mx-auto px-4 my-10">
        <h1 className="font-extrabold text-2xl text-center mb-10 text-gray-900 dark:text-gray-100">
          Courses You Are Enrolled In
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {user.enrolledCourses.length === 0 ? (
            <div className="col-span-full text-center">
              <p className="text-gray-500 dark:text-gray-400">
                You are not enrolled in any courses yet.
              </p>
            </div>
          ) : (
            user.enrolledCourses.map((course) => <Course key={course._id} course={course} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
