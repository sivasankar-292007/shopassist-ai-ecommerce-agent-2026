import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Product } from '../../types';
import { RotateCw, Eye, Sparkles, Box, Maximize, ZoomIn, ZoomOut, Check } from 'lucide-react';

interface ProductViewer3DProps {
  product: Product;
  onAskAIAboutFeature?: (featureName: string, detail: string) => void;
  selectedColor?: string;
  onSelectColor?: (color: string) => void;
}

export const ProductViewer3D: React.FC<ProductViewer3DProps> = ({
  product,
  onAskAIAboutFeature,
  selectedColor,
  onSelectColor
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Material color mapping based on product colors
  const getColorHex = (colorName?: string): number => {
    if (!colorName) return 0x1e293b;
    const c = colorName.toLowerCase();
    if (c.includes('black') || c.includes('obsidian') || c.includes('carbon')) return 0x18181b;
    if (c.includes('olive') || c.includes('green') || c.includes('sage')) return 0x4a5d4e;
    if (c.includes('grey') || c.includes('charcoal') || c.includes('graphite')) return 0x3f3f46;
    if (c.includes('silver') || c.includes('cloud') || c.includes('titanium')) return 0xd1d5db;
    if (c.includes('gold') || c.includes('dune') || c.includes('sand')) return 0xc2a67e;
    if (c.includes('navy') || c.includes('blue')) return 0x1e3a8a;
    if (c.includes('bone') || c.includes('oatmeal') || c.includes('white')) return 0xf3f4f6;
    return 0x27272a;
  };

  const currentColorHex = getColorHex(selectedColor || (product.colors ? product.colors[0] : undefined));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 360;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Root model group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Dynamic materials
    const mainMaterial = new THREE.MeshStandardMaterial({
      color: currentColorHex,
      roughness: 0.35,
      metalness: 0.45,
      wireframe: wireframeMode,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x6366f1, // Lumina Indigo Accent
      roughness: 0.2,
      metalness: 0.8,
      wireframe: wireframeMode,
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.1,
      metalness: 0.95,
      wireframe: wireframeMode,
    });

    const cushionMaterial = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.8,
      metalness: 0.05,
      wireframe: wireframeMode,
    });

    // -------------------------------------------------------------
    // Build Procedural 3D Geometry Based on Product ID / Category
    // -------------------------------------------------------------
    if (product.id === 'prod-3') {
      // 🎧 SoundPulse ANC Headphones
      // 1. Headband arc
      const headbandCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-1.2, 0.2, 0),
        new THREE.Vector3(0, 1.6, 0),
        new THREE.Vector3(1.2, 0.2, 0)
      );
      const headbandGeo = new THREE.TubeGeometry(headbandCurve, 32, 0.12, 16, false);
      const headband = new THREE.Mesh(headbandGeo, mainMaterial);
      modelGroup.add(headband);

      // 2. Ear Cups (Left & Right)
      const earCupGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.3, 32);
      const cushionGeo = new THREE.TorusGeometry(0.5, 0.14, 16, 32);

      // Left earcup
      const leftCup = new THREE.Mesh(earCupGeo, mainMaterial);
      leftCup.rotation.z = Math.PI / 2;
      leftCup.position.set(-1.2, 0.1, 0);
      modelGroup.add(leftCup);

      const leftCushion = new THREE.Mesh(cushionGeo, cushionMaterial);
      leftCushion.rotation.y = Math.PI / 2;
      leftCushion.position.set(-1.05, 0.1, 0);
      modelGroup.add(leftCushion);

      // Metal ring trim
      const leftTrim = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.03, 16, 32), chromeMaterial);
      leftTrim.rotation.y = Math.PI / 2;
      leftTrim.position.set(-1.3, 0.1, 0);
      modelGroup.add(leftTrim);

      // Right earcup
      const rightCup = new THREE.Mesh(earCupGeo, mainMaterial);
      rightCup.rotation.z = Math.PI / 2;
      rightCup.position.set(1.2, 0.1, 0);
      modelGroup.add(rightCup);

      const rightCushion = new THREE.Mesh(cushionGeo, cushionMaterial);
      rightCushion.rotation.y = Math.PI / 2;
      rightCushion.position.set(1.05, 0.1, 0);
      modelGroup.add(rightCushion);

      const rightTrim = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.03, 16, 32), chromeMaterial);
      rightTrim.rotation.y = Math.PI / 2;
      rightTrim.position.set(1.3, 0.1, 0);
      modelGroup.add(rightTrim);

    } else if (product.id === 'prod-1') {
      // 🎒 Aerolite 24L Daypack
      // Main Body
      const bodyGeo = new THREE.BoxGeometry(1.4, 2.0, 0.9, 12, 12, 12);
      // Soft round corners by scaling vertices slightly
      const body = new THREE.Mesh(bodyGeo, mainMaterial);
      modelGroup.add(body);

      // Front Pocket
      const pocketGeo = new THREE.BoxGeometry(1.2, 1.1, 0.35);
      const pocket = new THREE.Mesh(pocketGeo, mainMaterial);
      pocket.position.set(0, -0.35, 0.55);
      modelGroup.add(pocket);

      // Top Carry Handle
      const handleCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-0.35, 1.0, 0),
        new THREE.Vector3(0, 1.35, 0),
        new THREE.Vector3(0.35, 1.0, 0)
      );
      const handle = new THREE.Mesh(new THREE.TubeGeometry(handleCurve, 16, 0.05, 8, false), accentMaterial);
      modelGroup.add(handle);

      // Dual Straps on back
      const strapGeo = new THREE.BoxGeometry(0.2, 1.6, 0.08);
      const leftStrap = new THREE.Mesh(strapGeo, cushionMaterial);
      leftStrap.position.set(-0.45, 0.1, -0.5);
      leftStrap.rotation.x = -0.15;
      modelGroup.add(leftStrap);

      const rightStrap = new THREE.Mesh(strapGeo, cushionMaterial);
      rightStrap.position.set(0.45, 0.1, -0.5);
      rightStrap.rotation.x = -0.15;
      modelGroup.add(rightStrap);

      // Zipper line
      const zipGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.3, 8);
      const zipper = new THREE.Mesh(zipGeo, chromeMaterial);
      zipper.rotation.z = Math.PI / 2;
      zipper.position.set(0, 0.25, 0.58);
      modelGroup.add(zipper);

    } else if (product.id === 'prod-5') {
      // 🍶 HydroLock Insulated Bottle 32oz
      // Main Body
      const bottleGeo = new THREE.CylinderGeometry(0.55, 0.55, 2.1, 32);
      const bottle = new THREE.Mesh(bottleGeo, mainMaterial);
      modelGroup.add(bottle);

      // Grip band
      const gripGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.5, 32);
      const grip = new THREE.Mesh(gripGeo, cushionMaterial);
      grip.position.set(0, 0.2, 0);
      modelGroup.add(grip);

      // Neck & Lid
      const neckGeo = new THREE.CylinderGeometry(0.35, 0.5, 0.3, 32);
      const neck = new THREE.Mesh(neckGeo, chromeMaterial);
      neck.position.set(0, 1.15, 0);
      modelGroup.add(neck);

      const capGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.35, 32);
      const cap = new THREE.Mesh(capGeo, mainMaterial);
      cap.position.set(0, 1.45, 0);
      modelGroup.add(cap);

      // Loop handle on cap
      const loopGeo = new THREE.TorusGeometry(0.2, 0.05, 12, 24);
      const loop = new THREE.Mesh(loopGeo, accentMaterial);
      loop.rotation.x = Math.PI / 2;
      loop.position.set(0, 1.65, 0);
      modelGroup.add(loop);

    } else if (product.id === 'prod-4') {
      // 👟 Vanguard All-Weather Low Sneakers
      // Outsole
      const soleGeo = new THREE.BoxGeometry(1.1, 0.35, 2.4);
      const sole = new THREE.Mesh(soleGeo, cushionMaterial);
      sole.position.set(0, -0.6, 0);
      modelGroup.add(sole);

      // Upper body
      const upperGeo = new THREE.BoxGeometry(1.0, 0.75, 2.2);
      const upper = new THREE.Mesh(upperGeo, mainMaterial);
      upper.position.set(0, -0.1, -0.05);
      modelGroup.add(upper);

      // Collar / Ankle
      const collarGeo = new THREE.CylinderGeometry(0.4, 0.45, 0.4, 16);
      const collar = new THREE.Mesh(collarGeo, cushionMaterial);
      collar.position.set(0, 0.35, -0.4);
      modelGroup.add(collar);

      // Laces
      for (let i = 0; i < 4; i++) {
        const laceGeo = new THREE.BoxGeometry(0.6, 0.04, 0.08);
        const lace = new THREE.Mesh(laceGeo, chromeMaterial);
        lace.position.set(0, 0.35 - i * 0.08, 0.2 + i * 0.25);
        modelGroup.add(lace);
      }

    } else if (product.id === 'prod-6') {
      // 🖊️ Titanium EDC Pen
      const barrelGeo = new THREE.CylinderGeometry(0.09, 0.09, 2.6, 24);
      const barrel = new THREE.Mesh(barrelGeo, chromeMaterial);
      barrel.rotation.z = Math.PI / 4;
      modelGroup.add(barrel);

      const tipGeo = new THREE.ConeGeometry(0.09, 0.35, 24);
      const tip = new THREE.Mesh(tipGeo, chromeMaterial);
      tip.rotation.z = Math.PI / 4 + Math.PI;
      tip.position.set(-0.95, -0.95, 0);
      modelGroup.add(tip);

      const clipGeo = new THREE.BoxGeometry(0.04, 0.6, 0.08);
      const clip = new THREE.Mesh(clipGeo, accentMaterial);
      clip.rotation.z = Math.PI / 4;
      clip.position.set(0.8, 0.9, 0.1);
      modelGroup.add(clip);

    } else {
      // Default: Modern Tech Minimalist Origami Folio / Apparel Fold
      const folioGeo = new THREE.BoxGeometry(1.8, 1.3, 0.35);
      const folio = new THREE.Mesh(folioGeo, mainMaterial);
      modelGroup.add(folio);

      const bandGeo = new THREE.BoxGeometry(0.3, 1.32, 0.37);
      const band = new THREE.Mesh(bandGeo, accentMaterial);
      band.position.set(0.3, 0, 0);
      modelGroup.add(band);

      const claspGeo = new THREE.BoxGeometry(0.18, 0.25, 0.4);
      const clasp = new THREE.Mesh(claspGeo, chromeMaterial);
      clasp.position.set(0.3, 0, 0);
      modelGroup.add(clasp);
    }

    // Shadow Floor
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.2 });
    const shadowFloor = new THREE.Mesh(shadowGeo, shadowMat);
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -1.2;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 0.9);
    fillLight.position.set(-4, -1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // -------------------------------------------------------------
    // Mouse Interaction (Orbit / Pitch / Yaw / Zoom)
    // -------------------------------------------------------------
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotSpeed = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      rotSpeed.y = deltaX * 0.008;
      rotSpeed.x = deltaY * 0.008;
      modelGroup.rotation.y += rotSpeed.y;
      modelGroup.rotation.x += rotSpeed.x;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(2.5, Math.min(7.0, camera.position.z + e.deltaY * 0.003));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Window Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth && newHeight) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (autoRotate && !isDragging) {
        modelGroup.rotation.y += 0.006;
      }

      // Smooth damping
      if (!isDragging) {
        rotSpeed.x *= 0.92;
        rotSpeed.y *= 0.92;
        modelGroup.rotation.x += rotSpeed.x;
        modelGroup.rotation.y += rotSpeed.y;
      }

      // Gentle floating levitation
      modelGroup.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [product.id, currentColorHex, wireframeMode, autoRotate]);

  // Inspection hotspots for 3D exploration
  const hotspots = [
    {
      id: 'materials',
      label: 'Materials & Finish',
      detail: product.materialsCare || 'Crafted with premium weather-resistant finishes'
    },
    {
      id: 'fit',
      label: 'Sizing & Ergonomics',
      detail: product.sizingAdvice || 'Precision engineered for daily comfort'
    },
    {
      id: 'specs',
      label: 'Performance Spec',
      detail: product.highlights[0] || '1-year comprehensive manufacturer warranty'
    }
  ];

  return (
    <div className="relative w-full h-full min-h-[340px] flex flex-col bg-neutral-900/5 rounded-2xl overflow-hidden border border-neutral-200 select-none">
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={containerRef}
        className="w-full h-full flex-1 cursor-grab active:cursor-grabbing relative"
      />

      {/* Top 3D Control Pill Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-800 shadow-xs pointer-events-auto">
          <Box className="w-3.5 h-3.5 text-indigo-600" />
          <span>3D Interactive Studio</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Turntable Auto-rotate */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause 360° Turntable' : 'Play 360° Turntable'}
            className={`p-1.5 rounded-lg border text-xs font-medium backdrop-blur transition-colors cursor-pointer ${
              autoRotate
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white/90 text-neutral-700 border-neutral-200 hover:bg-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Wireframe Hologram View */}
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            title={wireframeMode ? 'Switch to Studio Render' : 'Switch to Wireframe Mode'}
            className={`p-1.5 rounded-lg border text-xs font-medium backdrop-blur transition-colors cursor-pointer ${
              wireframeMode
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white/90 text-neutral-700 border-neutral-200 hover:bg-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive 3D Inspection Hotspots */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {hotspots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => {
                setActiveHotspot(spot.id);
                if (onAskAIAboutFeature) {
                  onAskAIAboutFeature(spot.label, spot.detail);
                }
              }}
              className="text-[11px] bg-white/95 hover:bg-indigo-50 text-neutral-800 hover:text-indigo-700 px-2.5 py-1 rounded-full border border-neutral-200 shadow-xs flex items-center gap-1 transition-all cursor-pointer backdrop-blur"
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>{spot.label}</span>
            </button>
          ))}
        </div>

        <div className="text-[10px] text-neutral-400 bg-white/80 backdrop-blur px-2 py-0.5 rounded-full border border-neutral-100 hidden sm:block">
          Drag to 360° rotate • Scroll to zoom
        </div>
      </div>
    </div>
  );
};
