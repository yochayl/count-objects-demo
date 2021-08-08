import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import npm from "./assets/npm.png";
import github from "./assets/github.png";
import {
  Chip,
  Grid,
  Container,
  Box,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
const { CountObjects } = require("count-objects");

const initStartTime = "2021-01-01";

const getNextDay = (date) => {
  const dateObj = new Date(date);
  return new Date(dateObj.setDate(dateObj.getDate() + 1))
    .toISOString()
    .split("T")[0];
};

const columns = [
  {
    headerName: "Key",
    field: "key",
    flex: 1,
    headerClassName: "super-app-theme--header",
  },
  {
    headerName: "Value",
    field: "value",
    flex: 1,
    headerClassName: "super-app-theme--header",
  },
  {
    headerName: "Count",
    field: "count",
    flex: 1,
    headerClassName: "super-app-theme--header",
  },
];

const getUrl = ({ endDate }) => {
  const endTime = getNextDay(endDate);
  return encodeURI(
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${endDate}&endtime=${endTime}`
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .super-app-theme--header": {
      backgroundColor: "beige",
      fontSize: "medium",
    },
  },
  header: {
    padding: theme.spacing(0),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  chipContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",

    paddingRight: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
  },
  queryMore: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
  },
  circularProgress: {
    textAlign: "center",
  },
  datePickerContainer: {
    display: "flex",
    flexWrap: "wrap",
  },
  datePickerTextField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  totalCount: {
    paddingBottom: theme.spacing(1),
  },
}));

const decorateFilters = (filters, filtersType) => {
  const chips = [];
  for (const filter of filters) {
    const id = JSON.stringify(filter);
    const type = filtersType[id];
    const value = type === "value" ? filter.pop() : null;
    const key = filter.join(".");
    const keyVal = type === "value" ? `${key} - ${value}` : `${key}`;
    chips.push({ key: id, label: keyVal, type });
  }
  return chips;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const day = date.getDate().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  return `${day}/${month}/${year}`;
};

const decorateData = (data) => {
  const { features } = data;
  return features.map((feat) => {
    const { properties } = feat;
    const {
      status,
      mag,
      place,
      type,
      alert,
      tsunami,
      time,
      sources,
    } = properties;

    const dateTime = new Date(time);
    const date = dateTime.toISOString().split("T")[0];
    return {
      status: status.toLowerCase(),
      mag: Math.round(mag * 10) / 10,
      place: typeof place === 'string' && place.split(", ").pop().toLowerCase(),
      type,
      tsunami,
      alert: alert || undefined,
      date,
      sources: sources.split(",").reduce((acc, src) => {
        if (src) {
          acc[src] = src;
        }
        return acc;
      }, {}),
    };
  });
};

export function Demo() {
  const [countObjects, setCountObjects] = useState(new CountObjects([]));
  const [totalCount, setTotalCount] = useState(0);
  const [endDate, setEndDate] = useState(initStartTime);
  const [table, setTable] = useState([]);
  const [filters, setFilters] = useState([]);
  const [filtersType, setFiltersType] = useState({});
  const [filtersCount, setFiltersCount] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date(initStartTime)
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setEndDate(() => {
      return new Date(date).toISOString().split("T")[0];
    });
    setTotalCount(0);
    setCountObjects(new CountObjects([]));
    setIsLoading(true);
  };

  const handleDelete = (filterToDelete) => () => {
    setCountObjects((co) =>
      co.removeFilter(JSON.parse(filterToDelete.key)).clone()
    );
  };

  const handleFilter = (key, value) => {
    const type = value ? "value" : "key";
    const filter = [...key.split(".")];
    if (type === "value") {
      filter.push(value);
    }
    const filterStr = JSON.stringify(filter);
    setFiltersType((filtersType) => {
      return { ...filtersType, [filterStr]: type };
    });
    setCountObjects((co) => {
      const existingFiltersStr = co
        .getFilters()
        .map((filter) => JSON.stringify(filter));
      const isExists = existingFiltersStr.some((fil) => fil === filterStr);
      if (!isExists) {
        return co.addFilter(filter).clone();
      } else {
        return co;
      }
    });
  };

  const handleQueryMore = () => {
    setIsLoading(() => true);
    setEndDate(() => getNextDay(endDate));
  };

  // update table
  useEffect(() => {
    setTable(() =>
      countObjects
        .table()
        .filter((row) => row.count !== 0)
        .map((row, idx) => {
          row.id = idx;
          return row;
        })
    );
    setFilters(() => {
      return decorateFilters(
        JSON.parse(JSON.stringify(countObjects.getFilters())),
        filtersType
      );
    });
    setFiltersCount(() => {
      return countObjects.filtersCount();
    });
  }, [countObjects]);

  // query more
  useEffect(() => {
    const getDate = async () => {
      const url = getUrl({ endDate });
      const results = await fetch(url);
      const data = await results.json();
      const cleanData = decorateData(data);
      setTotalCount((totalCount) => totalCount + cleanData.length);
      setCountObjects(countObjects.add(cleanData).clone());
      setIsLoading(false);
    };
    getDate();
  }, [endDate, selectedDate]);

  const classes = useStyles();

  const Table = () => {
    return (
      <Box style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={table}
          columns={columns}
          pageSize={50}
          onCellClick={(event) => {
            const { field, row } = event;
            const { key, value } = row;
            if (field === "key") {
              handleFilter(key);
            }
            if (field === "value") {
              handleFilter(key, value);
            }
          }}
          HorizontalAlignment="Stretch"
          HorizontalContentAlignment="Stretch"
          ColumnWidth="*"
        />
      </Box>
    );
  };
  const QueryMore = () => {
    return (
      <Box className={classes.queryMore}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleQueryMore}
        >
          Query More
        </Button>
      </Box>
    );
  };

  const Filters = () => {
    return filters.map((filter, idx) => {
      const backgroundColor = filter.type === "value" ? "#dce7ea" : "#eadce6";
      return (
        <Box
          component="li"
          className={classes.chipContainer}
          key={filter.label}
        >
          <Chip
            label={`${filter.label} (${filtersCount[idx]})`}
            onDelete={handleDelete(filter)}
            style={{ background: backgroundColor }}
          />
        </Box>
      );
    });
  };

  const DatePicker = () => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Start Date"
          format="dd/MM/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>
    );
  };

  const TotalCount = () => {
    return (
      <Box className={classes.totalCount}>
        <Box component="span">Total Count: </Box>
        <Box component="span"> {totalCount}</Box>
      </Box>
    );
  };

  const EndDate = () => {
    return (
      <Box className={classes.totalCount}>
        <Box component="span" style={{ marginRight: "17px" }}>
          End Date:{" "}
        </Box>
        <Box component="span"> {formatDate(endDate)}</Box>
      </Box>
    );
  };

  const DataSource = () => {
    return (
      <Box>
        <Box component="label">Data Source: </Box>
        <Box
          component="a"
          href="https://earthquake.usgs.gov/fdsnws/event/1/"
          target="_blank"
          rel="noreferrer"
        >
          Earthquake Hazards
        </Box>
      </Box>
    );
  };

  const Header = () => {
    return (
      <Box>
        <Box component="h1" className={classes.header}>
          Earthquakes
        </Box>
        <Box component="h3" className={classes.header}>
          Count Objects Demo
        </Box>
        <Box className={classes.header}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={2}>
              <Grid item>
                <a
                  href="https://www.npmjs.com/package/count-objects"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Box
                    component="img"
                    src={npm}
                    alt="NPM"
                    width="64px"
                    height="64px"
                  />
                </a>
              </Grid>
              <Grid item>
                <a
                  href="https://github.com/yochayl/count-objects-demo"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Box
                    component="img"
                    src={github}
                    alt="GitHub"
                    width="64px"
                    height="64px"
                  />
                </a>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };

  const Loader = () => {
    return (
      <Box className={classes.circularProgress}>
        <CircularProgress />
      </Box>
    );
  };

  return (
    <Container maxWidth="md" className={classes.root}>
      <Header />
      <DatePicker />
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          <Grid container>
            <Grid item xs={3}>
              <QueryMore />
            </Grid>
            <Grid item xs={9}>
              <Grid container>
                <Filters />
              </Grid>
            </Grid>
          </Grid>
          <EndDate />
          <TotalCount />
          <Table />
          <DataSource />
        </Box>
      )}
    </Container>
  );
}
