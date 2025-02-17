import React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useContext, useState } from 'react';
import { Box, Button, Paper, Popper, Typography } from '@mui/material';
// import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

import { PortalContext } from '../contexts/portalInfo';
import { IIncidentDetailType } from '../pages/detections/DetectionDetailPage';

const MAX_TAGS = 15;
const MAX_TAG_LENGTH = 30;

interface TagsProps {
  tagsList: string[];
  updateTag: (attributes: Partial<IIncidentDetailType>) => Promise<void>;
}

const Tag: React.FC<TagsProps> = ({ tagsList, updateTag }: any) => {
  const { tags: apiTags } = useContext(PortalContext)!;
  const apiNewTags = apiTags.map((tag, i) => ({ id: i, label: tag }));
  const defaultTags = tagsList;
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultTags);
  const [availableOptions, setAvailableOptions] = useState<string[]>(
    apiNewTags.map((tag) => tag.label).filter((option) => !defaultTags.includes(option))
  );
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [hasEdited, setHasEdited] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const handleChange = (_event: any, newValue: string[]) => {
    if (newValue.length > MAX_TAGS) {
      setWarningMessage("Tag limit of 15 reached");
      return;
    }
    setWarningMessage('');
    const validTags = newValue.filter(tag => tag.length <= MAX_TAG_LENGTH);
    if (validTags.length !== newValue.length) {
      setWarningMessage("Character limit of 30 reached");
      return;
    }
    const lowerCaseTagsSet = new Set();
    const uniqueTags = [];

    for (const tag of newValue) {
      const lowerCaseTag = tag.toLowerCase();
      if (!lowerCaseTagsSet.has(lowerCaseTag)) {
        lowerCaseTagsSet.add(lowerCaseTag);
        uniqueTags.push(tag);
      }
    }

    setSelectedTags(uniqueTags);
    setAvailableOptions(
      apiNewTags.map((tag) => tag.label).filter((option) => !lowerCaseTagsSet.has(option.toLowerCase()))
    );
    setHasEdited(true);
  };

  const handleTextField = () => {
    setHasEdited(true);
  };

  const handleToggleEditMode = () => {
    setHasEdited(!hasEdited);
  };

  const handleSave = () => {
    const tagsAPI = Object.values(selectedTags).map((tag) => tag);
    updateTag({ tags: tagsAPI });
    defaultTags.length = 0;
    defaultTags.push(...tagsAPI);
    setHasEdited(false);
  };

  const handleCancel = () => {
    setSelectedTags(defaultTags);
    setAvailableOptions(
      apiNewTags.map((tag) => tag.label).filter((option) => !defaultTags.includes(option))
    );
    setHasEdited(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', width: 600 }}>
        <Stack spacing={3} sx={{ width: 400, pl: 3, pt: 1 }}>
          {hasEdited ? (
            <Autocomplete
              multiple
              id="tags-outlined"
              options={availableOptions}
              value={selectedTags}
              onChange={handleChange}
              defaultValue={[tagsList.map((tag: { lowercase: any; }) => tag.lowercase)]}
              freeSolo
              filterSelectedOptions
              filterOptions={(options, state) => {
                const inputValue = state.inputValue.toLowerCase();
                return options.filter((option) => option.toLowerCase().includes(inputValue));
              }}
              size='small'
              renderTags={(value, getTagProps) =>
                value.map((option: string, index: number) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  const isDefaultTag = defaultTags.includes(option);
                  const showDeleteIcon = hasEdited || !isDefaultTag;
                  return (
                    <Chip variant="outlined"
                      label={option}
                      size="small"
                      key={key}
                      {...tagProps}
                      onDelete={showDeleteIcon ? tagProps.onDelete : undefined} />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Add Tags..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: null,
                  }}
                  onClick={handleTextField}
                />
              )}
            />
          )
            : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                {selectedTags.slice(0, 3).map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
                {selectedTags.length > 3 && (
                  <Chip
                    label={`+${selectedTags.length - 3}`}
                    size="small"
                    variant="outlined"
                    onClick={handleClick}
                  />
                )}
                {/* <IconButton onClick={handleToggleEditMode} size="small">
                <Typography>Add Tag</Typography>
                <ModeEditOutlineOutlinedIcon fontSize="small" />
              </IconButton> */}
                <Button
                  sx={{ p: 0 }}
                  variant="text"
                  color="primary"
                  onClick={() => {
                    handleToggleEditMode();
                  }}
                >
                  Add Tag
                </Button>
              </Box>
            )}
        </Stack>
        {hasEdited && (
          <Box sx={{ display: 'flex', m: 0, p: 0 }}>
            <Button
              sx={{ p: 0 }}
              variant="text"
              color="primary"
              onClick={() => {
                handleSave();
              }}
            >
              Save
            </Button><Button
              sx={{ p: 0 }}
              variant="text"
              color="primary"
              onClick={() => {
                handleCancel();
              }}>
              Cancel
            </Button>
          </Box>
        )}

        {!hasEdited && (
          <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
            <Paper sx={{ p: 1, mt: 1, boxShadow: 3, maxWidth: 200 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedTags.slice(3).map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            </Paper>
          </Popper>
        )}
      </Box>
      <Typography sx={{ pl: 3, pt: 1, color: "red" }}>{warningMessage}</Typography></Box>
  );
};
export default Tag;
