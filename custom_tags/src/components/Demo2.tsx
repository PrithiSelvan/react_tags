import {
  Box,
  Button,
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
import { isTechnicianAuthzModified } from '../api/alerts';

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
  platform: string;
  version: string;
  downloadLink: string;
};

export function AgentInstallation() {
  const [tabValue, setTabValue] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rows] = useState<VersionRow[]>([]);
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
  const { portalId } = useContext(PortalContext)!;

  const [showApiKey, setShowApiKey] = useState(false);
  const [realApiKey, setRealApiKey] = useState<any>('');
  const [copyStatus, setCopyStatus] = useState('Copy Key');
  const [sensorVersionDetails, setSensorVersionDetails] = useState<AgentVersions[]>([]);

  async function fetchApiKey() {
    try {
      const response = (await getApikey(portalId)) as Response;
      if (response.ok) {
        const data = await response.json();
        setRealApiKey(data.enrollmentKey);
      }
    } catch (error) {
      console.error(error);
    }
  }

 async function fetchSensors() {
    const sensorsDetails: string[] = ['agentName','version', 'downloadLink'];

    try {
      const response = (await getSensorsVersion(portalId, osType.WINDOWS,{
        sensorsVersion: sensorsDetails
      })) as Response;
      if (isTechnicianAuthzModified(response)) {
        return;
      }
      const sensorsVersion: AgentVersions[] = [];
      if (response?.ok) {
        const data = await response.json();
        const sensorsData = data?.data;
        sensorsData.forEach((sensor: any) => {
          const attributes = sensor?.attributes;
          sensorsVersion.push({
            agentName: attributes?.agentName,
            version: attributes?.version,
            downloadLink: attributes?.downloadLink
          });
        });

        setSensorVersionDetails(sensorsVersion);
     
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchApiKey();
  }, []);

  useEffect(() => {
    fetchSensors();
  }, []);

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
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Key'), 1000);
  };

  const ApiKey = () => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 0 }}>
        <Grid container spacing={1} sx={{ marginTop: 0, marginBottom: 2.5 }} alignItems={'center'}>
          <Grid size={2}>
            <Typography variant="h5" sx={{ m: 1 }}>
              API Key
            </Typography>
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
                    fontFamily: 'monospace'
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
                      <IconButton onClick={handleCopyApiKey} edge="end">
                        {copyStatus == 'Copy Key' ? <ContentCopy fontSize="small" /> : <DoneIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const onClickActionButton = (_row: any) => {};

  return (
    <>
    <Box component="div" sx={{ padding: '0px 25px' }}>
      <Typography variant="h4" sx={{ marginBottom: '10px' }}>
        Install Agent
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        Install your sensor in Windows, MacOS, and Linux.
      </Typography>
    </Box>
    <Divider />
    <ApiKey />
    <Box component={'div'} sx={{ padding: '0px 25px' }}>
      <Grid container>
        <Grid size={6}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="icon position tabs example" sx={{ marginBottom: '20px' }}>
            <Tab icon={<WindowsIcon />} iconPosition="start" label=" Windows" sx={{ whiteSpace: 'pre' }} />
            <Tab icon={<MacosIcon />} iconPosition="start" label=" MacOS" sx={{ whiteSpace: 'pre' }} />
            <Tab icon={<LinuxIcon />} iconPosition="start" label=" Linux" sx={{ whiteSpace: 'pre' }} />
          </Tabs>
  
          {['windows', 'mac', 'linux'].map((platform, idx) => (
            <TabPanel key={platform} value={tabValue} index={idx}>
              {sensorVersionDetails.filter(sensor => sensor.platform === platform).length > 0 ? (
                sensorVersionDetails.filter(sensor => sensor.platform === platform).map((sensor, index) => (
                  <Box
                    key={index}
                    component={'div'}
                    sx={{
                      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                      borderRadius: 1,
                      my: 1,
                      minHeight: '30px',
                      width: '800px'
                    }}
                  >
                    <Box sx={{ padding: 1.25 }}>
                      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} marginBottom={0.5}>
                        <Stack direction={'row'} alignItems={'center'}>
                          <Typography variant="h4" sx={{ paddingRight: 2, fontSize: 16 }}>
                            {platform.charAt(0).toUpperCase() + platform.slice(1)} Sensor - {sensor.version}
                          </Typography>
                        </Stack>
                        <Button size="medium" color="primary" variant="contained" href={sensor.downloadLink} target="_blank">
                          Download
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', pt: 20 }}>
                  <Typography>No Versions available....</Typography>
                </Box>
              )}
            </TabPanel>
          ))}
        </Grid>
      </Grid>
    </Box>
    <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md" disableRestoreFocus>
      <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Minor Versions</Typography>
        <IconButton onClick={handleCloseDialog}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <CustomTable
          rows={rows}
          columns={columns}
          selected={selected}
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
//--------------------------------------
import { JSON_API_ACCEPT_TYPE, JSON_API_CONTENT_TYPE, REMOTE_URL } from './technician';

export const getSensorsVersion = async (portalId: string, osType: osType, _version: { sensorsVersion?: string[] }) => {
  const url = `${REMOTE_URL}/api/agent-versions?portal_id=${portalId}&platform=${osType}`;
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

export const getSensorsVersion = async (portalId: string, _version: { sensorsVersion?: string[] }) => {
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
};
//------------------------------------
 http.get(`${REMOTE_URL}/api/fetch-enrollment-key`, async ({ request, params }) => {
    return HttpResponse.json({ enrollmentKey: 'ajsdhghjash dlasvd' });
  }),

  http.get(`${REMOTE_URL}/api/agent-versions`, async ({ request, params }) => {
    return HttpResponse.json({
      "data": [
        {
          "type": "agentVersionInfos",
          "id": "9606891426025472",
          "attributes": {
            "agentName": "RMM agent",
            "version": "4.2.1",
            "downloadUrl": "https://downloads.hexnode.com/windows-agent/HexnodeAgent421.zip"
          }
        },
        {
          "type": "agentVersionInfos",
          "id": "9606891426025473",
          "attributes": {
            "agentName": "Installer agent",
            "version": "4.2.2",
            "downloadUrl": "https://downloads.hexnode.com/windows-agent/HexnodeAgent422.zip"
          }
        },
        {
          "type": "agentVersionInfos",
          "id": "9606891426025474",
          "attributes": {
            "agentName": "ZEQ agent",
            "version": "4.2.3",
            "downloadUrl": "https://downloads.hexnode.com/windows-agent/HexnodeAgent423.zip"
          }
        }
      ],
      "meta": {
        "count": 3
      }
    });
  }),
        
          
   //-----------+++++
import { useState, useEffect } from "react";
import { Box, Button, Divider, Grid, Tab, Tabs, Typography, Dialog, DialogTitle, DialogContent, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WindowsIcon from "@mui/icons-material/Windows";
import MacosIcon from "@mui/icons-material/Apple";
import LinuxIcon from "@mui/icons-material/Linux";
import axios from "axios";

const REMOTE_URL = "your_api_base_url"; // Replace with your actual API base URL

const InstallAgent = () => {
  const [tabValue, setTabValue] = useState(0);
  const [sensorVersionDetails, setSensorVersionDetails] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAgentVersions = async () => {
      try {
        const response = await axios.get(`${REMOTE_URL}/api/agent-versions`);
        if (response.data && response.data.data) {
          setSensorVersionDetails(response.data.data.map(item => item.attributes));
        }
      } catch (error) {
        console.error("Error fetching agent versions:", error);
      }
    };

    fetchAgentVersions();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Box component="div" sx={{ padding: "0px 25px" }}>
        <Typography variant="h4" sx={{ marginBottom: "10px" }}>
          Install Agent
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
          Install your sensor in Windows, MacOS, and Linux.
        </Typography>
      </Box>
      <Divider />
      <Box component="div" sx={{ padding: "0px 25px" }}>
        <Grid container>
          <Grid item xs={12}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ marginBottom: "20px" }}>
              <Tab icon={<WindowsIcon />} iconPosition="start" label="Windows" />
              <Tab icon={<MacosIcon />} iconPosition="start" label="MacOS" />
              <Tab icon={<LinuxIcon />} iconPosition="start" label="Linux" />
            </Tabs>

            {["windows", "mac", "linux"].map((platform, idx) => (
              <div key={platform} hidden={tabValue !== idx}>
                {sensorVersionDetails.filter(sensor => sensor.platform === platform).length > 0 ? (
                  sensorVersionDetails
                    .filter(sensor => sensor.platform === platform)
                    .map((sensor, index) => (
                      <Box
                        key={index}
                        sx={{
                          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                          borderRadius: 1,
                          my: 1,
                          minHeight: "30px",
                          width: "800px"
                        }}
                      >
                        <Box sx={{ padding: 1.25 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">
                              {platform.charAt(0).toUpperCase() + platform.slice(1)} Sensor - {sensor.version}
                            </Typography>
                            <Button
                              size="medium"
                              color="primary"
                              variant="contained"
                              href={sensor.downloadLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download
                            </Button>
                          </Stack>
                        </Box>
                      </Box>
                    ))
                ) : (
                  <Box sx={{ textAlign: "center", pt: 20 }}>
                    <Typography>No Versions available....</Typography>
                  </Box>
                )}
              </div>
            ))}
          </Grid>
        </Grid>
      </Box>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md" disableRestoreFocus>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4">Minor Versions</Typography>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Your CustomTable component should go here */}
        </DialogContent>
      </Dialog>
    </>
  );
};

//------------reference-----------------
export const AbilityContext = createContext<AnyAbility>(createMongoAbility());
export const Can = createContextualCan(AbilityContext.Consumer);



export const AbilityProvider = ({ children }: { children: any }) => {
  const { isSuperAdmin, permissions: portalPermissions } = useContext(PortalContext)!;
  const superAdminPermissions = [
    {
      action:['view'],
      subject:'sensor'
    }

  ];
  const permissions: object[] = isSuperAdmin ? superAdminPermissions : (portalPermissions as object[]);
  const ability = createMongoAbility(permissions);
  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
  
    const ability = useAbility(AbilityContext);
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
    const { pathname } = useLocation();
  
    const handleToggle = (id: string) => {
      setOpenMenuId((prevId) => (prevId === id ? null : id));
    };
    const [menus] = React.useState<MenuItems[]>([
      {
        id: 'threat-management',
        type: 'group',
        title: 'Threat Management',
        defaultRoute: '/detections',
        isHidden: ability.cannot('view', 'audits'),
        children: [
          {
            id: 'detections',
            title: 'Detections',
            type: 'item',
            isHidden: ability.cannot('view', 'audits'),
            route: '/detections/:id',
            disabled: false
          },
        ]
      }
    ]);
 const [roleSchema, setRoleSchema] = useState<RoleSchema>({
        sensor: {
          label: 'Sensors',
          isView: false
        }})
        const handleOnChangeCheckbox = (resource: string, action: 'isView') => {
          const value = !roleSchema[resource][action];
          setRoleSchema((prevValue) => {
            prevValue[resource][action] = value;
      
            if (action != 'isView' && prevValue[resource]['isView'] == false) {
              prevValue[resource]['isView'] = true;
            }
      
           
            return {
              ...prevValue
            };
          });
         
        };
   {Object.keys(roleSchema).map((resource: string) => {
        return(
          <Box component={'div'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {roleSchema[resource]?.isView != undefined ? (
                         <IconButton onChange={()=> {handleOnChangeCheckbox(resource, 'isView');}}><PreviewIcon/></IconButton>
                          ) : (
                            <Box component={'div'} sx={{ width: '42px', height: '42px' }}></Box>
                          )}
                          </Box>
        );
 {ability.can('view', 'detections') ? (
                      <Grid2 size={12} sx={{ borderBottom: 1, borderColor: 'divider', pl: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: '600', mt: 1 }}>
                          Sensor
                        </Typography>
                        <Grid2 container sx={{ p: 2 }} rowSpacing={1} alignItems={'flex-start'}>
                          {Object.keys(sensorData).map((key) => (
                            <>
                              <Grid2 size={3}>
                                <Typography color="text.secondary">{sensorData[key].label}</Typography>
                              </Grid2>
                              <Grid2 size={9}>
                                {typeof sensorData[key].value == 'string' ? (
                                  <OverflowTooltip typographySxProps={{ fontSize: '14px' }}>{sensorData[key].value}</OverflowTooltip>
                                ) : (
                                  sensorData[key].value
                                )}
                              </Grid2>
                            </>
                          ))}
                        </Grid2>
                      </Grid2>
                       ) : (
                        <>
                          return();
                        </>
                      )}
//-------------------------------------
export default InstallAgent;
