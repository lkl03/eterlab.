"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { ChevronDown } from "lucide-react";

import { COPY, type Lang } from "../lib/i18n";
import { MouseTrail } from "../components/ui/MouseTrail";

type Props = {
  lang: Lang;
};

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

/* -------------------------------------------------------------------------- */
/*  tiny shader background                                                     */
/* -------------------------------------------------------------------------- */

function GradientPlane() {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  useFrame(({ clock }) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Mostly white/off-white with very subtle tinting.
  const fragmentShader = `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;

    // simple value noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 uv = vUv;

      vec3 baseA = vec3(0.995, 0.997, 1.0);
      vec3 baseB = vec3(0.97, 0.975, 0.99);

      vec3 blue  = vec3(0.54, 0.71, 1.0);
      vec3 pink  = vec3(1.0, 0.74, 0.90);
      vec3 violet= vec3(0.72, 0.62, 1.0);

      vec3 col = mix(baseA, baseB, uv.y);

      float n1 = noise(uv * 2.3 + vec2(uTime * 0.04, uTime * 0.02));
      float n2 = noise(uv * 3.1 - vec2(uTime * 0.03, uTime * 0.05));
      float n3 = noise(uv * 1.6 + vec2(-uTime * 0.02, uTime * 0.03));

      col += blue  * (0.06 * n1);
      col += pink  * (0.05 * n2);
      col += violet* (0.035 * n3);

      // soft vignette
      float d = distance(uv, vec2(0.5));
      col *= 1.0 - smoothstep(0.55, 0.95, d) * 0.08;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial ref={materialRef} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  );
}

export default function VenceHero({ lang }: Props) {
  const c = COPY[lang];
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-paper"
    >
      {/* SEO-only heading */}
      <h1 className="sr-only">eterlab.</h1>

      {/* Soft ethereal background */}
      <div aria-hidden className="absolute inset-0 eter-gradient-bg" />

      {/* Subtle shader layer */}
      <Canvas className="pointer-events-none absolute inset-0 opacity-85" dpr={[1, 2]}>
        <OrthographicCamera makeDefault position={[0, 0, 2]} zoom={1} />
        <GradientPlane />
      </Canvas>

      {/* Mouse “trail / stela” */}
      <MouseTrail
        targetRef={sectionRef}
        className="pointer-events-none absolute inset-0"
        colors={["rgba(138,180,255,0.38)", "rgba(255,139,211,0.30)"]}
        max={52}
        radius={56}
      />

      <div className="relative mx-auto w-[min(1120px,calc(100%-2rem))]">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo placeholder (swap later for your real mark) */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mx-auto mb-8 grid place-items-center"
          >
            <div
              className="font-logo eter-bubble select-none font-medium tracking-tight text-ink"
              style={{ fontSize: "clamp(60px, 10vw, 120px)", lineHeight: "0.82em" }}
            >
              eterlab.
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.08 }}
            className="mx-auto max-w-2xl text-balance select-none text-sm font-light leading-relaxed text-ink/60 sm:text-base xl:text-lg"
          >
            <span className="text-ink/70">{c.hero.subtitle}</span>
          </motion.p>
        </div>

      </div>

      {/* Scroll cue (keeps hero content perfectly centered) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <button
          type="button"
          aria-label={c.hero.scrollAria}
          className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-ink/15 bg-paper/60 text-ink/70 backdrop-blur transition-colors duration-300 ease-in-out hover:bg-paper hover:text-ink"
          onClick={() => {
            const el = document.querySelector("#projects");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <ChevronDown className="h-5 w-5 eter-chevron" />
        </button>
      </motion.div>
    </section>
  );
}