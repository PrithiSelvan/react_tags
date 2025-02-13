import React, { useState } from "react";
import { TextField, Chip, IconButton, Box, Autocomplete, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

const MAX_TAGS = 15;
const suggestedTags = ["Bug", "Feature", "Improvement", "Task", "Enhancement", "Critical", "Low Priority"];

const JiraLabels = () => {
  const [labels, setLabels] = useState(["Bug", "Feature"]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const addLabel = (newLabel: string) => {
    if (!newLabel) return;

    const formattedLabel = newLabel.trim().toLowerCase(); // Case-insensitive handling

    if (labels.some((tag) => tag.toLowerCase() === formattedLabel)) return; // Prevent duplicates
    if (labels.length >= MAX_TAGS) {
      setError(true);
      return; // Prevent adding beyond limit
    }

    setLabels([...labels, newLabel.trim()]);
    setInput("");
    setError(false);
  };

  const deleteLabel = (labelToDelete: string) => {
    setLabels(labels.filter((label) => label !== labelToDelete));
    if (labels.length - 1 < MAX_TAGS) setError(false); // Reset error when below max limit
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: 400 }}>
      {/* Display Existing Tags */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
        {labels.map((label, index) => (
          <Chip
            key={index}
            label={label}
            onDelete={() => deleteLabel(label)}
            sx={{ backgroundColor: "#e0f2f1", fontWeight: "bold" }}
          />
        ))}
      </Box>

      {/* Input & Autocomplete for Adding New Tags */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Autocomplete
          freeSolo
          options={suggestedTags.filter(
            (tag) => !labels.some((label) => label.toLowerCase() === tag.toLowerCase()) // Filter out selected tags
          )}
          value={input}
          onChange={(event, newValue) => {
            if (newValue) addLabel(newValue);
          }}
          inputValue={input}
          onInputChange={(event, newInput) => setInput(newInput)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="small"
              placeholder="Add label"
              onKeyPress={(e) => e.key === "Enter" && addLabel(input)}
              error={error}
            />
          )}
          sx={{ flexGrow: 1 }}
          disabled={labels.length >= MAX_TAGS} // Disable input when limit reached
        />
        <IconButton color="primary" onClick={() => addLabel(input)} disabled={labels.length >= MAX_TAGS}>
          <Add />
        </IconButton>
      </Box>

      {/* Persistent Error Message Below Input */}
      {error && <Typography color="error">Tag limit exceeded (max 15 tags allowed)</Typography>}
    </Box>
  );
};

export default JiraLabels;
