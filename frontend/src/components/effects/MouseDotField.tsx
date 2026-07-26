import { useEffect, useRef } from "react";

interface Dot {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  depth: number;
  color: string;
}

const COLORS = [
  "168, 85, 247",
  "59, 130, 246",
  "236, 72, 153",
  "20, 184, 166",
  "249, 115, 22",
];

export default function MouseDotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const context = canvasEl?.getContext("2d");
    if (!canvasEl || !context) return;

    // Aliases com tipo não-nulo: dentro dos closures abaixo (resize/render)
    // o TS não consegue provar que canvasEl/context continuam não-nulos.
    const canvas = canvasEl;
    const ctx = context;

    const spacing = 56;
    const shiftRange = 30;
    const proximityRadius = 150;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dots: Dot[] = [];

    const mouse = { x: width / 2, y: height / 2 };
    const smoothMouse = { x: width / 2, y: height / 2 };

    function buildGrid() {
      dots = [];
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const baseX = i * spacing;
          const baseY = j * spacing;
          dots.push({
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            depth: 0.3 + Math.random() * 0.7,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          });
        }
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    }

    function onMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    let rafId: number;
    function render() {
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.06;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.06;

      const cx = width / 2;
      const cy = height / 2;
      const nx = (smoothMouse.x - cx) / cx;
      const ny = (smoothMouse.y - cy) / cy;

      ctx.clearRect(0, 0, width, height);

      for (const dot of dots) {
        dot.x = dot.baseX + nx * shiftRange * dot.depth;
        dot.y = dot.baseY + ny * shiftRange * dot.depth;

        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / proximityRadius);

        const size = 1 + dot.depth * 1.1 + proximity * 2.4;
        const opacity = 0.1 + dot.depth * 0.14 + proximity * 0.55;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dot.color}, ${opacity})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-[5] pointer-events-none"
      aria-hidden="true"
    />
  );
}
