import { useRef, useState } from "react";
import { TextField, Chip, Box, Paper, List, ListItem, Button } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import { InputAdornment } from "@mui/material";

const TagsInput = () => {
  const MAX_TAGS = 15;
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);
  

  const tags = ["App", "Art", "Anish", "Tutorial", "HowTo", "DIY", "Review", "Tech", "Gaming", "Travel", "Fitness", "Cooking", "Vlog"];

  // Convert all comparisons to lowercase to ensure case insensitivity
  const lowerSelected = selected.map(tag => tag.toLowerCase());

  // Filter suggested tags (excluding already selected ones)
  const filteredTags = tags.filter(
    (item) => item.toLowerCase().includes(query.toLowerCase().trim()) && !lowerSelected.includes(item.toLowerCase())
  );

  const isDuplicateTag = tags.some(tag => tag.toLowerCase() === query.toLowerCase().trim());
  // Disable Add button if the tag is empty or already exists (case insensitive)
  const isDisable = !query.trim() || lowerSelected.includes(query.toLowerCase().trim()) || isDuplicateTag || selected.length >= MAX_TAGS;

  return (
    <>
    <h2>Tags</h2>
    <Box display="flex" justifyContent="left" alignItems="center" margin="10px" padding="10px" position="relative">
      <Box>
        {/* Input Box with Tags */}
        <Paper sx={{ display: "flex", alignItems: "center", p: 1, gap: 1 ,flexWrap:"wrap"}}>
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
                const matchedTag = filteredTags.find((tag) => tag.toLowerCase() === query.toLowerCase().trim());
                  const tagToAdd = matchedTag || query;

                  setSelected((prev) => [...prev, tagToAdd]);
                  setQuery("");
                  setMenuOpen(true);
               
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {!showInput && selected.length === 0 && (
                    <Button color="primary"
                      onClick={() => setShowInput(true)}>
                      +ADD
                    </Button>
                  )}
                  {selected.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => {
                        setSelected(selected.filter((t) => t !== tag));
                        
                      }}
                      sx={{ marginRight: "5px" }} 
                      />
                  ))}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">

                  {showInput && (
                    <Button
                      color="primary"
                      onClick={() => {
                        if (!isDisable) {
                          setSelected((prev) => [...prev, query]);
                          setQuery("");
                          setMenuOpen(true);
                         
                        }
                      } }
                        disabled = {selected.length >= MAX_TAGS}
                    >
                      SAVE
                    </Button>
                  )}
                </InputAdornment>
              ),
            }} />
        </Paper>

        {/* Drop-down with Suggested Tags */}
        {menuOpen && showInput && (
          <Paper sx={{ mt: 1, maxHeight: 150, overflowY: "auto", width:250, position:"relative"}}>
            <List>
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <ListItemButton
                  disabled = {selected.length >= MAX_TAGS}
                    key={tag}
                    onClick={() => {
                      setSelected((prev) => [...prev, tag]);
                      setQuery("");
                      setMenuOpen(true);
                      setShowInput(true);
                     
                    }}
                  >
                    {tag}
                  </ListItemButton>
                ))
              ) : (null)
              }
            </List>
            {query.trim() && !filteredTags.includes(query) && (
              <Box display="flex" justifyContent="center" p={1} width="100%">
                <Button
                  disabled={isDisable}
                  onClick={() => {
                    if (isDisable) return;
                    setSelected((prev) => [...prev, query]);
                    setQuery("");
                    inputRef.current?.focus();
                    setMenuOpen(true);
                    setShowInput(false);
                   
                  } }
                >
                   "{query}"  + Add
                </Button>
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </Box>
  
    </>
  );
};

export default TagsInput;
