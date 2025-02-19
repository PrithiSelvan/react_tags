import React, { useState } from "react";
import { TextField, InputAdornment, IconButton, Typography, Box, Grid2, Tooltip } from "@mui/material";
import { Visibility, VisibilityOff, ContentCopy } from "@mui/icons-material";

const Demo2 = () => {

    const [selected, setSelected] = useState<any>([]);
    // const [isAscending, setIsAscending] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [realApiKey, setRealApiKey] = useState<string>("gjroegjeoc");
    const [apiKey, setApiKey] = useState<string>("");
    const [copyStatus, setCopyStatus] = useState("Copy Key");



    const handleToggleVisibility = () => {
        setShowApiKey((prev) => !prev);
        setApiKey(realApiKey);
        // setApiKey(showApiKey ? "..............." : realApiKey);

    };

    const handleCopyApiKey = () => {
        navigator.clipboard.writeText(realApiKey);
        setCopyStatus("Copied!");
        setTimeout(() => setCopyStatus("Copy Key"), 2000);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 0 }}>
            <Grid2 container spacing={1} sx={{ marginTop: '0px', marginBottom: '20px' }} alignItems={'center'}>
                <Grid2 size={2}>
                    <Typography sx={{ m: 1 }}>API Key </Typography>
                </Grid2>
                <Grid2 size={4}>
                    <TextField
                        id="outlined-read-only-input"
                        type={showApiKey ? 'text' : 'password'}
                        value={realApiKey}
                        sx={{ width: 680, backgroundColor: '#fffee9'}}
                        InputProps={{
                            readOnly: true,
                            sx: { input: { fontFamily: 'monospace' } },
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton onClick={handleToggleVisibility} edge="start">

                                        {showApiKey ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title={copyStatus} placement="top" arrow>
                                        <IconButton
                                            onClick={handleCopyApiKey}
                                            edge="end">
                                            <ContentCopy
                                                fontSize="small"
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}

                    />

                </Grid2>
            </Grid2>
        </Box>
    );
}

export default Demo2;
