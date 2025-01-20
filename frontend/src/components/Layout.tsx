import { Box, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Outlet />
      </Container>
    </Box>
  );
} 