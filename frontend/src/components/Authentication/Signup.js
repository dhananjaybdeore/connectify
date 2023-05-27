import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const Signup = () => {
  //*states for show - hide password button functionality
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //* form data storage states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState("");

  //* state for determining if there is any action taking place at backend
  //* when loading is true, submit button will be disabled and there will be loading animation
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const handleShowHide = (type) => {
    if (type === "password") setShowPassword(!showPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  //*Function to upload image in cloudinary
  const uploadProfileImage = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image",

        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "connectify");
      data.append("cloud_name", "dhdxz3msy");
      fetch("https://api.cloudinary.com/v1_1/dhdxz3msy/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select jpeg or png file",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    //*Condition for checking if any field is empty
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    //*Condition for checking both passwords are same or not
    if (password !== confirmpassword) {
      toast({
        title: "Both passwords are not matching",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      //?Making an API call to register the user into the database
      axios
        .post(
          "/api/user",
          {
            name,
            email,
            password,
            pic,
          },
          config
        )
        .then((data) => {
          toast({
            title: "Registration Successfull",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom",
          });
          // ?localStorage.setItem("userInfo", JSON.stringify(data));
          setLoading(false);
          toast({
            title: "Redirecting to Login Page",
            status: "loading",
            duration: 2000,
            isClosable: false,
            position: "bottom",
          });
          //! To load the login page
          setTimeout(() => {
            window.location.reload(); //!have to find alternative later
          }, 2000);
          navigate("/");
        })
        .catch((error) => {
          toast({
            title: error.response.data,
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        });
    } catch (error) {
      toast({
        title: error.response.data,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing={4}>
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name here"
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
        ></Input>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email here"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        ></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter your password here"
            type={showPassword ? "text" : "password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => handleShowHide("password")}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter your password here"
            type={showConfirmPassword ? "text" : "password"}
            onChange={(e) => {
              setConfirmpassword(e.target.value);
            }}
            value={confirmpassword}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => {
                handleShowHide("confirmPassword");
              }}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Profile Picture</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            uploadProfileImage(e.target.files[0]);
          }}
        ></Input>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
