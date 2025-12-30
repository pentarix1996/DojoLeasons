import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ZoomableImage = ({ src, alt, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.div
                className={`relative overflow-hidden rounded-xl border border-white/10 ${className}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
            >
                <motion.img
                    src={src}
                    alt={alt}
                    onClick={() => setIsOpen(true)}
                    className="w-full h-auto cursor-zoom-in object-cover"
                    layoutId={`image-${src}`}
                />
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
                    >
                        <button
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-[110]"
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={32} />
                        </button>
                        <motion.img
                            src={src}
                            alt={alt}
                            layoutId={`image-${src}`}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl bg-black"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ZoomableImage;
