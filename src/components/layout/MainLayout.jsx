import Header from "./Header";
import { Footer } from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export function MainLayout({ children }) {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col bg-skySoft">
            {/* общий хедер для всех страниц */}
            <Header />

            {/* контент страницы */}
            <AnimatePresence mode="wait">
                <motion.main
                    key={location.pathname}
                    className="flex-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {children}
                </motion.main>
            </AnimatePresence>

            {/* общий футер */}
            <Footer />
        </div>
    );
}
