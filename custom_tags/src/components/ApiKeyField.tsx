import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton, Typography, Box } from "@mui/material";
import { Visibility, VisibilityOff, ContentCopy } from "@mui/icons-material";

const ApiKeyField: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("...............");
  const [realApiKey, setRealApiKey] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=5")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch API key");
        }
        return response.json();
      })
      .then((data) => {
        setRealApiKey(data.apiKey);
        setApiKey("...............");
        setError(false);
      })
      .catch((err) => {
        console.error("Error fetching API key:", err);
        setError(true);
      });
  }, []);

  const handleToggleVisibility = () => {
    setShowApiKey((prev) => !prev);
    setApiKey(showApiKey ? "..............." : realApiKey);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(realApiKey);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: 600 }}>
      <Typography sx={{m:2}}>Api Key</Typography>
      
      <TextField
      sx={{borderRadius:"5opx"}}
      variant="outlined"
      type="text"
      value={apiKey}
      error={error}
      helperText={error ? "Failed to load API key" : ""}
      InputProps={{
        readOnly: true,
        startAdornment: (
          <InputAdornment position="start">
            <IconButton onClick={handleToggleVisibility} edge="start">
              {showApiKey ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleCopyApiKey} edge="end">
              <ContentCopy />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
      </Box>
  );
};

export default ApiKeyField;
