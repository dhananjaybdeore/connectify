import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  useToast,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";

const Login = () => {
  //*states for show - hide password button functionality
  const [showPassword, setShowPassword] = useState(false);

  //* form data storage states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //* state for determining if there is any action taking place at backend
  //* when loading is true, submit button will be disabled and there will be loading animation
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleShowHide = (type) => {
    if (type === "password") setShowPassword(!showPassword);
  };

  const submitHandler = () => {
    setLoading(true);
    //* checking if there are empty fields
    if (!email || !password) {
      setLoading(false);
      toast({
        title: "Please Fill all the fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      };
      axios
        .post(
          "https://connectify-ht7d.onrender.com/api/user/login",
          {
            email,
            password,
          },
          {
            config,
          }
        )
        .then((data) => {
          toast({
            title: "Logged in successfully",
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "top-right",
          });
          setLoading(false);
          localStorage.setItem("UserInfo", JSON.stringify(data));
          navigate("/chats");
        })
        .catch((error) => {
          toast({
            title: error.response.data.message,
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
        });
    } catch {}
  };
  return (
    <VStack spacing={4}>
      <FormControl id="login-email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email here"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        ></Input>
      </FormControl>
      <FormControl id="login-password" isRequired>
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

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Details
      </Button>
    </VStack>
  );
};

export default Login;
