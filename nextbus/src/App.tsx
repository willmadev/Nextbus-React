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

interface StopSelectorProps {
  company: string;
  route: string;
  onChange: (
    selectedValue: SelectedOptionValue | SelectedOptionValue[],
    selectedOption: SelectedOption | SelectedOption[],
    optionSnapshot: SelectSearchProps
  ) => void;
  value: string;
}

const StopSelector: FC<StopSelectorProps> = ({
  company,
  route,
  onChange,
  value,
}) => {
  const [options, setOptions] = useState([{ name: "", value: "" }]);
  useEffect(() => {
    let inboundResult;
    let outboundResult;
    console.log("company:", company);
    console.log("route:", route);
    const fetchStops = async () => {
      inboundResult = await axios(
        `https://rt.data.gov.hk/v1/transport/citybus-nwfb/route-stop/${company}/${route}/inbound`
      );
      const inboundStopsResult = await Promise.all(
        inboundResult.data.data.map(async (value: any) => {
          const stopData = await axios(
            `https://rt.data.gov.hk/v1/transport/citybus-nwfb/stop/${value.stop}`
          );
          return stopData.data.data;
        })
      );

      outboundResult = await axios(
        `https://rt.data.gov.hk/v1/transport/citybus-nwfb/route-stop/${company}/${route}/outbound`
      );
      const outboundStopsResult = await Promise.all(
        outboundResult.data.data.map(async (value: any) => {
          const stopData = await axios(
            `https://rt.data.gov.hk/v1/transport/citybus-nwfb/stop/${value.stop}`
          );
          // console.log(stopData.data.data);
          return stopData.data.data;
        })
      );
      console.log(inboundStopsResult);
      console.log(outboundStopsResult);
      const test = [
        ...inboundStopsResult.map((value: any) => {
          return { name: value.name_en, value: value.stop };
        }),
        ...outboundStopsResult.map((value: any) => {
          return { name: value.name_en, value: value.stop };
        }),
      ];

      setOptions(test);
    };
    fetchStops();
  }, [company, route]);
  console.log(options);
  return (
    <div className="app_stop-selector app_selector">
      <p>Select Stop</p>
      <SelectSearch
        options={options}
        search
        filterOptions={fuzzySearch}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

interface EtaDisplayProps {
  route: string;
  stop: string;
  company: string;
}
const EtaDisplay: FC<EtaDisplayProps> = ({ route, stop, company }) => {
  const [eta, setEta] = useState("");
  useEffect(() => {
    const fetchEta = async () => {
      const result = await axios(
        `https://rt.data.gov.hk/v1/transport/citybus-nwfb/eta/${company}/${stop}/${route}`
      );
      const resultEta = new Date(result.data.data[0].eta);
      setEta(resultEta.toLocaleTimeString());
    };
    fetchEta();
  });
  return (
    <div className="app_eta-wrapper">
      {eta !== "" ? <p>The next bus is coming at: {eta}</p> : <p>Loading...</p>}
    </div>
  );
};

const App: FC = () => {
  const [company, setCompany] = useState("");
  const [route, setRoute] = useState("");
  const [stop, setStop] = useState("");
  const companySelected = company !== "";
  const routeSelected = route !== "";
  const stopSelected = stop !== "";

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
            setStop("");
          }}
        />
        {companySelected ? (
          <RouteSelector
            company={company}
            value={route}
            onChange={(value: any) => setRoute(value)}
          />
        ) : null}
        {routeSelected ? (
          <StopSelector
            company={company}
            route={route}
            value={stop}
            onChange={(value: any) => setStop(value)}
          />
        ) : null}
        {stopSelected ? (
          <EtaDisplay company={company} route={route} stop={stop} />
        ) : null}
      </div>
    </div>
  );
};

export default App;
