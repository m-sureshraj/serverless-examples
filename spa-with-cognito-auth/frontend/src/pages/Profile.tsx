import React, { FormEvent, useState } from 'react';

import { updateUserProfile } from '../service.ts';
import { useUser } from '../userContext.tsx';
import { User } from '../types.ts';

export function Profile() {
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
    <>
      <h2>Profile Page</h2>

      {error && <p>{error}</p>}
      {statusMessage && <p>{statusMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="given_name">Given Name</label>
          <br />
          <input
            id="given_name"
            name="given_name"
            type="text"
            required
            pattern=".*\S.*"
            value={formData.given_name}
            onChange={handleInputChange}
          />
        </div>

        <br />
        <div>
          <label htmlFor="family_name">Family Name (Lastname)</label>
          <br />
          <input
            id="family_name"
            name="family_name"
            required
            type="text"
            pattern=".*\S.*"
            value={formData.family_name}
            onChange={handleInputChange}
          />
        </div>

        <br />
        <div>
          <label htmlFor="custom:company">Company</label>
          <br />
          <input
            id="custom:company"
            name="custom:company"
            type="text"
            pattern=".*\S.*"
            value={formData['custom:company']}
            onChange={handleInputChange}
          />
        </div>

        <br />
        <button type="submit" disabled={submitting}>
          Update Profile
        </button>
      </form>
    </>
  );
}
