import Loader from './Loader';

/** Default UI while a route segment’s page is loading (via Next.js `loading.tsx`). */
export default function RouteSegmentLoading() {
  return <Loader fullScreen />;
}
