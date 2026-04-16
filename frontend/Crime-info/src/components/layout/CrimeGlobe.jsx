// frontend/Crime-info/src/pages/CrimeGlobe.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Globe, MapPin, Search, RotateCcw, Share2, Trash2, X } from "lucide-react";

const RADIUS = 100;

// Country boundary data for continent outlines
const countryBoundaries = {
  "North America": [
    [[72,-140],[72,-100],[72,-80],[65,-65],[55,-60],[50,-65],[45,-65],[45,-67],[43,-70],[40,-74],[35,-76],[30,-82],[25,-80],[25,-85],[30,-90],[30,-95],[25,-98],[20,-105],[20,-110],[25,-115],[30,-118],[35,-120],[40,-124],[45,-125],[48,-125],[50,-130],[55,-132],[58,-140],[60,-148],[62,-165],[65,-168],[72,-165],[72,-140]],
    [[20,-105],[15,-92],[10,-85],[10,-78],[15,-80],[18,-88],[20,-95],[20,-105]]
  ],
  "South America": [
    [[12,-72],[10,-65],[5,-60],[5,-52],[0,-50],[-5,-35],[-10,-38],[-15,-40],[-20,-42],[-25,-48],[-30,-52],[-35,-56],[-38,-58],[-40,-62],[-45,-65],[-50,-72],[-55,-68],[-55,-70],[-50,-72],[-45,-72],[-40,-72],[-35,-72],[-30,-72],[-25,-70],[-20,-70],[-15,-75],[-10,-78],[-5,-80],[0,-80],[5,-77],[10,-72],[12,-72]]
  ],
  "Europe": [
    [[72,10],[72,30],[70,35],[65,30],[60,25],[58,30],[55,25],[55,15],[52,15],[50,10],[48,15],[45,12],[42,10],[40,0],[38,-5],[38,0],[42,3],[43,5],[45,8],[48,2],[50,5],[52,5],[55,8],[58,10],[62,5],[65,12],[68,15],[70,20],[72,30],[72,10]],
    [[38,0],[38,-5],[37,-5],[36,0],[38,0]]
  ],
  "Africa": [
    [[37,10],[35,15],[32,32],[30,35],[25,35],[20,40],[15,42],[12,45],[5,42],[0,42],[-5,40],[-10,40],[-15,35],[-20,35],[-25,32],[-30,30],[-33,28],[-35,25],[-35,20],[-30,18],[-25,15],[-20,12],[-15,12],[-10,10],[-5,5],[0,5],[5,0],[8,-5],[10,-15],[15,-17],[20,-17],[25,-15],[30,-12],[32,-8],[35,-5],[37,0],[37,10]]
  ],
  "Asia": [
    [[72,40],[70,50],[68,60],[65,70],[60,80],[55,85],[50,90],[48,95],[45,100],[42,105],[40,110],[38,115],[35,120],[30,122],[25,120],[22,115],[20,110],[18,105],[15,100],[10,98],[8,100],[5,100],[2,105],[0,105],[-5,108],[-8,115],[-8,120],[-5,125],[0,130],[5,135],[10,130],[15,125],[20,122],[25,120],[28,125],[30,130],[35,135],[38,138],[42,140],[45,142],[48,142],[52,142],[55,142],[58,140],[60,135],[62,130],[65,125],[68,120],[70,110],[72,100],[72,80],[72,60],[72,40]]
  ],
  "Australia": [
    [[-12,130],[-15,125],[-18,122],[-22,115],[-25,113],[-28,114],[-32,115],[-35,118],[-38,145],[-38,150],[-35,152],[-30,153],[-28,153],[-25,152],[-22,150],[-20,148],[-18,145],[-15,142],[-12,135],[-12,130]]
  ]
};

