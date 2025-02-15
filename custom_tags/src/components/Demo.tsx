import React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useContext, useState } from 'react';
import { Box, Button, IconButton, MenuItem, Typography } from '@mui/material';

import { PortalContext } from '../contexts/portalInfo';
import { IIncidentDetailType } from '../pages/detections/DetectionDetailPage';

const MAX_TAGS = 15;
const MAX_TAG_LENGTH = 30;


interface TagsProps {
    tagsList: string[];
    updateTag: (attributes: Partial<IIncidentDetailType>) => Promise<void>;
}

const TagOption: React.FC<TagsProps> = ({ tagsList, updateTag }: any) => {
    const { tags: apiTags } = useContext(PortalContext)!;
    const apiNewTags = apiTags.map((tag, i) => ({ id: i, label: tag }));
    const defaultTags = tagsList;
    const [selectedTags, setSelectedTags] = useState<string[]>(defaultTags);
    const [availableOptions, setAvailableOptions] = useState<string[]>(
        apiNewTags.map((tag) => tag.label).filter((option) => !defaultTags.includes(option))
    );

    const [showButton, setShowButton] = useState<boolean>(false);
    const [warningMessage, setWarningMessage] = useState<string>('');

    const handleChange = (_event: any, newValue: string[]) => {
        if (newValue.length > MAX_TAGS) {
            setWarningMessage("Tag limit of 15 reached");
            return;
        }
        setWarningMessage('');

        // Filter out invalid tags based on length
        const validTags = newValue.filter(tag => tag.length <= MAX_TAG_LENGTH);
        if (validTags.length !== newValue.length) {
            setWarningMessage("Character limit of 30 reached");
            return;
        }

        // Create a set to track lowercase tags for duplicate checking
        const lowerCaseTagsSet = new Set();
        const uniqueTags = [];

        for (const tag of newValue) {
            const lowerCaseTag = tag.toLowerCase();
            if (!lowerCaseTagsSet.has(lowerCaseTag)) {
                lowerCaseTagsSet.add(lowerCaseTag);
                uniqueTags.push(tag); // Push the original case tag
            }
        }

        setSelectedTags(uniqueTags);
        setAvailableOptions(
            apiNewTags.map((tag) => tag.label).filter((option) => !lowerCaseTagsSet.has(option.toLowerCase()))
        );
        setShowButton(uniqueTags.length > 0);
    };

    const handleSave = () => {
        const tagsAPI = Object.values(selectedTags).map((tag) => tag);
        updateTag({ tags: tagsAPI });
        setShowButton(false);
    };

    const handleCancel = () => {
        setSelectedTags(defaultTags);
        setAvailableOptions(
            apiNewTags.map((tag) => tag.label).filter((option) => option != defaultTags)
        );
        setShowButton(false);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: 600 }}>
            <Stack spacing={3} sx={{ width: 400, pl: 3, pt: 1 }}>



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
                            return (
                                <Chip variant="outlined"
                                    label={option}
                                    size="small"
                                    key={key} {...tagProps} />
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

                        />

                    )}


                />
            </Stack>
            {showButton && (
                <Box sx={{ display: 'flex', m: 0, p: 0 }}>
                    <Typography>{warningMessage}</Typography>
                    <Button
                        sx={{ p: 0 }}
                        variant="text"
                        color="primary"
                        onClick={() => {
                            handleSave();

                        }}>
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

        </Box>

    );
}


export default TagOption;
