import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { getCookie } from "../utils/cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState(0);
  const token = getCookie("token");
  const navigate = useNavigate();

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <ToastContainer />
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">
                  {name ? name[0].toUpperCase() : ""}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="amount"
                >
                  Amount (in Rs)
                </label>
                <input
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  type="number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  id="amount"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={() => {
                  const toastID = toast.loading("Sending money!");
                  setTimeout(() => {
                    axios
                      .post(
                        "https://payments-app-backend.rikhiltaneja.com/bank/transfer",
                        {
                          to: id,
                          amount,
                        },
                        {
                          headers: {
                            Authorization: token,
                          },
                        }
                      )
                      .then((res) => {
                        toast.update(toastID, {
                          render: "Transfer Successful!",
                          type: "success",
                          isLoading: false,
                        });
                        setTimeout(() => {
                          navigate("/dashboard");
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                        if (err.response) {
                          if (err.response.status == 400) {
                            toast.update(toastID, {
                              render: "Insufficient Balance!",
                              type: "error",
                              isLoading: false,
                            });
                          } else if (err.response.status == 404) {
                            toast.update(toastID, {
                              render: "Server Error or TO account not found!",
                              type: "error",
                              isLoading: false,
                            });
                          } else {
                            toast.update(toastID, {
                              render: "Server Error",
                              type: "error",
                              isLoading: false,
                            });
                          }
                        } else {
                          toast.update(toastID, {
                            render: "Server Error",
                            type: "error",
                            isLoading: false,
                          });
                        }
                      });
                  }, 1500);
                }}
                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
              >
                Initiate Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
