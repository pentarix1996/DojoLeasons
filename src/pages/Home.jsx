import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Unplug, ShieldCheck, ArrowRight, Settings } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <span className="px-3 py-1 rounded-full bg-saiyan-orange/20 text-saiyan-orange text-xs font-bold tracking-widest uppercase border border-saiyan-orange/30">
                    Nivel de Poder: 9000+
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
                    Domina la <span className="text-transparent bg-clip-text bg-gradient-to-r from-teleport-cyan to-blue-500 text-glow">Terminal</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Bienvenido al entrenamiento, joven padawan... digo, Saiyan.
                    Aquí aprenderás a controlar servidores remotos como si usaras la Teletransportación.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                <ClassCard
                    to="/ssh"
                    title="Clase 1: SSH"
                    subtitle="Teletransportación Instantánea"
                    description="Aprende a conectarte a otros ordenadores a la velocidad de la luz. Sin moverte de tu silla."
                    icon={<Unplug size={40} />}
                    color="cyan"
                    delay={0.2}
                />
                <ClassCard
                    to="/keygen"
                    title="Clase 2: KeyGen"
                    subtitle="Modo Super Saiyan"
                    description="Entra sin contraseña. Desbloquea el poder de las llaves criptográficas y olvida los passwords."
                    icon={<ShieldCheck size={40} />}
                    color="gold"
                    delay={0.4}
                />
                <ClassCard
                    to="/config-ssh"
                    title="Clase 3: Config SSH"
                    subtitle="El Manual de la Nave"
                    description="Modifica los puertos y permisos de tu servidor para máxima seguridad y control."
                    icon={<Settings size={40} />}
                    color="purple"
                    delay={0.6}
                />
            </div>
        </div>
    );
};

const ClassCard = ({ title, subtitle, description, icon, to, color, delay }) => {
    const colors = {
        cyan: 'from-teleport-cyan to-blue-600 group-hover:shadow-teleport-cyan/40',
        gold: 'from-saiyan-gold to-saiyan-orange group-hover:shadow-saiyan-gold/40',
        purple: 'from-purple-500 to-indigo-600 group-hover:shadow-purple-500/40',
    };

    const textColors = {
        cyan: 'text-teleport-cyan',
        gold: 'text-saiyan-gold',
        purple: 'text-purple-400',
    };

    return (
        <Link to={to}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay, duration: 0.4 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative h-full bg-space-blue/50 border border-white/10 rounded-2xl p-8 overflow-hidden transition-colors hover:border-white/20"
            >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors[color]} opacity-10 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity`} />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6 flex justify-between items-start">
                        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${textColors[color]}`}>
                            {icon}
                        </div>
                        <ArrowRight className="text-gray-500 group-hover:text-white transition-colors" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-glow transition-all">{title}</h2>
                    <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${textColors[color]}`}>{subtitle}</h3>

                    <p className="text-gray-400 leading-relaxed mb-6 flex-grow">{description}</p>

                    <div className="flex items-center gap-2 text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                        <span>Iniciar Entrenamiento</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default Home;
