import React, { useState } from 'react';
import ProgressFlow from '../components/ProgressFlow';
import { motion } from 'framer-motion';
import { Server, Settings, FileCode, Play, Folder, Globe, Layers, Shield, Hash } from 'lucide-react';
import ZoomableImage from '../components/ZoomableImage';

const ApacheConfigClass = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { title: "Intro: Virtual Hosts", id: "intro" },
        { title: "Anatomía de .conf", id: "anatomy" },
        { title: "Escenario Multi-Sitio", id: "scenario" },
        { title: "1. Preparación", id: "prep" },
        { title: "2. Configuración", id: "config" },
        { title: "3. Despliegue", id: "deploy" },
        { title: "4. Estrategia: Puertos", id: "ports" },
        { title: "5. Estrategia: Dominios", id: "domains" },
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
            title="Módulo 2: Apache Config"
        >
            {currentStep === 0 && <IntroStep />}
            {currentStep === 1 && <AnatomyStep />}
            {currentStep === 2 && <ScenarioStep />}
            {currentStep === 3 && <PrepStep />}
            {currentStep === 4 && <ConfigStep />}
            {currentStep === 5 && <DeployStep />}
            {currentStep === 6 && <PortsStep />}
            {currentStep === 7 && <DomainsStep />}
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
            <div className="absolute inset-0 bg-green-500 blur-[60px] opacity-20"></div>
            <Settings size={80} className="text-green-400 relative z-10 mx-auto mb-4 animate-spin-slow" />
        </div>

        <h2 className="text-4xl font-bold">Maestro de la Configuración</h2>

        <div className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto space-y-6">
            <p>
                ¿Un servidor para una sola web? ¡Desperdicio!
                <br />
                Apache puede servir <strong>docenas de sitios web diferentes</strong> desde una única máquina usando
                <span className="text-teleport-cyan font-bold mx-1">Virtual Hosts</span>.
            </p>

            <div className="max-w-2xl mx-auto">
                <ZoomableImage src="/apache_conf.jpg" alt="Apache Virtual Hosts Diagram" />
            </div>

            <div className="bg-white/5 p-6 rounded-xl border-l-4 border-green-500 text-left">
                <p className="italic">
                    "Configurar Apache es como dirigir el tráfico. Tú decides qué carpeta (web) se muestra según el dominio que escriba el usuario."
                </p>
            </div>
        </div>
    </motion.div>
);

const AnatomyStep = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-green-400">Anatomía de 000-default.conf</h3>
        <p className="text-gray-300">
            Este es el ADN de un sitio web en Apache. Analicemos el archivo por defecto:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-sm overflow-x-auto">
                <div className="text-gray-500 mb-2"># /etc/apache2/sites-available/000-default.conf</div>
                <pre className="text-gray-300">
                    {`<VirtualHost *:80>
`}
                    <span className="text-green-500">    #ServerName www.example.com</span>
                    {`

    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html

    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined

</VirtualHost>`}
                </pre>
            </div>

            <div className="space-y-4">
                <InfoCard
                    title="<VirtualHost *:80>"
                    desc="Indica que esta configuración escucha en el puerto 80 (HTTP estándar) de cualquier IP (*)."
                    color="text-purple-400"
                />
                <InfoCard
                    title="DocumentRoot"
                    desc="La carpeta donde están los archivos HTML de este sitio."
                    color="text-yellow-400"
                />
                <InfoCard
                    title="ServerName"
                    desc="[Opcional] en Apache2 define el nombre de dominio principal para un Virtual Host (sitio web) específico, permitiendo que Apache sirva el contenido correcto cuando varias webs (o sitios) residen en el mismo servidor, identificando a cuál debe responder según el nombre solicitado por el navegador en la petición HTTP/HTTPS"
                    color="text-blue-400"
                />
            </div>
        </div>

        <div className="mt-4 bg-white/5 p-3 rounded-lg border-l-2 border-green-500">
            <p className="text-sm text-gray-400">
                <span className="text-green-400 font-bold">#</span> : En los archivos de configuración, cualquier línea que empieza por almohadilla es un <strong>comentario</strong>. Apache la ignora. Se usa para desactivar opciones o dejar notas.
            </p>
        </div>
    </div>
);

const ScenarioStep = () => (
    <div className="space-y-6 text-center">
        <h3 className="text-3xl font-bold text-white">Misión: Servidor Multi-Sitio</h3>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Vamos a configurar tu servidor para que aloje dos páginas web completamente distintas al mismo tiempo.
        </p>

        <div className="flex justify-center gap-12 mt-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-blue-500/30 w-64 hover:scale-105 transition-transform">
                <Globe className="text-blue-400 mx-auto mb-4" size={48} />
                <h4 className="text-xl font-bold text-blue-300">Web 1</h4>
                <code className="block bg-black/30 rounded mt-2 p-1 text-sm text-gray-400">/var/www/web1</code>
            </div>

            <div className="flex items-center">
                <Layers className="text-gray-600" size={32} />
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-red-500/30 w-64 hover:scale-105 transition-transform">
                <Globe className="text-red-400 mx-auto mb-4" size={48} />
                <h4 className="text-xl font-bold text-red-300">Web 2</h4>
                <code className="block bg-black/30 rounded mt-2 p-1 text-sm text-gray-400">/var/www/web2</code>
            </div>
        </div>
    </div>
);

