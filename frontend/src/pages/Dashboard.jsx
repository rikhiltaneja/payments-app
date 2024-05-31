import { useContext, useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { getCookie } from "../utils/cookie";
import axios from "axios";
import { AppContext } from "../components/Context";

export const Dashboard = () => {
  const token = getCookie("token");
  const { login } = useContext(AppContext);
  const [amount, setAmount] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:8080/bank/balance", {
        headers: { Authorization: token },
      })
      .then((res) => {
        setAmount(res.data.balance);
      });
  }, []);
  return (
    <div>
      <Appbar />
      <div className="m-8">
        {login ? (
          <>
            <Balance value={amount} />
            <Users />
          </>
        ) : (
          "Please Login"
        )}
      </div>
    </div>
  );
};
