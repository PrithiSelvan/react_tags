import { useRef, useState, useEffect } from "react";
import { TextField, Chip, Box, Paper, List, Button } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import { InputAdornment } from "@mui/material";

const TagsInput = () => {
  const MAX_TAGS = 15;
  const MAX_TAG_LENGTH = 30;
  const [query, setQuery] = useState("");
  const [savedTags, setSavedTags] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("savedTags") || "[]");
  });
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);
 

  useEffect(() => {
    localStorage.setItem("savedTags", JSON.stringify(savedTags));
  }, [savedTags]);


  const tags = ["App", "Art", "Tutorial", "HowTo", "DIY", "Review", "Tech", "Gaming", "Travel", "Fitness", "Cooking", "Vlog"];
 
  const lowerSavedTags = savedTags.map(tag => tag.toLowerCase());
  const lowerTempTags = tempTags.map(tag => tag.toLowerCase());
  const isDuplicateTag = tags.some(tag => tag.toLowerCase() === query.toLowerCase().trim());
  
  const filteredTags = tags
    .filter((item) => 
      item.toLowerCase().includes(query.toLowerCase().trim()) &&
      !lowerSavedTags.includes(item.toLowerCase()) &&
      !lowerTempTags.includes(item.toLowerCase())
    )
    .sort((a, b) => a.localeCompare(b));
 
  const isDisable =
    !query.trim() ||
    tempTags.includes(query.toLowerCase().trim()) ||
    savedTags.includes(query.toLowerCase().trim())  ||
    query.length > MAX_TAG_LENGTH ||
    tempTags.length + savedTags.length >= MAX_TAGS || isDuplicateTag;

  return (
    <>
      <h2>Tags</h2>
      <Box display="flex" justifyContent="left" alignItems="center" margin="10px" padding="10px" position="relative">
        <Box>
          <Paper sx={{ display: "flex", alignItems: "center", p: 1, gap: 1, flexWrap: "wrap" }}>
            <TextField
              inputRef={inputRef}
              variant="outlined"
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={showInput ? "Enter tag..." : ""}
              onFocus={() => {
                setMenuOpen(true);
                setShowInput(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isDisable) {
                  setTempTags([...tempTags, query]);
                  setQuery("");
                  setMenuOpen(true);
                }
              }}
              
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {savedTags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => {
                          setSavedTags(savedTags.filter((t) => t !== tag));
                          setShowInput(false);
                        }}
                        sx={{ marginRight: "5px", backgroundColor: "#90caf9" }}
                      />
                    ))}
                    {!showInput && (
                      <Button color="primary" onClick={() => setShowInput(true)}>
                        +ADD
                      </Button>
                    )}
                    {tempTags.map((tag) => (
                      <Chip key={tag} label={tag} 
                      onDelete={() => {
                        setTempTags(tempTags.filter((t) => t !== tag));
                      }}
                      sx={{ marginRight: "5px", backgroundColor: "#ffcc80" }} />
                    ))}
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {showInput && (
                      <Button
                        color="primary"
                        onClick={() => {
                          setSavedTags([...savedTags, ...tempTags]);
                          setTempTags([]);
                          setQuery("");
                          setMenuOpen(false);
                          setShowInput(false);
                        }}
                        disabled={tempTags.length === 0 || isDuplicateTag}
                      >
                        SAVE
                      </Button>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          {menuOpen && showInput && (
            <Paper sx={{ mt: 1, maxHeight: 150, overflowY: "auto", width: 250, position: "relative" }}>
              <List>
                {filteredTags.map((tag) => (
                  <ListItemButton
                    key={tag}
                    onClick={() => {
                      setTempTags([...tempTags, tag]);
                      setQuery("");
                      setMenuOpen(false);
                    }}
                  >
                    {tag}
                  </ListItemButton>
                ))}
                  {query.trim() && !filteredTags.includes(query) && (
              <Box display="flex" justifyContent="center" p={1} width="100%">
                <Button
                  disabled={isDisable}
                  onClick={() => {
                    if (isDisable) return;
                    setTempTags([...tempTags, query]);
                    setQuery("");
                    inputRef.current?.focus();
                    setMenuOpen(true);
                    setShowInput(true);
                  }}
                >
                   "{query}"  + Add
                </Button>
              </Box>
            )}
              </List>
            </Paper>
          )}
        </Box>
      </Box>
    </>
  );
};

export default TagsInput;
