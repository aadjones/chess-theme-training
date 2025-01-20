import { Box, Button, FormControl, FormLabel, Input, VStack, Heading } from '@chakra-ui/react';

export function RegisterPage() {
  return (
    <Box maxW="md" mx="auto">
      <VStack spacing={8}>
        <Heading>Sign Up</Heading>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </FormControl>
        <Button colorScheme="blue" width="full">
          Sign Up
        </Button>
      </VStack>
    </Box>
  );
}
