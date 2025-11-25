import employeeIcon from "@ui5/webcomponents-icons/dist/employee.js";
import { Avatar, ShellBar } from "@ui5/webcomponents-react";
import { HashRouter } from "react-router-dom";
import UglApp from "./pages/UglApp.tsx";

function App() {
  return (
    <>
      <ShellBar
        logo={
          <img
            src="/assets/sap-logo-nobg.png"
            alt={"UI5 Web Components for React logo"}
          />
        }
        primaryTitle="Analytical Dashboard"
        profile={<Avatar icon={employeeIcon} />}
      />
      <HashRouter>
        <UglApp />
      </HashRouter>
    </>
  );
}

export default App;
