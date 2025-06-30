import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import DarkMode from "@/DarkMode.jsx";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User logged out.");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 dark:bg-gray-900 bg-white text-black dark:text-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 ">
            <img
              src="https://cdn-icons-png.flaticon.com/512/538/538931.png"
              alt="logo"
              className="w-8 h-8 md:w-10 md:h-10 object-cover dark:bd-white-900 dark:text-white dark:border-b-white-800"
            />
            <h1 className="hidden md:block font-bold text-lg md:text-xl">E-Learning</h1>
          </Link>
        </div>



        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <Avatar>
                    <AvatarImage
                      src={
                        user?.photoUrl ||
                        "https://tse1.mm.bing.net/th?id=OIP.JI82FNKJMOX_56pzAY-TjQHaHa&pid=Api&P=0&h=180"
                      }
                      alt={user?.name || "User Avatar"}
                    />
                    <AvatarFallback>
                      {user?.name
                        ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                        : "CN"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="/my-learning">My learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}

          {/* ✅ Use DarkMode directly — no button wrapper */}
          <DarkMode />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <Link to="/">
          <h1 className="font-extrabold text-2xl">E-Learning</h1>
        </Link>
        <MobileNavbar user={user} />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({ user }) => {
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  const logoutHandler = async () => {
    const result = await logoutUser().unwrap();
    toast.success(result?.message || "User logged out.");
    navigate("/login");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full hover:bg-gray-200" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>
            <Link to="/">E-Learning</Link>
          </SheetTitle>
          <SheetDescription className="sr-only">Mobile navigation</SheetDescription>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2 my-4" />
        <nav className="flex flex-col space-y-4">
          <SheetClose asChild>
            <Link to="/my-learning">My Learning</Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/profile">Edit Profile</Link>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline" onClick={logoutHandler}>
              Log out
            </Button>
          </SheetClose>
          {user?.role === "instructor" && (
            <SheetClose asChild>
              <Button onClick={() => navigate("/admin/dashboard")}>Dashboard</Button>
            </SheetClose>
          )}
        </nav>
      </SheetContent>
    </Sheet>

  );
};
