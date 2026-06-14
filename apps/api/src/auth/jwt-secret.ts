const MINIMUM_SECRET_LENGTH = 32;

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error('JWT_SECRET is required to start the API');
  }

  if (secret.length < MINIMUM_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must contain at least ${MINIMUM_SECRET_LENGTH} characters`,
    );
  }

  return secret;
}
