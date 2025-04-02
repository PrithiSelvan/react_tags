import { useContext, useState, forwardRef, useImperativeHandle } from 'react';
import type { RuleGroupType, RuleGroupTypeIC, Translations } from 'react-querybuilder';
import { QueryBuilder } from 'react-querybuilder';
import { QueryBuilderDnD } from '@react-querybuilder/dnd';
import * as ReactDnD from 'react-dnd';
import * as ReactDndHtml5Backend from 'react-dnd-html5-backend';
import * as ReactDndTouchBackend from 'react-dnd-touch-backend';
import 'react-querybuilder/dist/query-builder.css';
import { toFullOption } from 'react-querybuilder';
import { QueryBuilderMaterial } from '@react-querybuilder/material';
import { Box } from '@mui/material';
import { getSensors } from '../../api/sensors';
import { PortalContext } from '../../contexts/portalInfo';

const initialQuery: RuleGroupTypeIC = { rules: [] };

const customTranslations: Partial<Translations> = {
    addRule: { label: '+ Add' },
};

// Using forwardRef to expose handleSearch
const DynamicGroup = forwardRef((_, ref) => {
    const [query, setQuery] = useState(initialQuery);
    const { portalId } = useContext(PortalContext)!;

    const handleSearch = async () => {
        const transformedQuery = transformQuery(query);
        const fields = {
            sensors: ['hostName', 'platform', 'osName', 'osVersion', 'agentVersion', 'status'],
        };

        try {
            const response = await getSensors(portalId, undefined, undefined, undefined, transformedQuery, fields);
            console.log('API Response:', response);
        } catch (error) {
            console.error('Error fetching sensor groups:', error);
        }
    };

    // Expose handleSearch to parent using useImperativeHandle
    useImperativeHandle(ref, () => ({
        handleSearch,
    }));

    return (
        <Box>
            <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend, ...ReactDndTouchBackend }}>
                <QueryBuilderMaterial>
                    <QueryBuilder
                        fields={fields}
                        query={query}
                        onQueryChange={setQuery}
                        controlClassnames={{ addRule: 'button', addGroup: 'button', removeRule: 'cancel', removeGroup: 'cancel' }}
                        translations={customTranslations}
                    />
                </QueryBuilderMaterial>
            </QueryBuilderDnD>
        </Box>
    );
});

// Add display name for better debugging
DynamicGroup.displayName = 'DynamicGroup';

export default DynamicGroup;

//from.tsx:
import { useState, useRef } from 'react';
import { Box, Button, Popover } from '@mui/material';
import DynamicGroup from './DynamicGroup';
import { CustomTanStackTable } from '../../components/CustomTanStackTable';

const FormComponent = () => {
    const dynamicGroupRef = useRef<{ handleSearch: () => void } | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoading, setLoading] = useState(false);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const triggerSearch = () => {
        if (dynamicGroupRef.current) {
            dynamicGroupRef.current.handleSearch();
        }
    };

    return (
        <Box sx={{ color: '#1677FF', cursor: 'pointer' }}>
            {/* Attach ref to DynamicGroup */}
            <DynamicGroup ref={dynamicGroupRef} />

            <Box sx={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', padding: '16px 0px 16px 24px', gap: 2 }}>
                <Button variant="contained" onClick={triggerSearch}>
                    Preview
                </Button>

                <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                    <CustomTanStackTable isLoading={isLoading} table={table} type={CustomTanStackTableType.LIST_TYPE} />
                </Popover>
            </Box>
        </Box>
    );
};

export default FormComponent;

