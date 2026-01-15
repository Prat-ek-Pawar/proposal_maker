
import { useEffect } from 'react';
import Lenis from 'lenis';
import { Shell } from './components/layout/Shell';
import 'lenis/dist/lenis.css'; // Optional: if Lenis includes css, though often it's JS only. Actually recent Lenis suggests `import 'lenis/dist/lenis.css'` for basic styles if needed, but often manual CSS is used 'html.lenis { height: auto }'. I'll stick to JS init first, as css might not be in the package depending on version. The prompt said "use lenis". I'll use the stanard JS setup.

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <Shell />;
}

export default App;