  const [selected, setSelected] = useState<any>([]);
  // const [isAscending, setIsAscending] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [realApiKey, setRealApiKey] = useState<string>("gjroegjeoc");
  const [apiKey, setApiKey] = useState<string>("");


  const handleToggleVisibility = () => {
    setShowApiKey((prev) => !prev);
    setApiKey(realApiKey);
    // setApiKey(showApiKey ? "..............." : realApiKey);
    
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(realApiKey);
  };

   <Box sx={{ display: 'flex', alignItems: 'center', p: 2,pb:0 }}>
        <Grid container spacing={1} sx={{ marginTop: '0px', marginBottom: '20px' }} alignItems={'center'}>
          <Grid size={2}>
            <Typography sx={{ m: 1 }}>API Key </Typography>
          </Grid>
          <Grid size={4}>
            <TextField
              id="outlined-read-only-input"
              type={showApiKey ? 'text' : 'password'}
              value={realApiKey}
              sx={{ width: 680, backgroundColor:'#fffee9', fontFamily:'monospace'}}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={handleToggleVisibility} edge="start">
                        
                        {showApiKey ? <Visibility fontSize="small"/> : <VisibilityOff fontSize="small"/>}
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                    onClick={handleCopyApiKey} 
                    edge="end">
                      <ContentCopy 
                      fontSize="small"
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}

            />
           
          </Grid>
        </Grid>
      </Box>
