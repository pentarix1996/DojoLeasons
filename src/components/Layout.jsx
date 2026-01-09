import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Terminal, Shield, Zap, Home, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Layout = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-space-black text-white selection:bg-teleport-cyan selection:text-black font-sans">
            {/* Background Stars/Effect */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Navigation */}
            <header className="fixed top-0 w-full z-50 glass-panel border-b border-white/10 m-4 w-[calc(100%-2rem)]">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teleport-cyan to-blue-600 flex items-center justify-center shadow-lg shadow-teleport-cyan/20 group-hover:scale-110 transition-transform">
                            <Terminal className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            Dojo <span className="text-teleport-cyan">DevOps</span>
                        </span>
                    </Link>

                    <nav className="flex gap-2">
                        <Link to="/">
                            <NavButton active={location.pathname === '/'} icon={<Home size={18} />}>
                                Inicio
                            </NavButton>
                        </Link>
                        <Link to="/ssh">
                            <NavButton active={location.pathname === '/ssh'} icon={<Zap size={18} />}>
                                SSH
                            </NavButton>
                        </Link>
                        <Link to="/keygen">
                            <NavButton active={location.pathname === '/keygen'} icon={<Shield size={18} />}>
                                KeyGen
                            </NavButton>
                        </Link>
                        <Link to="/config-ssh">
                            <NavButton active={location.pathname === '/config-ssh'} icon={<Settings size={18} />}>
                                Config
                            </NavButton>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 pt-24 px-4 pb-12 max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-6 text-center text-gray-500 text-sm">
                <p>Entrenamiento Intensivo para Saiyans del Código</p>
            </footer>
        </div>
    );
};

const NavButton = ({ children, active, icon }) => (
    <div className={`
    relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300
    ${active ? 'bg-white/10 text-teleport-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'hover:bg-white/5 text-gray-400 hover:text-white'}
  `}>
        {icon}
        <span className="font-medium">{children}</span>
        {active && (
            <motion.div
                layoutId="nav-glow"
                className="absolute inset-0 rounded-lg border border-teleport-cyan/50"
                transition={{ duration: 0.3 }}
            />
        )}
    </div>
);

export default Layout;
