import * as React from 'react';
import Box from '@mui/material/Box';
import TabToggler from './tab-toggler';

export default function BasicTabs(props: any) {
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabToggler handleClick={props.handleClick} checked={props.checked} handleDelete={props.handleDelete} updateEditing={props.updateEditing} />
            </Box>
        </Box >
    );
}
