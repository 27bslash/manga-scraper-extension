import * as React from 'react';
import Box from '@mui/material/Box';
import TabToggler from './tab-toggler';


export default function BasicTabs(props: any) {
    return (
        <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', bgColor: 'primary.dark' }}>
            <TabToggler {...props} />
        </Box >
    );
}
