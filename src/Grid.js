import React, { useState, useEffect, useDebugValue } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

import { Table } from "./Table";

const { CountObjects } = require("count-objects");

const url =
  "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  circularProgressDiv: {
    textAlign: "center",
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

const fetchData = async () => {
  const results = await fetch(url);
  const data = await results.json();
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

export default function CenteredGrid() {
  const [countObjects, setCountObjects] = useState(new CountObjects([]));
  const [table, setTable] = useState([]);
  const [filters, setFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // fetch data for the first time
  useEffect(() => {
    (async () => {
      const cleanData = await fetchData();
      setCountObjects((co) => {
        return co.add(cleanData).clone();
      });
      setIsLoading(() => {
        return false;
      });
    })();
  }, []);

  // update table
  useEffect(() => {
    setTable(() => countObjects.table().filter((row) => row.count !== 0));
  }, [countObjects]);

  // update filters
  useEffect(() => {
    setFilters((prevFilters) => {
      return decorateFilters(
        JSON.parse(JSON.stringify(countObjects.getFilters()))
      );
    });
  }, [countObjects]);

  const classes = useStyles();
  const showTable = isLoading ? (
    <div className={classes.circularProgressDiv}>
      {" "}
      <CircularProgress />{" "}
    </div>
  ) : (
    <Table table={table} onFilterClick={handleFilter}></Table>
  );

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>HEADER</Paper>
        </Grid>
        <Grid container>
          {filters.map((filter) => {
            return (
              // <Grid item xs={1}>
              <li key={filter.key}>
                <Chip
                  label={filter.label}
                  onDelete={handleDelete(filter)}
                  className={classes.chip}
                />
              </li>
              // </Grid>
            );
          })}
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          {showTable}
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </div>
  );
}
