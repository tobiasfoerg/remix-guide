import type { LinksFunction, MetaFunction, LoaderFunction } from 'remix';
import {
  Meta,
  Links,
  Scripts,
  useLoaderData,
  LiveReload,
  useCatch,
  Outlet,
  Link,
  ScrollRestoration,
} from 'remix';
import SearchForm from '~/components/SearchForm';
import { categories, platforms } from './meta';
import stylesUrl from './styles/tailwind.css';

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Guide',
    viewport: 'width=device-width, initial-scale=1',
  };
};

export let loader: LoaderFunction = async ({ context }) => {
  const { languages } = await context.query('meta', 'data');

  return {
    versions: [],
    categories,
    languages,
    platforms,
  };
};

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export default function App() {
  let { categories, platforms, languages, versions } = useLoaderData();

  return (
    <Document>
      <div className="min-h-screen flex flex-col">
        <header className="px-4 sm:px-16 h-12 sticky top-0 z-40 bg-white border-b flex flex-row items-center text-xs md:text-base shadow-sm">
          <Link
            className="whitespace-nowrap -mx-4 px-4 z-40"
            to="/"
            prefetch="intent"
          >
            Remix Guide
          </Link>
          <div className="flex flex-grow">
            <SearchForm
              categories={categories}
              platforms={platforms}
              versions={versions}
              languages={languages}
            />
          </div>
        </header>
        <main className="flex-grow p-4 sm:p-8">
          <Outlet />
        </main>
        <footer className="flex flex-col sm:flex-row justify-between sm:px-16 p-4 text-sm text-center sm:text-left">
          <p>
            Wanna share something? Submit it{' '}
            <Link className="underline" to="submit">
              here
            </Link>
          </p>
          <p>
            Made with{' '}
            <a
              className="hover:underline"
              href="https://remix.run"
              target="_blank"
              rel="noopener noreferrer"
            >
              Remix
            </a>{' '}
            by{' '}
            <a
              className="hover:underline"
              href="https://github.com/edmundhung"
              target="_blank"
              rel="noopener noreferrer"
            >
              Edmund Hung
            </a>
          </p>
        </footer>
      </div>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 401:
    case 404:
      return (
        <Document title={`${caught.status} ${caught.statusText}`}>
          <div className="min-h-screen py-4 flex flex-col justify-center items-center">
            <h1>
              {caught.status} {caught.statusText}
            </h1>
          </div>
        </Document>
      );

    default:
      throw new Error(
        `Unexpected caught response with status: ${caught.status}`
      );
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Document title="Uh-oh!">
      <h1>App Error</h1>
      <pre>{error.message}</pre>
      <p>
        Replace this UI with what you want users to see when your app throws
        uncaught errors.
      </p>
    </Document>
  );
}
