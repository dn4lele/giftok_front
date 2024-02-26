/*import { UserProvider } from "../components/UserContext";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
*/

import { UserProvider } from "../components/UserContext";

function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return <UserProvider>{getLayout(<Component {...pageProps} />)}</UserProvider>;
}

export default MyApp;
