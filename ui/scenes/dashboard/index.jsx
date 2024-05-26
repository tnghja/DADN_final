import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import DevicesOtherOutlinedIcon from '@mui/icons-material/DevicesOtherOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // eslint-disable-next-line
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [totalPower, setTotalPower] = useState(0);
  const roomColors = {
    "H1": "#4cceac", 
    "H2": "#a4a9fc",
    "H3": "#4cceac",
    "H6": "#db4f4a" 
  };
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formatLineData = useCallback((data) => {
    const formattedData = new Map();
    data.forEach(log => {
      const roomId = log.room_id;
      const month = new Date(log.date).getMonth();
      const monthName = months[month];
      if (!formattedData.has(roomId)) {
        formattedData.set(roomId, {
          id: roomId,
          color: roomColors[roomId],
          data: []
        })
      }
      const existingData = formattedData.get(roomId).data.find(dataPoint => dataPoint.x === monthName);

    if (existingData) {
      existingData.y += log.power;
    } else {
      formattedData.get(roomId).data.push({
        x: monthName,
        y: log.power 
      });
    }
    });
    return Array.from(formattedData.values());
    // eslint-disable-next-line
  }, [])
  const calTotal = (data) => {
    let overall = 0;
    data.forEach((room) => {
      room.data.forEach((point) => {
        overall += point.y;
      });
    });
    return overall;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/building');
        const lineData = response.data;
        const total = calTotal(formatLineData(lineData));
        setTotalPower(total);
        setLineData(formatLineData(lineData));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [formatLineData]);

  //BarChart
  const formatBarData = useCallback((data) => {
    if (!Array.isArray(data)) {
      return [];
    }

    let mockBarData = [];
    data.forEach(item => {
      let buildingIndex = mockBarData.findIndex(building => building.building === item.building_id);
      if (buildingIndex !== -1) {
        if (mockBarData[buildingIndex][item.floor_id]) {
          mockBarData[buildingIndex][item.floor_id] += item.power;
        } else {
          mockBarData[buildingIndex][item.floor_id] = item.power;
          mockBarData[buildingIndex][item.floor_id + 'Color'] = getColor(item.floor_id);
        }
      } else {
        mockBarData.push({
          building: item.building_id,
          [item.floor_id]: item.power,
          [item.floor_id + 'Color']: getColor(item.floor_id)
        });
      } 
    });
    return Array.from(mockBarData.values());
  }, [])

  const getColor = (floor) => {
    switch (floor) {
      case "T1":
        return "hsl(72, 70%, 50%)";
      case "T2":
        return "hsl(96, 70%, 50%)";
      case "T3":
        return "hsl(106, 70%, 50%)";
      case "T4":
        return "hsl(9, 70%, 50%)";
      case "T5":
        return "hsl(326, 70%, 50%)";
      case "T6":
        return "hsl(256, 70%, 50%)";
      default:
        return "hsl(300, 70%, 50%)"
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/building');
        const data = response.data;
        const dataFormated = formatBarData(data);
        setBarData(dataFormated);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [formatBarData]);
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1230"
            subtitle="Devices"
            progress="0.75"
            increase="+14%"
            icon={
              <DevicesOtherOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="4"
            subtitle="Buidling"
            progress="1"
            increase="+100%"
            icon={
              <LocationCityOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="315"
            subtitle="New Update"
            progress="0.30"
            increase="+25%"
            icon={
              <EventAvailableOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Energy Consumption
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                6012W
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true}/>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Maintenance
            </Typography>
          </Box>
            <Box
              key={'3112'}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
          >
            <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {'ID'}
                </Typography>
                <Typography color={colors.grey[100]}>
        
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{'Date'}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${'Cost'}
            </Box>
            </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $10,352 Saving
            </Typography>
            <Typography>Includes maintenance costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Power Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true}/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
