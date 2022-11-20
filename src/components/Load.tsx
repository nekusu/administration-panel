import { AnimatePresence, motion, MotionStyle } from 'framer-motion';
import { ReactNode } from 'react';
import { Loader } from '@mantine/core';

interface LoadProps {
  children: ReactNode;
  in: boolean;
  style?: MotionStyle;
}

export default function Load(props: LoadProps) {
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <AnimatePresence mode="wait">
      {props.in ? (
        <motion.div
          key="children"
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {props.children}
        </motion.div>
      ) : (
        <motion.div
          key="loading"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            ...props.style,
          }}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <Loader />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
