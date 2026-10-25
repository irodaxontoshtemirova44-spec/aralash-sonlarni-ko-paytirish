import confetti from 'canvas-confetti';

export function fireSuccessConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
    });
  } catch {
    // fallback if canvas not available
  }
}

export function fireGrandCelebration() {
  try {
    const end = Date.now() + 2 * 1000;
    const colors = ['#22c55e', '#3b82f6', '#eab308', '#f43f5e', '#a855f7'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // fallback
  }
}
