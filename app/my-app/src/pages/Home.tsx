import {
  Card,
  CardHeader,
  Text,
  Icon,
  List,
  ListItemStandard,
  ListItemCustom,
  ProgressIndicator,
  FlexBox,
  FlexBoxDirection,
  FlexBoxJustifyContent,
  AnalyticalTable,
  FlexBoxWrap,
  Button,
} from "@ui5/webcomponents-react";
import { BarChart, LineChart } from "@ui5/webcomponents-react-charts";
import { MockData } from "../mock/data.ts";
import { useState } from "react";
import lineChartIcon from "@ui5/webcomponents-icons/dist/line-chart.js";
import barChartIcon from "@ui5/webcomponents-icons/dist/horizontal-bar-chart.js";
import listIcon from "@ui5/webcomponents-icons/dist/list.js";
import ValueState from "@ui5/webcomponents-base/dist/types/ValueState.js";
import tableViewIcon from "@ui5/webcomponents-icons/dist/table-view.js";
import { useNavigate } from "react-router-dom";
import DataExtractor from "../utils/DataExtractor.ts";

enum ChartType {
  LineChart,
  BarChart,
}

export function Home() {
  const navigate = useNavigate();

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

  const handleProgressHeaderClick = () => {
    navigate("/detail");
  };

  return (
    <FlexBox
      justifyContent={FlexBoxJustifyContent.Center}
      wrap={FlexBoxWrap.Wrap}
      style={{ padding: "2rem" }}
    >
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
            onClick={handleProgressHeaderClick}
            interactive
          />
        }
        style={{ width: "400px", margin: "2rem" }}
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

          <ListItemCustom>
            <FlexBox
              direction={FlexBoxDirection.Column}
              fitContainer
              style={{ paddingBlock: "var(--sapContent_Space_S)" }}
            >
              <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween}>
                <Text style={{ fontSize: "var(--sapFontLargeSize)" }}>
                  Activity 3
                </Text>
                <Text style={{ color: "var(--sapCriticalTextColor)" }}>
                  in progress
                </Text>
              </FlexBox>
              <ProgressIndicator
                value={89}
                valueState={ValueState.Positive}
                style={{ marginBlockStart: "0.5rem" }}
              />
            </FlexBox>
          </ListItemCustom>

          <ListItemCustom>
            <FlexBox
              direction={FlexBoxDirection.Column}
              fitContainer
              style={{ paddingBlock: "var(--sapContent_Space_S)" }}
            >
              <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween}>
                <Text style={{ fontSize: "var(--sapFontLargeSize)" }}>
                  Activity 3
                </Text>
                <Text style={{ color: "var(--sapCriticalTextColor)" }}>
                  in progress
                </Text>
              </FlexBox>
              <ProgressIndicator
                value={5}
                valueState={ValueState.Negative}
                style={{ marginBlockStart: "0.5rem" }}
              />
            </FlexBox>
          </ListItemCustom>
        </List>
      </Card>

      <Card
        header={
          <FlexBox
            justifyContent={FlexBoxJustifyContent.SpaceBetween}
            alignItems="Center"
          >
            <CardHeader
              titleText="AnalyticalTable"
              avatar={<Icon name={tableViewIcon} />}
            />
            <Button
              style={{ marginRight: "2rem" }}
              onClick={() => {
                DataExtractor.exportCSV(
                  DataExtractor.jsonToCSV(MockData.tableData),
                );
              }}
            >
              Export
            </Button>
          </FlexBox>
        }
        style={{ maxWidth: "900px", margin: "2rem" }}
      >
        <AnalyticalTable
          data={MockData.tableData}
          columns={MockData.tableColumns}
          visibleRows={5}
        />
      </Card>
    </FlexBox>
  );
}
