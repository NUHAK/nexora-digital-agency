"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll as useFramerScroll } from "framer-motion";

const PARTICLE_COUNT = 18000;
const ROCKET_SCALE = 3.2;

const EXPLOSION_SPREAD_RADIUS = 9;
const EXPLOSION_TURBULENCE = 0.6;
const SCROLL_SENSITIVITY_PX = 900;

const IDLE_ROTATION_SPEED = 0.05;
const FLOAT_AMPLITUDE = 0.15;
const FLOAT_SPEED = 0.6;
const PARTICLE_SIZE = 0.09;

const USE_GLOW_BLENDING = false;

const TILT_X_DEG = -4; // slight pitch for a more dynamic pose
const TILT_Z_DEG = -12; // FIXED: Missing reference resolved here

const HOVER_LERP_SPEED = 0.08;
const SHIMMER_INTENSITY = 0.55;
const SHIMMER_FREQUENCY = 3.2;
const SHIMMER_SPEED = 2.5;
const HOVER_ROTATION_MULTIPLIER = 3;

const DUST_FRACTION = 0.28;
const DUST_SIZE_RANGE: [number, number] = [0.35, 0.7];

const ACCENT_FRACTION = 0.1;
const ACCENT_SIZE_RANGE: [number, number] = [1.6, 2.4];

const NORMAL_SIZE_RANGE: [number, number] = [0.95, 1.35];

const FUSELAGE_PALETTE: { color: string; weight: number }[] = [
  { color: "#FF5A1F", weight: 0.4 },
  { color: "#FF8A3D", weight: 0.28 },
  { color: "#FFC08A", weight: 0.12 },
  { color: "#C2410C", weight: 0.2 },
];

const STRUCTURE_COLOR = "#7C2D12";

function pickFuselageColor(): string {
  const totalWeight = FUSELAGE_PALETTE.reduce((sum, c) => sum + c.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of FUSELAGE_PALETTE) {
    if (roll < entry.weight) return entry.color;
    roll -= entry.weight;
  }
  return FUSELAGE_PALETTE[0].color;
}

