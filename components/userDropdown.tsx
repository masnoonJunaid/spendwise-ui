"use client";
import { logout } from "@/state/features/authSlice";
import { useAppDispatch } from "@/state/store";
import { displayToast } from "@/utils/functions";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function UserDropDown() {

  const router = useRouter();
  const dispatch = useAppDispatch();

  const logOutStatus = useSelector((state: any) => state?.auth?.logoutStatus);
  const handleLogout = async () => {
    await localStorage.clear()
    dispatch(logout());
  }


  useEffect(() => {
    // if(logOutStatus === 'succeeded') {
    //   displayToast("Logged out successfully, ", "", "sm", "success");
    //   // localStorage.clear();
    //   // router.push("/")
    //   // router.refresh()
    // }
  }, [logOutStatus])




  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            size="sm"
            isBordered
            as="button"
            className="transition-transform"
            src=""
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">masnoon20@gmail.com</p>
          </DropdownItem>
          <DropdownItem key="settings">My Settings</DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem  key="logout" color="danger" onPress={() => handleLogout()}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
