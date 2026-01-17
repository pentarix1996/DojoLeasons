import React, { useState } from 'react';
import ProgressFlow from '../components/ProgressFlow';
import { motion } from 'framer-motion';
import { Server, Settings, FileCode, Play, Shield, Globe, Link as LinkIcon, CheckCircle } from 'lucide-react';
import ZoomableImage from '../components/ZoomableImage';

const ApacheBasicClass = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { title: "Intro: Apache", id: "intro" },
        { title: "Instalación", id: "install" },
        { title: "Configuración", id: "config" },
        { title: "Enlaces Simbólicos", id: "symlinks" },
        { title: "Comandos Básicos", id: "commands" },
        { title: "Mi Primera Web", id: "practice" },
        { title: "Resumen", id: "summary" },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    return (
        <ProgressFlow
            steps={steps}
            currentStepIndex={currentStep}
            onNext={handleNext}
            onPrev={handlePrev}
            title="Módulo 2: Apache Server"
        >
            {currentStep === 0 && <IntroStep />}
            {currentStep === 1 && <InstallationStep />}
            {currentStep === 2 && <ConfigurationStep />}
            {currentStep === 3 && <SymbolicLinkStep />}
            {currentStep === 4 && <CommandsStep />}
            {currentStep === 5 && <PracticeStep />}
            {currentStep === 6 && <SummaryStep />}
        </ProgressFlow>
    );
};

/* --- Step Components --- */

const IntroStep = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8 text-center"
    >
        <div className="relative inline-block">
            <div className="absolute inset-0 bg-saiyan-orange blur-[60px] opacity-40"></div>
            <Server size={80} className="text-saiyan-orange relative z-10 mx-auto mb-4 animate-pulse" />
        </div>

        <h2 className="text-4xl font-bold">El Servidor Web Apache</h2>

        <div className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto space-y-6">
            <p>
                Apache HTTP Server es el servidor web más popular de la historia.
                Es el software que "sirve" las páginas web cuando alguien escribe una dirección en su navegador.
            </p>
            <div className="bg-white/5 p-6 rounded-xl border-l-4 border-saiyan-orange text-left">
                <p className="italic">
                    "Si Internet fuera un restaurante, Apache sería el camarero infatigable que lleva los platos (páginas web) desde la cocina (servidor) hasta tu mesa (navegador)."
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-8">
                <InfoCard
                    icon={<Globe className="text-blue-400" />}
                    title="Open Source"
                    description="Código abierto y gratuito. Mantenido por la Apache Software Foundation."
                />
                <InfoCard
                    icon={<Shield className="text-green-400" />}
                    title="Robusto"
                    description="Famoso por su fiabilidad y seguridad en entornos de producción."
                />
            </div>

            <div className="mt-8 max-w-2xl mx-auto">
                <ZoomableImage src="/apache_intro.jpg" alt="Apache Server Introduction" />
            </div>
        </div>
    </motion.div>
);

const InstallationStep = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-saiyan-orange">Instalación en Linux</h3>
        <p className="text-lg text-gray-300">
            Instalar Apache es tan sencillo como invocar un comando. En sistemas basados en Debian/Ubuntu:
        </p>

        <div className="bg-space-black p-6 rounded-xl border border-white/10 space-y-4">
            <div>
                <p className="text-sm text-gray-500 mb-2">1. Actualiza la lista de paquetes:</p>
                <CodeBlock>sudo apt-get update</CodeBlock>
            </div>
            <div>
                <p className="text-sm text-gray-500 mb-2">2. Instala el servidor:</p>
                <CodeBlock>sudo apt-get install apache2</CodeBlock>
            </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg flex items-start gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg shrink-0">
                <Play className="text-blue-400" size={20} />
            </div>
            <div>
                <h4 className="font-bold text-blue-300">Comprobación rápida</h4>
                <p className="text-sm text-gray-400">
                    Una vez instalado, abre tu navegador y escribe <span className="text-white font-mono">http://localhost</span>.
                    Deberías ver la página "Apache2 Default Page".
                </p>
            </div>
        </div>
    </div>
);

