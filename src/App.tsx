import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth.tsx";
import UserDashboard from "./components/UserDashboard";
import AdminPanel from "./components/AdminPanel";
import Communities from "./pages/Communities";
import Resources from "./pages/Resources";
//import Join from "./pages/Join";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Index />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/resources" element={<Resources />} />
          {/* <Route path="/join" element={<Join />} /> */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


// import { useEffect, useState } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import Auth from "./pages/Auth.tsx";

// const queryClient = new QueryClient();

// const App = () => {
//   const [session, setSession] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🧠 Check if the user is already logged in
//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setLoading(false);
//     });

//     // 🔄 Listen for auth changes (login/logout)
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   if (loading) return null; // or you can show a spinner while checking auth

//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Routes>
//             {/* ✅ If logged in → go to main page, else redirect to login */}
//             <Route
//               path="/"
//               element={session ? <Index /> : <Navigate to="/auth" replace />}
//             />

//             {/* 🔑 Login/Signup Page */}
//             <Route
//               path="/auth"
//               element={session ? <Navigate to="/" replace /> : <Auth />}
//             />

//             {/* ❌ Catch-all (404) */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// };

// export default App;
