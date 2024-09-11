This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Dependencies

This app uses the [Costa API's](https://github.com/carbonteq/costa-oil-api) Square API's to work. To run the application correctly, you must clone the aforementioned repository and run the following command:

```bash

npm run start:dev
```

Also make sure a redis server is running before since it requires you to have one in the background. For that, open a new terminal, and do the following:

```bash
sudo apt-get install redis-server
#to start the server
redis-server
```

## Functionality

- Authorize the Seller using the OAuth API provided by Square.
- Allow the User to Search by Query and/or by Category.
- Display a list of Products fetched directly from the Square Seller Dashboard.