function generateRocketPositions(count: number): {
  positions: Float32Array;
  colorHint: Float32Array;
} {
  const positions = new Float32Array(count * 3);
  const colorHint = new Float32Array(count);

  const bodyHeight = 3.4;
  const noseHeight = 1.7;
  const antennaHeight = 0.35;
  const baseRadius = 1.05;
  const bodyBottomY = -2.2;
  const hullHeight = bodyHeight + noseHeight;
  const noseTipY = bodyBottomY + hullHeight;

  const antennaCount = Math.floor(count * 0.015);
  const hullCount = Math.floor(count * 0.56);
  const noseCapCount = Math.floor(count * 0.025);
  const stripeCount = Math.floor(count * 0.035);
  const windowCount = Math.floor(count * 0.05);
  const finCount = Math.floor(count * 0.16);
  const skirtCount = Math.floor(count * 0.055);
  const thrusterCount =
    count -
    antennaCount -
    hullCount -
    noseCapCount -
    stripeCount -
    windowCount -
    finCount -
    skirtCount;

  let i = 0;

  for (let n = 0; n < antennaCount; n++, i++) {
    const t = Math.random();
    const r = 0.025 * (1 - t * 0.6);
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3 + 0] = Math.cos(theta) * r;
    positions[i * 3 + 1] = noseTipY + t * antennaHeight;
    positions[i * 3 + 2] = Math.sin(theta) * r;
  }

  const HULL_ROUNDNESS = 0.85;
  const hullRadius = (t: number) => {
    if (t < 0.55) {
      return 1 - 0.05 * (t / 0.55);
    }
    const noseT = (t - 0.55) / 0.45;
    const bodyEndRadius = 0.95;
    return (
      bodyEndRadius *
      Math.pow(Math.max(0, Math.cos(noseT * (Math.PI / 2))), HULL_ROUNDNESS)
    );
  };

  for (let n = 0; n < hullCount; n++, i++) {
    const t = Math.random();
    const y = bodyBottomY + t * hullHeight;
    const r = baseRadius * hullRadius(t) * (0.94 + 0.06 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3 + 0] = Math.cos(theta) * r;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * r;
  }

  const noseCapTStart = 0.88;
  for (let n = 0; n < noseCapCount; n++, i++) {
    const t = THREE.MathUtils.lerp(noseCapTStart, 1, Math.random());
    const y = bodyBottomY + t * hullHeight;
    const r = baseRadius * hullRadius(t) * (0.94 + 0.06 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3 + 0] = Math.cos(theta) * r;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * r;
    colorHint[i] = 2;
  }

  const stripeT = 0.48;
  const stripeY = bodyBottomY + stripeT * hullHeight;
  for (let n = 0; n < stripeCount; n++, i++) {
    const r = baseRadius * hullRadius(stripeT) * 1.01;
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3 + 0] = Math.cos(theta) * r;
    positions[i * 3 + 1] = stripeY + (Math.random() - 0.5) * 0.1;
    positions[i * 3 + 2] = Math.sin(theta) * r;
    colorHint[i] = 2;
  }

  const windowT = 0.68;
  const windowY = bodyBottomY + windowT * hullHeight;
  const windowRadius = baseRadius * 0.26;
  const windowZOffset = baseRadius * hullRadius(windowT);
  for (let n = 0; n < windowCount; n++, i++) {
    const roll = Math.random();
    let rad: number;
    if (roll < 0.4) rad = windowRadius * (0.9 + 0.1 * Math.random());
    else rad = windowRadius * 0.6 * Math.sqrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3 + 0] = Math.cos(theta) * rad;
    positions[i * 3 + 1] = windowY + Math.sin(theta) * rad;
    positions[i * 3 + 2] = windowZOffset;
    colorHint[i] = 2;
  }

  const finBaseY = bodyBottomY + 0.25;
  const finHeight = baseRadius * 1.1;
  const finOutwardTip = baseRadius * 1.55;
  for (let n = 0; n < finCount; n++, i++) {
    const finIndex = n % 3;
    const angle = (finIndex / 3) * Math.PI * 2 + Math.PI / 6;
    const u = Math.random();

    const width =
      (Math.sin((1 - u) * Math.PI * 0.5) * 0.65 + 0.12) * baseRadius;
    const localX = (Math.random() - 0.5) * width;
    const chord = Math.random();

    const sweepBack = (1 - Math.cos(u * Math.PI * 0.5)) * finHeight * 0.5;
    const outward =
      baseRadius * 0.85 +
      (finOutwardTip - baseRadius * 0.85) * Math.sin(u * Math.PI * 0.5);

    const px =
      Math.cos(angle) * outward + Math.cos(angle + Math.PI / 2) * localX;
    const pz =
      Math.sin(angle) * outward + Math.sin(angle + Math.PI / 2) * localX;
    const py = finBaseY + chord * finHeight * (1 - u * 0.3) - sweepBack;

    positions[i * 3 + 0] = px;
    positions[i * 3 + 1] = py;
    positions[i * 3 + 2] = pz;
    colorHint[i] = 2;
  }

  const skirtTopY = bodyBottomY + 0.05;
  const skirtBottomY = bodyBottomY - 0.3;
  const skirtTopR = baseRadius * 0.95;
  const skirtBottomR = baseRadius * 1.15;
  for (let n = 0; n < skirtCount; n++, i++) {
    const t = Math.random();
    const y = skirtTopY + t * (skirtBottomY - skirtTopY);
    const r = skirtTopR + t * (skirtBottomR - skirtTopR);
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3 + 0] = Math.cos(theta) * r;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * r;
    colorHint[i] = 2;
  }

  const thrusterTopY = skirtBottomY;
  const thrusterDrop = baseRadius * 0.55;
  const nozzleTopRadius = baseRadius * 0.22;
  const nozzleBottomRadius = baseRadius * 0.32;
  for (let n = 0; n < thrusterCount; n++, i++) {
    const cluster = n % 3;
    const clusterAngle = (cluster / 3) * Math.PI * 2;
    const clusterOffsetR = baseRadius * 0.5;
    const cx = Math.cos(clusterAngle) * clusterOffsetR;
    const cz = Math.sin(clusterAngle) * clusterOffsetR;

    const t = Math.random();
    const r = nozzleTopRadius + t * (nozzleBottomRadius - nozzleTopRadius);
    const theta = Math.random() * Math.PI * 2;

    positions[i * 3 + 0] = cx + Math.cos(theta) * r;
    positions[i * 3 + 1] = thrusterTopY - t * thrusterDrop;
    positions[i * 3 + 2] = cz + Math.sin(theta) * r;
    colorHint[i] = 2;
  }

  return { positions, colorHint };
}

