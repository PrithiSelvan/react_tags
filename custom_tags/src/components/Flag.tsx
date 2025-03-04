import React, { useContext, useState } from 'react';
import { AbilityContext } from './AbilityProvider';
import { IconButton, Typography, Box } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import Grid2 from '@mui/material/Grid';
import { createMongoAbility } from '@casl/ability';

const SensorComponent = () => {
  const ability = useContext(AbilityContext); // Get ability instance

  const [roleSchema, setRoleSchema] = useState({
    sensor: {
      label: 'Sensors',
      isView: ability.can('view', 'sensor'), // Initialize based on ability
    },
  });

  const handleOnChangeCheckbox = (resource: string) => {
    setRoleSchema((prevValue) => {
      const newState = {
        ...prevValue,
        [resource]: {
          ...prevValue[resource],
          isView: !prevValue[resource].isView, // Toggle visibility
        },
      };

      return newState;
    });

    // Toggle ability permission dynamically
    ability.update([
      {
        action: 'view',
        subject: 'sensor',
        inverted: ability.can('view', 'sensor'), // Toggle permission
      },
    ]);
  };

  const [menus] = useState([
    {
      id: 'sensor-management',
      type: 'group',
      title: 'Sensor Management',
      defaultRoute: '/sensors',
      isHidden: ability.cannot('view', 'sensor'), // Hide if cannot view
      children: [
        {
          id: 'sensor-details',
          title: 'Sensor Details',
          type: 'item',
          isHidden: ability.cannot('view', 'sensor'), // Hide if cannot view
          route: '/sensors/:id',
          disabled: false,
        },
      ],
    },
  ]);

  return (
    <Box>
      {Object.keys(roleSchema).map((resource: string) => (
        <Box key={resource} component={'div'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {roleSchema[resource]?.isView !== undefined ? (
            <IconButton onClick={() => handleOnChangeCheckbox(resource)}>
              <PreviewIcon />
            </IconButton>
          ) : (
            <Box component={'div'} sx={{ width: '42px', height: '42px' }}></Box>
          )}
        </Box>
      ))}

      {/* ✅ Show sensor details if ability.can('view', 'sensor'), otherwise hide */}
      {!ability.cannot('view', 'sensor') && (
        <Grid2 size={12} sx={{ borderBottom: 1, borderColor: 'divider', pl: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: '600', mt: 1 }}>Sensor</Typography>
          <Grid2 container sx={{ p: 2 }} rowSpacing={1} alignItems={'flex-start'}>
            {Object.keys(sensorData).map((key) => (
              <React.Fragment key={key}>
                <Grid2 size={3}>
                  <Typography color="text.secondary">{sensorData[key].label}</Typography>
                </Grid2>
                <Grid2 size={9}>
                  {typeof sensorData[key].value === 'string' ? (
                    <OverflowTooltip typographySxProps={{ fontSize: '14px' }}>
                      {sensorData[key].value}
                    </OverflowTooltip>
                  ) : (
                    sensorData[key].value
                  )}
                </Grid2>
              </React.Fragment>
            ))}
          </Grid2>
        </Grid2>
      )}
    </Box>
  );
};

export default SensorComponent;

//---------------------------------------------------------------------------------
import React, { useContext, useState } from 'react';
import { AbilityContext } from './AbilityProvider';
import { IconButton, Typography, Box } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import Grid2 from '@mui/material/Grid'; // Ensure correct Grid component
import { createMongoAbility } from '@casl/ability';

const SensorComponent = () => {
  const ability = useContext(AbilityContext); // Get ability instance

  const [roleSchema, setRoleSchema] = useState({
    sensor: {
      label: 'Sensors',
      isView: false,
    },
  });

  const handleOnChangeCheckbox = (resource: string, action: 'isView') => {
    setRoleSchema((prevValue) => {
      const newState = {
        ...prevValue,
        [resource]: {
          ...prevValue[resource], // Fix mutation issue
          [action]: !prevValue[resource][action],
        },
      };

      return newState;
    });

    // Toggle ability using `cannot` like in the menus array
    ability.update([
      {
        action: 'view',
        subject: 'sensor',
        inverted: ability.can('view', 'sensor'), // Toggle permission
      },
    ]);
  };

  // Use ability.cannot like in your menus
  const isSensorHidden = ability.cannot('view', 'sensor');

  return (
    <Box>
      {Object.keys(roleSchema).map((resource: string) => (
        <Box key={resource} component={'div'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {roleSchema[resource]?.isView !== undefined ? (
            <IconButton onClick={() => handleOnChangeCheckbox(resource, 'isView')}>
              <PreviewIcon />
            </IconButton>
          ) : (
            <Box component={'div'} sx={{ width: '42px', height: '42px' }}></Box>
          )}
        </Box>
      ))}

      {/* ✅ Hide sensor details when ability.cannot('view', 'sensor') */}
      {!isSensorHidden && (
        <Grid2 size={12} sx={{ borderBottom: 1, borderColor: 'divider', pl: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: '600', mt: 1 }}>Sensor</Typography>
          <Grid2 container sx={{ p: 2 }} rowSpacing={1} alignItems={'flex-start'}>
            {Object.keys(sensorData).map((key) => (
              <React.Fragment key={key}>
                <Grid2 size={3}>
                  <Typography color="text.secondary">{sensorData[key].label}</Typography>
                </Grid2>
                <Grid2 size={9}>
                  {typeof sensorData[key].value === 'string' ? (
                    <OverflowTooltip typographySxProps={{ fontSize: '14px' }}>
                      {sensorData[key].value}
                    </OverflowTooltip>
                  ) : (
                    sensorData[key].value
                  )}
                </Grid2>
              </React.Fragment>
            ))}
          </Grid2>
        </Grid2>
      )}
    </Box>
  );
};

export default SensorComponent;
