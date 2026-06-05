import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ width, height, borderRadius = '8px', style }) => {
    return (
        <motion.div
            animate={{
                opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            style={{
                width: width || '100%',
                height: height || '20px',
                backgroundColor: 'var(--glass)',
                borderRadius,
                ...style
            }}
        />
    );
};

export default Skeleton;
