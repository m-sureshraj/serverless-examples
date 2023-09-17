import React, { FormEvent, useState } from 'react';
import { TextInput, Box, Button, createStyles, rem, Notification } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

import { updateUserProfile } from '../service.ts';
import { useUser } from '../userContext.tsx';
import { User } from '../types.ts';

const useStyles = createStyles(() => ({
  input: {
    marginBottom: rem(20),
  },
}));

export function Profile() {
  const { classes } = useStyles();
  const userContext = useUser();
  // This component loads only after the user has logged in, so a user always exists
  const user = userContext.user as User;

  const [formData, setFormData] = useState({
    given_name: user.given_name,
    family_name: user.family_name,
    'custom:company': user['custom:company'],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [statusMessage, setStatusMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      await updateUserProfile(formData);
      setStatusMessage('Profile data successfully updated!');

      userContext.setUser({
        ...user,
        ...formData,
      });
    } catch (error: unknown) {
      const _error = error as Error;
      console.error(_error);
      setError(_error.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  }

  return (
    <Box w={'50%'}>
      <h2>Profile Page</h2>

      {error && (
        <Notification
          icon={<IconX size="1.1rem" />}
          color="red"
          withBorder
          mb={20}
          onClose={() => setError(null)}
        >
          {error}
        </Notification>
      )}

      {statusMessage && (
        <Notification
          color="green"
          icon={<IconCheck size="1.2rem" />}
          withBorder
          mb={20}
          onClose={() => setStatusMessage('')}
        >
          {statusMessage}
        </Notification>
      )}

      <form onSubmit={handleSubmit}>
        <TextInput
          label="Given Name"
          value={formData.given_name}
          onChange={handleInputChange}
          id="given_name"
          name="given_name"
          pattern=".*\S.*"
          required
          className={classes.input}
        />

        <TextInput
          label="Family Name (Lastname)"
          id="family_name"
          name="family_name"
          required
          type="text"
          pattern=".*\S.*"
          value={formData.family_name}
          onChange={handleInputChange}
          className={classes.input}
        />

        <TextInput
          label="Company"
          id="custom:company"
          name="custom:company"
          type="text"
          pattern=".*\S.*"
          value={formData['custom:company']}
          onChange={handleInputChange}
          className={classes.input}
        />

        <Button type="submit" loading={submitting} color="violet">
          Update Profile
        </Button>
      </form>
    </Box>
  );
}
