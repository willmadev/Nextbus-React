import { FC, useEffect, useState } from "react";
import axios from "axios";
import SelectSearch, {
  fuzzySearch,
  SelectedOption,
  SelectedOptionValue,
  SelectSearchProps,
} from "react-select-search";

import "./app.css";
import "./select.css";

interface CompanySelectorProps {
  value: string;
  onChange: (
    selectedValue: SelectedOptionValue | SelectedOptionValue[],
    selectedOption: SelectedOption | SelectedOption[],
    optionSnapshot: SelectSearchProps
  ) => void;
}

const CompanySelector: FC<CompanySelectorProps> = ({ value, onChange }) => {
  const options = [
    { name: "Citybus", value: "CTB" },
    { name: "New World First Bus", value: "NWFB" },
    // { name: "New Lantau Bus", value: "NLB" },
  ];
  return (
    <div className="app_company-selector app_selector">
      <p>Select Company</p>
      <SelectSearch options={options} value={value} onChange={onChange} />
    </div>
  );
  // return (
  //   <div className="app_company-selector">
  //     <label htmlFor="company">Select Company: </label>
  //     <select name="company" value={value} onChange={onChange}>
  //       <option value="">Select an option</option>
  //       <option value="CTB">Citybus</option>
  //       <option value="NWFB">New World First Bus</option>
  //       <option value="NLB">New Lantao Bus Company</option>
  //     </select>
  //   </div>
  // );
};

interface RouteSelectorProps {
  company: string;
  value: string;
  onChange: (
    selectedValue: SelectedOptionValue | SelectedOptionValue[],
    selectedOption: SelectedOption | SelectedOption[],
    optionSnapshot: SelectSearchProps
  ) => void;
}

const RouteSelector: FC<RouteSelectorProps> = ({
  company,
  value,
  onChange,
}) => {
  const [routes, setRoutes] = useState([]);
  useEffect(() => {
    const fetchRoutes = async () => {
      const result = await axios(
        `https://rt.data.gov.hk/v1/transport/citybus-nwfb/route/${company}`
      );
      if (result.status === 200) {
        setRoutes(result.data.data);
      }
    };
    fetchRoutes();
  }, [company]);

  return (
    <div className="app_route-selector app_selector">
      <p>Select Route</p>
      <SelectSearch
        options={routes.map((route: any) => {
          return { name: route.route, value: route.route };
        })}
        search
        filterOptions={fuzzySearch}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

const App: FC = () => {
  const [company, setCompany] = useState("");
  const [route, setRoute] = useState("");
  let companySelected = company !== "";

  return (
    <div className="page-wrapper">
      <div className="header">
        <h1>Nextbus HK</h1>
        <h3>Made by Willma</h3>
      </div>
      <div className="app_container">
        <CompanySelector
          value={company}
          onChange={(value: any) => {
            setCompany(value);
            setRoute("");
          }}
        />
        {companySelected ? (
          <RouteSelector
            company={company}
            value={route}
            onChange={(value: any) => setRoute(value)}
          />
        ) : null}
      </div>
    </div>
  );
};

export default App;
