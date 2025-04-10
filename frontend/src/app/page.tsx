'use client';
import * as motion from 'motion/react-client';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>

      <motion.div
        style={{
          width: 100,
          height: 100,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 },
        }}
      >
        <Button>Haz clic</Button>
      </motion.div>
    </div>
  );
}
