import { Code, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';

import { useUser } from '../userContext.tsx';

export function Home() {
  const { user } = useUser();

  return (
    <>
      <h2>Welcome to the App</h2>
      <p>
        The following code block displays all of your details stored in AWS Cognito. You
        can edit the given name, family name and company name on the{' '}
        <Anchor component={Link} to="/profile" color="violet">
          profile page
        </Anchor>
        .
      </p>

      <Code block color="teal" p={20} fz={14}>
        {JSON.stringify(user, null, 2)}
      </Code>
    </>
  );
}