// Urban centers for risk calculation
const urbanCenters = [
  [40.7, -74], [51.5, -0.1], [35.7, 139.7], [19, 72.8],
  [-23.5, -46.6], [31.2, 121.5], [1.35, 103.8], [-33.9, 18.4],
  [25.2, 55.3], [55.7, 37.6], [34, -118], [37.8, -122],
  [48.9, 2.3], [40.4, -3.7], [52.5, 13.4], [41.9, 12.5],
  [30, 31.2], [6.5, 3.4], [-1.3, 36.8], [13.7, 100.5],
  [-6.2, 106.8], [14.6, 121], [37.6, 127], [39.9, 116.4],
];

export default function CrimeGlobe() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const globeRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const hotspotMarkersRef = useRef([]);
  const animationIdRef = useRef(null);

  const [mode, setMode] = useState("browse");
  const [loading, setLoading] = useState(true);
  const [infoPanelVisible, setInfoPanelVisible] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [stats, setStats] = useState({
    hotspotCount: 0,
    avgRisk: null,
    highRiskCount: 0,
    totalRisk: 0
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  // Utility functions
  const latLngToVec3 = useCallback((lat, lng, radius) => {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lng + 180) * Math.PI / 180;
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }, []);

  const vec3ToLatLng = useCallback((point) => {
    const normalized = point.clone().normalize();
    const lat = 90 - Math.acos(normalized.y) * 180 / Math.PI;
    let lng = Math.atan2(normalized.z, -normalized.x) * 180 / Math.PI - 180;
    if (lng > 180) lng -= 360;
    if (lng < -180) lng += 360;
    return { lat, lng };
  }, []);

  const generateRiskScore = useCallback((lat, lng) => {
    const seed = Math.abs(Math.round(lat * 137 + lng * 73 + lat * lng * 0.5));
    const hash = ((seed * 2654435761) >>> 0) % 100;
    let risk = hash;

    urbanCenters.forEach(([ul, ulng]) => {
      const dist = Math.sqrt((lat - ul) ** 2 + (lng - ulng) ** 2);
      if (dist < 5) {
        risk = Math.min(95, risk + (30 - dist * 5));
      }
    });

    return Math.max(5, Math.min(98, Math.round(risk)));
  }, []);

  const getRiskColor = useCallback((risk) => {
    if (risk > 70) return 0xef4444;
    if (risk > 40) return 0xf59e0b;
    return 0x10b981;
  }, []);

  const getRiskLevel = useCallback((risk) => {
    if (risk > 70) return "high";
    if (risk > 40) return "moderate";
    return "low";
  }, []);

  // Create stars
  const createStars = useCallback((scene) => {
    const starGeo = new THREE.BufferGeometry();
    const starCount = 4000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 300 + Math.random() * 250;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true
    });
    scene.add(new THREE.Points(starGeo, starMat));
  }, []);

  // Create globe
  const createGlobe = useCallback((scene) => {
    const globeGeo = new THREE.SphereGeometry(RADIUS, 128, 128);
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0x08101e,
      emissive: 0x040a14,
      transparent: true,
      opacity: 0.9,
      shininess: 5,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);
    globeRef.current = globe;

    // Grid
    const gridGroup = new THREE.Group();
    for (let lat = -80; lat <= 80; lat += 20) {
      const phi = (90 - lat) * Math.PI / 180;
      const r = RADIUS * Math.sin(phi);
      const y = RADIUS * Math.cos(phi);
      const pts = [];
      for (let i = 0; i <= 128; i++) {
        const theta = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(-r * Math.cos(theta), y, r * Math.sin(theta)));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x0c1e35, transparent: true, opacity: 0.25 });
      gridGroup.add(new THREE.Line(lineGeo, lineMat));
    }
    for (let lng = -180; lng < 180; lng += 30) {
      const theta = (lng + 180) * Math.PI / 180;
      const pts = [];
      for (let i = 0; i <= 128; i++) {
        const phi = (i / 128) * Math.PI;
        const r = RADIUS * Math.sin(phi);
        pts.push(new THREE.Vector3(-r * Math.cos(theta), RADIUS * Math.cos(phi), r * Math.sin(theta)));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x0c1e35, transparent: true, opacity: 0.25 });
      gridGroup.add(new THREE.Line(lineGeo, lineMat));
    }
    globe.add(gridGroup);

    // Atmosphere
    const atmosGeo = new THREE.SphereGeometry(RADIUS * 1.015, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
          float intensity = pow(rim, 3.0) * 0.5;
          gl_FragColor = vec4(0.0, 0.4, 0.6, intensity);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(atmosGeo, atmosMat));

    // Lighting
    scene.add(new THREE.AmbientLight(0x1a2a4a, 0.6));
    const dirLight = new THREE.DirectionalLight(0x404060, 0.4);
    dirLight.position.set(100, 80, 100);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0x00b4d8, 0.3, 300);
    pointLight.position.set(-60, 60, 120);
    scene.add(pointLight);

    return globe;
  }, []);

  // Create country outlines
  const createCountryOutlines = useCallback((scene) => {
    const outlineGroup = new THREE.Group();

    Object.values(countryBoundaries).forEach(continent => {
      continent.forEach(ring => {
        const pts = [];
        ring.forEach(([lat, lng]) => {
          const pos = latLngToVec3(lat, lng, RADIUS + 0.3);
          pts.push(pos);
        });
        pts.push(pts[0].clone());

        const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
        const curvePts = curve.getPoints(120);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x1a4a6a,
          transparent: true,
          opacity: 0.4,
          linewidth: 1,
        });
        outlineGroup.add(new THREE.Line(lineGeo, lineMat));
      });
    });

    scene.add(outlineGroup);
  }, [latLngToVec3]);

  // Create continent labels
