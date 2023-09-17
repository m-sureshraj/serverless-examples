import { Button, Flex, Text, Title, Box, Notification } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';

import { API_ENDPOINT } from '../config.ts';
import { IconX } from '@tabler/icons-react';

export function Auth() {
  const [searchParams] = useSearchParams();
  const isLoginFailed = searchParams.get('error') === 'auth_failed';

  return (
    <Flex direction="column" align="center" mt={80}>
      <Title order={1} mb="sm">
        Authentication Required
      </Title>

      <Text fz="xl" mb="xl">
        Please log in to access this page
      </Text>

      {isLoginFailed && (
        <Notification
          icon={<IconX size="1.1rem" />}
          color="red"
          withBorder
          mb={40}
          mt={20}
          p="md"
          withCloseButton={false}
        >
          An error occurred while logging you in. Please try again!
        </Notification>
      )}

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