const PrepStep = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-teleport-cyan">Paso 1: Preparar el Terreno</h3>

        <div className="space-y-6">
            <div className="bg-space-black p-5 rounded-xl border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Folder size={18} className="text-yellow-500" /> Crear directorios
                </h4>
                <CodeBlock>sudo mkdir -p /var/www/web1</CodeBlock>
                <CodeBlock>sudo mkdir -p /var/www/web2</CodeBlock>
            </div>

            <div className="bg-space-black p-5 rounded-xl border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <FileCode size={18} className="text-blue-400" /> Crear contenido (index.html)
                </h4>
                <p className="text-sm text-gray-400 mb-2">Crea un archivo index.html diferente dentro de cada carpeta para distinguirlas.</p>
                <CodeBlock>echo "&lt;h1&gt;Bienvenido a Web 1&lt;/h1&gt;" &gt; /var/www/web1/index.html</CodeBlock>
                <CodeBlock>echo "&lt;h1&gt;Bienvenido a Web 2&lt;/h1&gt;" &gt; /var/www/web2/index.html</CodeBlock>
            </div>

            <div className="bg-red-900/20 p-5 rounded-xl border border-red-500/50">
                <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                    <Shield size={18} /> ¡CRÍTICO! Permisos
                </h4>
                <p className="text-sm text-gray-300 mb-3">
                    Apache necesita ser el "dueño" de estas carpetas para poder leerlas.
                </p>
                <CodeBlock>sudo chown -R www-data:www-data /var/www/web1</CodeBlock>
                <CodeBlock>sudo chown -R www-data:www-data /var/www/web2</CodeBlock>
            </div>
        </div>
    </div>
);

const ConfigStep = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-teleport-cyan">Paso 2: Crear Configuraciones</h3>
        <p className="text-gray-300">
            Ahora debemos decirle a Apache dónde están estos sitios. Crearemos dos archivos en <code className="text-purple-300">/etc/apache2/sites-available/</code>.
        </p>

        <div className="grid gap-6">
            <ConfigCard
                filename="web1.conf"
                path="/var/www/web1"
                color="blue"
            />
            <ConfigCard
                filename="web2.conf"
                path="/var/www/web2"
                color="red"
            />
        </div>

        <p className="text-sm text-gray-500 italic mt-2">
            * Nota: En un entorno real, añadirías <code className="text-white">ServerName web1.com</code> dentro de cada bloque VirtualHost.
            Por ahora, usaremos puertos diferentes (ej: 8081 y 8082) en la siguiente lección avanzada. De momento, vamos a habilitarlos y ver qué pasa.
        </p>
    </div>
);

const DeployStep = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-green-400">Paso 3: ¡Despliegue!</h3>

        <div className="bg-space-black p-6 rounded-xl border border-white/10 space-y-4">
            <div>
                <p className="text-gray-400 mb-1">1. Habilitar los sitios (crear symlinks):</p>
                <CodeBlock>sudo a2ensite web1.conf</CodeBlock>
                <CodeBlock>sudo a2ensite web2.conf</CodeBlock>
            </div>

            <div>
                <p className="text-gray-400 mb-1">2. Deshabilitar el default (opcional, para evitar conflictos):</p>
                <CodeBlock>sudo a2dissite 000-default.conf</CodeBlock>
            </div>

            <div className="pt-4 border-t border-white/10">
                <p className="text-green-400 font-bold mb-1">3. Aplicar cambios:</p>
                <CodeBlock>sudo systemctl reload apache2</CodeBlock>
            </div>
        </div>

        <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30 flex items-start gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg shrink-0">
                <Play className="text-yellow-400" size={20} />
            </div>
            <div>
                <h4 className="font-bold text-yellow-300">Reto</h4>
                <p className="text-sm text-gray-400">
                    Si habilitas ambos sitios en el puerto 80 sin especificar un <code className="text-white">ServerName</code>, Apache se "liará" y mostrará el primero que encuentre alfabéticamente.
                    <br />¡Esa será nuestra siguiente misión! Aprender a separar tráficos por Dominio o por Puerto.
                </p>
            </div>
        </div>
    </div>
);

/* --- Helper Components --- */