//   const createLabels = useCallback((scene) => {
//     const labels = [
//       { text: "NORTH AMERICA", lat: 45, lng: -100 },
//       { text: "SOUTH AMERICA", lat: -15, lng: -55 },
//       { text: "EUROPE", lat: 50, lng: 15 },
//       { text: "AFRICA", lat: 5, lng: 22 },
//       { text: "ASIA", lat: 40, lng: 100 },
//       { text: "OCEANIA", lat: -25, lng: 135 },
//     ];

//     labels.forEach(l => {
//       const canvas = document.createElement('canvas');
//       canvas.width = 512 inside your routes:
//     <Route path="/globe" element={<Private><CrimeGlobe /></Private>} />


const createLabels = useCallback((scene) => {
  const labels = [
    { text: "NORTH AMERICA", lat: 45, lng: -100 },
    { text: "SOUTH AMERICA", lat: -15, lng: -55 },
    { text: "EUROPE", lat: 50, lng: 15 },
    { text: "AFRICA", lat: 5, lng: 22 },
    { text: "ASIA", lat: 40, lng: 100 },
    { text: "OCEANIA", lat: -25, lng: 135 },
  ];

  labels.forEach(l => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 64;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(100,180,220,0.12)";
    ctx.font = "bold 36px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(l.text, 256, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });

    const sprite = new THREE.Sprite(spriteMat);

    const pos = latLngToVec3(l.lat, l.lng, RADIUS + 6);
    sprite.position.copy(pos);
    sprite.scale.set(40, 5, 1);

    scene.add(sprite);
  });
}, [latLngToVec3]);

useEffect(() => {
  const scene = new THREE.Scene();
  sceneRef.current = scene;

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 0, 300);
  cameraRef.current = camera;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  rendererRef.current = renderer;

  mountRef.current.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controlsRef.current = controls;

  // 🌍 Build scene
  createStars(scene);
  createGlobe(scene);
  createCountryOutlines(scene);
  createLabels(scene);

  // 🎬 Animation loop
  const animate = () => {
    animationIdRef.current = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  // 🧹 Cleanup
  return () => {
    cancelAnimationFrame(animationIdRef.current);
    renderer.dispose();
    if (mountRef.current) {
      mountRef.current.removeChild(renderer.domElement);
    }
  };
}, []);

    return (
        <div
            ref={mountRef}
            style={{ width: "100vw", height: "100vh", background: "black" }}
        />
        );
}