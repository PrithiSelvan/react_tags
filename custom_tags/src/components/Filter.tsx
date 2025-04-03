import { forwardRef, useContext, useImperativeHandle, useState } from 'react';
import type { Combinator, CombinatorSelectorProps, RuleGroupType, RuleGroupTypeIC, Translations } from 'react-querybuilder';
import { formatQuery, QueryBuilder } from 'react-querybuilder';
import { QueryBuilderDnD } from '@react-querybuilder/dnd';
import * as ReactDnD from 'react-dnd';
import * as ReactDndHtml5Backend from 'react-dnd-html5-backend';
import * as ReactDndTouchBackend from 'react-dnd-touch-backend';
import 'react-querybuilder/dist/query-builder.css';
import type { Field, RuleType } from 'react-querybuilder';
import { toFullOption } from 'react-querybuilder';
import { QueryBuilderMaterial } from '@react-querybuilder/material';
import './style.css'
import { getSensors } from '../../api/sensors';
import { PortalContext } from '../../contexts/portalInfo';
import { Filter } from '../../api/technician';
import { FormControl, MenuItem, Select } from '@mui/material';


const initialQuery: RuleGroupTypeIC = { rules: [] };


// export const validator = (r: RuleType) => !!r.value;
const useOperators = [
    { name: '=', value: '=', label: '=' },
    { name: '!=', value: '!=', label: '!=' },
    { name: 'contains', value: 'contains', label: 'contains' },
    { name: 'beginsWith', value: 'beginsWith', label: 'begins with' },
    { name: 'endsWith', value: 'endsWith', label: 'ends with' },
    { name: 'doesNotContain', value: 'doesNotContain', label: 'does not contain' },
    { name: 'doesNotBeginWith', value: 'doesNotBeginWith', label: 'does not begin with' },
    { name: 'doesNotEndWith', value: 'doesNotEndWith', label: 'does not end with' },
]
const platformType = [
    { name: 'WINDOWS', label: 'WINDOWS' },
    { name: 'MACOS', label: 'MACOS' },
    { name: 'LINUX', label: 'LINUX' }
]

const statusType = [
    { name: 'ACTIVE', label: 'ACTIVE' },
    { name: 'INACTIVE', label: 'INACTIVE' },
    { name: 'ISOLATED', label: 'ISOLATED' }
]

export const fields = (
    [
        {
            name: 'hostName',
            label: 'Host',
            operators: useOperators
        },
        {
            name: 'platform',
            label: 'Platform',
            valueEditorType: 'select',
            values: platformType,
            operators: [
                { name: 'in', value: 'in', label: 'in' },
                { name: 'notIn', value: 'notIn', label: 'not in' },
            ]
        },
        {
            name: 'osName',
            label: 'Os Name',
            operators: useOperators,
        },
        {
            name: 'osVersion',
            label: 'Os Version',
            operators: useOperators,
        },
        {
            name: 'agentVersion',
            label: 'Agent Version',
            operators: useOperators,
        },
        {
            name: 'createdTime',
            label: 'Registration Date',
            inputType: 'date',
            operators: [
                { name: 'between', value: 'between', label: 'between' },
                { name: 'notBetween', value: 'notBetween', label: 'not between' },
            ]
        },
        {
            name: 'lastPingedTime',
            label: 'Last Synced',
            inputType: 'date',
            operators: [
                { name: 'between', value: 'between', label: 'between' },
                { name: 'notBetween', value: 'notBetween', label: 'not between' },
            ]

        },
        {
            name: 'status',
            label: 'Status',
            values: statusType,
            valueEditorType: 'select',
            operators: [
                { name: 'in', value: 'in', label: 'in' },
                { name: 'notIn', value: 'notIn', label: 'not in' },
            ]

        },
    ] satisfies Field[]
).map((o) => toFullOption(o));

const customTranslations: Partial<Translations> = {
    addRule: { label: '+ Add' },
};

const DynamicGroup = forwardRef((_, ref) => {
    const [query, setQuery] = useState<RuleGroupTypeIC>(initialQuery);
    const { portalId } = useContext(PortalContext)!;
    // const transformedQueryString = formatQuery(query, 'json_without_ids');
    // const transformedQuery = JSON.parse(transformedQueryString);
    // const filters: Filter[] = transformedQuery.rules;
    //********* temporary
    const transformedQueryString = JSON.stringify(query, ['rules', 'field', 'operator', 'value']);
    const transformedQuery = JSON.parse(transformedQueryString);
    const filters: Filter[] = transformedQuery.rules;
    //**********
    const sensorsFields: string[] = [];
    const handleSearch = async () => {
        try {
            const response = (await getSensors(portalId, undefined, undefined, undefined, filters, {
                sensors: sensorsFields
            })) as Response;
            console.log('API Response:', response);
            return response;
        } catch (error) {
            console.error('Error fetching sensor groups:', error);
            return [];
        }
    };

    useImperativeHandle(ref, () => ({
        handleSearch,
    }));

    const CustomCombinatorSelector = ({ value, title, className, handleOnChange }: CombinatorSelectorProps) => (  //temporary

        <FormControl variant="standard" >
            <Select

                className={className}
                title={title}
                value={value}
                onChange={e => handleOnChange(e.target.value)}

            >
                <MenuItem value="and">AND</MenuItem>
            </Select>
        </FormControl>

    );



    return (
        <QueryBuilderDnD
            dnd={{ ...ReactDnD, ...ReactDndHtml5Backend, ...ReactDndTouchBackend }}
        >

            <QueryBuilderMaterial>
                <QueryBuilder

                    fields={fields}
                    query={query}
                    onQueryChange={setQuery}
                    controlClassnames={{ addRule: 'button', addGroup: 'button', removeRule: 'cancel', removeGroup: 'cancel' }}
                    translations={customTranslations}
                    controlElements={{
                        addGroupAction: () => null,     //temporary
                        combinatorSelector:CustomCombinatorSelector,     //temporary
                    }}
                />

            </QueryBuilderMaterial>


        </QueryBuilderDnD>

    );
});

export default DynamicGroup;
