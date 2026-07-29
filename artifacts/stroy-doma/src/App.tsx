import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/Layout";
// Lazy-load all pages for route-based code splitting
// (splash screen covers the brief Suspense on first load)
const Home = lazy(() => import("@/pages/home"));
const Projects = lazy(() => import("@/pages/projects"));
const ProjectDetail = lazy(() => import("@/pages/project-detail"));
const About = lazy(() => import("@/pages/about"));
const Contacts = lazy(() => import("@/pages/contacts"));
const Gallery = lazy(() => import("@/pages/gallery"));
const ProductionProfBrus = lazy(() => import("@/pages/production-profbrus"));
const ProductionPilomaterial = lazy(() => import("@/pages/production-pilomaterial"));
const Articles = lazy(() => import("@/pages/articles"));
const ArticleDetail = lazy(() => import("@/pages/article-detail"));
const Terms = lazy(() => import("@/pages/terms"));
const ServicesProfBrus = lazy(() => import("@/pages/services-profbrus"));
const ServicesRublenye = lazy(() => import("@/pages/services-rublenye"));
const Uslugi = lazy(() => import("@/pages/uslugi"));
const NotFound = lazy(() => import("@/pages/not-found"));

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
          <Route path="/" component={Home} />
          <Route path="/services/profilirovanny-brus" component={ServicesProfBrus} />
          <Route path="/services/rublenye-doma" component={ServicesRublenye} />
          <Route path="/uslugi" component={Uslugi} />
          <Route path="/projects" component={Projects} />
          <Route path="/projects/:id" component={ProjectDetail} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/production/profilirovanny-brus" component={ProductionProfBrus} />
          <Route path="/production/pilomaterial" component={ProductionPilomaterial} />
          <Route path="/production" component={ProductionProfBrus} />
          <Route path="/articles/:slug" component={ArticleDetail} />
          <Route path="/articles" component={Articles} />
          <Route path="/about" component={About} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/terms" component={Terms} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
