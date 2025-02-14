const REQUIRED_ENVIRONMENT_VARIABLES = ['MONGODB_URI'];
const OPTIONAL_ENVIRONMENT_VARIABLES = {
  PORT: '3000'
};

type RequiredEnvironmentVariables = {
  [K in (typeof REQUIRED_ENVIRONMENT_VARIABLES)[number]]: string;
};

type OptionalEnvironmentVariables = {
  [K in keyof typeof OPTIONAL_ENVIRONMENT_VARIABLES]:
    | string
    | (typeof OPTIONAL_ENVIRONMENT_VARIABLES)[K];
};

export type Env = RequiredEnvironmentVariables & OptionalEnvironmentVariables;

export default {
  ...REQUIRED_ENVIRONMENT_VARIABLES.reduce((acc, key) => {
    if (!process.env[key]) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    acc[key] = process.env[key]!;
    return acc;
  }, {} as RequiredEnvironmentVariables),
  ...Object.entries(OPTIONAL_ENVIRONMENT_VARIABLES).reduce(
    (acc, [key, defaultValue]) => {
      acc[key as keyof typeof OPTIONAL_ENVIRONMENT_VARIABLES] =
        process.env[key] ?? defaultValue;
      return acc;
    },
    {} as OptionalEnvironmentVariables
  )
};
