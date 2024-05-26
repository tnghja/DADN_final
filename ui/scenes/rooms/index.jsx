import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataRoom } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const Rooms = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); // Correctly use useNavigate

    const columns = useMemo(() => [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "building", headerName: "Building", flex: 1 },
    { field: "roomNumber", headerName: "Room", flex: 1 },
    {
      field: "detail",
      headerName: "Detail",
      flex: 1,
      renderCell: (params) => (
          <Box
            width="50%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
                  colors.greenAccent[600]
              }
            borderRadius="4px"
            role = "button"
            variant="contained"
            onClick={() => navigate(`../room/${params.row.roomNumber}`)}  
            sx={{ cursor: 'default', color: colors.primary[500] }}  
        >
          Information
        </Box>
      ),
    }
  ], [navigate]);

  const dataGridStyles = {
    root: {
      border: "none",
    },
    cell: {
      borderBottom: "none",
    },
    columnHeaders: {
      backgroundColor: colors.blueAccent[700],
      borderBottom: "none",
    },
    virtualScroller: {
      backgroundColor: colors.primary[400],
    },
    footerContainer: {
      borderTop: "none",
      backgroundColor: colors.blueAccent[700],
    },
    checkboxRoot: {
      color: `${colors.greenAccent[200]} !important`,
    },
    toolbarButton: {
      color: `${colors.grey[100]} !important`,
    },
  };

  return (
    <Box m="20px">
      <Header title="ROOMS" subtitle="List of Rooms" />
      <Box m="40px 0 0 0" height="75vh" sx={{
        "& .MuiDataGrid-root": dataGridStyles.root,
        "& .MuiDataGrid-cell": dataGridStyles.cell,
        "& .MuiDataGrid-columnHeaders": dataGridStyles.columnHeaders,
        "& .MuiDataGrid-virtualScroller": dataGridStyles.virtualScroller,
        "& .MuiDataGrid-footerContainer": dataGridStyles.footerContainer,
        "& .MuiCheckbox-root": dataGridStyles.checkboxRoot,
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": dataGridStyles.toolbarButton,
      }}>
        <DataGrid
          rows={mockDataRoom}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Rooms;
