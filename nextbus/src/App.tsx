import { FC, useState } from "react"

import "./app.css"

interface CompanySelectorProps {
  value: string,
  onChange: React.ChangeEventHandler<HTMLSelectElement>
}

const CompanySelector:FC<CompanySelectorProps> = ({value, onChange}) => {
  return (
    <div className="app_company-selector">
      <label htmlFor="company">Select Company: </label>
      <select name="company" value={value} onChange={onChange}>
        <option value="">Select an option</option>
        <option value="CTB">Citybus</option>
        <option value="NWFB">New World First Bus</option>
        <option value="NLB">New Lantao Bus Company</option>
      </select>
    </div>)
}

const App:FC = () => {
  const [company, setCompany] = useState("")
  const companySelected = (company !== "")
  

  return (
    <div className="page-wrapper">
      <div className="header">
        <h1>Nextbus HK</h1>
        <h3>Made by Willma</h3>
      </div>
      <div className="app_container">
        <CompanySelector value={company} onChange={(e) => setCompany(e.target.value)}/>
        <div className="app_route-selector">
          <input type="search"></input>
        </div>
      </div>
    </div>
  );
}

export default App;
