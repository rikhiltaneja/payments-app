import { useContext, useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCookie } from "../utils/cookie";
import { AppContext } from "../components/Context";
import { loginCheck } from "../utils/loginCheck";

export const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {setLogin} = useContext(AppContext)
  const navigate = useNavigate();

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <ToastContainer />
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="John Doe"
            label={"Name"}
          />
          <InputBox
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="testuser123"
            label={"Username"}
          />
          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="123456"
            label={"Password"}
            type={"password"}
          />
          <div className="pt-4">
            <Button
              onClick={() => {
                const id = toast.loading("Signing up!");
                setTimeout(() => {
                  axios
                    .post("http://localhost:8080/users/signup", {
                      username,
                      name,
                      password,
                    })
                    .then((res) => {
                      console.log(res);
                      setCookie("token", res.data, 10);
                      setCookie("username", username, 10);
                      setLogin(loginCheck())
                      toast.update(id, {
                        render: "Signed Up!",
                        type: "success",
                        isLoading: false,
                      });
                      setTimeout(() => {
                        navigate("/dashboard");
                      }, 1000);
                    })
                    .catch((err) => {
                      // console.log(err);
                      if (err.response) {
                        if (err.response.status == 400) {
                          toast.update(id, {
                            render: "Username exists!",
                            type: "error",
                            isLoading: false,
                          });
                        } else {
                          toast.update(id, {
                            render: "Server Error!",
                            type: "error",
                            isLoading: false,
                          });
                        }
                      } else {
                        toast.update(id, {
                          render: "Server Error!",
                          type: "error",
                          isLoading: false,
                        });
                      }
                    });
                }, 1500);
              }}
              label={"Sign up"}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
