import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressFlow from '../components/ProgressFlow';
import { motion } from 'framer-motion';
import { Terminal, Folder, FileText, Trash, Move, Shield, User, Volume2, Lock, Settings, Link as LinkIcon, Search, Scissors, CheckCircle } from 'lucide-react';

const BashBasicClass = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { title: "Intro: La Terminal", id: "intro" },
        { title: "cd: Navegación", id: "cd" },
        { title: "ls: Listar", id: "ls" },
        { title: "cat: Leer", id: "cat" },
        { title: "touch: Crear Archivo", id: "touch" },
        { title: "mkdir: Crear Carpeta", id: "mkdir" },
        { title: "rm: Borrar", id: "rm" },
        { title: "mv: Mover", id: "mv" },
        { title: "sudo: Superpoderes", id: "sudo" },
        { title: "whoami: Identidad", id: "whoami" },
        { title: "echo: Gritar", id: "echo" },
        { title: "chmod: Permisos", id: "chmod" },
        { title: "chown: Dueño", id: "chown" },
        { title: "systemctl: Control", id: "systemctl" },
        { title: "ln -s: Atajos", id: "ln" },
        { title: "grep: Buscar", id: "grep" },
        { title: "cut: Cortar", id: "cut" },
        { title: "Resumen", id: "summary" },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
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
            title="Módulo Bash: Comandos Básicos"
        >
            {currentStep === 0 && <IntroStep />}
            {currentStep === 1 && <CdStep />}
            {currentStep === 2 && <LsStep />}
            {currentStep === 3 && <CatStep />}
            {currentStep === 4 && <TouchStep />}
            {currentStep === 5 && <MkdirStep />}
            {currentStep === 6 && <RmStep />}
            {currentStep === 7 && <MvStep />}
            {currentStep === 8 && <SudoStep />}
            {currentStep === 9 && <WhoamiStep />}
            {currentStep === 10 && <EchoStep />}
            {currentStep === 11 && <ChmodStep />}
            {currentStep === 12 && <ChownStep />}
            {currentStep === 13 && <SystemctlStep />}
            {currentStep === 14 && <LnStep />}
            {currentStep === 15 && <GrepStep />}
            {currentStep === 16 && <CutStep />}
            {currentStep === 17 && <SummaryStep />}
        </ProgressFlow>
    );
};

const CommandCard = ({ command, description, example, expectedOutput, icon }) => (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-teleport-cyan/30 transition-colors space-y-4">
        <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-teleport-cyan/10 rounded-lg text-teleport-cyan">
                {icon || <Terminal size={24} />}
            </div>
            <h3 className="text-2xl font-bold text-white font-mono">{command}</h3>
        </div>
        <p className="text-gray-300 text-lg leading-relaxed">
            {description}
        </p>
        <div className="bg-black/50 rounded-lg border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Ejemplo:</p>
                <code className="block font-mono text-green-400 text-lg">
                    <span className="text-yellow-500">$</span> {example}
                </code>
            </div>
            {expectedOutput && (
                <div className="p-4 bg-white/5">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold flex items-center gap-2">
                        <Terminal size={12} /> Resultado:
                    </p>
                    <code className="block font-mono text-gray-300 text-sm whitespace-pre-wrap">
                        {expectedOutput}
                    </code>
                </div>
            )}
        </div>
    </div>
);

const IntroStep = () => (
    <div className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="inline-block p-4 bg-teleport-cyan/10 rounded-full mb-4 ring-1 ring-teleport-cyan/50">
            <Terminal size={64} className="text-teleport-cyan" />
        </div>
        <h2 className="text-4xl font-bold text-white">Bienvenido a la Terminal</h2>

        <div className="text-left space-y-6 text-lg text-gray-300 bg-white/5 p-8 rounded-2xl border border-white/10">
            <p>
                <strong>Bash</strong> (Born Again SHell) es el intérprete de comandos por defecto en la mayoría de sistemas Linux.
                Es el lenguaje que usas para hablar directamente con el sistema operativo, sin intermediarios gráficos.
            </p>
            <p>
                Al abrir la terminal, verás algo como esto:
            </p>
            <div className="bg-black p-4 rounded-lg font-mono border-l-4 border-teleport-cyan">
                <span className="text-green-400">usuario@hoost</span>:<span className="text-blue-400">~</span>$ <span className="animate-pulse">_</span>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-base">
                <li><span className="text-green-400 font-mono">usuario</span>: Tu nombre de usuario actual.</li>
                <li><span className="text-green-400 font-mono">host</span>: El nombre de la máquina.</li>
                <li><span className="text-blue-400 font-mono">~</span>: Indica que estás en tu carpeta personal (Home).</li>
                <li><span className="text-white font-mono">$</span>: El símbolo del sistema (prompt), esperando tus órdenes.</li>
            </ul>
        </div>
    </div>
);

