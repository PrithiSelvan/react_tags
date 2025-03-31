import { useState } from 'react';
import type { RuleGroupType, Translations, RuleType, RuleGroupTypeIC } from 'react-querybuilder';
import { QueryBuilder } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import type { Field } from 'react-querybuilder';
import { toFullOption } from 'react-querybuilder';
import { createTheme, ThemeProvider, Button } from '@mui/material';
import { QueryBuilderMaterial } from '@react-querybuilder/material';
import { getSensorGroups } from './sensor-groups';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1677ff',
    },
    secondary: {
      main: '#1677ff',
    },
  },
  typography: {
    body2: {
      fontSize: '10px', // Customize font size for labels
    },
  },
});

const initialQuery: RuleGroupType = { combinator: 'and', rules: [] };

export const validator = (r: RuleType) => !!r.value;

export const fields = [
  {
    name: 'hostname',
    label: 'HOST',
    validator,
  },
  {
    name: 'platform',
    label: 'PLATFORM',
    comparator: 'groupNumber',
    groupNumber: 'group1',
    valuesSources: ['MACOS', 'WINDOWS', 'LINUX'],
  },
  {
    name: 'osVersion',
    label: 'OS VERSION',
    validator,
  },
  {
    name: 'agentVersion',
    label: 'AGENT VERSION',
    validator,
  },
  {
    name: 'createdTime',
    label: 'REGISTRATION DATE',
    inputType: 'datetime-local',
    datatype: 'timestamp with time zone',
  },
  {
    name: 'lastPingedTime',
    label: 'LAST SYNCED',
    inputType: 'datetime-local',
    datatype: 'timestamp with time zone',
  },
  {
    name: 'status',
    label: 'STATUS',
    comparator: 'groupNumber',
    groupNumber: 'group1',
    valuesSources: ['ACTIVE', 'INACTIVE', 'ISOLATED'],
  },
].map((o) => toFullOption(o));

const customTranslations: Partial<Translations> = {
  addRule: { label: 'Add' },
};

const transformQuery = (query: RuleGroupTypeIC): RuleGroupTypeIC => {
  const transformRules = (rules: any[]): any[] => {
    return rules.map(rule => {
      const { id, valueSource, ...rest } = rule;
      if (rule.rules) {
        return { ...rest, rules: transformRules(rule.rules) };
      }
      return rest;
    });
  };

  return {
    ...query,
    combinator: query.combinator.toUpperCase(),
    rules: transformRules(query.rules),
  };
};

const DynamicGroup = () => {
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = async () => {
    const transformedQuery = transformQuery(query);
    const fields = {
      sensorGroups: ['hostName', 'osName', 'osVersion', 'agentVersion', 'status'],
    };
    try {
      const response = await getSensorGroups('test-1', 0, 10, 'createdTime', transformedQuery, fields);
      console.log('API Response:', response);
    } catch (error) {
      console.error('Error fetching sensor groups:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <QueryBuilderMaterial>
        <QueryBuilder
          fields={fields}
          query={query}
          onQueryChange={setQuery}
          controlElements={{
            addGroupAction: (props) => (
              <Button
                {...props}
                sx={{
                  backgroundColor: '#ff5733',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '4px 8px',
                  '&:hover': { backgroundColor: '#d43f00' },
                }}
              >
                Group
              </Button>
            ),
            addRuleAction: (props) => (
              <Button
                {...props}
                sx={{
                  backgroundColor: '#008080',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '4px 8px',
                  '&:hover': { backgroundColor: '#005555' },
                }}
              >
                Add
              </Button>
            ),
            removeRuleAction: (props) => (
              <Button
                {...props}
                sx={{
                  backgroundColor: '#d32f2f',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '4px 8px',
                  '&:hover': { backgroundColor: '#b71c1c' },
                }}
              >
                X
              </Button>
            ),
          }}
          translations={customTranslations}
        />
        <button onClick={handleSearch}>Search</button>
      </QueryBuilderMaterial>
    </ThemeProvider>
  );
};

export default DynamicGroup;
