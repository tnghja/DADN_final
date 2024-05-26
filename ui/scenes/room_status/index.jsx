import { Box, IconButton, Typography, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import axios from "axios";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LineChart from "../../components/LineChart";
import Header from "../../components/Header";
import { useParams } from 'react-router-dom'; // Import useParams hook

const Room = () => {
  const { roomId } = useParams(); // Use useParams to get the roomId from the URL
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [devices, setDevices] = useState([]);
  const [logData, setLogData] = useState([]);
  const [voltageLogData, setVoltageLogData] = useState([]);
  const [amperageLogData, setAmperageLogData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [lightData, setLightData] = useState([]);
  const [classSchedule, setClassSchedule] = useState([]);
  const [overloadedDevices, setOverloadedDevices] = useState({});

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/room/${roomId}`);
        setDevices(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDevices();
  }, [roomId]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const colors = [
          tokens("dark").greenAccent[500],
          tokens("dark").redAccent[500],
          tokens("dark").blueAccent[500]
        ];

        const logPromises = devices.map(async (device, index) => {
          const response = await axios.get(`http://localhost:3001/api/log/${device.device_id}`);
          const logs = response.data.slice(-10);
          return [{
            id: device.deviceName,
            color: colors[index % colors.length],
            data: logs[0].data.map(logEntry => ({
              x: new Date(logEntry.date).toLocaleString('vi-VN', options),
              y: logEntry.power
            }))
          }];
        });

        const voltageLogPromises = devices.map(async (device, index) => {
          const response = await axios.get(`http://localhost:3001/api/log/${device.device_id}/voltage`);
          const logs = response.data.slice(-10);
          console.log(logs);
          return [{
            id: device.deviceName,
            color: colors[index % colors.length],
            data: logs[0].data.map(logEntry => ({
              x: new Date(logEntry.date).toLocaleString('vi-VN', options),
              y: logEntry.voltage
            }))
          }];
        });

        const amperageLogPromises = devices.map(async (device, index) => {
          const response = await axios.get(`http://localhost:3001/api/log/${device.device_id}/amperage`);
          const logs = response.data.slice(-10);
          console.log(logs);
          const averageAmperage = logs.reduce((acc, logEntry) => acc + logEntry.data.reduce((sum, entry) => sum + entry.amperage, 0) / logEntry.data.length, 0) / logs.length;
          const lastLog = logs[logs.length - 1];
          const lastAmperage = lastLog.data[lastLog.data.length - 1].amperage;

          if (lastAmperage > averageAmperage * 1.5) {
            setOverloadedDevices(prev => ({ ...prev, [device.device_id]: true }));
          }

          return [{
            id: device.deviceName,
            color: colors[index % colors.length],
            data: logs[0].data.map(logEntry => ({
              x: new Date(logEntry.date).toLocaleString('vi-VN', options),
              y: logEntry.amperage
            }))
          }];
        });

        const temperatureLogPromise = async () => {
          const response = await axios.get(`http://localhost:3001/api/log/${roomId}/temperature`);
          const logs = response.data.slice(-12);
          const dataForResponsiveLine = [
            {
              id: 'Temperature',
              data: logs.map(logEntry => ({
                x: new Date(logEntry.date).toLocaleTimeString(),
                y: logEntry.data
              }))
            }
          ];
          return dataForResponsiveLine;
        };

        const lightLogPromise = async () => {
          const response = await axios.get(`http://localhost:3001/api/log/${roomId}/light`);
          const logs = response.data.slice(-12);
          const dataForResponsiveLine = [
            {
              id: 'Light',
              data: logs.map(logEntry => ({
                x: new Date(logEntry.date).toLocaleTimeString(),
                y: logEntry.data
              }))
            }
          ];
          return dataForResponsiveLine;
        };

        const [logResults, temperatureLogs, lightLogs] = await Promise.all([
          Promise.all(logPromises),
          temperatureLogPromise(),
          lightLogPromise()
        ]);

        const [voltageLogs, amperageLogs] = await Promise.all([
          Promise.all(voltageLogPromises),
          Promise.all(amperageLogPromises)
        ]);

        const transformedLogs = logResults.flat();
        const transformedVoltageLogs = voltageLogs.flat();
        const transformedAmperageLogs = amperageLogs.flat();
        setLogData(transformedLogs);
        setVoltageLogData(transformedVoltageLogs);
        setAmperageLogData(transformedAmperageLogs);
        setTempData(temperatureLogs);
        setLightData(lightLogs);
      } catch (error) {
        console.error(error);
      }
    };

    if (devices.length > 0) {
      fetchLogs();
      const intervalId = setInterval(() => {
        fetchLogs();
      }, 1000000);

      return () => clearInterval(intervalId);
    }
  }, [devices, roomId]); // Added roomId to dependency array

  const handleToggle = async (deviceId, newStatus) => {
    try {
      if (newStatus === "on") {
        await axios.post(`http://localhost:3001/api/device/${deviceId}/turnOn`);
      } else if (newStatus === "off") {
        await axios.post(`http://localhost:3001/api/device/${deviceId}/turnOff`);
      }
      const updatedDevices = devices.map(device =>
        device._id === deviceId ? { ...device, status: newStatus } : device
      );
      setDevices(updatedDevices);
    } catch (error) {
      console.error(error);
    }
  };

  const options = {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  useEffect(() => {
    const fetchClassSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/room/${roomId}/event`);
        setClassSchedule(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching class schedule: ", error);
      }
    };

    fetchClassSchedule();
  }, [roomId]);

  const handleSchedule = async (roomId, scheduleId) => {
    try {
      await axios.post(`http://localhost:3001/api/room/${roomId}/schedule/${scheduleId}`);
      alert('Class scheduled successfully!');
    } catch (error) {
      console.error("Error scheduling class: ", error);
      alert('Error scheduling class');
    }
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Room" subtitle="Welcome to your dashboard" />
      </Box>

      {/* MAIN CONTENT */}
      <Box display="flex" justifyContent="space-between">
        {/* ENERGY CONSUMPTION */}
        <Box
          display="flex"
          flexDirection="column"
          backgroundColor={colors.primary[400]}
          borderRadius="8px"
          p="20px"
          mr="20px"
          flex="7"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
              Energy Consumption
            </Typography>
            <IconButton>
              <DownloadOutlinedIcon sx={{ fontSize: "26px", color: colors.greenAccent[500] }} />
            </IconButton>
          </Box>
          <Box height="250px" mt="20px">
            <LineChart dataReal={logData} chartName={"Energy Consumption"} />
          </Box>
        </Box>

        {/* RECENT MAINTENANCE */}
        <Box
          display="flex"
          flexDirection="column"
          backgroundColor={colors.primary[400]}
          borderRadius="8px"
          p="20px"
          flex="3"
        >
          <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb="20px">
            Class Schedule
          </Typography>
          <Box maxHeight="250px" overflow="auto">
            {classSchedule.map((classItem) => (
              <Box
                key={classItem.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
                mb="10px"
              >
                <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                  {classItem.title}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {new Date(classItem.startTime).toLocaleString('vi-VN', options)} - {new Date(classItem.endTime).toLocaleString('vi-VN', options)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSchedule(classItem.room, classItem.id)}
                >
                  Schedule
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        backgroundColor={colors.primary[400]}
        borderRadius="8px"
        p="20px"
        display="flex" justifyContent="space-between" mt="20px"
      >
        <Box flex="1" mr="10px">
          <Box height="250px">
            <LineChart dataReal={voltageLogData} chartName={"Voltage Data"} />
          </Box>
        </Box>
        <Box flex="1" ml="10px">
          <Box height="250px">
            <LineChart dataReal={amperageLogData} chartName={"Amperage Data"} />
          </Box>
        </Box>
      </Box>

      <Box
        backgroundColor={colors.primary[400]}
        borderRadius="8px"
        p="20px"
        display="flex" justifyContent="space-between" mt="20px"
      >
        <Box flex="1" mr="10px">
          <Box height="250px">
            <LineChart dataReal={tempData} chartName={"Room Temperature"} />
          </Box>
        </Box>
        <Box flex="1" ml="10px">
          <Box height="250px">
            <LineChart dataReal={lightData} chartName={"Room Light"} />
          </Box>
        </Box>
      </Box>

      {/* DEVICE LIST */}
      <Box
        backgroundColor={colors.primary[400]}
        borderRadius="8px"
        p="20px"
        mt="20px"
      >
        <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb="20px">
          Devices
        </Typography>
        <Box maxHeight="300px" overflow="auto">
          {devices.map((device, index) => (
            <Box
              key={index}
              display="grid"
              gridTemplateColumns="repeat(4, 1fr)"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
              mb="10px"
            >
              <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                {device.device_id}
              </Typography>
              <Typography color={colors.grey[100]}>
                {device.deviceName}
              </Typography>
              <Typography color={colors.grey[100]}>
                {device.status ? "Active" : "Inactive"}
              </Typography>
              <Button
                variant={device.status ? "contained" : "outlined"}
                color={device.status ? "success" : "error"}
                onClick={() => handleToggle(device._id, device.status ? "off" : "on")}
                sx={{
                  backgroundColor: device.status ? colors.greenAccent[500] : colors.primary[600],
                  color: colors.grey[100]
                }}
              >
                {device.status ? "Turn Off" : "Turn On"}
              </Button>
              {overloadedDevices[device.device_id] && (
                <Typography color="red" variant="h6" fontWeight="600">
                  Quá tải
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Room;
