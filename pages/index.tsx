import { Box, Button, Typography, Stack } from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Box
      sx={{
        height: 'calc(100vh - 88px)',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center'
      }}
    >
      <Typography variant="h1">WOD</Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        This is a tool to help you plan and organize
        <br />
        the wods for your box athletes!
        <br />
        It gives you a worksheet with insights about the schedule.
      </Typography>
      <Stack sx={{ mt: 6 }} direction="row" spacing={4}>
        <Link href="/plan" passHref>
          <Button variant="contained">Start Planning</Button>
        </Link>
        <Link href="/worksheet" passHref>
          <Button variant="contained">See the insights</Button>
        </Link>
      </Stack>
    </Box>
  );
}