const ConfigurationStep = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-saiyan-orange">Archivos Vitales</h3>
        <p className="text-gray-300">
            Para dominar Apache, debes conocer sus puntos vitales.
        </p>

        <div className="grid gap-6">
            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                    <Settings className="text-purple-400" />
                    <h4 className="font-mono text-xl font-bold text-purple-300">/etc/apache2/sites-available/</h4>
                </div>
                <p className="text-gray-400 mb-3">
                    Aquí viven los archivos de configuración de tus sitios web ("Virtual Hosts").
                </p>
                <div className="bg-black/50 p-3 rounded border-l-2 border-purple-500">
                    <span className="text-gray-500">Archivo por defecto:</span> <br />
                    <code className="text-green-400">000-default.conf</code>
                </div>
            </div>

            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                    <FileCode className="text-yellow-400" />
                    <h4 className="font-mono text-xl font-bold text-yellow-300">/var/www/html/</h4>
                </div>
                <p className="text-gray-400">
                    La carpeta pública ("DocumentRoot") por defecto.
                    <br />Todo lo que pongas aquí será visible en Internet.
                </p>
            </div>

            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                    <Shield className="text-red-400" />
                    <h4 className="font-mono text-xl font-bold text-red-300">Usuario: www-data</h4>
                </div>
                <p className="text-gray-400">
                    Apache no corre como 'root' (por seguridad), sino con su propio usuario limitado llamado <code className="text-white">www-data</code>.
                    Asegúrate de que este usuario tenga permisos para leer tus archivos web.
                </p>

                <div className="bg-black/30 p-4 rounded-lg mt-3 border border-red-500/20">
                    <p className="text-sm text-gray-400 mb-2">Dar propiedad al usuario:</p>
                    <CodeBlock>sudo chown -R www-data:www-data /var/www/html</CodeBlock>

                    <p className="text-sm text-gray-400 mt-3 mb-2">Verificar permisos:</p>
                    <CodeBlock>ls -l /var/www/html</CodeBlock>
                </div>
            </div>

            <div className="mt-4 max-w-xl mx-auto">
                <ZoomableImage src="/apache_path.jpg" alt="Apache Configuration Paths" />
            </div>
        </div>
    </div>
);

const SymbolicLinkStep = () => (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
            <LinkIcon size={32} className="text-teleport-cyan" />
            <h3 className="text-2xl font-bold text-teleport-cyan">Enlaces Simbólicos</h3>
        </div>

        <p className="text-lg text-gray-300">
            Un <strong>enlace simbólico</strong> (symlink) es como un "acceso directo" en Windows.
            Es un archivo especial que apunta a otro archivo o directorio.
        </p>

        <div className="bg-space-black p-6 rounded-xl border border-white/10 space-y-4">
            <h4 className="font-bold text-white">¿Por qué los usamos en Apache?</h4>
            <p className="text-gray-400">
                Apache usa dos carpetas para gestionar sitios:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                <li><code className="text-purple-300">sites-available/</code>: Donde guardas tus configuraciones (almacén).</li>
                <li><code className="text-green-300">sites-enabled/</code>: Donde están los sitios activos (escaparate).</li>
            </ul>
            <p className="text-gray-400 mt-2">
                Para activar un sitio, Apache crea un <strong>enlace simbólico</strong> desde
                <span className="text-purple-300 mx-1">available</span> hacia
                <span className="text-green-300 mx-1">enabled</span>.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg border border-teleport-cyan/30">
                <h4 className="font-bold text-teleport-cyan mb-2">Soft Link (Simbólico)</h4>
                <p className="text-sm text-gray-400">
                    Es un <strong>acceso directo</strong>. Si borras el archivo original, el enlace se rompe y deja de funcionar.
                    Puede cruzar diferentes sistemas de archivos.
                    <br /><span className="text-xs text-gray-500 mt-1 block">Comando: ln -s target link</span>
                </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-orange-500/30">
                <h4 className="font-bold text-orange-400 mb-2">Hard Link (Duro)</h4>
                <p className="text-sm text-gray-400">
                    Es una <strong>copia espejo</strong>. Apunta a los mismos datos en el disco (inode).
                    Si borras el original, el Hard Link <strong>sigue funcionando</strong> con el contenido.
                    <br /><span className="text-xs text-gray-500 mt-1 block">Comando: ln target link</span>
                </p>
            </div>
        </div>

        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
            <h4 className="font-bold text-white mb-3">Cómo crear uno manualmente</h4>
            <CodeBlock>ln -s /ruta/archivo/original /ruta/del/enlace</CodeBlock>
            <p className="text-sm text-gray-500 mt-2">
                <span className="text-teleport-cyan font-bold">ln</span> = Link, <span className="text-teleport-cyan font-bold">-s</span> = Symbolic.
            </p>
        </div>

        <div className="mt-4 max-w-xl mx-auto">
            <ZoomableImage src="/apache_simbolic.jpg" alt="Explicación visual de Enlaces Simbólicos" />
        </div>
    </div>
);

const CommandsStep = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-saiyan-orange">Comandos de Control</h3>
        <p className="text-gray-300">
            Herramientas esenciales para gestionar tus sitios.
        </p>

        <div className="space-y-4">
            <CommandCard
                cmd="sudo a2ensite <nombre-sitio>"
                desc="Activa un sitio web (Apache2 ENable SITE). Crea un enlace simbólico en sites-enabled."
            />
            <CommandCard
                cmd="sudo a2dissite <nombre-sitio>"
                desc="Desactiva un sitio web (Apache2 DISable SITE). Rompe el enlace simbólico."
            />
            <CommandCard
                cmd="sudo systemctl reload apache2"
                desc="Recarga la configuración sin detener el servidor. Úsablog tras activar/desactivar sitios."
                color="text-green-400"
            />
        </div>
    </div>
);

