import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.BoxGeometry(4, 8, 4);
    const edgesGeo = new THREE.EdgesGeometry(geometry);
    const cubes = [];

    for (let i = 0; i < 40; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.72 + Math.random() * 0.08, 0.6, 0.03 + Math.random() * 0.05),
        transparent: true,
        opacity: 0.5 + Math.random() * 0.5,
      });

      const cube = new THREE.Mesh(geometry, material);
      const edges = new THREE.LineSegments(edgesGeo, new THREE.LineBasicMaterial({
        color: new THREE.Color().setHSL(0.72 + Math.random() * 0.1, 0.7, 0.15 + Math.random() * 0.15),
        transparent: true,
        opacity: 0.2 + Math.random() * 0.3,
      }));

      cube.add(edges);
      cube.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 5
      );
      cube.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      cube.scale.setScalar(0.3 + Math.random() * 1.2);

      cube.userData = {
        rotSpeed: { x: (Math.random() - 0.5) * 0.003, y: (Math.random() - 0.5) * 0.003 },
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.3 + Math.random() * 0.5,
        originalY: cube.position.y,
      };

      group.add(cube);
      cubes.push(cube);
    }

    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 250;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 60;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 30 - 10;
    }
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particlesGeo, new THREE.PointsMaterial({
      color: 0x8B5CF6,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    }));
    group.add(particles);

    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    let animFrame;
    const animate = (time) => {
      animFrame = requestAnimationFrame(animate);
      const t = time * 0.001;
      group.rotation.x += (mouseRef.current.y * 0.15 - group.rotation.x) * 0.02;
      group.rotation.y += (mouseRef.current.x * 0.15 - group.rotation.y) * 0.02;

      cubes.forEach((cube) => {
        cube.rotation.x += cube.userData.rotSpeed.x;
        cube.rotation.y += cube.userData.rotSpeed.y;
        cube.position.y = cube.userData.originalY +
          Math.sin(t * cube.userData.floatSpeed + cube.userData.floatOffset) * 0.8;
      });

      particles.rotation.y = t * 0.01;
      particles.rotation.x = t * 0.005;
      renderer.render(scene, camera);
    };
    animate(0);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrame);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}