function generateExplosionVectors(
  count: number,
  homePositions: Float32Array
): Float32Array {
  const vectors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const hx = homePositions[i * 3 + 0];
    const hy = homePositions[i * 3 + 1];
    const hz = homePositions[i * 3 + 2];

    const radial = new THREE.Vector3(hx, 0, hz);
    if (radial.lengthSq() < 0.0001)
      radial.set(Math.random() - 0.5, 0, Math.random() - 0.5);
    radial.normalize();

    const turbulent = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).normalize();

    const dir = new THREE.Vector3()
      .addScaledVector(radial, 1 - EXPLOSION_TURBULENCE)
      .addScaledVector(turbulent, EXPLOSION_TURBULENCE)
      .normalize();

    const distanceVariance = 0.5 + Math.random() * 0.5;

    vectors[i * 3 + 0] = dir.x * distanceVariance;
    vectors[i * 3 + 1] = dir.y * distanceVariance + (Math.random() - 0.5) * 0.3;
    vectors[i * 3 + 2] = dir.z * distanceVariance;
  }
  return vectors;
}

function generateParticleSizes(count: number): Float32Array {
  const sizes = new Float32Array(count);
  const lerpRange = (range: [number, number]) =>
    THREE.MathUtils.lerp(range[0], range[1], Math.random());

  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    if (roll < DUST_FRACTION) {
      sizes[i] = lerpRange(DUST_SIZE_RANGE);
    } else if (roll < DUST_FRACTION + ACCENT_FRACTION) {
      sizes[i] = lerpRange(ACCENT_SIZE_RANGE);
    } else {
      sizes[i] = lerpRange(NORMAL_SIZE_RANGE);
    }
  }
  return sizes;
}

interface RocketParticlesProps {
  explosionProgress: React.MutableRefObject<number>;
}

