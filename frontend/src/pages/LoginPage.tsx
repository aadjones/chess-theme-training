import { Box, Button, FormControl, FormLabel, Input, VStack, Heading } from '@chakra-ui/react';

export function LoginPage() {
  return (
    <Box maxW="md" mx="auto">
      <VStack spacing={8}>
        <Heading>Login</Heading>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </FormControl>
        <Button colorScheme="blue" width="full">
          Login
        </Button>
      </VStack>
    </Box>
  );
}
