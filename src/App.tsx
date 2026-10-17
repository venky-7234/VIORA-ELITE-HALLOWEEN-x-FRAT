import React, { useState, useEffect, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CustomCursor } from './components/CustomCursor';
import { GlobalSmoothScroll } from './components/GlobalSmoothScroll';
import { HalloweenLandingPage } from './pages/HalloweenLandingPage';

const PageFallback = () => (
  <div className="min-h-screen bg-[#070508] flex flex-col items-center justify-center text-[#d7192d]">
    <div className="w-8 h-8 border-2 border-[#d7192d] border-t-transparent rounded-full animate-spin"></div>
    <span className="mt-4 font-serif text-xs tracking-widest text-[#f5f5f5] uppercase animate-pulse">Entering the Nightmare...</span>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-50 bg-[#070508] flex flex-col items-center justify-center text-[#f5f5f5]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0 }}
              className="flex flex-col items-center gap-4 text-center px-6"
            >
              <div className="relative mb-4 flex items-center justify-center select-none pointer-events-none">
                <img
                  src={`${import.meta.env.BASE_URL}images/logo.svg`}
                  alt="Viora Elite Logo"
                  className="h-20 sm:h-24 object-contain filter drop-shadow-[0_0_20px_rgba(215,25,45,0.45)]"
                />
              </div>

              <h2 className="font-serif text-lg tracking-[0.35em] uppercase text-[#fff5ec] mt-2">
                HALLOWEEN ✕ FRAT
              </h2>
              <span className="font-sans text-[8px] tracking-[0.55em] text-[#d7192d] uppercase font-semibold animate-pulse">
                VIORA ELITE AFTER DARK
              </span>

              <div className="w-28 h-[1px] bg-[#d7192d]/20 mt-6 relative overflow-hidden">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                  className="absolute top-0 bottom-0 w-1/3 bg-[#d7192d]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative min-h-screen w-full bg-[#070508] text-[#F5F5F5] overflow-x-hidden selection:bg-[#d7192d] selection:text-[#fff5ec] z-10">
        <CustomCursor />
        <Toaster position="top-right" toastOptions={{ style: { background: '#110a0e', color: '#fff5ec', border: '1px solid #3d0a14' } }} />

        <GlobalSmoothScroll>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="*" element={<HalloweenLandingPage />} />
            </Routes>
          </Suspense>
        </GlobalSmoothScroll>
      </div>
    </>
  );
}

export default App;