const CdStep = () => (
    <CommandCard
        command="cd"
        description="Change Directory. Sirve para moverte entre carpetas."
        example="cd /home/usuario/Documentos"
        expectedOutput={`(El prompt cambia)
usuario@host:~/Documentos$`}
        icon={<Folder />}
    />
);

const LsStep = () => (
    <div className="space-y-6">
        <CommandCard
            command="ls"
            description="List. Muestra qué archivos y carpetas hay donde estás."
            example="ls -l"
            icon={<FileText />}
        />
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded text-sm text-gray-300">
                <span className="font-bold text-teleport-cyan">-l</span> : Long (detalles)
            </div>
            <div className="bg-white/5 p-4 rounded text-sm text-gray-300">
                <span className="font-bold text-teleport-cyan">-a</span> : All (ocultos)
            </div>
            <div className="bg-white/5 p-4 rounded text-sm text-gray-300">
                <span className="font-bold text-teleport-cyan">-t</span> : Time (por fecha)
            </div>
            <div className="bg-white/5 p-4 rounded text-sm text-gray-300">
                <span className="font-bold text-teleport-cyan">-r</span> : Reverse
            </div>
        </div>
    </div>
);

const CatStep = () => (
    <CommandCard
        command="cat"
        description="Concatenate. Muestra el contenido de un archivo en pantalla."
        example="cat notas.txt"
        expectedOutput={`Comprar leche
Estudiar Bash
Hacer la cama`}
        icon={<FileText />}
    />
);

const TouchStep = () => (
    <CommandCard
        command="touch"
        description="Crea un archivo vacío o actualiza la fecha de uno existente."
        example="touch nuevo_archivo.txt"
        expectedOutput="(No muestra nada si todo va bien)"
        icon={<FileText />}
    />
);

const MkdirStep = () => (
    <CommandCard
        command="mkdir"
        description="Make Directory. Crea una nueva carpeta."
        example="mkdir Proyectos"
        expectedOutput="(No muestra nada, pero la carpeta se crea)"
        icon={<Folder />}
    />
);

const RmStep = () => (
    <div className="space-y-6">
        <CommandCard
            command="rm"
            description="Remove. Borra archivos. ¡Cuidado, no hay papelera!"
            example="rm archivo_viejo.txt"
            icon={<Trash />}
        />
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-red-200">
            <p><strong>Truco:</strong> Usa <span className="font-mono bg-red-500/20 px-1 rounded">rm -r carpeta/</span> para borrar carpetas enteras.</p>
        </div>
    </div>
);

const MvStep = () => (
    <CommandCard
        command="mv"
        description="Move. Sirve para mover archivos de sitio... ¡o para renombrarlos!"
        example="mv documento.txt documento_final.txt"
        expectedOutput="(Silencio absoluto si ha funcionado)"
        icon={<Move />}
    />
);

const SudoStep = () => (
    <CommandCard
        command="sudo"
        description="SuperUser DO. Ejecuta el comando como Administrador (root)."
        example="sudo apt update"
        expectedOutput={`[sudo] contraseña para usuario:
Hit:1 http://es.archive.ubuntu.com/ubuntu jammy InRelease...`}
        icon={<Shield />}
    />
);

const WhoamiStep = () => (
    <CommandCard
        command="whoami"
        description="Te dice con qué usuario estás logueado actualmente."
        example="whoami"
        expectedOutput="usuario"
        icon={<User />}
    />
);

const EchoStep = () => (
    <CommandCard
        command="echo"
        description="Imprime texto en la pantalla. Útil para scripts o crear archivos rápidos."
        example="echo 'Hola Mundo'"
        expectedOutput="Hola Mundo"
        icon={<Volume2 />}
    />
);

