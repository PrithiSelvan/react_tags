import React, { useState, useRef, useEffect, useContext } from 'react';
import { Box, Chip, IconButton, TextField, MenuItem, Paper, ClickAwayListener, Popover, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
// import { PortalContext } from '../contexts/portalInfo';

type Tag = {
  id: number;
  label: string;
};

const initialTags: Tag[] = [
  { id: 1, label: 'React Development' },
  { id: 2, label: 'JavaScript Essentials' },
  { id: 3, label: 'Advanced TypeScript' },
  { id: 4, label: 'Design Patterns' },
  { id: 5, label: 'UI/UX' },
  { id: 6, label: 'Redux' },
  { id: 7, label: 'Next.js' },
  { id: 8, label: 'GraphQL and Apollo Client' },

];

const allTags: Tag[] = [
  { id: 101, label: '1234567890123' },
  { id: 102, label: 'React Hooks' },
  { id: 103, label: 'TypeScript Type' },
  { id: 104, label: 'Node.js Express' },
  { id: 105, label: 'GraphQL Resolvers' }
];


const Tags: React.FC = () => {
  // const { tags: apiTags } = useContext(PortalContext)!;
  // const apiNewTags = apiTags.map((tag, i) => ({ id: i, label: tag }));
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredTags, setFilteredTags] = useState<Tag[]>(allTags);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [isAddBtnDisabled, setAddBtnDisabled] = useState(false);
  const [isAddBtnVisible, setAddBtnVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWarningMessage('');
    setInputValue(value);

    if (value.startsWith(" ") || (value.endsWith(" "))) {
      setWarningMessage('Tag not start and end with space');
    }
    else if (value.length <= 30) {
      const tagsFiltered = allTags.filter((tag) => !tags.some((t) => t.id === tag.id) && tag.label.toLowerCase().includes(value.toLowerCase()));
      setFilteredTags(tagsFiltered);
      setAddBtnVisible(tagsFiltered.some((tag) => {
        return tag.label.toLowerCase() !== value?.trim().toLowerCase();
      }));
      setDropdownOpen(true);
    }
    else {
      setWarningMessage('Character limit of 30 reached');
    }
    setAddBtnDisabled(tags.some((tag) => {
      return tag.label.toLowerCase() === value?.trim().toLowerCase();
    }));

  };

  // Handle adding a tag
  const handleAddTag = (tag: Tag) => {
    if (tags.length < 15 && !tags.some((t) => t.id === tag.id)) {
      const updatedTags = [...tags, tag];
      setTags(updatedTags);
      setInputValue('');
      setDropdownOpen(false);
      if (updatedTags.length >= 15) {
        setWarningMessage('Tag limit of 15 reached');
      }
      else {
        setWarningMessage('');
      }
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: Tag) => {
    const updatedTags = tags.filter((tag) => tag.id !== tagToRemove.id);
    setTags(updatedTags);
    if (updatedTags.length < 15) {
      setWarningMessage('');
    }
    if (isEditMode && inputValue === '') {
      setDropdownOpen(true);
    }
  };
  // Handle adding a new tag
  const handleAddNewTag = () => {
    if (tags.length < 15) {
      const newTag = { id: Date.now(), label: inputValue };
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      setInputValue('');
      setDropdownOpen(false);
      if (updatedTags.length >= 15) {
        setWarningMessage('Tag limit of 15 reached');
      }
      else {
        setWarningMessage('');
      }
    }

  };
  // Toggle edit mode
  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setInputValue('');
    if (!isEditMode) {
      if (tags.length >= 15) {
        setDropdownOpen(false);
        isEditMode && setWarningMessage('Tag limit of 15 reached');
      }
      else {
        setWarningMessage('');
      }
    }
    else {
      setFilteredTags(allTags.filter((tag) => !tags.some((t) => t.id === tag.id)));
      setDropdownOpen(true);
    }

  };

  // Handle click away from dropdown
  const handleClickAway = () => {
    setDropdownOpen(false);
    setInputValue('');
  };

  // Handle popover open
  const handlePopoverOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
  };

  // Handle popover close
  const handlePopoverClose = () => {
    setPopoverOpen(false);
    setAnchorEl(null);
  };

 

  useEffect(() => {
    if (inputRef.current && dropdownRef.current) {
      const { width } = inputRef.current.getBoundingClientRect();
      dropdownRef.current.style.width = `${width}px`;
    }
  }, [inputValue]);

  return (
    <Box
      sx={{
        width: 'max-content',
        maxWidth: '90%',
        ml: 2,
        p: 1,
        borderRadius: 1,
        position: 'relative',
        background: isEditMode ? '#bfbfbf14' : '#ffffff'
      }}
    >
      {!isEditMode ? (
        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 1, overflow: 'hidden', alignItems: 'center' }}>
          {tags.slice(0, 5).map((tag) => (
            <Chip key={tag.id} label={tag.label} size="small" sx={{ borderRadius: '8px', backgroundColor: '#e0f7fa', color: '#00796b' }} />
          ))}
          {tags.length > 5 && (
            <Box onClick={handlePopoverOpen} sx={{ cursor: 'pointer' }}>
              <Chip label={`+${tags.length - 5}`} size="small" sx={{ borderRadius: '8px', backgroundColor: '#e0f7fa', color: '#00796b' }} />
            </Box>
          )}
          <IconButton onClick={handleToggleEditMode} title="Edit tags" size="small">
            <ModeEditOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.label}
                onDelete={() => handleRemoveTag(tag)}
                deleteIcon={<CloseIcon />}
                size="small"
                sx={{ borderRadius: '8px', backgroundColor: '#e0f7fa', color: '#00796b' }}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <TextField
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter a tag"
              size="small"
              autoComplete='off'
              sx={{ width: '100%', maxWidth: '300px' }}
              inputRef={inputRef}
              disabled={tags.length >= 15}
              onClick={() => {
                const tagsFiltered = allTags.filter((tag) => !tags.some((t) => t.id === tag.id));
                setFilteredTags(tagsFiltered);
                setDropdownOpen(true);
              }}
              title={tags.length >= 15 ? 'Max 15 Limit reached' : ''}
            />
            
            

            <Button onClick={() => { handleToggleEditMode(); }} variant="outlined" color="primary" sx={{ ml: 1 }}>
              Save
            </Button>
          </Box>
          {warningMessage && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {warningMessage}
            </Typography>
          )}
        </Box>
      )}
      {isEditMode && dropdownOpen && !warningMessage && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper
            ref={dropdownRef}
            sx={{
              position: 'absolute',
              zIndex: 1,
              maxHeight: '200px',
              width: '100%',
              maxWidth: '250px',
              overflowY: 'auto',
              marginTop: '8px' // Add some margin to separate from TextField
            }}
          >
              {
              (isAddBtnVisible || filteredTags.length == 0) &&

              <MenuItem
                disabled={!inputValue || isAddBtnDisabled}
                onClick={handleAddNewTag}
                sx={{
                  color: inputValue ? '#2167f3' : 'inherit',
                }}
              >
                {inputValue ? `+ Add ${inputValue}` : '+ Add'}
              </MenuItem>
            }
            {filteredTags.length > 0
              ? filteredTags.map((tag) => (
                <MenuItem key={tag.id} onClick={() => handleAddTag(tag)}>
                  {tag.label}
                </MenuItem>
              ))
              : null}
          
          </Paper>
        </ClickAwayListener>
      )}
      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Box sx={{ padding: 1, display: 'flex', width: '250px', flexWrap: 'wrap', gap: 0.5 }}>
          {tags.slice(5).map((tag) => (
            <Chip key={tag.id} label={tag.label} size="small" sx={{ borderRadius: '8px', backgroundColor: '#e0f7fa', color: '#00796b' }} />
          ))}
        </Box>
      </Popover>
    </Box>
  );
};

export default Tags;
