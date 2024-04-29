# Read ME
You should be using Node.js version 18+. (developed on 20)
## Installing and running app
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

OAUTH_PROVIDER_OMNI_STUDIO - OAuth provider for generating Omni API tokens - `https://omni-studio.app.ccl/oauth2`

SCOPE_PUBLIC_API - `api.read`

CALLBACK_URL_PUBKIC_API - callback URL for public api

CALLBACK_URL_OMNI_STUDIO - callback URL for omni api

CLIENT_SECRET_OMNI_STUDIO - omni studio secret - provided by employee

CLIENT_ID_OMNI_STUDIO - omni studio ID - provided by employee

OAUTH_PROVIDER_PUBLIC_API_URL - OAuth provider for generating Public API tokens - `https://3348d0628f75ab43fe445e17eb650c1b.sbksapps.com/oauth2/0`

CLIENT_SECRET_PUBLIC_API - public API secret - provided by employee

CLIENT_ID_PUBLIC_API - public API ID - provided by employee

PUBLIC_API_URL - URL of public API - `https://3348d0628f75ab43fe445e17eb650c1b.sbksapps.com`

OMNI_STUDIO_API_URL - URL of Omni Studio - `https://omni-studio.app.ccl/api`

## Suite account
To be able to create tokens, you must be logged into Suite account. This can be provided by Emplifi employees.

## VPN
To be able to create omni API tokens, you must be logged on VPN. For that, you will need to:
1. Download viscosity
2. Generate certificate and recieve credentionals - this is provided by employees from Emplifi
3. Attach certificate and insert received credentionals (you will receive manual how to set up as well)
4. Run the VPN
  
