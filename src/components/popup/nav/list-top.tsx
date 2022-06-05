import Box from '@mui/material/Box';
import TabToggler from './tab-toggler';


export default function BasicTabs(props: any) {
    return (
        <Box className='test-box' sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', backgroundColor: 'rgb(30, 41, 101)' }}>
            <TabToggler {...props} />
        </Box >
    );
}
