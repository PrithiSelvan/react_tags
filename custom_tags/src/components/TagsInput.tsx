import { useRef, useState } from "react";
import { TextField, Chip, Box, Paper, List, Button } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import { InputAdornment } from "@mui/material";

const TagsInput = () => {
  const MAX_TAGS = 15;
  const MAX_TAG_LENGTH = 30;
  const [query, setQuery] = useState("");

  // const [savedTags, setSavedTags] = useState<string[]>(() => {
  //   return JSON.parse(localStorage.getItem("savedTags") || "[]");
  // });
  const [savedTags, setSavedTags] = useState<string[]>([]);
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // Track active list item index
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]); // Reference to the list


  // useEffect(() => {
  //   localStorage.setItem("savedTags", JSON.stringify(savedTags));
  // }, [savedTags]);


  const tags = ["App", "Art", "Tutorial", "HowTo", "DIY", "Review", "Tech", "Gaming", "Travel", "Fitness", "Cooking", "Vlog", "Hello" , "Java" , "Python" , "React"];
 
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
    query.length > MAX_TAG_LENGTH || savedTags.length > MAX_TAGS || tempTags.length > MAX_TAGS ||
    (tempTags.length + savedTags.length) >MAX_TAGS || isDuplicateTag;

    const handleInputChange = (e:any)  => {
      setQuery(e.target.value);
      setActiveIndex(-1);
    }

    const handleKeyDown = (e: any) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prevIndex) => {
          const newIndex = Math.min(prevIndex + 1, filteredTags.length - 1);
          itemRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          return newIndex;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prevIndex) => {
          const newIndex = Math.max(prevIndex - 1, 0);
          itemRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          return newIndex;
        });
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && filteredTags[activeIndex]) {
          setTempTags([...tempTags, filteredTags[activeIndex]]);
          setQuery("");
          setMenuOpen(true);
          setActiveIndex(-1);
        } else if (!isDisable) {
          setTempTags([...tempTags, query]);
          setQuery("");
        }
      }
    };
    

  return (
    <>
      <h2>Tags</h2>
      <Box display="flex" justifyContent="left" alignItems="center" margin="10px" padding="10px" position="relative" >
        <Box>
          <Paper sx={{ display: "flex", alignItems: "center", p: 1, gap: 1, flexWrap: "wrap" }} elevation={0}>
            <TextField
              inputRef={inputRef}
              variant="outlined"
              fullWidth
              value={query}
              onChange={handleInputChange}
              placeholder={showInput ? "Enter tag..." : ""}
              onFocus={() => {
                setMenuOpen(true);
                setShowInput(true);
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {savedTags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => {
                          setSavedTags(savedTags.filter((t) => t !== tag));
                          setShowInput(true);
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
                        setShowInput(true);
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
                        disabled={query.length > MAX_TAG_LENGTH || savedTags.length > MAX_TAGS || tempTags.length > MAX_TAGS ||
                          (tempTags.length + savedTags.length) > MAX_TAGS || isDuplicateTag}
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
            <Paper sx={{ mt: 1, maxHeight: 150, overflowY: "auto", width: 250, position: "relative" }} elevation={0}>
              <List>
                {filteredTags.map((tag,index) => (
                  <ListItemButton
                    key={tag}
                    ref={(el) => (itemRefs.current[index] = el)} 
                    onClick={() => {
                      setTempTags([...tempTags, tag]);
                      setQuery("");
                      setMenuOpen(false);
                    }}
                    selected={index === activeIndex}
                    sx={{
                      backgroundColor: index === activeIndex ? "#91caf9" : "transparent",
                      color: index === activeIndex ? "#000000" : "inherit",
                    }}
                    disabled={query.length > MAX_TAG_LENGTH || savedTags.length >= MAX_TAGS || tempTags.length >= MAX_TAGS ||
                      (tempTags.length + savedTags.length) >= MAX_TAGS }
                  >
                    {tag}
                  </ListItemButton>
                ))}
                  {query.trim() && !filteredTags.includes(query) && (
              <Box display="flex" justifyContent="center" p={1} width="100%">
                <Button sx={{display:"flex", justifyContent:"center"}}
                  variant="outlined"
                  onClick={() => {
                    if (isDisable) return;
                    setTempTags([...tempTags, query]);
                    setQuery("");
                    inputRef.current?.focus();
                    setMenuOpen(true);
                    setShowInput(true);
                  }}
                  disabled={query.length > MAX_TAG_LENGTH || savedTags.length >= MAX_TAGS || tempTags.length >= MAX_TAGS ||
                    (tempTags.length + savedTags.length) >= MAX_TAGS || isDuplicateTag}
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
