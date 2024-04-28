# Read ME

Embedding Studio for previewing widgets and for creating Public API and Omni API tokens.

To start Embedding Studio, just use:

```cmd title="Starting app"
npm run dev
```

To build Embedding Studio, just use

```cmd title="Build"
npm run build
```

and then start it by

```cmd title="Starting built app"
npm run start
```

Make sure that all variables in .env file are set such as:

OMNI_API_TOKEN - Omni token

PUBLIC_API_TOKEN - Public token

OAUTH_PROVIDER_OMNI_STUDIO - OAuth provider for generating Omni API tokens

SCOPE_PUBLIC_API - api.read

CALLBACK_URL_PUBKIC_API - callback URL for public api

CALLBACK_URL_OMNI_STUDIO - callback URL for omni api

CLIENT_SECRET_OMNI_STUDIO - omni studio secret

CLIENT_ID_OMNI_STUDIO - omni studio ID

OAUTH_PROVIDER_PUBLIC_API_URL - OAuth provider for generating Public API tokens

CLIENT_SECRET_PUBLIC_API - public API secret

CLIENT_ID_PUBLIC_API - public API ID

PUBLIC_API_URL - URL of public API

OMNI_STUDIO_API_URL - URL of Omni Studio
