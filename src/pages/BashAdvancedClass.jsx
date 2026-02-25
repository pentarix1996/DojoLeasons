import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressFlow from '../components/ProgressFlow';
import { motion } from 'framer-motion';
import { Terminal, ArrowRightLeft, ArrowRight, ArrowLeft, Filter, Scissors, CheckCircle } from 'lucide-react';

const BashAdvancedClass = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { title: "Intro: Flujos", id: "intro" },
        { title: "Pipes: Tuberías (|)", id: "pipes" },
        { title: "Redirect Output (>)", id: "redirect-out" },
        { title: "Redirect Input (<)", id: "redirect-in" },
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
            title="Módulo Bash: Comandos Avanzados"
        >
            {currentStep === 0 && <IntroStep />}
            {currentStep === 1 && <PipesStep />}
            {currentStep === 2 && <RedirectOutStep />}
            {currentStep === 3 && <RedirectInStep />}
            {currentStep === 4 && <SummaryStep />}
        </ProgressFlow>
    );
};

const CommandBlock = ({ title, command, explanation }) => (
    <div className="bg-black/40 rounded-lg p-4 mb-4 border border-white/5">
        <h4 className="font-bold text-teleport-cyan mb-2">{title}</h4>
        <code className="block bg-black p-3 rounded text-green-400 font-mono mb-2 shadow-inner">
            {command}
        </code>
        <p className="text-gray-400 text-sm italic">{explanation}</p>
    </div>
);

const IntroStep = () => (
    <div className="text-center space-y-8">
        <div className="inline-block p-4 bg-purple-500/20 rounded-full mb-4">
            <ArrowRightLeft size={64} className="text-purple-400" />
        </div>
        <h2 className="text-4xl font-bold text-white">Domina los Flujos</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            En Linux, la magia real ocurre cuando conectas comandos entre sí.
            La salida de uno se convierte en la entrada del siguiente.
        </p>
    </div>
);

const PipesStep = () => (
    <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
            <Filter className="text-teleport-cyan" size={32} />
            <h3 className="text-2xl font-bold text-white">El Pipe (|)</h3>
        </div>
        <p className="text-gray-300">
            El símbolo <code>|</code> conecta comandos. Es como una tubería: lo que sale de un comando entra en el otro.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
            <CommandBlock
                title="Leer y Filtrar"
                command="cat archivo.txt | grep 'error'"
                explanation="Lee el archivo y pasa el contenido a grep, que solo muestra las líneas con 'error'."
            />
            <CommandBlock
                title="Leer y Cortar"
                command="cat alumnos.csv | cut -d ',' -f 1"
                explanation="Lee el CSV y extrae solo la primera columna (nombres)."
            />
            <CommandBlock
                title="Cadena de Montaje"
                command="cat log.txt | grep 'ERROR' | cut -d ':' -f 2"
                explanation="Busca errores y luego corta para quedarse con el mensaje, descartando la fecha."
            />
            <CommandBlock
                title="Filtrar y Cortar"
                command="grep 'Juan' notas.csv | cut -d ',' -f 3"
                explanation="Busca a Juan en el archivo y luego extrae solo su nota (columna 3)."
            />
        </div>
    </div>
);

const RedirectOutStep = () => (
    <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
            <ArrowRight className="text-green-400" size={32} />
            <h3 className="text-2xl font-bold text-white">Redirección de Salida ({'>'})</h3>
        </div>
        <p className="text-gray-300">
            En lugar de mostrar el resultado en la pantalla, guárdalo en un archivo.
        </p>

        <div className="space-y-4">
            <div className="bg-white/5 p-6 rounded-xl border-l-4 border-green-500">
                <code className="block text-xl font-mono text-white mb-2">ls -l {'>'} lista_archivos.txt</code>
                <p className="text-gray-400">Todo lo que mostraría 'ls -l' se guarda dentro de 'lista_archivos.txt'.</p>
            </div>

            <div className="bg-white/5 p-6 rounded-xl border-l-4 border-yellow-500">
                <h4 className="font-bold text-yellow-500 mb-2">¡Cuidado con {'>'} vs {'>>'}!</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li><code>{'>'}</code> : <strong>Sobrescribe</strong> el archivo (borra lo anterior).</li>
                    <li><code>{'>>'}</code> : <strong>Añade</strong> al final del archivo (sin borrar nada).</li>
                </ul>
            </div>
        </div>
    </div>
);

const RedirectInStep = () => (
    <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
            <ArrowLeft className="text-blue-400" size={32} />
            <h3 className="text-2xl font-bold text-white">Redirección de Entrada ({'<'})</h3>
        </div>
        <p className="text-gray-300">
            Alimenta un comando con el contenido de un archivo, en lugar de escribirlo tú.
        </p>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <code className="block text-xl font-mono text-white mb-2">sort {'<'} nombres_desordenados.txt</code>
            <p className="text-gray-400 mt-2">
                El comando <code>sort</code> recibe el contenido del archivo y lo ordena alfabéticamente.
            </p>
        </div>
        <p className="text-sm text-gray-500 italic mt-4 text-center">
            Nota: Muchos comandos modernos aceptan el archivo como argumento directo (ej: <code>sort archivo.txt</code>),
            pero <code>{'<'}</code> es la forma clásica y universal de redirigir la entrada estándar.
        </p>
    </div>
);

const SummaryStep = () => (
    <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-teleport-cyan">¡Dominio del Flujo!</h2>
        <p className="text-xl text-gray-300">
            Ahora sabes conectar comandos como un fontanero digital.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mt-8">
            <div className="bg-black/30 p-4 rounded-lg border border-purple-500/30">
                <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                    <Filter size={18} /> Pipes (|)
                </h3>
                <p className="text-sm text-gray-400">Conecta la salida de un comando a la entrada de otro.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border border-green-500/30">
                <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                    <ArrowRight size={18} /> Output ({'>'})
                </h3>
                <p className="text-sm text-gray-400">Guarda resultados en archivos.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border border-blue-500/30">
                <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                    <ArrowLeft size={18} /> Input ({'<'})
                </h3>
                <p className="text-sm text-gray-400">Usa archivos como entrada.</p>
            </div>
        </div>

        <Link to="/">
            <button className="mt-12 px-8 py-3 bg-teleport-cyan text-black font-bold rounded-full shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:scale-105 transition-transform">
                Volver al Dojo
            </button>
        </Link>
    </div>
);

export default BashAdvancedClass;
