import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { Suspense, createElement, lazy, useEffect, type ComponentType } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/Layout";
// Lazy-load all pages for route-based code splitting. The loaded component is
// also exposed synchronously after preload so prerendered pages can hydrate
// without rendering the Suspense fallback first.
type PageModule = { default: ComponentType<any> };

function lazyRoute(loadModule: () => Promise<PageModule>) {
  let loaded: ComponentType<any> | null = null;
  let promise: Promise<PageModule> | null = null;

  const load = () => {
    if (!promise) {
      promise = loadModule().then((module) => {
        loaded = module.default;
        return module;
      });
    }
    return promise;
  };

  const LazyComponent = lazy(load);
  const RouteComponent = (props: any) =>
    loaded
      ? createElement(loaded, props)
      : createElement(LazyComponent, props);

  return { component: RouteComponent, preload: load };
}

const Home = lazyRoute(() => import("@/pages/home"));
const HouseScrollTest = lazyRoute(() => import("@/pages/house-scroll-test"));
const HouseVideoScrollTest = lazyRoute(() => import("@/pages/house-video-scroll-test"));
const Projects = lazyRoute(() => import("@/pages/projects"));
const ProjectDetail = lazyRoute(() => import("@/pages/project-detail"));
const About = lazyRoute(() => import("@/pages/about"));
const Contacts = lazyRoute(() => import("@/pages/contacts"));
const Gallery = lazyRoute(() => import("@/pages/gallery"));
const ProductionProfBrus = lazyRoute(() => import("@/pages/production-profbrus"));
const ProductionPilomaterial = lazyRoute(() => import("@/pages/production-pilomaterial"));
const ProductionStolyar = lazyRoute(() => import("@/pages/production-stolyar"));
const Articles = lazyRoute(() => import("@/pages/articles"));
const ArticleDetail = lazyRoute(() => import("@/pages/article-detail"));
const Terms = lazyRoute(() => import("@/pages/terms"));
const ServicesProfBrus = lazyRoute(() => import("@/pages/services-profbrus"));
const ServicesRublenye = lazyRoute(() => import("@/pages/services-rublenye"));
const Uslugi = lazyRoute(() => import("@/pages/uslugi"));
const NotFound = lazyRoute(() => import("@/pages/not-found"));

const routePreloaders: Array<{
  matches: (pathname: string) => boolean;
  preload: () => Promise<PageModule>;
}> = [
  { matches: (pathname) => pathname === "/", preload: Home.preload },
  {
    matches: (pathname) => pathname === "/house-scroll-test",
    preload: HouseScrollTest.preload,
  },
  {
    matches: (pathname) => pathname === "/house-video-scroll-test",
    preload: HouseVideoScrollTest.preload,
  },
  {
    matches: (pathname) => pathname === "/services/profilirovanny-brus",
    preload: ServicesProfBrus.preload,
  },
  {
    matches: (pathname) => pathname === "/services/rublenye-doma",
    preload: ServicesRublenye.preload,
  },
  {
    matches: (pathname) => pathname === "/services" || pathname === "/uslugi",
    preload: Uslugi.preload,
  },
  { matches: (pathname) => pathname === "/projects", preload: Projects.preload },
  {
    matches: (pathname) => pathname.startsWith("/projects/"),
    preload: ProjectDetail.preload,
  },
  { matches: (pathname) => pathname === "/gallery", preload: Gallery.preload },
  {
    matches: (pathname) =>
      pathname === "/production/profilirovanny-brus" || pathname === "/production",
    preload: ProductionProfBrus.preload,
  },
  {
    matches: (pathname) => pathname === "/production/stolyarnye-izdeliya",
    preload: ProductionStolyar.preload,
  },
  {
    matches: (pathname) => pathname === "/production/pilomaterial",
    preload: ProductionPilomaterial.preload,
  },
  { matches: (pathname) => pathname === "/articles", preload: Articles.preload },
  {
    matches: (pathname) => pathname.startsWith("/articles/"),
    preload: ArticleDetail.preload,
  },
  { matches: (pathname) => pathname === "/about", preload: About.preload },
  { matches: (pathname) => pathname === "/contacts", preload: Contacts.preload },
  { matches: (pathname) => pathname === "/terms", preload: Terms.preload },
  { matches: () => true, preload: NotFound.preload },
];

export function preloadRoute(pathname: string) {
  return routePreloaders.find(({ matches }) => matches(pathname))!.preload();
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#1c1a17] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home.component} />
          <Route path="/house-scroll-test" component={HouseScrollTest.component} />
          <Route path="/house-video-scroll-test" component={HouseVideoScrollTest.component} />
          <Route path="/services/profilirovanny-brus" component={ServicesProfBrus.component} />
          <Route path="/services/rublenye-doma" component={ServicesRublenye.component} />
          <Route path="/services" component={Uslugi.component} />
          <Route path="/uslugi" component={Uslugi.component} />
          <Route path="/projects" component={Projects.component} />
          <Route path="/projects/:id" component={ProjectDetail.component} />
          <Route path="/gallery" component={Gallery.component} />
          <Route path="/production/profilirovanny-brus" component={ProductionProfBrus.component} />
          <Route path="/production/stolyarnye-izdeliya" component={ProductionStolyar.component} />
          <Route path="/production/pilomaterial" component={ProductionPilomaterial.component} />
          <Route path="/production" component={ProductionProfBrus.component} />
          <Route path="/articles/:slug" component={ArticleDetail.component} />
          <Route path="/articles" component={Articles.component} />
          <Route path="/about" component={About.component} />
          <Route path="/contacts" component={Contacts.component} />
          <Route path="/terms" component={Terms.component} />
          <Route component={NotFound.component} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default function App({ ssrPath }: { ssrPath?: string } = {}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter
          base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}
          ssrPath={ssrPath}
        >
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
