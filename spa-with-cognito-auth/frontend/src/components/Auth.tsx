import { Button, Flex, Text, Title, Box } from '@mantine/core';

import { API_ENDPOINT } from '../config.ts';

export function Auth() {
  return (
    <Flex direction="column" align="center" mt="xl">
      <Title order={1} mb="sm">
        Authentication Required
      </Title>
      <Text fz="xl" mb="xl">
        Please log in to access this page
      </Text>

      <Flex gap={10}>
        <Box w={120}>
          <Button
            component="a"
            fullWidth
            href={`${API_ENDPOINT}/login`}
            rel="noreferrer"
            variant="light"
            color="violet"
          >
            Log in
          </Button>
        </Box>

        <Box w={120}>
          <Button
            component="a"
            fullWidth
            href={`${API_ENDPOINT}/login?hint=signup`}
            rel="noreferrer"
            variant="light"
            color="violet"
          >
            Sign up
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
}
