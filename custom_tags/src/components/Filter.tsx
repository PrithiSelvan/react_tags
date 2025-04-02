import { forwardRef, useContext, useImperativeHandle, useState } from 'react';
import type { RuleGroupType, RuleGroupTypeIC, Translations } from 'react-querybuilder';
import {  QueryBuilder } from 'react-querybuilder';
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



const initialQuery: RuleGroupTypeIC = { rules: [] };
// export const validator = (r: RuleType) => !!r.value;
const useOperators = 
    [
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
    { name: 'WINDOWS' , label: 'WINDOWS' }, 
    { name: 'MACOS', label: 'MACOS' },
    {name:'LINUX',label:'LINUX'}
]

const statusType =[
    { name: 'ACTIVE' , label: 'ACTIVE' }, 
    { name: 'INACTIVE', label: 'INACTIVE' },
    {name:'ISOLATED',label:'ISOLATED'}
]

export const fields = (
    [
        {
            name: 'hostname',
            label: 'Host',
            operators:useOperators
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
            operators:useOperators,
        },
        {
            name: 'osVersion',
            label: 'Os Version',
            operators:useOperators,
        },
        {
            name: 'agentVersion',
            label: 'Agent Version',
            operators:useOperators,
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

const transformQuery = (query: RuleGroupType): RuleGroupType => {
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



const DynamicGroup = forwardRef((_, ref) => {
    const [query, setQuery] = useState<RuleGroupTypeIC>(initialQuery);
    const { portalId } = useContext(PortalContext)!;
    // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    // const handleClose = () => {
    //     setAnchorEl(null);
    //   };


    const handleSearch = async () => {
        const transformedQuery = transformQuery(query);
        const fields = {
            sensors: ['hostName','platform', 'osName', 'osVersion', 'agentVersion', 'status'],
        };
        try {
            const response = await getSensors(portalId, undefined, undefined, undefined, transformedQuery, fields);
            console.log('API Response:', response);
        } catch (error) {
            console.error('Error fetching sensor groups:', error);
        }
    };

    useImperativeHandle(ref, () => ({
        handleSearch,
    }));
   

    

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
                            translations={customTranslations} />

                </QueryBuilderMaterial>
 
         
        </QueryBuilderDnD>

    );
});

export default DynamicGroup;
