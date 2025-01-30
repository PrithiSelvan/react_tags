import { useRef, useState } from "react";
import { TextField, Chip, Box, Paper, List, IconButton, ListItemButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from "@mui/icons-material/Close";


const App = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = [
    "Tutorial",
    "HowTo",
    "DIY",
    "Review",
    "Tech",
    "Gaming",
    "Travel",
    "Fitness",
    "Cooking",
    "Vlog",
  ];

  const filteredTags = tags.filter(
    (item) =>
      item.toLowerCase().includes(query.toLowerCase().trim()) &&
      !selected.includes(item)
  );

  const isDisable =
    !query.trim() ||
    selected.some(
      (item) => item.toLowerCase().trim() === query.toLowerCase().trim()
    );

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#eef1f8">
      <Box width={320}>
        {selected.length > 0 && (
          <Paper sx={{ p: 1, mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selected.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => setSelected(selected.filter((i) => i !== tag))}
                color="default"
              />
            ))}
            <Box width="100%" textAlign="right">
              <Chip
                label="Clear all"
                onClick={() => {
                  setSelected([]);
                  inputRef.current?.focus();
                }}
                variant="outlined"
                size="small"
              />
            </Box>
          </Paper>
        )}
        <Paper sx={{ display: "flex", alignItems: "center", p: 1, gap: 1 }}>
          <SearchIcon color="error" />
          <TextField
            inputRef={inputRef}
            variant="standard"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value.trimStart())}
            placeholder="Search or Create tags"
            onFocus={() => setMenuOpen(true)}
            onBlur={() => setMenuOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isDisable) {
                setSelected((prev) => [...prev, query]);
                setQuery("");
                setMenuOpen(true);
              }
            }}
          />
        </Paper>
        {menuOpen && (
          <Paper sx={{ mt: 1, maxHeight: 150, overflowY: "auto" }}>
            <List>
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <ListItemButton
                    key={tag}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSelected((prev) => [...prev, tag]);
                      setQuery("");
                    }}
                  >
                    {tag}
                  </ListItemButton>
                ))
              ) : (
                <ListItemButton>No options available</ListItemButton>
              )}
            </List>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default App;
