import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Unplug, ShieldCheck, ArrowRight, Settings, Server, Terminal, Trophy } from 'lucide-react';

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

            <div className="w-full max-w-6xl space-y-12">

                {/* Bash Section */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white pl-4 border-l-4 border-green-500">Módulo: Bash</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ClassCard
                            to="/bash-basic"
                            title="Lección 1: Comandos Básicos"
                            subtitle="El Lenguaje del Sistema"
                            description="Aprende a hablar directamente con el sistema operativo. Navega, crea y destruye archivos."
                            icon={<Terminal size={40} />}
                            color="cyan"
                            delay={0.1}
                        />
                        <ClassCard
                            to="/bash-advanced"
                            title="Lección 2: Comandos Avanzados"
                            subtitle="Dominando los Flujos"
                            description="Conecta comandos con pipes, redirige salidas y conviértete en un mago de la terminal."
                            icon={<Unplug size={40} />}
                            color="cyan"
                            delay={0.2}
                        />
                    </div>
                </div>

                {/* SSH Section */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white pl-4 border-l-4 border-teleport-cyan">Módulo: SSH</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ClassCard
                            to="/ssh"
                            title="Lección 1: SSH-Basic"
                            subtitle="Teletransportación Instantánea"
                            description="Aprende a conectarte a otros ordenadores a la velocidad de la luz. Sin moverte de tu silla."
                            icon={<Unplug size={40} />}
                            color="cyan"
                            delay={0.2}
                        />
                        <ClassCard
                            to="/keygen"
                            title="Lección 2: KeyGen"
                            subtitle="Modo Super Saiyan"
                            description="Entra sin contraseña. Desbloquea el poder de las llaves criptográficas y olvida los passwords."
                            icon={<ShieldCheck size={40} />}
                            color="gold"
                            delay={0.3}
                        />
                        <ClassCard
                            to="/config-ssh"
                            title="Lección 3: Config SSH"
                            subtitle="El Manual de la Nave"
                            description="Modifica los puertos y permisos de tu servidor para máxima seguridad y control."
                            icon={<Settings size={40} />}
                            color="purple"
                            delay={0.4}
                        />
                    </div>
                </div>

                {/* Apache Section */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white pl-4 border-l-4 border-saiyan-orange">Módulo: Apache</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ClassCard
                            to="/apache-basic"
                            title="Lección 1: Apache-Basic"
                            subtitle="El Servidor Web"
                            description="Descubre cómo funcionan las páginas web. Instala y configura tu propio servidor Apache."
                            icon={<Server size={40} />}
                            color="orange"
                            delay={0.5}
                        />
                        <ClassCard
                            to="/apache-config"
                            title="Lección 2: Apache-Config"
                            subtitle="Multi-Sitio"
                            description="Configura Virtual Hosts para alojar múltiples webs en el mismo servidor. Domina el archivo .conf."
                            icon={<Settings size={40} />}
                            color="orange"
                            delay={0.6}
                        />
                    </div>
                </div>

                {/* Examenes Section */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white pl-4 border-l-4 border-red-600">Exámenes</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ClassCard
                            to="/exam01"
                            title="Exam01: Apache Warrior"
                            subtitle="Prueba Final"
                            description="Demuestra todo lo aprendido. Configura un servidor web completo, base de datos y despliega WordPress."
                            icon={<Trophy size={40} />}
                            color="red"
                            delay={0.7}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

const ClassCard = ({ title, subtitle, description, icon, to, color, delay }) => {
    const colors = {
        cyan: 'from-teleport-cyan to-blue-600 group-hover:shadow-teleport-cyan/40',
        gold: 'from-saiyan-gold to-saiyan-orange group-hover:shadow-saiyan-gold/40',
        purple: 'from-purple-500 to-indigo-600 group-hover:shadow-purple-500/40',
        orange: 'from-orange-500 to-red-600 group-hover:shadow-orange-500/40',
        red: 'from-red-600 to-rose-700 group-hover:shadow-red-600/40',
    };

    const textColors = {
        cyan: 'text-teleport-cyan',
        gold: 'text-saiyan-gold',
        purple: 'text-purple-400',
        orange: 'text-orange-400',
        red: 'text-red-500',
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
