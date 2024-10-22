import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Tables } from "../services/tables";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { ListMenu } from "../domains/Menu/list-menu";

export const Table = () => {
  const [params] = useSearchParams();
  const tableId = params.get("tableId");
  const navigate = useNavigate();
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Tables.getAllTables()
      .then((response) => {
        setAvailableTables(response.data.tables.map(({ id }) => id));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (loaded) {
      const storedTableId = sessionStorage.getItem("tableId");

      if (storedTableId) {
        navigate(`/table?tableId=${storedTableId}`);
      } else if (!tableId) {
        return navigate("/");
      } else if (!availableTables.includes(tableId)) {
        navigate("/", { state: "invalid table" });
      } else {
        sessionStorage.setItem("tableId", tableId);
      }
    }
  }, [loaded, availableTables, navigate, tableId]);

  if (!loaded) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="top"
      flexDirection="column"
      alignItems="center"
      height="100vh"
    >
      <Card variant="outlined" sx={{ maxWidth: 400 }}>
        <CardContent>
          <Typography variant="body1">
            You are currently at Table ID: <strong>{tableId}</strong>
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" component="div" gutterBottom>
        Menu Items
      </Typography>
      <ListMenu />
    </Box>
  );
};
