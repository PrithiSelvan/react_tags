import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,

  Grid2 as Grid,
  IconButton,
  InputAdornment,

  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import WindowsIcon from '../components/custom-icons/Windows';
import MacosIcon from '../components/custom-icons/Macos';
import LinuxIcon from '../components/custom-icons/Linux';
import { TabPanel } from '../layout/Base/Header/HeaderContent/Profile';
import { CustomTable } from '../components/CustomTable';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import { ContentCopy, Visibility, VisibilityOff } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import { getApikey, getSensorsVersion } from '../api/agent-installation';
import { PortalContext } from '../contexts/portalInfo';
import { yellow } from '@mui/material/colors';
import { useLocation } from 'react-router-dom';

// TODO change to
const PLATFORM: any = {
  WINDOWS: 0,
  MACOS: 1,
  LINUX: 2,

}
type VersionRow = {
  id: string;
  version: string;
  downloadPath: string;
  lastUpdated: string;
};
interface Column {
  disablePadding: boolean;
  id: keyof VersionRow;
  value: string;
  label: string;
  width: string;
  type?: string;
  required: boolean;
  selected: boolean;
}

export type AgentVersions = {
  version: string;
  platform: string,
  includedOsVersions: string,
  excludedOsVersions: string,
  includedBuilds: number,
  excludedBuilds: string,
  releasedDate: string,
  changes: string,
  downloadLink: string

}

