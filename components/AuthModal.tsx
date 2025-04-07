"use client"
import { login } from "@/state/features/authSlice";
import { AppDispatch } from "@/state/store";
import { displayToast } from "@/utils/functions";
import { EyeFilledIcon, EyeSlashFilledIcon, LockIcon, MailIcon } from "@/utils/icons";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Checkbox,
    Input,
    Link,
    ToastProvider,
  } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; 
import { useDispatch, useSelector } from 'react-redux';
  
  export default function AuthModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value.trim())
    }

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value.trim())
    }

    const dispatch = useDispatch<AppDispatch>()

    const handleLogin = (data: any = {}) => {
        if(email.length < 3 ||  password.length<4)
            return displayToast("Invalid email or password","","sm", "danger")
        dispatch(login(data))
    }

    const loading = useSelector((state: any) => state.auth.status);
    const logInStatus = useSelector((state: any) => state.auth);
    

    useEffect(() => {
        if (loading === 'succeeded') {
          const storedUserId = logInStatus?.user?.user?.id
          localStorage.setItem("userId", storedUserId);
          displayToast("Success!", "", "sm", "success");
          if(storedUserId) {
            router.push("/dashboard");
          }
        } else if (loading === 'failed') {
          displayToast("Invalid user name or password!", "", "sm", "danger");
        }
      }, [loading]);
  
    return (
      <>
        <Button size="sm" variant="flat" color="primary" onPress={onOpen}>
          Log In
        </Button>
        <Modal 
            isOpen={isOpen}
            placement="top-center" 
            onOpenChange={onOpenChange}
            isDismissable={false}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
                <ModalBody>
                  <Input
                    endContent={
                      <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Email"
                    placeholder="Enter your email"
                    variant="bordered"
                    onChange={(event) => handleEmail(event)}
                  />
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    type={isVisible ? "text" : "password"}
                    variant="bordered"
                    onChange={(event) => handlePassword(event)}
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                          {isVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          ) : (
                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                    }
                  />
                  {/* <div className="flex py-2 px-1 justify-between">
                    <Checkbox
                      classNames={{
                        label: "text-small",
                      }}
                    >
                      Remember me
                    </Checkbox>
                    <Link color="primary" href="#" size="sm">
                      Forgot password?
                    </Link>
                  </div> */}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button 
                    color="primary"
                    onPress={() => handleLogin({email, password})}
                    isLoading = {loading === 'loading'}
                    isDisabled = { email.length < 3 || password.length === 0 }
                >
                    Log In
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  