const ChmodStep = () => (
    <div className="space-y-6">
        <CommandCard
            command="chmod"
            description="Change Mode. Cambia los permisos de lectura, escritura y ejecución."
            example="chmod 777 script.sh"
            expectedOutput="(Silencio si el permiso se aplicó)"
            icon={<Lock />}
        />
        <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="font-bold text-teleport-cyan mb-2">Modo Letras (Simbólico)</h4>
                <div className="space-y-2 text-gray-300">
                    <p><code className="text-yellow-400">u/g/o/a</code> = Usuario / Grupo / Otros / All</p>
                    <p><code className="text-green-400">+ / -</code> = Añadir / Quitar</p>
                    <p><code className="text-blue-400">r / w / x</code> = Leer / Escribir / Ejecutar</p>
                    <div className="mt-2 bg-black/30 p-2 rounded">
                        <code>chmod u+x script.sh</code>
                        <span className="block text-xs text-gray-500">Da permiso de ejecución al dueño.</span>
                    </div>
                </div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="font-bold text-teleport-cyan mb-2">Modo Números (Octal)</h4>
                <div className="space-y-1 text-gray-300">
                    <p>4 = <span className="text-blue-400">R</span>ead (Leer)</p>
                    <p>2 = <span className="text-blue-400">W</span>rite (Escribir)</p>
                    <p>1 = e<span className="text-blue-400">X</span>ecute (Ejecutar)</p>
                    <div className="mt-2 bg-black/30 p-2 rounded">
                        <code>chmod 777 archivo</code>
                        <span className="block text-xs text-gray-500">7 (4+2+1) para Usuario, Grupo y Otros. ¡Permiso total!</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ChownStep = () => (
    <div className="space-y-6">
        <CommandCard
            command="chown"
            description="Change Owner. Cambia el dueño de un archivo o carpeta."
            example="sudo chown usuario:admin archivo.txt"
            expectedOutput="(Sin respuesta = Buen trabajo)"
            icon={<User />}
        />
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="font-bold text-teleport-cyan mb-2 flex items-center gap-2">
                <User size={16} /> Cambiar Dueño y Grupo
            </h4>
            <p className="text-gray-300 mb-2">
                Puedes cambiar solo el dueño, o el dueño y el grupo a la vez usando <code>:</code>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/30 p-3 rounded border-l-2 border-green-500">
                    <code className="text-green-400">chown pepe archivo</code>
                    <p className="text-xs text-gray-500 mt-1">Solo cambia el dueño a 'pepe'.</p>
                </div>
                <div className="bg-black/30 p-3 rounded border-l-2 border-purple-500">
                    <code className="text-purple-400">chown pepe:feos archivo</code>
                    <p className="text-xs text-gray-500 mt-1">Dueño 'pepe', Grupo 'feos'.</p>
                </div>
            </div>
        </div>
    </div>
);

const SystemctlStep = () => (
    <div className="space-y-6">
        <CommandCard
            command="systemctl"
            description="Controla servicios del sistema (arrancar, parar, reiniciar)."
            example="sudo systemctl status apache2"
            icon={<Settings />}
        />
        <div className="grid grid-cols-2 gap-2 text-sm">
            <code className="bg-black/30 p-2 rounded text-gray-300">start</code>
            <code className="bg-black/30 p-2 rounded text-gray-300">stop</code>
            <code className="bg-black/30 p-2 rounded text-gray-300">restart</code>
            <code className="bg-black/30 p-2 rounded text-gray-300">enable</code>
        </div>
    </div>
);

const LnStep = () => (
    <CommandCard
        command="ln -s"
        description="Link. Crea un acceso directo (enlace simbólico)."
        example="ln -s archivo_original.txt acceso_directo"
        expectedOutput="(Se crea el enlace sin mostrar nada)"
        icon={<LinkIcon />}
    />
);

const GrepStep = () => (
    <CommandCard
        command="grep"
        description="Busca texto DENTRO de archivos. Es el buscador definitivo."
        example="grep 'error' log.txt"
        expectedOutput={`2023-10-24 10:00:01 [error] Connection failed
2023-10-24 10:05:00 [error] Timeout`}
        icon={<Search />}
    />
);

const CutStep = () => (
    <CommandCard
        command="cut"
        description="Corta partes de cada línea de un archivo (columnas)."
        example="cut -d ',' -f 1 nombres.csv"
        expectedOutput={`Juan
Maria
Pedro`}
        icon={<Scissors />}
    />
);

const SummaryStep = () => (
    <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-teleport-cyan">¡Entrenamiento Básico Completado!</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto mt-8">
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> cd</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> ls</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> cat</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> touch</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> mkdir</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> rm</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> mv</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> sudo</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> whoami</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> echo</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> chmod</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> chown</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> systemctl</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> ln -s</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> grep</span>
            <span className="flex items-center gap-2 text-gray-400"><CheckCircle size={14} className="text-green-500" /> cut</span>
        </div>
        <Link to="/">
            <button className="mt-12 px-8 py-3 bg-teleport-cyan text-black font-bold rounded-full shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:scale-105 transition-transform">
                Volver al Dojo
            </button>
        </Link>
    </div>
);

export default BashBasicClass;
