import { Box, Flex, Button, Heading } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export function Navbar() {
  return (
    <Box bg="white" px={4} shadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Heading size="md" as={RouterLink} to="/">
          Chess Theme Training
        </Heading>
        <Flex gap={4}>
          <Button as={RouterLink} to="/login" variant="ghost">
            Login
          </Button>
          <Button as={RouterLink} to="/register" colorScheme="blue">
            Sign Up
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