export function AgentInstallation() {
  const { state } = useLocation();
  const [tabValue, setTabValue] = useState(PLATFORM[state?.platform] || 0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rows, setRows] = useState<VersionRow[]>([]);
  const [columns] = useState<Column[]>([
    {
      id: 'version',
      disablePadding: false,
      value: 'version',
      label: 'Version',
      selected: true,
      required: true,
      width: '40%'
    },
    {
      id: 'lastUpdated',
      disablePadding: false,
      label: 'Last updated',
      value: 'lastUpdated',
      selected: true,
      required: false,
      type: 'date',
      width: '30%'
    },
    {
      id: 'downloadPath',
      disablePadding: false,
      label: 'Action',
      value: 'action',
      type: 'action',
      selected: true,
      required: false,
      width: '30%'
    }
  ]);
  const [selected, setSelected] = useState<any>([]);
  // const [isAscending, setIsAscending] = useState(false);
  const { portalId } = useContext(PortalContext)!;

  const [showApiKey, setShowApiKey] = useState(false);
  const [realApiKey, setRealApiKey] = useState<any>("");
  const [copyStatus, setCopyStatus] = useState("Copy Key");
  const [sensorVersionDetails, setSensorVersionDetails] = useState<AgentVersions[]>([]);



  async function fetchApiKey() {
    try {
      const response = (await getApikey(portalId)) as Response;
      if (response.ok) {
        const data = await response.json();
        setRealApiKey(data.enrollmentKey)
      }

    }
    catch (error) {
      console.error(error);
    }
  }

  async function fetchSensors() {
    const sensorsDetails: string[] = [
      'version',
      'platform',
      'includedOsVersions',
      'excludedOsVersions',
      'includedBuilds',
      'excludedBuilds',
      'releasedDate',
      'changes',
      'downloadLink'

    ];


    try {
      const response = (await getSensorsVersion(portalId, {
        sensorsVersion: sensorsDetails
      })) as Response;
      //  if (isTechnicianAuthzModified(response)) {
      //    return;
      //  }
      const sensorsVersion: AgentVersions[] = [];
      if (response?.ok) {
        const data = await response.json();
        const sensorsData = data?.data;
        sensorsData.forEach((sensor: any) => {
          const attributes = sensor?.attributes;
          sensorsVersion.push({
            // id: sensorsData?.id,
            version: attributes?.version,
            platform: attributes?.platform,
            includedOsVersions: attributes?.includedOsVersions,
            excludedOsVersions: attributes?.excludedOsVersions,
            includedBuilds: attributes?.includedBuilds,
            excludedBuilds: attributes?.excludedBuilds,
            releasedDate: attributes?.releasedDate,
            changes: attributes?.changes,
            downloadLink: attributes?.downloadLink

          });
        });
        //  console.log(sensorsVersion);

        setSensorVersionDetails(sensorsVersion);
      }
    } catch (error) {
      console.error(error);
    }
  }
  console.log(sensorVersionDetails)

  useEffect(() => {
    fetchApiKey();
  }, []);

  useEffect(() => {
    fetchSensors();
  }, [])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCloseDialog = (_event?: any, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason == 'backdropClick') {
      return;
    }
    setIsDialogOpen(false);
  };

  const handleToggleVisibility = () => {
    setShowApiKey((prev) => !prev);
    setRealApiKey(realApiKey);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(realApiKey);
    setCopyStatus("Copied!");
    setTimeout(() => setCopyStatus("Copy Key"), 1000);
  };

  const onClickActionButton = (_row: any) => { };

  // const SensorVersionPage = () => {
  //   return (
  //     <Box
  //       component={'div'}
  //       sx={{
  //         borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  //         borderRadius: '5px',
  //         my: '5px',
  //         minHeight: '30px',
  //         width: '800px'
  //       }}
  //     >
  //       <Box sx={{ padding: '10px' }}>
  //         <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} marginBottom={'5px'}>
  //           <Stack direction={'row'} alignItems={'center'}>
  //             <Typography variant="h4" sx={{ paddingRight: '15px', fontSize: 16 }}>
  //               Windows Sensor - {sensorVersionDetails.version}
  //             </Typography>

  //           </Stack>
  //           <Button size="medium" color="primary" variant="contained">
  //             Download
  //           </Button>
  //         </Stack>
  //       </Box>
  //       </Box>
  //   )
  // }

  {/* <Divider />
      <Box sx={{ padding: '5px 20px 0px 20px' }}>
        <Stack direction={'row'} alignItems={'center'}>
          <Typography variant="h5">Whats Changed</Typography>
          <Typography variant="h6" sx={{ textAlign: 'center', color: 'grey', fontSize: 'smaller', marginLeft: '10px' }}>
            updated on: {sensorVersionDetails.releasedDate}
          </Typography>
        </Stack>
        <Box>
          <ul>
            <li>
              <Typography variant="h6">feat: request and reply decorators can not be a reference type</Typography>
            </li>
            <li>
              <Typography variant="h6">fix: config type in RouteShorthandOptions</Typography>
            </li>
          </ul>

          <Button
            size="small"
            sx={{ textTransform: 'none' }}
            onClick={() => {
              setIsDialogOpen(true);
              setRows([
                {
                  id: '1',
                  downloadPath: 'sample_download',
                  version: '6.51.1605',
                  lastUpdated: '2024-08-20T10:10:25Z'
                },
                {
                  id: '2',
                  downloadPath: 'sample_download',
                  version: '6.48.1605',
                  lastUpdated: '2024-08-20T10:10:25Z'
                },
                {
                  id: '3',
                  downloadPath: 'sample_download',
                  version: '6.40.1605',
                  lastUpdated: '2024-08-20T10:10:25Z'
                }
              ]);
            }}
          >
            Click here to see minor versions
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ padding: '0px 20px 20px 20px' }}>
        <Stack direction={'row'} sx={{ marginTop: '10px' }} alignItems={'center'} justifyContent={'space-between'}>
          <Stack direction={'row'} alignItems={'center'}>
            <Typography sx={{ textAlign: 'right' }}>Compatible with Windows 11 build 1047 or higher</Typography>
          </Stack>
        </Stack>
      </Box> */}

  return (
    <>
      <Box component="div" sx={{ padding: '0px 25px 0px 25px' }}>
        <Typography variant="h4" sx={{ marginBottom: '10px' }}>
          Install Agent
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: '10px' }}>
          Install your sensor in windows, macos and linux.
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 0 }}>
        <Grid container spacing={1} sx={{ marginTop: '0px', marginBottom: '20px' }} alignItems={'center'}>
          <Grid size={2}>
            <Typography variant="h5" sx={{ m: 1 }}>API Key </Typography>
          </Grid>
          <Grid size={4}>
            <TextField
              id="outlined-read-only-input"
              type={showApiKey ? 'text' : 'password'}
              value={realApiKey}
              sx={{ width: 680, backgroundColor: yellow[50] }}
              InputProps={{
                readOnly: true,
                sx: {
                  input: {
                    fontFamily: 'monospace',
                  }
                },

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
                        {copyStatus == 'Copy Key' ? <ContentCopy fontSize="small" /> : <DoneIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}

            />

          </Grid>
        </Grid>
      </Box>
      <Box component={'div'} sx={{ padding: '0px 25px 0px 25px' }}>
        <Grid container>
          <Grid size={6}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="icon position tabs example" sx={{ marginBottom: '20px' }}>
              <Tab icon={<WindowsIcon />} iconPosition="start" label=" Windows" sx={{ whiteSpace: 'pre' }} />
              <Tab icon={<MacosIcon />} iconPosition="start" label=" MacOS" sx={{ whiteSpace: 'pre' }} />
              <Tab icon={<LinuxIcon />} iconPosition="start" label=" Linux" sx={{ whiteSpace: 'pre' }} />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <>
                {/* <Stack sx={{ marginTop: '10px', width: '800px' }} direction={'row'} justifyContent={'flex-end'}>
              <Stack direction={'row'}>
                <Select
                  variant="standard"
                  value={menuValue}
                  onChange={(e)=>{
                    setMenuValue(e.target.value)
                  }}
                  size="medium"
                  disableUnderline
                >
                  <MenuItem value={0}>Updated on</MenuItem>
                  <MenuItem value={1}>Last downloaded</MenuItem>
                </Select>
                <IconButton onClick={()=>{
                  setIsAscending((prev)=>!prev);
                }} title='Sort direction'>
                  {isAscending ? <SouthIcon className="Sorted-icon" fontSize="small" sx={{ fontSize: 'medium' }} /> : <NorthIcon className="Sorted-icon" fontSize="small" sx={{ fontSize: 'medium' }} />}
                </IconButton>
              </Stack>
            </Stack> */}



                <Box
                  component={'div'}
                  sx={{
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '5px',
                    my: '5px',
                    minHeight: '30px',
                    width: '800px'
                  }}
                >
                  <Box sx={{ padding: '10px' }}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} marginBottom={'5px'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography variant="h4" sx={{ paddingRight: '15px', fontSize: 16 }}>
                          Windows Sensor - {sensorVersionDetails.version}
                        </Typography>

                      </Stack>
                      <Button size="medium" color="primary" variant="contained">
                        Download
                      </Button>
                    </Stack>
                  </Box>
                </Box>

                {/* <Box
                  component={'div'}
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '5px',
                    my: '10px',
                    minHeight: '100px',
                    width: '800px'
                  }}
                >
                  <Box sx={{ padding: '10px' }}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} marginBottom={'5px'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography variant="h4" sx={{ paddingRight: '15px' }}>
                          Windows Sensor - {sensorVersionDetails.version}
                        </Typography>
                        <Chip label="Latest" color={'success'} variant="outlined" size="small" />
                      </Stack>
                      <Button size="medium" color="primary" variant="contained">
                        Download
                      </Button>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '5px 20px 0px 20px' }}>
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography variant="h5">Whats Changed</Typography>
                      <Typography variant="h6" sx={{ textAlign: 'center', color: 'grey', fontSize: 'smaller', marginLeft: '10px' }}>
                        updated on: {sensorVersionDetails.releasedDate}
                      </Typography>
                    </Stack>
                    <Box>
                      <ul>
                        <li>
                          <Typography variant="h6">feat: request and reply decorators can not be a reference type</Typography>
                        </li>
                        <li>
                          <Typography variant="h6">fix: config type in RouteShorthandOptions</Typography>
                        </li>
                      </ul>

                      <Button
                        size="small"
                        sx={{ textTransform: 'none' }}
                        onClick={() => {
                          setIsDialogOpen(true);
                          setRows([
                            {
                              id: '1',
                              downloadPath: 'sample_download',
                              version: '6.51.1605',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '2',
                              downloadPath: 'sample_download',
                              version: '6.48.1605',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '3',
                              downloadPath: 'sample_download',
                              version: '6.40.1605',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            }
                          ]);
                        }}
                      >
                        Click here to see minor versions
                      </Button>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '0px 20px 20px 20px' }}>
                    <Stack direction={'row'} sx={{ marginTop: '10px' }} alignItems={'center'} justifyContent={'space-between'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography sx={{ textAlign: 'right' }}>Compatible with Windows 11 build 1047 or higher</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Box> */}
                {/* <Box
                  component={'div'}
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '5px',
                    my: '10px',
                    minHeight: '100px',
                    width: '800px'
                  }}
                >
                  <Box sx={{ padding: '10px' }}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} marginBottom={'5px'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography variant="h4" sx={{ paddingRight: '15px' }}>
                          Windows Sensor - 7.123.101
                        </Typography>
                        <Chip label="Beta" color={'info'} variant="outlined" size="small" />
                      </Stack>
                      <Button size="medium" color="primary" variant="contained">
                        Download
                      </Button>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '5px 20px 0px 20px' }}>
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography variant="h5">Whats Changed</Typography>
                      <Typography variant="h6" sx={{ textAlign: 'center', color: 'grey', fontSize: 'smaller', marginLeft: '10px' }}>
                        updated on: 26/07/2024
                      </Typography>
                    </Stack>
                    <Box>
                      <ul>
                        <li>
                          <Typography variant="h6">feat: request and reply decorators can not be a reference type</Typography>
                        </li>
                        <li>
                          <Typography variant="h6">fix: config type in RouteShorthandOptions</Typography>
                        </li>
                      </ul>

                      <Button
                        size="small"
                        sx={{ textTransform: 'none' }}
                        onClick={() => {
                          setIsDialogOpen(true);
                          setRows([
                            {
                              id: '1',
                              downloadPath: 'sample_download',
                              version: '7.120.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '2',
                              downloadPath: 'sample_download',
                              version: '7.118.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '3',
                              downloadPath: 'sample_download',
                              version: '7.119.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            }
                          ]);
                        }}
                      >
                        Click here to see minor versions
                      </Button>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '0px 20px 20px 20px' }}>
                    <Stack direction={'row'} sx={{ marginTop: '10px' }} alignItems={'center'} justifyContent={'space-between'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography sx={{ textAlign: 'right' }}>Compatible with Windows 11 build 1067 or higher</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
                <Box
                  component={'div'}
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '5px',
                    my: '10px',
                    minHeight: '100px',
                    width: '800px'
                  }}
                >
                  <Box sx={{ padding: '10px' }}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} marginBottom={'5px'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography variant="h4" sx={{ paddingRight: '15px' }}>
                          Windows Sensor - 7.123.101
                        </Typography>
                        <Chip label="Beta" color={'info'} variant="outlined" size="small" />
                      </Stack>
                      <Button size="medium" color="primary" variant="contained">
                        Download
                      </Button>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '5px 20px 0px 20px' }}>
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography variant="h5">Whats Changed</Typography>
                      <Typography variant="h6" sx={{ textAlign: 'center', color: 'grey', fontSize: 'smaller', marginLeft: '10px' }}>
                        updated on: 26/07/2024
                      </Typography>
                    </Stack>
                    <Box>
                      <ul>
                        <li>
                          <Typography variant="h6">feat: request and reply decorators can not be a reference type</Typography>
                        </li>
                        <li>
                          <Typography variant="h6">fix: config type in RouteShorthandOptions</Typography>
                        </li>
                      </ul>

                      <Button
                        size="small"
                        sx={{ textTransform: 'none' }}
                        onClick={() => {
                          setIsDialogOpen(true);
                          setRows([
                            {
                              id: '1',
                              downloadPath: 'sample_download',
                              version: '7.120.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '2',
                              downloadPath: 'sample_download',
                              version: '7.118.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '3',
                              downloadPath: 'sample_download',
                              version: '7.119.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            }
                          ]);
                        }}
                      >
                        Click here to see minor versions
                      </Button>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '0px 20px 20px 20px' }}>
                    <Stack direction={'row'} sx={{ marginTop: '10px' }} alignItems={'center'} justifyContent={'space-between'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography sx={{ textAlign: 'right' }}>Compatible with Windows 11 build 1067 or higher</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Box> */}
              </>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <>
                {/* <Stack sx={{ marginTop: '10px', width: '800px' }} direction={'row'} justifyContent={'flex-end'}>
              <Box>
                <Select
                  variant="standard"
                  value={0}
                  size="medium"
                  disableUnderline
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon fontSize="medium" /> Sort by
                    </InputAdornment>
                  }
                >
                  <MenuItem value={0}>Updated on</MenuItem>
                  <MenuItem value={1}>Last downloaded</MenuItem>
                </Select>
              </Box>
            </Stack> */}
                <Box
                  component={'div'}
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '5px',
                    my: '10px',
                    minHeight: '100px',
                    width: '800px'
                  }}
                >
                  <Box sx={{ padding: '10px' }}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} marginBottom={'5px'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography variant="h4" sx={{ paddingRight: '15px' }}>
                          MacOS Sensor - v6.7.4
                        </Typography>
                        <Chip label="Latest" color={'success'} variant="outlined" size="small" />
                      </Stack>
                      <Button size="medium" color="primary" variant="contained">
                        Download
                      </Button>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '5px 20px 0px 20px' }}>
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography variant="h5">Whats Changed</Typography>
                      <Typography variant="h6" sx={{ textAlign: 'center', color: 'grey', fontSize: 'smaller', marginLeft: '10px' }}>
                        updated on: 24/07/2024
                      </Typography>
                    </Stack>
                    <Box>
                      <ul>
                        <li>
                          <Typography variant="h6">feat: request and reply decorators can not be a reference type</Typography>
                        </li>
                        <li>
                          <Typography variant="h6">fix: config type in RouteShorthandOptions</Typography>
                        </li>
                      </ul>

                      <Button
                        size="small"
                        sx={{ textTransform: 'none' }}
                        onClick={() => {
                          setIsDialogOpen(true);
                          setRows([
                            {
                              id: '1',
                              downloadPath: 'sample_download',
                              version: '6.51.1605',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '2',
                              downloadPath: 'sample_download',
                              version: '6.48.1605',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '3',
                              downloadPath: 'sample_download',
                              version: '6.40.1605',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            }
                          ]);
                        }}
                      >
                        Click here to see minor versions
                      </Button>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '0px 20px 20px 20px' }}>
                    <Stack direction={'row'} sx={{ marginTop: '10px' }} alignItems={'center'} justifyContent={'space-between'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography sx={{ textAlign: 'right' }}>Compatible with Windows 11 build 1047 or higher</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
                <Box
                  component={'div'}
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '5px',
                    my: '10px',
                    minHeight: '100px',
                    width: '800px'
                  }}
                >
                  <Box sx={{ padding: '10px' }}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} marginBottom={'5px'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography variant="h4" sx={{ paddingRight: '15px' }}>
                          MacOS Sensor - 7.153.140
                        </Typography>
                        <Chip label="Beta" color={'info'} variant="outlined" size="small" />
                      </Stack>
                      <Button size="medium" color="primary" variant="contained">
                        Download
                      </Button>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '5px 20px 0px 20px' }}>
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography variant="h5">Whats Changed</Typography>
                      <Typography variant="h6" sx={{ textAlign: 'center', color: 'grey', fontSize: 'smaller', marginLeft: '10px' }}>
                        updated on: 26/07/2024
                      </Typography>
                    </Stack>
                    <Box>
                      <ul>
                        <li>
                          <Typography variant="h6">feat: request and reply decorators can not be a reference type</Typography>
                        </li>
                        <li>
                          <Typography variant="h6">fix: config type in RouteShorthandOptions</Typography>
                        </li>
                      </ul>

                      <Button
                        size="small"
                        sx={{ textTransform: 'none' }}
                        onClick={() => {
                          setIsDialogOpen(true);
                          setRows([
                            {
                              id: '1',
                              downloadPath: 'sample_download',
                              version: '7.120.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '2',
                              downloadPath: 'sample_download',
                              version: '7.119.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '3',
                              downloadPath: 'sample_download',
                              version: '7.118.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            }
                          ]);
                        }}
                      >
                        Click here to see minor versions
                      </Button>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '0px 20px 20px 20px' }}>
                    <Stack direction={'row'} sx={{ marginTop: '10px' }} alignItems={'center'} justifyContent={'space-between'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography sx={{ textAlign: 'right' }}>Compatible with Windows 11 build 1067 or higher</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
                <Box
                  component={'div'}
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '5px',
                    my: '10px',
                    minHeight: '100px',
                    width: '800px'
                  }}
                >
                  <Box sx={{ padding: '10px' }}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} marginBottom={'5px'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography variant="h4" sx={{ paddingRight: '15px' }}>
                          MacOS Sensor - 7.153.140
                        </Typography>
                        <Chip label="Beta" color={'info'} variant="outlined" size="small" />
                      </Stack>
                      <Button size="medium" color="primary" variant="contained">
                        Download
                      </Button>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '5px 20px 0px 20px' }}>
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography variant="h5">Whats Changed</Typography>
                      <Typography variant="h6" sx={{ textAlign: 'center', color: 'grey', fontSize: 'smaller', marginLeft: '10px' }}>
                        updated on: 26/07/2024
                      </Typography>
                    </Stack>
                    <Box>
                      <ul>
                        <li>
                          <Typography variant="h6">feat: request and reply decorators can not be a reference type</Typography>
                        </li>
                        <li>
                          <Typography variant="h6">fix: config type in RouteShorthandOptions</Typography>
                        </li>
                      </ul>

                      <Button
                        size="small"
                        sx={{ textTransform: 'none' }}
                        onClick={() => {
                          setIsDialogOpen(true);
                          setRows([
                            {
                              id: '1',
                              downloadPath: 'sample_download',
                              version: '7.120.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '2',
                              downloadPath: 'sample_download',
                              version: '7.119.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '3',
                              downloadPath: 'sample_download',
                              version: '7.118.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            }
                          ]);
                        }}
                      >
                        Click here to see minor versions
                      </Button>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '0px 20px 20px 20px' }}>
                    <Stack direction={'row'} sx={{ marginTop: '10px' }} alignItems={'center'} justifyContent={'space-between'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography sx={{ textAlign: 'right' }}>Compatible with Windows 11 build 1067 or higher</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
              </>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <>
                {/* <Stack sx={{ marginTop: '10px', width: '800px' }} direction={'row'} justifyContent={'flex-end'}>
              <Box>
                <Select
                  variant="standard"
                  value={0}
                  size="medium"
                  disableUnderline
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon fontSize="medium" /> Sort by
                    </InputAdornment>
                  }
                >
                  <MenuItem value={0}>Updated on</MenuItem>
                  <MenuItem value={1}>Last downloaded</MenuItem>
                </Select>
              </Box>
            </Stack> */}
                <Box
                  component={'div'}
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '5px',
                    my: '10px',
                    minHeight: '100px',
                    width: '800px'
                  }}
                >
                  <Box sx={{ padding: '10px' }}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} marginBottom={'5px'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography variant="h4" sx={{ paddingRight: '15px' }}>
                          Linux - 6.53.1605
                        </Typography>
                        <Chip label="Latest" color={'success'} variant="outlined" size="small" />
                      </Stack>
                      <Button size="medium" color="primary" variant="contained">
                        Download
                      </Button>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '5px 20px 0px 20px' }}>
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography variant="h5">Whats Changed</Typography>
                      <Typography variant="h6" sx={{ textAlign: 'center', color: 'grey', fontSize: 'smaller', marginLeft: '10px' }}>
                        updated on: 24/07/2024
                      </Typography>
                    </Stack>
                    <Box>
                      <ul>
                        <li>
                          <Typography variant="h6">feat: request and reply decorators can not be a reference type</Typography>
                        </li>
                        <li>
                          <Typography variant="h6">fix: config type in RouteShorthandOptions</Typography>
                        </li>
                      </ul>

                      <Button
                        size="small"
                        sx={{ textTransform: 'none' }}
                        onClick={() => {
                          setIsDialogOpen(true);
                          setRows([
                            {
                              id: '1',
                              downloadPath: 'sample_download',
                              version: '6.51.1605',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '2',
                              downloadPath: 'sample_download',
                              version: '6.48.1605',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '3',
                              downloadPath: 'sample_download',
                              version: '6.40.1605',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            }
                          ]);
                        }}
                      >
                        Click here to see minor versions
                      </Button>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '0px 20px 20px 20px' }}>
                    <Stack direction={'row'} sx={{ marginTop: '10px' }} alignItems={'center'} justifyContent={'space-between'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography sx={{ textAlign: 'right' }}>Compatible with Windows 11 build 1047 or higher</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
                <Box
                  component={'div'}
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '5px',
                    my: '10px',
                    minHeight: '100px',
                    width: '800px'
                  }}
                >
                  <Box sx={{ padding: '10px' }}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} marginBottom={'5px'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography variant="h4" sx={{ paddingRight: '15px' }}>
                          Linux - 7.120.101
                        </Typography>
                        <Chip label="Beta" color={'info'} variant="outlined" size="small" />
                      </Stack>
                      <Button size="medium" color="primary" variant="contained">
                        Download
                      </Button>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '5px 20px 0px 20px' }}>
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography variant="h5">Whats Changed</Typography>
                      <Typography variant="h6" sx={{ textAlign: 'center', color: 'grey', fontSize: 'smaller', marginLeft: '10px' }}>
                        updated on: 26/07/2024
                      </Typography>
                    </Stack>
                    <Box>
                      <ul>
                        <li>
                          <Typography variant="h6">feat: request and reply decorators can not be a reference type</Typography>
                        </li>
                        <li>
                          <Typography variant="h6">fix: config type in RouteShorthandOptions</Typography>
                        </li>
                      </ul>

                      <Button
                        size="small"
                        sx={{ textTransform: 'none' }}
                        onClick={() => {
                          setIsDialogOpen(true);
                          setRows([
                            {
                              id: '1',
                              downloadPath: 'sample_download',
                              version: '7.119.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '2',
                              downloadPath: 'sample_download',
                              version: '7.118.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '3',
                              downloadPath: 'sample_download',
                              version: '7.117.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            }
                          ]);
                        }}
                      >
                        Click here to see minor versions
                      </Button>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '0px 20px 20px 20px' }}>
                    <Stack direction={'row'} sx={{ marginTop: '10px' }} alignItems={'center'} justifyContent={'space-between'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography sx={{ textAlign: 'right' }}>Compatible with Windows 11 build 1067 or higher</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
                <Box
                  component={'div'}
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '5px',
                    my: '10px',
                    minHeight: '100px',
                    width: '800px'
                  }}
                >
                  <Box sx={{ padding: '10px' }}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} marginBottom={'5px'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography variant="h4" sx={{ paddingRight: '15px' }}>
                          Linux - v8.7.5
                        </Typography>
                        <Chip label="Beta" color={'info'} variant="outlined" size="small" />
                      </Stack>
                      <Button size="medium" color="primary" variant="contained">
                        Download
                      </Button>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '5px 20px 0px 20px' }}>
                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography variant="h5">Whats Changed</Typography>
                      <Typography variant="h6" sx={{ textAlign: 'center', color: 'grey', fontSize: 'smaller', marginLeft: '10px' }}>
                        updated on: 26/07/2024
                      </Typography>
                    </Stack>
                    <Box>
                      <ul>
                        <li>
                          <Typography variant="h6">feat: request and reply decorators can not be a reference type</Typography>
                        </li>
                        <li>
                          <Typography variant="h6">fix: config type in RouteShorthandOptions</Typography>
                        </li>
                      </ul>

                      <Button
                        size="small"
                        sx={{ textTransform: 'none' }}
                        onClick={() => {
                          setIsDialogOpen(true);
                          setRows([
                            {
                              id: '1',
                              downloadPath: 'sample_download',
                              version: '7.119.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '2',
                              downloadPath: 'sample_download',
                              version: '7.118.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            },
                            {
                              id: '3',
                              downloadPath: 'sample_download',
                              version: '7.117.101',
                              lastUpdated: '2024-08-20T10:10:25Z'
                            }
                          ]);
                        }}
                      >
                        Click here to see minor versions
                      </Button>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '0px 20px 20px 20px' }}>
                    <Stack direction={'row'} sx={{ marginTop: '10px' }} alignItems={'center'} justifyContent={'space-between'}>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Typography sx={{ textAlign: 'right' }}>Compatible with Windows 11 build 1067 or higher</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
              </>
            </TabPanel>
          </Grid>
          {/* <Grid item xs={6}>
              <Stepper nonLinear orientation='vertical'>
                <Step>
                  <StepLabel slotProps={{
                    label:<Typography variant='h5'></Typography>
                  }}>
                    Choose the sensor
                  </StepLabel>
                <StepContent>
                    
                </StepContent>
                </Step>
              </Stepper>
          </Grid> */}
        </Grid>
      </Box>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md" disableRestoreFocus>
        <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Minor Versions</Typography>
          <IconButton
            onClick={() => {
              handleCloseDialog();
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <CustomTable
            rows={rows}
            columns={columns}
            selected={selected}
            sensorVersionDetails={sensorVersionDetails}
            setSelected={setSelected}
            actionIcon={<DownloadIcon fontSize="small" />}
            onClickActionButton={onClickActionButton}
            isCheckbox={false}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

//-----------------------------------

import { JSON_API_ACCEPT_TYPE, JSON_API_CONTENT_TYPE, REMOTE_URL } from './technician';

export const getApikey = async (portalId: string) => {
  const url = `${REMOTE_URL}/api/fetch-enrollment-key?portal_id=${portalId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: JSON_API_ACCEPT_TYPE,
        'Content-Type': JSON_API_CONTENT_TYPE
      },
      credentials: 'include'
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getSensorsVersion = async (portalId: string, _p0: { sensorsVersion?: string[]; }) => {
  const url = `${REMOTE_URL}/api/agent-versions?portal_id=${portalId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: JSON_API_ACCEPT_TYPE,
        'Content-Type': JSON_API_CONTENT_TYPE
      },
      credentials: 'include'
    });

    return response;
  } catch (error) {
    console.error(error);
  }
}


 http.get(`${REMOTE_URL}/api/agent-versions`, async ({ request, params }) => {
    return HttpResponse.json({
      data: [{
        type: 'versions',
        id: 1,
        attributes: {
          version: 'v6.7.4',
          platform: 'windows',
          includedOsVersions: "windows 11",
          excludedOsVersions: "windows 8",
          includedBuilds: 1047,
          excludedBuilds: null,
          releasedDate: "21/02/2025",
          changes: "feat: request and reply decorators can not be a reference type fix: config type in RouteShorthandOptions",
          downloadLink: null
        },
        type: 'versions',
        id: 2,
        attributes: {
          version: 'v7.7.4',
          platform: 'windows',
          includedOsVersions: "windows 11",
          excludedOsVersions: "windows 8",
          includedBuilds: 1047,
          excludedBuilds: null,
          releasedDate: "21/01/2025",
          changes: "feat: request and reply decorators can not be a reference type fix: config type in RouteShorthandOptions",
          downloadLink: null
        },
        type: 'versions',
        id: 3,
        attributes: {
          version: 'v8.7.4',
          platform: 'windows',
          includedOsVersions: "windows 11",
          excludedOsVersions: "windows 8",
          includedBuilds: 1047,
          excludedBuilds: null,
          releasedDate: "21/11/2024",
          changes: "feat: request and reply decorators can not be a reference type fix: config type in RouteShorthandOptions",
          downloadLink: null
        },

      }
     

      ],

    

    });

  })



 
