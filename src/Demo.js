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
  Paper,
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

const width = 300;
const columns = [
  {
    headerName: "Key",
    field: "key",
    width,
    headerClassName: "super-app-theme--header",
  },
  {
    headerName: "Value",
    field: "value",
    width,
    headerClassName: "super-app-theme--header",
  },
  {
    headerName: "Count",
    field: "count",
    width,
    headerClassName: "super-app-theme--header",
  },
];

const getUrl = ({ startTime }) => {
  const endTime = getNextDay(startTime);
  return encodeURI(
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}`
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
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  chip: {
    background: "#eadce6",
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
}));

const decorateFilters = (filters) => {
  const chips = [];
  for (const filter of filters) {
    const id = JSON.stringify(filter);
    const value = filter.pop();
    const key = filter.join(".");
    const keyVal = `${key} - ${value}`;
    chips.push({ key: id, label: keyVal });
  }
  return chips;
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
      place: place.split(", ").pop().toLowerCase(),
      type,
      tsunami,
      alert,
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
  const [startTime, setStartTime] = useState(initStartTime);
  const [table, setTable] = useState([]);
  const [filters, setFilters] = useState([]);
  const [filtersCount, setFiltersCount] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date(initStartTime)
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setStartTime(() => {
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
    const filter = [...key.split("."), value];
    const filterStr = JSON.stringify(filter);
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
    setStartTime(() => getNextDay(startTime));
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
        JSON.parse(JSON.stringify(countObjects.getFilters()))
      );
    });
    setFiltersCount(() => {
      return countObjects.filtersCount();
    });
  }, [countObjects]);

  // query more
  useEffect(() => {
    const getDate = async () => {
      const url = getUrl({ startTime });
      const results = await fetch(url);
      const data = await results.json();
      const cleanData = decorateData(data);
      setTotalCount((totalCount) => totalCount + cleanData.length);
      setCountObjects(countObjects.add(cleanData).clone());
      setIsLoading(false);
    };
    getDate();
  }, [startTime, selectedDate]);

  const classes = useStyles();

  const Table = () => {
    return (
      <Box style={{ height: 400, width: 900 }}>
        <DataGrid
          rows={table}
          columns={columns}
          pageSize={50}
          onRowSelected={(event) => {
            handleFilter(event.data.key, event.data.value);
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
      return (
        <Box
          component="li"
          className={classes.chipContainer}
          key={filter.label}
        >
          <Chip
            label={`${filter.label} (${filtersCount[idx]})`}
            onDelete={handleDelete(filter)}
            className={classes.chip}
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
    return isLoading ? null : (
      <Box>
        <Box component="span">Total Count: </Box>
        <Box component="span"> {totalCount}</Box>
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
            <Grid item xs={2}>
              <QueryMore />
            </Grid>
            <Grid item xs={10}>
              <Grid container>
                <Filters />
              </Grid>
            </Grid>
          </Grid>
          <TotalCount />
          <Table />
          <DataSource />
        </Box>
      )}
    </Container>
  );
}
