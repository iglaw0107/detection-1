import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

/* =========================
   THREE BACKGROUND
========================= */
function ThreeBackground() {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 30);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.BoxGeometry(4, 8, 4);
    const edgesGeo = new THREE.EdgesGeometry(geometry);

    const cubes = [];

    for (let i = 0; i < 35; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.72, 0.6, 0.05),
        transparent: true,
        opacity: 0.6,
      });

      const cube = new THREE.Mesh(geometry, material);

      const edges = new THREE.LineSegments(
        edgesGeo,
        new THREE.LineBasicMaterial({ color: 0x8b5cf6, opacity: 0.3, transparent: true })
      );

      cube.add(edges);
      cube.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20
      );

      cube.userData = {
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.003,
          y: (Math.random() - 0.5) * 0.003,
        },
      };

      group.add(cube);
      cubes.push(cube);
    }

    const animate = () => {
      requestAnimationFrame(animate);

      group.rotation.x += (mouseRef.current.y * 0.1 - group.rotation.x) * 0.05;
      group.rotation.y += (mouseRef.current.x * 0.1 - group.rotation.y) * 0.05;

      cubes.forEach((cube) => {
        cube.rotation.x += cube.userData.rotSpeed.x;
        cube.rotation.y += cube.userData.rotSpeed.y;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}

/* =========================
   NAVBAR
========================= */
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigation = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    navigation('/login')
  }

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 ${
        isScrolled ? "bg-black/70 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="flex justify-between p-4 max-w-6xl mx-auto">
        <h1 className="text-white font-bold">CRIMEAI</h1>
        <button className="bg-purple-600 px-4 py-2 rounded" onClick={handleClick}>Sign In</button>
      </div>
    </motion.nav>
  );
}

/* =========================
   HERO
========================= */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center">
      <ThreeBackground />

      <div className="z-10">
        <h1 className="text-5xl font-bold">
          Detect Crime with <br />
          <span className="text-purple-400">AI Precision</span>
        </h1>

        <p className="mt-4 text-gray-400">
          Build AI crime detection systems in minutes
        </p>
      </div>
    </section>
  );
}

/* =========================
   MAIN PAGE
========================= */
export default function CrimeAI() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <HeroSection />
    </div>
  );
}