const PortsStep = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-teleport-cyan">Estrategia 1: Diferentes Puertos</h3>
        <p className="text-gray-300">
            Si no tienes dominios reales, puedes usar puertos distintos.
            Ejemplo: <code className="text-white">Web1 en puerto 80</code> y <code className="text-white">Web2 en puerto 8080</code>.
        </p>

        <div className="grid gap-6">
            <div className="bg-space-black p-5 rounded-xl border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Hash size={18} className="text-orange-500" /> 1. Abrir el puerto (ports.conf)
                </h4>
                <p className="text-sm text-gray-400 mb-2">
                    Apache solo "escucha" donde le digas. Edita <code className="text-white">/etc/apache2/ports.conf</code>:
                </p>
                <CodeBlock>Listen 80
                    Listen 8080</CodeBlock>
            </div>

            <div className="bg-space-black p-5 rounded-xl border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Settings size={18} className="text-red-400" /> 2. Modificar VirtualHost (web2.conf)
                </h4>
                <p className="text-sm text-gray-400 mb-2">
                    Cambia la cabecera del archivo de configuración de Web 2:
                </p>
                <pre className="bg-black/50 p-3 rounded border border-red-500/30 font-mono text-sm text-gray-300">
                    {`<VirtualHost *:8080>
    DocumentRoot /var/www/web2
    
    # ... resto de configuración ...
</VirtualHost>`}
                </pre>
            </div>

            <div className="bg-blue-900/20 p-4 rounded-lg flex items-center gap-4 border border-blue-500/30">
                <div className="p-2 bg-blue-500/20 rounded-full"><Globe className="text-blue-400" /></div>
                <div>
                    <h5 className="font-bold text-blue-300">Resultado:</h5>
                    <ul className="text-sm text-gray-300">
                        <li>http://localhost <span className="text-gray-500">→ Web 1</span></li>
                        <li>http://localhost:8080 <span className="text-gray-500">→ Web 2</span></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

const DomainsStep = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-teleport-cyan">Estrategia 2: ServerName (Dominios)</h3>
        <p className="text-gray-300">
            La forma profesional. Ambos usan el puerto 80, pero Apache distingue a quién llamar por el <strong>nombre</strong> que escribes en el navegador.
        </p>

        <div className="space-y-4">
            <div className="bg-space-black p-5 rounded-xl border border-white/10">
                <h4 className="font-bold text-white mb-2">1. Configurar ServerName</h4>
                <p className="text-sm text-gray-400 mb-3">Añade la directiva a cada archivo .conf:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/30 p-3 rounded border-l-2 border-blue-500">
                        <span className="text-xs text-blue-400 font-bold block mb-1">web1.conf</span>
                        <code className="text-xs text-green-400">ServerName web1.local</code>
                    </div>
                    <div className="bg-black/30 p-3 rounded border-l-2 border-red-500">
                        <span className="text-xs text-red-400 font-bold block mb-1">web2.conf</span>
                        <code className="text-xs text-green-400">ServerName web2.local</code>
                    </div>
                </div>
            </div>

            <div className="bg-space-black p-5 rounded-xl border border-white/10">
                <h4 className="font-bold text-white mb-2">2. El "Truco" del archivo hosts</h4>
                <p className="text-sm text-gray-400 mb-2">
                    Como no tenemos dominios reales, engañaremos a tu ordenador para que crea que <code className="text-white">web1.local</code> es tu propia máquina.
                </p>
                <p className="text-sm text-gray-500 mb-2">Edita <code className="text-white">/etc/hosts</code> (en Windows: C:\Windows\System32\drivers\etc\hosts):</p>
                <CodeBlock>127.0.0.1  localhost web1.local web2.local</CodeBlock>
            </div>
        </div>

        <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30 text-center">
            <h4 className="text-2xl font-bold text-green-400 mb-2">¡Misión Cumplida!</h4>
            <p className="text-gray-300">
                Has configurado un servidor Web profesional.
            </p>
            <div className="flex justify-center gap-4 mt-4">
                <span className="px-3 py-1 bg-green-500/20 rounded text-green-300 border border-green-500/30">http://web1.local</span>
                <span className="px-3 py-1 bg-green-500/20 rounded text-green-300 border border-green-500/30">http://web2.local</span>
            </div>
        </div>
    </div>
);

/* --- Helper Components --- */

const InfoCard = ({ title, desc, color }) => (
    <div className="bg-white/5 p-3 rounded-lg border-l-2 border-white/20">
        <code className={`block font-bold mb-1 ${color}`}>{title}</code>
        <p className="text-xs text-gray-400">{desc}</p>
    </div>
);

const CodeBlock = ({ children }) => (
    <div className="bg-black/50 p-3 rounded border border-white/10 font-mono text-sm text-teleport-cyan mb-2 overflow-x-auto">
        {children}
    </div>
);

const ConfigCard = ({ filename, path, color }) => (
    <div className={`bg-space-black p-4 rounded-xl border border-${color}-500/30 overflow-hidden relative`}>
        <div className={`absolute top-0 right-0 px-3 py-1 bg-${color}-500/20 text-${color}-400 text-xs font-bold rounded-bl-xl`}>
            {filename}
        </div>
        <pre className="text-gray-300 text-sm font-mono mt-4">
            {`<VirtualHost *:80>
    DocumentRoot ${path}
    ServerAdmin webmaster@localhost

    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>`}
        </pre>
    </div>
);

export default ApacheConfigClass;
