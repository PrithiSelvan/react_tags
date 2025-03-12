import { useContext } from 'react';
import { Box, Checkbox, Divider, IconButton, List, ListItem, Popover, Typography } from '@mui/material';
import { PortalContext } from '../../../../contexts/portalInfo';
import PreviewIcon from '@mui/icons-material/Preview';
import React from 'react';
import { FeatureFlagContext } from '../../../../contexts/featureFlagContext';
import {   AbilityBuilder, createMongoAbility } from '@casl/ability';


const FeatureFlag = () => {
 
  const flagability = useContext(FeatureFlagContext);
  

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleOnChangeCheckbox = (resource: string, action: 'isView') => {
  //   const value = !isFlagEnabled[resource][action];
  //   setIsFlagEnabled((prevFlags) => ({
  //     ...prevFlags,
  //     [resource]: {
  //       ...prevFlags[resource],
  //       isView: value
  //     }
  //   }));
  // };
  const handleOnChangeCheckbox = (resource: string, action: 'view') => {
    const { can, rules } = new AbilityBuilder(createMongoAbility);

    // Toggle the feature flag
    if (flagability.can(action, resource)) {
      // Remove the ability if it exists
      flagability.rules.forEach(rule => {
        if (rule.subject !== resource || rule.action !== action) {
          can(rule.action, rule.subject);
        }
      });
    } else {
      // Add the ability if it does not exist
      flagability.rules.forEach(rule => {
        can(rule.action, rule.subject);
      });
      can(action, resource);
    }

    // Update the flagability with the new rules
    flagability.update(rules);
    console.log(`Feature flag for ${resource} ${action} changed`);
  };
  return (
    <Box>
      <IconButton onClick={handleClick}>
        <PreviewIcon />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <List sx={{ px: '16px', pb: 0, minWidth: '200px', maxHeight: '400px' }}>
        {flagability.rules.map((rule, index) => (
            <ListItem
              key={index}
              sx={{
                padding: '0px',
                marginBottom: '8px',
                alignItems: 'center',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <>
              <Checkbox
                  checked={flagability.can('view', rule.subject)}
                  id={`${rule.subject}_view`}
                  onChange={() => {
                    handleOnChangeCheckbox(rule.subject, 'view');
                  }}
                />
                <Typography sx={{ p: 2, textAlign: 'left' }}>{rule.subject}</Typography>
              </>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Popover>
    </Box>
  );
};

export default FeatureFlag;
in above code checkbox always showing with tick mark and not able to change it all checkbox related details are in hide state only since checkbox is ticked how to solve it and work checkbox to hide and show checkbox related details properly 
const DetectionDetailPage = () => {
const flagability = useContext(FeatureFlagContext);
  {flagability.can('view', 'sensor')? (
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
                      ) : null}
