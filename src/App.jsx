
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import ProfileProvider from "./context/ProfileContext";
import TokenProvider from "./context/TokenContext";
import Navigation from "./pages/Navigation";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <TokenProvider>
        <ProfileProvider>
          <Navigation />
        </ProfileProvider>
      </TokenProvider>
    </QueryClientProvider>
  );
}