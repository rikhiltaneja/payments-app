import { useContext } from "react";
import { Button } from "./Button";
import { AppContext } from "./Context";
import { deleteCookie, getCookie } from "../utils/cookie";
import { Link } from "react-router-dom";

export const Appbar = () => {
  const { login, setLogin } = useContext(AppContext);
  const username = getCookie("username");
  const logout = () => {
    deleteCookie("token");
    deleteCookie("username");
    location.reload();
  };
  const renderBtn = () => {
    if (login) {
      return (
        <button
          onClick={logout}
          className="bg-slate-700 px-5 py-2 h-fit self-center text-white rounded"
        >
          Logout
        </button>
      );
    } else {
      return (
        <Link className="self-center" to={"/signup"}>
          <button className="bg-slate-700 px-5 py-2 h-fit self-center text-white rounded">
            Login
          </button>
        </Link>
      );
    }
  };
  return (
    <div className="shadow h-14 flex justify-between px-7">
      <div className="flex flex-col justify-center h-full font-bold">
        PayTM App
      </div>
      <div className="flex flex-col justify-center h-full">
        Hello, {login ? username : "Guest"}
      </div>
      {renderBtn()}
    </div>
  );
};
