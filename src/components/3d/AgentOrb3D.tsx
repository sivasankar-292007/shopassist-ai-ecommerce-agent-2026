import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AgentOrb3DProps {
  state?: 'idle' | 'thinking' | 'speaking';
  size?: number; // pixel size or container fit
  interactive?: boolean;
}

export const AgentOrb3D: React.FC<AgentOrb3DProps> = ({
  state = 'idle',
  size = 56,
  interactive = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = size;
    const height = size;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    // WebGL Renderer with transparency & antialiasing
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for all elements
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // 1. Core Sphere with subtle wireframe/faceted look
    const sphereGeo = new THREE.IcosahedronGeometry(1.2, 3);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1, // Indigo
      emissive: 0x4338ca,
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: false,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    orbGroup.add(coreSphere);

    // 2. Translucent outer shell
    const outerGeo = new THREE.IcosahedronGeometry(1.35, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const outerWire = new THREE.Mesh(outerGeo, outerMat);
    orbGroup.add(outerWire);

    // 3. Orbiting Gyro Rings
    const ring1Geo = new THREE.TorusGeometry(1.6, 0.03, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xa5b4fc,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    orbGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.8, 0.025, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    orbGroup.add(ring2);

    // 4. Floating glowing particles cloud
    const particlesCount = 48;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      const radius = 1.6 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    orbGroup.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xa855f7, 3, 10);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x38bdf8, 3, 10);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);

    // Mouse drag interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      dragVelocity.x = deltaX * 0.01;
      dragVelocity.y = deltaY * 0.01;
      orbGroup.rotation.y += dragVelocity.x;
      orbGroup.rotation.x += dragVelocity.y;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    if (interactive) {
      container.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // State-specific behavior
      let speedFactor = 1;
      let pulseIntensity = 0.6;

      if (state === 'thinking') {
        speedFactor = 2.8;
        pulseIntensity = 0.9 + Math.sin(elapsedTime * 8) * 0.4;
      } else if (state === 'speaking') {
        speedFactor = 1.8;
        pulseIntensity = 0.8 + Math.sin(elapsedTime * 6) * 0.3;
      } else {
        pulseIntensity = 0.6 + Math.sin(elapsedTime * 2) * 0.15;
      }

      // Continuous rotation
      orbGroup.rotation.y += 0.012 * speedFactor;
      outerWire.rotation.x += 0.008 * speedFactor;
      outerWire.rotation.z += 0.005 * speedFactor;

      ring1.rotation.z -= 0.02 * speedFactor;
      ring2.rotation.x += 0.015 * speedFactor;
      particleSystem.rotation.y += 0.006 * speedFactor;

      // Pulse breathing
      const scale = 1 + Math.sin(elapsedTime * 3 * speedFactor) * 0.06;
      coreSphere.scale.set(scale, scale, scale);
      sphereMat.emissiveIntensity = pulseIntensity;

      // Light rotation
      pointLight1.position.x = Math.sin(elapsedTime * 1.5) * 3;
      pointLight1.position.y = Math.cos(elapsedTime * 1.5) * 3;

      // Damping on drag
      if (!isDragging) {
        dragVelocity.x *= 0.95;
        dragVelocity.y *= 0.95;
        orbGroup.rotation.y += dragVelocity.x;
        orbGroup.rotation.x += dragVelocity.y;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        container.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
      orbGroup.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
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
  }, [state, size, interactive]);

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      title="3D AI Core (Click & Drag to rotate)"
    />
  );
};