const PracticeStep = () => (
    <div className="space-y-6">
        <h3 className="text-3xl font-bold text-saiyan-orange">Práctica: Tu Primera Web</h3>
        <p className="text-lg text-gray-300">
            Vamos a reemplazar la página por defecto con tu propio HTML.
        </p>

        <div className="space-y-6">
            <div className="bg-space-black p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-[40px] rounded-full"></div>
                <h4 className="font-bold text-xl mb-4 text-purple-300">1. Crear el HTML</h4>
                <p className="text-gray-400 mb-3">Crea un archivo <code className="text-white">index.html</code> en <code className="text-white">/var/www/html/</code>:</p>
                <CodeBlock language="html">
                    {`<!DOCTYPE html>
<html>
<head>
    <title>Dojo DevOps</title>
</head>
<body>
    <h1>¡Hola Mundo desde Apache!</h1>
    <p>Soy un Saiyan del Backend.</p>
</body>
</html>`}
                </CodeBlock>
            </div>

            <div className="bg-space-black p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 blur-[40px] rounded-full"></div>
                <h4 className="font-bold text-xl mb-4 text-green-300">2. Verificar</h4>
                <p className="text-gray-400 mb-2">Visita <code className="text-white">http://localhost</code> en tu navegador.</p>
                <p className="text-sm text-gray-500 italic">Si ves tu mensaje, ¡felicidades! Has desplegado tu primera web estática.</p>
            </div>
        </div>
    </div>
);

/* --- Helper Components --- */

const SummaryStep = () => (
    <div className="space-y-8 text-center">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block p-6 rounded-full bg-green-500/20 mb-4"
        >
            <CheckCircle size={64} className="text-green-400" />
        </motion.div>

        <h2 className="text-4xl font-bold text-white">¡Módulo Completado!</h2>
        <p className="text-xl text-gray-300">
            Has dado tus primeros pasos en el mundo de los Servidores Web.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div className="bg-space-black p-5 rounded-xl border border-white/10 hover:border-saiyan-orange/50 transition-colors">
                <h4 className="font-bold text-saiyan-orange mb-3 flex items-center gap-2">
                    <Server size={20} /> Conceptos Clave
                </h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• <strong>Apache</strong>: El servidor web robusto y open source.</li>
                    <li>• <strong>sites-available</strong>: Donde se guardan las configs.</li>
                    <li>• <strong>sites-enabled</strong>: Donde se activan (symlinks).</li>
                    <li>• <strong>www-data</strong>: El usuario seguro de Apache.</li>
                </ul>
            </div>

            <div className="bg-space-black p-5 rounded-xl border border-white/10 hover:border-teleport-cyan/50 transition-colors">
                <h4 className="font-bold text-teleport-cyan mb-3 flex items-center gap-2">
                    <Play size={20} /> Comandos Vitales
                </h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• <code className="text-white">apt-get install apache2</code>: Instalar.</li>
                    <li>• <code className="text-white">a2ensite / a2dissite</code>: Activar/Desactivar webs.</li>
                    <li>• <code className="text-white">systemctl reload apache2</code>: Aplicar cambios.</li>
                    <li>• <code className="text-white">chown -R www-data</code>: Asignar dueño.</li>
                </ul>
            </div>
        </div>

        <div className="pt-8">
            <LinkIcon className="inline-block text-gray-500 mb-2" />
            <p className="text-gray-500 text-sm">
                ¡Estás listo para configuraciones avanzadas en la siguiente lección!
            </p>
        </div>
    </div>
);

const InfoCard = ({ icon, title, description }) => (
    <div className="bg-white/5 p-4 rounded-lg flex items-start gap-4">
        <div className="p-2 bg-black/20 rounded-lg">{icon}</div>
        <div>
            <h4 className="font-bold text-white mb-1">{title}</h4>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    </div>
);

const CodeBlock = ({ children, language = 'bash' }) => (
    <div className="bg-black/50 p-4 rounded-lg border border-white/10 font-mono text-sm overflow-x-auto relative group">
        <div className="absolute top-2 right-2 text-xs text-gray-600 uppercase">{language}</div>
        <pre><code className="text-teleport-cyan">{children}</code></pre>
    </div>
);

const CommandCard = ({ cmd, desc, color = "text-teleport-cyan" }) => (
    <div className="group bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/20 transition-all">
        <code className={`block text-lg font-bold mb-2 ${color}`}>{cmd}</code>
        <p className="text-gray-400 text-sm">{desc}</p>
    </div>
);

export default ApacheBasicClass;
