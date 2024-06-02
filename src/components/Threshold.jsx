import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Checkbox, FormControlLabel, ToggleButtonGroup, ToggleButton, useTheme } from "@mui/material";
import axios from 'axios';
import { tokens } from "../theme";  // Import tokens from your theme file

const OverloadControlForm = ({ roomId, onClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);  // Get colors based on the current theme

  const [amperageThreshold, setAmperageThreshold] = useState(0);
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState({});

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

  const handleDeviceToggle = (deviceId) => {
    setSelectedDevices((prev) => ({
      ...prev,
      [deviceId]: prev[deviceId] === false ? null : false,
    }));
  };

  const handleFanChange = (deviceId, newValue) => {
    setSelectedDevices((prev) => ({
      ...prev,
      [deviceId]: newValue,
    }));
  };

  const handleSubmit = async () => {
    try {
      const selectedDeviceSettings = Object.entries(selectedDevices)
        .filter(([deviceId, value]) => value !== false)
        .map(([deviceId, value]) => {
          const device = devices.find(d => d.device_id === deviceId);
          return device.type === 'fan' ? { deviceId, value } : { deviceId };
        });
      await axios.post(`http://localhost:3001/api/room/${roomId}/threshold`, {
        amperageThreshold,
        devices: selectedDeviceSettings,
      });
      alert('Overload settings saved successfully!');
      onClose();
    } catch (error) {
      console.error("Error saving overload settings: ", error);
      alert('Error saving overload settings');
    }
  };

  return (
    <Box p="20px" display="flex" flexDirection="column" sx={{ backgroundColor: colors.primary[400], borderRadius: '8px' }}>
      <Typography variant="h5" fontWeight="600" mb="20px" sx={{ color: colors.grey[100] }}>Overload Control</Typography>
      <TextField
        label="Amperage Threshold"
        type="number"
        value={amperageThreshold}
        onChange={(e) => setAmperageThreshold(e.target.value)}
        fullWidth
        margin="normal"
        sx={{ '& .MuiInputBase-input': { color: colors.grey[100] }, '& .MuiFormLabel-root': { color: colors.grey[500] } }}
      />
      <Box mt="20px">
        {devices.map((device) => (
          <Box key={device.device_id} mb="10px">
            <Typography sx={{ color: colors.grey[100], mb: '5px' }}>{device.deviceName}</Typography>
            {device.type === 'light' ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedDevices[device.device_id] !== false}
                    onChange={() => handleDeviceToggle(device.device_id)}
                    sx={{ color: colors.grey[100] }}
                  />
                }
                label={<Typography sx={{ color: colors.grey[100] }}>Toggle Light</Typography>}
              />
            ) : device.type === 'fan' ? (
              <ToggleButtonGroup
                value={selectedDevices[device.device_id] || 0}
                exclusive
                onChange={(event, newValue) => handleFanChange(device.device_id, newValue)}
                aria-label="fan speed"
                sx={{
                  '& .MuiToggleButton-root': {
                    fontSize: '1rem',
                    padding: '10px 20px',
                    color: colors.grey[100],
                    '&.Mui-selected': {
                      backgroundColor: colors.greenAccent[500],
                      color: colors.grey[100],
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
            ) : null}
          </Box>
        ))}
      </Box>
      <Box mt="20px" display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default OverloadControlForm;
