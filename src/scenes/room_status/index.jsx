import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, useTheme, Button, Modal, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { tokens } from "../../theme";
import axios from "axios";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LineChart from "../../components/LineChart";
import Header from "../../components/Header";
import { useParams } from 'react-router-dom';
import OverloadControlForm from '../../components/Threshold'; // Import the new component

const Room = () => {
  const { roomId } = useParams();
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
  const [totalWattage, setTotalWattage] = useState(0);
  const [isOverloadControlOpen, setIsOverloadControlOpen] = useState(false); // State to control modal

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
              x: new Date(logEntry.date).toLocaleTimeString(),
              y: logEntry.power
            }))
          }];
        });

        const voltageLogPromises = devices.map(async (device, index) => {
          const response = await axios.get(`http://localhost:3001/api/log/${device.device_id}/voltage`);
          const logs = response.data.slice(-10);
          return [{
            id: device.deviceName,
            color: colors[index % colors.length],
            data: logs[0].data.map(logEntry => ({
              x: new Date(logEntry.date).toLocaleTimeString(),
              y: logEntry.voltage
            }))
          }];
        });

        const amperageLogPromises = devices.map(async (device, index) => {
            // Fetch the logs for the device
            const response = await axios.get(`http://localhost:3001/api/log/${device.device_id}/amperage`);
            const logs = response.data.slice(-10);
        
            // Fetch the overload settings for the room
            const res = await axios.get(`http://localhost:3001/api/room/${roomId}/threshold`);
        
            if (res.data) {
              const { threshold, devices: overloadSettings } = res.data;
              const lastThreeLogs = logs.slice(-3).flatMap(log => log.data);
        
              // Check if all last three log entries exceed the threshold
              const allExceedThreshold = lastThreeLogs.every(logEntry => logEntry.amperage > threshold);
              if (allExceedThreshold) {
                setOverloadedDevices(prev => ({ ...prev, [device.device_id]: true }));
        
                // Find the device settings in the threshold data
                const deviceSetting = overloadSettings.find(d => d.device_id === device.device_id);
        
                if (deviceSetting) {
                  if (deviceSetting.value !== undefined) {
                    // Set the fan speed if the value is defined
                    await axios.post(`http://localhost:3001/api/device/${device.device_id}/setFanSpeed`, { value: deviceSetting.value });
                  } else {
                    // Turn off the device if no specific value is defined
                    await axios.post(`http://localhost:3001/api/device/${device.device_id}/turnOff`);
                  }
        
                  // Update the device status in the state
                  setDevices(prevDevices =>
                    prevDevices.map(dev =>
                      dev.device_id === device.device_id ? { ...dev, status: false } : dev
                    )
                  );
                }
              }
            }
        
          return [{
            id: device.deviceName,
            color: colors[index % colors.length],
            data: logs[0].data.map(logEntry => ({
              x: new Date(logEntry.date).toLocaleTimeString(),
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

        const totalWattage = transformedLogs.reduce((acc, deviceLog) => {
          const lastLog = deviceLog.data[deviceLog.data.length - 1];
          return acc + (lastLog ? lastLog.y : 0);
        }, 0);
        setTotalWattage(totalWattage);
      } catch (error) {
        console.error(error);
      }
    };


    if (devices.length > 0) {
      fetchLogs();
      const intervalId = setInterval(() => {
        fetchLogs();
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [devices, roomId]);

  const handleToggle = async (deviceId, newStatus) => {
    try {
      if (newStatus === "on") {
        await axios.post(`http://localhost:3001/api/device/${deviceId}/turnOn`);
      } else if (newStatus === "off") {
        await axios.post(`http://localhost:3001/api/device/${deviceId}/turnOff`);
      }

      const response = await axios.get(`http://localhost:3001/api/room/${roomId}`);
      setDevices(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFanChange = async (deviceId, newValue) => {
    try {
      await axios.post(`http://localhost:3001/api/device/${deviceId}/setFanSpeed`, { value: newValue });

      const response = await axios.get(`http://localhost:3001/api/room/${roomId}`);
      setDevices(response.data);
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

  const handleOpenOverloadControl = () => {
    setIsOverloadControlOpen(true);
  };

  const handleCloseOverloadControl = () => {
    setIsOverloadControlOpen(false);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Room" subtitle="Welcome to your dashboard" />
        <Button variant="contained" color="primary" onClick={handleOpenOverloadControl}>
          Open Overload Control
        </Button>
      </Box>

      <Modal
        open={isOverloadControlOpen}
        onClose={handleCloseOverloadControl}
        aria-labelledby="overload-control-modal"
        aria-describedby="overload-control-modal-description"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          p="20px"
        >
          <OverloadControlForm roomId={roomId} onClose={handleCloseOverloadControl} />
        </Box>
      </Modal>

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
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                Energy Consumption
              </Typography>
              <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                {totalWattage}W
              </Typography>
            </Box>

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
              {device.type === "light" ? (
                <Button
                  variant={device.status ? "contained" : "outlined"}
                  color={device.status ? "success" : "error"}
                  onClick={() => handleToggle(device.device_id, device.status ? "off" : "on")}
                  sx={{
                    backgroundColor: device.status ? colors.greenAccent[500] : colors.primary[600],
                    color: colors.grey[100]
                  }}
                >
                  {device.status ? "Turn Off" : "Turn On"}
                </Button>
              ) : (
                <ToggleButtonGroup
                  value={device.value}
                  exclusive
                  onChange={(event, newValue) => handleFanChange(device.device_id, newValue)}
                  aria-label="fan speed"
                  sx={{
                    '& .MuiToggleButton-root': {
                      padding: '10px 20px',
                      '&.Mui-selected': {
                        backgroundColor: 'lightblue',
                        color: 'black',
                      }
                    }
                  }}
                >
                  <ToggleButton value={0} aria-label="off">
                    Off
                  </ToggleButton>
                  <ToggleButton value={1} aria-label="low">
                    Low
                  </ToggleButton>
                  <ToggleButton value={2} aria-label="high">
                    High
                  </ToggleButton>
                </ToggleButtonGroup>

              )}
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
