import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';



function GlobeScene() {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Globe group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Sphere geometry for the globe
    const sphereGeo = new THREE.SphereGeometry(5, 64, 64);

    // Create procedural earth-like texture using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Ocean background
    ctx.fillStyle = '#0a0520';
    ctx.fillRect(0, 0, 2048, 1024);

    // Draw continent-like shapes
    const continents = [
      // North America
      [[300, 150], [400, 120], [500, 140], [550, 200], [520, 280], [480, 320], [420, 350], [350, 340], [300, 300], [280, 250]],
      // South America
      [[420, 400], [480, 380], [520, 420], [530, 500], [510, 580], [480, 650], [450, 700], [420, 680], [400, 600], [390, 500], [400, 440]],
      // Europe
      [[900, 140], [960, 120], [1020, 130], [1050, 160], [1040, 200], [1000, 230], [950, 240], [910, 220], [890, 190], [880, 160]],
      // Africa
      [[900, 300], [980, 280], [1050, 320], [1080, 400], [1070, 500], [1040, 580], [990, 640], [940, 660], [900, 620], [870, 540], [860, 440], [870, 360]],
      // Asia
      [[1050, 100], [1150, 80], [1250, 100], [1350, 120], [1450, 140], [1500, 200], [1480, 280], [1420, 320], [1350, 340], [1250, 330], [1180, 300], [1120, 260], [1080, 200], [1060, 150]],
      // India
      [[1180, 340], [1220, 320], [1260, 340], [1270, 400], [1250, 450], [1210, 460], [1180, 420], [1170, 370]],
      // Australia
      [[1400, 520], [1500, 500], [1580, 530], [1600, 580], [1560, 630], [1480, 640], [1420, 610], [1390, 570]],
      // Greenland
      [[550, 80], [620, 60], [680, 70], [700, 110], [680, 150], [620, 160], [560, 140], [540, 110]],
    ];

    continents.forEach(continent => {
      ctx.beginPath();
      ctx.moveTo(continent[0][0], continent[0][1]);
      for (let i = 1; i < continent.length; i++) {
        ctx.lineTo(continent[i][0], continent[i][1]);
      }
      ctx.closePath();
      ctx.fillStyle = '#1a0a3a';
      ctx.fill();
      ctx.strokeStyle = '#7C3AED';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Add glowing dots on continents
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 1024;
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      if (pixel[0] < 50 && pixel[1] < 30 && pixel[2] > 30) {
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 2 + 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${139 + Math.random() * 60}, ${80 + Math.random() * 40}, ${240 + Math.random() * 15}, ${0.3 + Math.random() * 0.7})`;
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    // Globe material with the texture
    const globeMat = new THREE.MeshPhongMaterial({
      map: texture,
      emissive: 0x2a0a5a,
      emissiveMap: texture,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.85,
    });
    const globe = new THREE.Mesh(sphereGeo, globeMat);
    globeGroup.add(globe);

    // Wireframe overlay
    const wireGeo = new THREE.SphereGeometry(5.02, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x7C3AED,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wireframe = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireframe);

    // Atmosphere glow
    const atmosGeo = new THREE.SphereGeometry(5.5, 32, 32);
    const atmosMat = new THREE.MeshPhongMaterial({
      color: 0x7C3AED,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosphere);

    // Outer glow
    const glowGeo = new THREE.SphereGeometry(6.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x6B21A8,
      transparent: true,
      opacity: 0.04,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glow);

    // Grid lines (latitude/longitude)
    const gridGroup = new THREE.Group();
    for (let lat = -80; lat <= 80; lat += 20) {
      const phi = (90 - lat) * (Math.PI / 180);
      const r = 5.03;
      const points = [];
      for (let lon = 0; lon <= 360; lon += 2) {
        const theta = lon * (Math.PI / 180);
        points.push(new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        ));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x7C3AED,
        transparent: true,
        opacity: 0.12,
      });
      gridGroup.add(new THREE.Line(lineGeo, lineMat));
    }
    for (let lon = 0; lon < 360; lon += 30) {
      const theta = lon * (Math.PI / 180);
      const points = [];
      for (let lat = -90; lat <= 90; lat += 2) {
        const phi = (90 - lat) * (Math.PI / 180);
        points.push(new THREE.Vector3(
          5.03 * Math.sin(phi) * Math.cos(theta),
          5.03 * Math.cos(phi),
          5.03 * Math.sin(phi) * Math.sin(theta)
        ));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x7C3AED,
        transparent: true,
        opacity: 0.08,
      });
      gridGroup.add(new THREE.Line(lineGeo, lineMat));
    }
    globeGroup.add(gridGroup);

    // Orbiting particles
    const particlesGeo = new THREE.BufferGeometry();
    const pCount = 150;
    const pPositions = new Float32Array(pCount * 3);
    const pSpeeds = [];
    for (let i = 0; i < pCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 3;
      const y = (Math.random() - 0.5) * 10;
      pPositions[i * 3] = Math.cos(angle) * radius;
      pPositions[i * 3 + 1] = y;
      pPositions[i * 3 + 2] = Math.sin(angle) * radius;
      pSpeeds.push({ angle, radius, ySpeed: (Math.random() - 0.5) * 0.01, angleSpeed: 0.002 + Math.random() * 0.005 });
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0xA78BFA,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    globeGroup.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x4C1D95, 0.5);
    scene.add(ambientLight);
    const pointLight1 = new THREE.PointLight(0x8B5CF6, 2, 50);
    pointLight1.position.set(10, 5, 10);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0x06B6D4, 1, 50);
    pointLight2.position.set(-10, -5, 5);
    scene.add(pointLight2);

    // Mouse tracking
    const handleMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const w2 = mount.clientWidth;
      const h2 = mount.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener('resize', handleResize);

    let animFrame;
    const animate = (time) => {
      animFrame = requestAnimationFrame(animate);
      const t = time * 0.001;

      // Smooth rotation toward target
      targetRotation.current.x = mouseRef.current.y * 0.5;
      targetRotation.current.y = mouseRef.current.x * 0.5;

      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.05;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.05;

      globeGroup.rotation.x = currentRotation.current.x + t * 0.05;
      globeGroup.rotation.y = currentRotation.current.y + t * 0.1;

      // Animate particles
      const posArr = particles.geometry.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        pSpeeds[i].angle += pSpeeds[i].angleSpeed;
        posArr[i * 3] = Math.cos(pSpeeds[i].angle) * pSpeeds[i].radius;
        posArr[i * 3 + 1] += pSpeeds[i].ySpeed;
        posArr[i * 3 + 2] = Math.sin(pSpeeds[i].angle) * pSpeeds[i].radius;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate(0);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrame);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full min-h-[400px] md:min-h-[500px]" />;
}

export default GlobeScene;