function RocketParticles({ explosionProgress }: RocketParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const hitboxRef = useRef<THREE.Mesh>(null);

  const isHovered = useRef(false);
  const hoverProgress = useRef(0);

  const { positions: homePositions, colorHint } = useMemo(
    () => generateRocketPositions(PARTICLE_COUNT),
    []
  );
  const explosionVectors = useMemo(
    () => generateExplosionVectors(PARTICLE_COUNT, homePositions),
    [homePositions]
  );

  const sizes = useMemo(() => generateParticleSizes(PARTICLE_COUNT), []);

  const colors = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    const structureColor = new THREE.Color(STRUCTURE_COLOR);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const forcedStructure = colorHint[i] === 2;
      const c = forcedStructure
        ? structureColor
        : new THREE.Color(pickFuselageColor());
      const variance = 0.85 + Math.random() * 0.3;
      arr[i * 3 + 0] = Math.min(1, c.r * variance);
      arr[i * 3 + 1] = Math.min(1, c.g * variance);
      arr[i * 3 + 2] = Math.min(1, c.b * variance);
    }
    return arr;
  }, [colorHint]);

  const currentPositions = useMemo(
    () => Float32Array.from(homePositions),
    [homePositions]
  );

  const elapsed = useRef(0);
  const baseTiltZ = THREE.MathUtils.degToRad(TILT_Z_DEG);
  const baseTiltX = THREE.MathUtils.degToRad(TILT_X_DEG);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const progress = explosionProgress.current;

    const geom = pointsRef.current?.geometry;
    if (!geom) return;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;

    const eased = 1 - Math.pow(1 - progress, 2);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const homeX = homePositions[ix];
      const homeY = homePositions[ix + 1];
      const homeZ = homePositions[ix + 2];

      const dirX = explosionVectors[ix];
      const dirY = explosionVectors[ix + 1];
      const dirZ = explosionVectors[ix + 2];

      currentPositions[ix] = homeX + dirX * EXPLOSION_SPREAD_RADIUS * eased;
      currentPositions[ix + 1] = homeY + dirY * EXPLOSION_SPREAD_RADIUS * eased;
      currentPositions[ix + 2] = homeZ + dirZ * EXPLOSION_SPREAD_RADIUS * eased;
    }

    posAttr.array = currentPositions;
    posAttr.needsUpdate = true;

    if (groupRef.current) {
      const rotationDamp = 1 - eased * 0.7;
      const rotationTarget = isHovered.current
        ? HOVER_ROTATION_MULTIPLIER
        : 1;
      hoverProgress.current = THREE.MathUtils.lerp(
        hoverProgress.current,
        isHovered.current ? 1 : 0,
        HOVER_LERP_SPEED
      );

      const rotationMultiplier = THREE.MathUtils.lerp(
        1,
        rotationTarget,
        hoverProgress.current
      );

      groupRef.current.rotation.z = baseTiltZ;
      groupRef.current.rotation.x = baseTiltX;
      groupRef.current.rotation.y +=
        IDLE_ROTATION_SPEED * delta * rotationDamp * rotationMultiplier;
      groupRef.current.position.y =
        Math.sin(elapsed.current * FLOAT_SPEED) *
        FLOAT_AMPLITUDE *
        (1 - eased * 0.5);
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsed.current;
      materialRef.current.uniforms.uHoverProgress.value =
        hoverProgress.current;
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    isHovered.current = true;
    document.body.style.cursor = "pointer";
  };
  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    isHovered.current = false;
    document.body.style.cursor = "auto";
  };

  return (
    <group ref={groupRef} scale={ROCKET_SCALE}>
      <mesh
        ref={hitboxRef}
        position={[0, 0.1, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[1.7, 1.7, 6.5, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={currentPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={PARTICLE_COUNT}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aSize"
            count={PARTICLE_COUNT}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          blending={
            USE_GLOW_BLENDING
              ? THREE.AdditiveBlending
              : THREE.NormalBlending
          }
          uniforms={{
            uBaseSize: { value: PARTICLE_SIZE },
            uOpacity: { value: USE_GLOW_BLENDING ? 1 : 0.95 },
            uAttenuation: { value: 380.0 },
            uTime: { value: 0 },
            uHoverProgress: { value: 0 },
          }}
          vertexShader={`
            attribute float aSize;
            attribute vec3 color;
            uniform float uBaseSize;
            uniform float uAttenuation;
            uniform float uTime;
            uniform float uHoverProgress;
            varying vec3 vColor;
            varying float vShimmer;

            void main() {
              float wave = sin(position.y * ${SHIMMER_FREQUENCY.toFixed(
                2
              )} - uTime * ${SHIMMER_SPEED.toFixed(2)});
              float shimmer = max(0.0, wave) * uHoverProgress;
              vShimmer = shimmer;

              vColor = color;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              float sizeBoost = 1.0 + shimmer * ${SHIMMER_INTENSITY.toFixed(
                2
              )};
              gl_PointSize = aSize * uBaseSize * sizeBoost * (uAttenuation / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            uniform float uOpacity;
            varying vec3 vColor;
            varying float vShimmer;

            void main() {
              vec2 coord = gl_PointCoord - vec2(0.5);
              float dist = length(coord);
              if (dist > 0.5) discard;
              float alpha = smoothstep(0.5, 0.15, dist) * uOpacity;
              vec3 litColor = mix(vColor, vec3(1.0), vShimmer * 0.5);
              gl_FragColor = vec4(litColor, alpha);
            }
          `}
        />
      </points>
    </group>
  );
}

function useScrollExplosionProgress() {
  const progressRef = useRef(0);
  const { scrollY } = useFramerScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      const raw = latest / SCROLL_SENSITIVITY_PX;
      progressRef.current = Math.min(1, Math.max(0, raw));
    });
    return () => unsubscribe();
  }, [scrollY]);

  return progressRef;
}

export default function RocketCanvas() {
  const explosionProgress = useScrollExplosionProgress();

  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        camera={{ position: [0, 0, 24], fov: 50 }}
        dpr={[1, 2]}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <ambientLight intensity={0.4} />
        <RocketParticles explosionProgress={explosionProgress} />
      </Canvas>
    </div>
  );
}