import { ShellBar, Avatar, ShellBarItem } from "@ui5/webcomponents-react";
import activateIcon from "@ui5/webcomponents-icons/dist/activate.js";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./Home";
import { Detail } from "./Detail";
import { useNavigate } from "react-router-dom";

function UglApp() {
  const navigate = useNavigate();

  return (
    <>
      <ShellBar
        primaryTitle="Crew Timesheet"
        logo={<img src="/assets/ugl-logo.png" style={{ maxWidth: "70%" }} />}
        profile={
          <Avatar>
            <img src="" alt="User Avatar" />
          </Avatar>
        }
        onLogoClick={() => navigate("/")}
      >
        <ShellBarItem icon={activateIcon} text="Activate" />
      </ShellBar>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="*" element={<Navigate replace to="/home" />} />
      </Routes>
    </>
  );
}

export default UglApp;
