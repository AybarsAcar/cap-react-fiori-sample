import {
  Card,
  CardHeader,
  Text,
  Icon,
  ShellBar,
  Avatar,
  ShellBarItem,
  List,
  ListItemStandard,
  ListItemCustom,
} from "@ui5/webcomponents-react";
import { BarChart, LineChart } from "@ui5/webcomponents-react-charts";
import { MockData } from "../mock/data.ts";
import { useState } from "react";
import lineChartIcon from "@ui5/webcomponents-icons/dist/line-chart.js";
import barChartIcon from "@ui5/webcomponents-icons/dist/horizontal-bar-chart.js";
import activateIcon from "@ui5/webcomponents-icons/dist/activate.js";
import listIcon from "@ui5/webcomponents-icons/dist/list.js";
import ValueState from "@ui5/webcomponents-base/dist/types/ValueState.js";

enum ChartType {
  LineChart,
  BarChart,
}

function UglApp() {
  const [selectedChart, setSelectedChart] = useState(ChartType.LineChart);
  const [loading, setLoading] = useState(false);
  const switchText =
    selectedChart === ChartType.LineChart ? "Bar Chart" : "Line Chart";
  const contentTitle =
    selectedChart === ChartType.LineChart ? "Line Chart" : "Bar Chart";

  const handleHeaderClick = () => {
    setLoading(true);
    if (selectedChart === ChartType.BarChart) {
      setSelectedChart(ChartType.LineChart);
    } else {
      setSelectedChart(ChartType.BarChart);
    }
    setLoading(false);
  };

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
      >
        <ShellBarItem icon={activateIcon} text="Activate" />
      </ShellBar>
      <Card
        header={
          <CardHeader
            onClick={handleHeaderClick}
            titleText={"Prices"}
            subtitleText={`Click to view as ${switchText}`}
            interactive
            avatar={
              <Icon
                name={
                  selectedChart === ChartType.BarChart
                    ? barChartIcon
                    : lineChartIcon
                }
                accessibleName={contentTitle}
              />
            }
          />
        }
        style={{ width: "400px", margin: "2rem" }}
      >
        <Text style={{ padding: "var(--sapContent_Space_S)" }}>
          {contentTitle}
        </Text>
        {selectedChart === ChartType.LineChart ? (
          <LineChart
            dimensions={[{ accessor: "month" }]}
            measures={[{ accessor: "data", label: "Price" }]}
            dataset={MockData.dataset}
            loading={loading}
          />
        ) : (
          <BarChart
            dimensions={[{ accessor: "month" }]}
            measures={[{ accessor: "data", label: "Price" }]}
            dataset={MockData.dataset}
            loading={loading}
          />
        )}
      </Card>

      <Card
        header={
          <CardHeader
            titleText="Progress"
            subtitleText="List"
            avatar={<Icon name={listIcon} />}
          />
        }
        style={{ width: "300px" }}
      >
        <List>
          <ListItemStandard
            additionalText="finished"
            additionalTextState={ValueState.Positive}
          >
            Activity 1
          </ListItemStandard>
          <ListItemStandard
            additionalText="failed"
            additionalTextState={ValueState.Negative}
          >
            Activity 2
          </ListItemStandard>
          <ListItemCustom></ListItemCustom>
        </List>
      </Card>
    </>
  );
}

export default UglApp;
