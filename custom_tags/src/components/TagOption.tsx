import * as React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

type Tag = {
  id: number;
  label: string;
};

const allTags: Tag[] = [
  { id: 101, label: 'Server' },
  { id: 102, label: 'React Hooks' },
  { id: 103, label: 'TypeScript Type' },
  { id: 104, label: 'Node.js Express' },
  { id: 105, label: 'GraphQL Resolvers' },
];

const TagOption = () => {
  const defaultTags = [allTags[1].label];
  const [selectedTags, setSelectedTags] = React.useState<string[]>(defaultTags);
  const [availableOptions, setAvailableOptions] = React.useState<string[]>(
    allTags.map((tag) => tag.label).filter((option) => !defaultTags.includes(option))
  );
  const [showSaveButton, setShowSaveButton] = React.useState<boolean>(false);

  const handleChange = (_event: any, newValue: string[]) => {
    const lowerCaseTags = new Set(newValue.map((tag) => tag.toLowerCase()));
    const uniqueTags = Array.from(lowerCaseTags);
    setSelectedTags(uniqueTags);
    setAvailableOptions(
      allTags.map((tag) => tag.label).filter((option) => !lowerCaseTags.has(option.toLowerCase()))
    );
    setShowSaveButton(uniqueTags.length > 0); // Show save button when tags are selected
  };

  const handleSave = () => {
    // You can replace this with actual saving logic (e.g., API call or state update)
    console.log('Tags saved:', selectedTags);
    setShowSaveButton(false); // Hide save button after saving
  };

  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={availableOptions}
        value={selectedTags}
        onChange={handleChange}
        filterSelectedOptions
        freeSolo
        filterOptions={(options, state) => {
          const inputValue = state.inputValue.toLowerCase();
          return options.filter((option) => option.toLowerCase().includes(inputValue));
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip variant="outlined" label={option} size="small" key={key} {...tagProps} />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Tags"
            placeholder="Add Tags..."
          />
        )}
      />

      {showSaveButton && (
        <Button
          variant="text"
          color="primary"
          onClick={handleSave}
          sx={{ marginTop: 2 }}
        >
          Save
        </Button>
      )}
    </Stack>
  );
};

export default TagOption;
