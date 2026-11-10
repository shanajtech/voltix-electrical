This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## GitHub Pages

The website is published through `.github/workflows/pages.yml` whenever `main` is updated. The workflow installs dependencies, builds with `GITHUB_PAGES=true`, and deploys the static `.next-pages` directory.

`next.config.ts` supplies the `/voltix-electrical` base path only for the Pages build. Public media and credit links use `src/lib/public-url.ts`, so local development keeps root-relative paths.

Expected address: https://shanajtech.github.io/voltix-electrical/

For Windows PowerShell, a local Pages build is:

```powershell
$env:GITHUB_PAGES = 'true'
npm run build
Remove-Item Env:GITHUB_PAGES
```

The site is static. Enquiry forms prepare an editable WhatsApp message; they do not submit data to a backend or confirm a booking.
