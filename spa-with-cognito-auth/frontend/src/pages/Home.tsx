import { Code } from '@mantine/core';

import { useUser } from '../userContext.tsx';

export function Home() {
  const { user } = useUser();

  return (
    <>
      <h2>Welcome to the App</h2>
      <p>The following code block displays all of your details stored in AWS Cognito.</p>

      <Code block color="teal" p={20} fz={14}>
        {JSON.stringify(user, null, 2)}
      </Code>
    </>
  );
}
