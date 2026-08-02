"use client";


import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll as useFramerScroll } from "framer-motion";


const PARTICLE_COUNT = 18000;

const ROCKET_SCALE = 3.2;

/** How far particles fly outward at full scroll-explosion (in the rocket's
 *  own unscaled coordinate space — it gets multiplied by ROCKET_SCALE
 *  automatically since it lives inside the scaled group). */
const EXPLOSION_SPREAD_RADIUS = 9;

/** How much extra randomness/turbulence is added per-particle on top of the
 *  pure radial explosion vector, for a softer "firework" look rather than a
 *  perfectly uniform sphere expansion. 0 = perfectly radial, 1 = fully chaotic. */
const EXPLOSION_TURBULENCE = 0.6;

/** Scroll distance (in px) over which the explosion goes from 0% -> 100%. */
const SCROLL_SENSITIVITY_PX = 900;

/** Idle rotation speed (radians/frame-ish, scaled by delta) at rest (top of page). */
const IDLE_ROTATION_SPEED = 0.05;

/** Idle vertical bob amplitude/speed for the "floating" feel. */
const FLOAT_AMPLITUDE = 0.15;
const FLOAT_SPEED = 0.6;

/** Base particle size (three.js Points size, world units w/ sizeAttenuation). */
const PARTICLE_SIZE = 0.09;


const USE_GLOW_BLENDING = false;

const TILT_X_DEG = -4; // slight pitch for a more dynamic, less flat pose


const HOVER_LERP_SPEED = 0.08;

/** How much brighter/bigger particles get at the peak of the shimmer wave
 *  as it passes over them. 0 = no effect, higher = more dramatic pulse. */
const SHIMMER_INTENSITY = 0.55;

/** How many wave crests run along the rocket's height at once — higher =
 *  tighter/more frequent bands of shimmer. */
const SHIMMER_FREQUENCY = 3.2;

/** How fast the shimmer wave travels along the hull while hovered. */
const SHIMMER_SPEED = 2.5;

/** Idle rotation speed multiplier while hovered — rocket spins faster as
 *  a "reacting" cue instead of growing bigger. 1 = no change. */
const HOVER_ROTATION_MULTIPLIER = 3;

// --- Per-particle SIZE VARIATION (instead of every dot being identical) ---
// Particles are split into three "tiers" so the cloud reads with depth and
// texture — lots of tiny dust, a solid middle layer, and a few bright,
// larger accent dots — similar to the reference nebula/rocket look.

/** Fraction of particles that are small background "dust" specks. Lowered
 *  from earlier versions — too much dust blurred the silhouette and made
 *  the shape harder to read at a glance. */
const DUST_FRACTION = 0.28;
/** Size range (as a multiplier of PARTICLE_SIZE) for dust particles. */
const DUST_SIZE_RANGE: [number, number] = [0.35, 0.7];

/** Fraction of particles that are bold, bright "accent" dots (drawn from
 *  the remainder after dust). Keep this fairly small — a few standout
 *  particles read as sparkle/highlights; too many looks noisy. */
const ACCENT_FRACTION = 0.1;
/** Size range for accent particles — noticeably bigger than the rest. */
const ACCENT_SIZE_RANGE: [number, number] = [1.6, 2.4];

/** Size range for the remaining "normal" mid-layer particles that form the
 *  bulk of the rocket's readable silhouette. Bumped up slightly (vs. dust
 *  being reduced) so the fuselage reads as a solid, filled shape. */
const NORMAL_SIZE_RANGE: [number, number] = [0.95, 1.35];


const FUSELAGE_PALETTE: { color: string; weight: number }[] = [
  { color: "#FF5A1F", weight: 0.4 }, // brand orange (primary)
  { color: "#FF8A3D", weight: 0.28 }, // light orange (matches hero blur accent)
  { color: "#FFC08A", weight: 0.12 }, // pale peach highlight — sparkle/glow
  { color: "#C2410C", weight: 0.2 }, // deep burnt orange — shadow/depth
];

const STRUCTURE_COLOR = "#7C2D12"; // deep rust/mahogany orange

/** Picks a palette color using the weights above. */
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
  const colorHint = new Float32Array(count); // 0 = default random mix, 2 = forced black

 
  const bodyHeight = 3.4;
  const noseHeight = 1.7;
  const antennaHeight = 0.35;
  const baseRadius = 1.05;
  const bodyBottomY = -2.2;
  const hullHeight = bodyHeight + noseHeight;
  const noseTipY = bodyBottomY + hullHeight;

  // --- Particle budget across parts ---
  const antennaCount = Math.floor(count * 0.015);
  const hullCount = Math.floor(count * 0.56); // body + nose, one continuous surface
  const noseCapCount = Math.floor(count * 0.025); // cap detail at the very tip
  const stripeCount = Math.floor(count * 0.035); // accent ring, mid-body
  const windowCount = Math.floor(count * 0.05);
  const finCount = Math.floor(count * 0.16);
  const skirtCount = Math.floor(count * 0.055);
  const thrusterCount = count - antennaCount - hullCount - noseCapCount -
    stripeCount - windowCount - finCount - skirtCount;

  let i = 0;

  // --- Tip antenna: thin vertical spike above the nose ---
  for (let n = 0; n < antennaCount; n++, i++) {
    const t = Math.random();
    const r = 0.025 * (1 - t * 0.6);
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3 + 0] = Math.cos(theta) * r;
    positions[i * 3 + 1] = noseTipY + t * antennaHeight;
    positions[i * 3 + 2] = Math.sin(theta) * r;
  }

  // --- Hull (body + nose as ONE continuous smooth curve) ---
  // A single profile function across the whole height avoids any seam or
  // banding — everything is sampled from the same smooth curve, so there's
  // no risk of rings/segments reading as a "spring" or "corkscrew".
  // HULL_ROUNDNESS < 1 = fuller, blunter nose. 1.0 = even taper. > 1 = sharp.
  const HULL_ROUNDNESS = 0.85;
  const hullRadius = (t: number) => {
    // t: 0 at the base, 1 at the very tip of the nose.
    // Stays at ~full radius through most of the body (the "waist" of the
    // rocket), then curves smoothly into the nose over the top ~35%.
    if (t < 0.55) {
      // Body zone: gentle, almost-cylindrical taper (barely narrows)
      return 1 - 0.05 * (t / 0.55);
    }
    // Nose zone: smooth cosine curve from the body's radius down to 0 at tip
    const noseT = (t - 0.55) / 0.45; // 0..1 across the nose only
    const bodyEndRadius = 0.95; // matches the body-zone formula at t=0.55
    return bodyEndRadius * Math.pow(Math.max(0, Math.cos(noseT * (Math.PI / 2))), HULL_ROUNDNESS);
  };

  for (let n = 0; n < hullCount; n++, i++) {
    const t = Math.random(); // 0 base, 1 tip
    const y = bodyBottomY + t * hullHeight;
    const r = baseRadius * hullRadius(t) * (0.94 + 0.06 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3 + 0] = Math.cos(theta) * r;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * r;
    // colorHint left at 0 (default) — this is where the random orange/black
    // speckle mix from COLOR_A_WEIGHT shows through as the fuselage texture.
  }

  // --- Dark nose cap: solid black accent over the top ~12% of the nose,
  //     sampled from the SAME hullRadius() curve so it sits flush with no
  //     step — reads as a deliberate two-tone nose tip, not a random blob ---
  const noseCapTStart = 0.88;
  for (let n = 0; n < noseCapCount; n++, i++) {
    const t = THREE.MathUtils.lerp(noseCapTStart, 1, Math.random());
    const y = bodyBottomY + t * hullHeight;
    const r = baseRadius * hullRadius(t) * (0.94 + 0.06 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3 + 0] = Math.cos(theta) * r;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * r;
    colorHint[i] = 2; // forced black
  }

  // --- Dark accent stripe: a slim ring around the body's midsection,
  //     radius sampled from hullRadius() so it sits flush on the hull ---
  const stripeT = 0.48;
  const stripeY = bodyBottomY + stripeT * hullHeight;
  for (let n = 0; n < stripeCount; n++, i++) {
    const r = baseRadius * hullRadius(stripeT) * 1.01;
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3 + 0] = Math.cos(theta) * r;
    positions[i * 3 + 1] = stripeY + (Math.random() - 0.5) * 0.1;
    positions[i * 3 + 2] = Math.sin(theta) * r;
    colorHint[i] = 2; // forced black
  }

  // --- Window: small, round, flush with the hull surface — sized as a
  //     fraction of baseRadius so it always reads as a window, not a blob.
  //     Colored dark like tinted glass, matching the orange/black theme. ---
  const windowT = 0.68;
  const windowY = bodyBottomY + windowT * hullHeight;
  const windowRadius = baseRadius * 0.26;
  const windowZOffset = baseRadius * hullRadius(windowT);
  for (let n = 0; n < windowCount; n++, i++) {
    const roll = Math.random();
    let rad: number;
    if (roll < 0.4) rad = windowRadius * (0.9 + 0.1 * Math.random()); // rim
    else rad = windowRadius * 0.6 * Math.sqrt(Math.random()); // filled glass
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3 + 0] = Math.cos(theta) * rad;
    positions[i * 3 + 1] = windowY + Math.sin(theta) * rad;
    positions[i * 3 + 2] = windowZOffset;
    colorHint[i] = 2; // forced black (tinted glass)
  }

  // --- Fins: three compact, contained swept fins — sized relative to
  //     baseRadius so they stay close to the body instead of spiking out.
  //     Colored black as part of the "engine block" accent. ---
  const finBaseY = bodyBottomY + 0.25;
  const finHeight = baseRadius * 1.1;
  const finOutwardTip = baseRadius * 1.55; // stays close to the hull, not a wild spike
  for (let n = 0; n < finCount; n++, i++) {
    const finIndex = n % 3;
    const angle = (finIndex / 3) * Math.PI * 2 + Math.PI / 6;
    const u = Math.random(); // 0 at root, 1 at tip

    // Smooth sine taper with a floor, so the fin fills a solid rounded
    // triangle instead of scattering as thin sparse spikes.
    const width = (Math.sin((1 - u) * Math.PI * 0.5) * 0.65 + 0.12) * baseRadius;
    const localX = (Math.random() - 0.5) * width;
    const chord = Math.random(); // fills the fin's area, not just its edge

    const sweepBack = (1 - Math.cos(u * Math.PI * 0.5)) * finHeight * 0.5;
    const outward = baseRadius * 0.85 + (finOutwardTip - baseRadius * 0.85) * Math.sin(u * Math.PI * 0.5);

    const px = Math.cos(angle) * outward + Math.cos(angle + Math.PI / 2) * localX;
    const pz = Math.sin(angle) * outward + Math.sin(angle + Math.PI / 2) * localX;
    const py = finBaseY + chord * finHeight * (1 - u * 0.3) - sweepBack;

    positions[i * 3 + 0] = px;
    positions[i * 3 + 1] = py;
    positions[i * 3 + 2] = pz;
    colorHint[i] = 2; // forced black
  }

  // --- Engine skirt: flared ring connecting the body to the thrusters.
  //     Black, as part of the engine block. ---
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
    colorHint[i] = 2; // forced black
  }

  // --- Thrusters: three distinct nozzle cylinders (flared bells) under the
  //     skirt. Black, as part of the engine block. ---
  const thrusterTopY = skirtBottomY;
  const thrusterDrop = baseRadius * 0.55;
  const nozzleTopRadius = baseRadius * 0.22;
  const nozzleBottomRadius = baseRadius * 0.32; // flared bell shape
  for (let n = 0; n < thrusterCount; n++, i++) {
    const cluster = n % 3;
    const clusterAngle = (cluster / 3) * Math.PI * 2;
    const clusterOffsetR = baseRadius * 0.5;
    const cx = Math.cos(clusterAngle) * clusterOffsetR;
    const cz = Math.sin(clusterAngle) * clusterOffsetR;

    const t = Math.random(); // 0 top, 1 bottom of nozzle
    const r = nozzleTopRadius + t * (nozzleBottomRadius - nozzleTopRadius);
    const theta = Math.random() * Math.PI * 2;

    positions[i * 3 + 0] = cx + Math.cos(theta) * r;
    positions[i * 3 + 1] = thrusterTopY - t * thrusterDrop;
    positions[i * 3 + 2] = cz + Math.sin(theta) * r;
    colorHint[i] = 2; // forced black
  }

  return { positions, colorHint };
}

/**
 * Precomputes a random "explosion direction" per particle (normalized-ish
 * vector, not necessarily unit length) so each particle has a consistent
 * outward trajectory rather than re-randomizing every frame (which would
 * look like noise/jitter instead of a clean scatter).
 */
function generateExplosionVectors(count: number, homePositions: Float32Array): Float32Array {
  const vectors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const hx = homePositions[i * 3 + 0];
    const hy = homePositions[i * 3 + 1];
    const hz = homePositions[i * 3 + 2];

    // Radial component: direction away from the rocket's central axis (0, hy, 0)
    const radial = new THREE.Vector3(hx, 0, hz);
    if (radial.lengthSq() < 0.0001) radial.set(Math.random() - 0.5, 0, Math.random() - 0.5);
    radial.normalize();

    // Turbulent component: fully random unit vector, blended in via EXPLOSION_TURBULENCE
    const turbulent = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).normalize();

    const dir = new THREE.Vector3()
      .addScaledVector(radial, 1 - EXPLOSION_TURBULENCE)
      .addScaledVector(turbulent, EXPLOSION_TURBULENCE)
      .normalize();

    // Slight per-particle distance variance so the scatter isn't a perfect shell
    const distanceVariance = 0.5 + Math.random() * 0.5;

    vectors[i * 3 + 0] = dir.x * distanceVariance;
    vectors[i * 3 + 1] = dir.y * distanceVariance + (Math.random() - 0.5) * 0.3; // gentle vertical drift too
    vectors[i * 3 + 2] = dir.z * distanceVariance;
  }
  return vectors;
}

/**
 * Assigns each particle a size multiplier (relative to PARTICLE_SIZE) drawn
 * from one of three tiers — dust / normal / accent — so the point cloud has
 * visual depth instead of every dot looking identical.
 */
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

// ============================================================================
// Particle system component (lives inside the <Canvas>)
// ============================================================================

interface RocketParticlesProps {
  /** 0 = fully assembled rocket, 1 = fully exploded/scattered */
  explosionProgress: React.MutableRefObject<number>;
}

function RocketParticles({ explosionProgress }: RocketParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const hitboxRef = useRef<THREE.Mesh>(null);

  // Hover state — a plain ref (not React state) so hovering doesn't trigger
  // re-renders; the useFrame loop below reads it every frame and smoothly
  // lerps hoverProgress toward 0 or 1, which drives both the shimmer-wave
  // shader effect and the rotation speed boost.
  const isHovered = useRef(false);
  const hoverProgress = useRef(0);

  // Generate geometry data once
  const { positions: homePositions, colorHint } = useMemo(
    () => generateRocketPositions(PARTICLE_COUNT),
    []
  );
  const explosionVectors = useMemo(
    () => generateExplosionVectors(PARTICLE_COUNT, homePositions),
    [homePositions]
  );

  // Per-particle size multipliers (dust / normal / accent tiers) — this is
  // what gives the cloud varied dot sizes instead of a flat, uniform look.
  const sizes = useMemo(() => generateParticleSizes(PARTICLE_COUNT), []);

  // Per-particle color buffer — multi-shade orange fuselage + a deeper
  // structural orange accent (nose cap, stripe, window, engine block).
  // colorHint[i] === 2 marks the deliberate structural sections; everything
  // else draws from the weighted FUSELAGE_PALETTE for tonal variety.
  const colors = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    const structureColor = new THREE.Color(STRUCTURE_COLOR);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const forcedStructure = colorHint[i] === 2;
      const c = forcedStructure ? structureColor : new THREE.Color(pickFuselageColor());
      // Slight per-particle brightness variance for a glowing, non-flat look
      const variance = 0.85 + Math.random() * 0.3;
      arr[i * 3 + 0] = Math.min(1, c.r * variance);
      arr[i * 3 + 1] = Math.min(1, c.g * variance);
      arr[i * 3 + 2] = Math.min(1, c.b * variance);
    }
    return arr;
  }, [colorHint]);

  // Working (current) position buffer — mutated every frame, uploaded to GPU
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
    const progress = explosionProgress.current; // 0..1, driven by scroll

    const geom = pointsRef.current?.geometry;
    if (!geom) return;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;

    // Smooth easing curve for a softer explosion feel (ease-out)
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

    // Static launch tilt (left lean) preserved throughout; idle spin speeds
    // up while hovered (rotation-boost instead of scaling up), and damps
    // down as the rocket explodes so the scattered cloud doesn't spin
    // distractingly fast.
    if (groupRef.current) {
      const rotationDamp = 1 - eased * 0.7;
      const rotationTarget = isHovered.current ? HOVER_ROTATION_MULTIPLIER : 1;
      hoverProgress.current = THREE.MathUtils.lerp(
        hoverProgress.current,
        isHovered.current ? 1 : 0,
        HOVER_LERP_SPEED
      );
      // Blend rotation speed by hoverProgress (not a hard snap) for a
      // smooth spin-up/spin-down instead of an instant speed change.
      const rotationMultiplier = THREE.MathUtils.lerp(1, rotationTarget, hoverProgress.current);

      groupRef.current.rotation.z = baseTiltZ;
      groupRef.current.rotation.x = baseTiltX;
      groupRef.current.rotation.y += IDLE_ROTATION_SPEED * delta * rotationDamp * rotationMultiplier;
      groupRef.current.position.y =
        Math.sin(elapsed.current * FLOAT_SPEED) * FLOAT_AMPLITUDE * (1 - eased * 0.5);
    }

    // --- Shimmer-wave hover animation ---
    // Instead of scaling the rocket, hovering sends a traveling wave of
    // extra brightness/size up the hull. Both uTime and uHoverProgress are
    // read by the shader every frame — the wave math itself runs on the
    // GPU per-vertex, so this is just two uniform updates, no CPU loop.
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsed.current;
      materialRef.current.uniforms.uHoverProgress.value = hoverProgress.current;
    }
  });

  // --- Hover handlers ---
  // Raycasting directly against sparse points is unreliable (you'd have to
  // hit an exact particle), so instead we use an invisible cylinder that
  // roughly wraps the rocket's silhouette as the actual pointer target.
  // It lives inside the same tilted/scaled group, so it always tracks the
  // rocket correctly regardless of tilt or hover-scale.
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
      {/* Invisible hitbox — sized to loosely cover nose-to-thrusters + fins */}
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
          {/* Per-particle size multiplier (dust / normal / accent tiers) —
              read in the vertex shader below as `aSize`. Standard
              THREE.PointsMaterial can't vary size per-particle, hence the
              custom shaderMaterial instead of <pointsMaterial>. */}
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
          blending={USE_GLOW_BLENDING ? THREE.AdditiveBlending : THREE.NormalBlending}
          uniforms={{
            // Base size in world units — same role PARTICLE_SIZE played on
            // <pointsMaterial>. Each vertex's final size = this * aSize,
            // modulated by the shimmer wave below.
            uBaseSize: { value: PARTICLE_SIZE },
            // Additive blending wants full opacity to read as "glow"; normal
            // blending on light backgrounds reads better slightly-less-than-
            // fully opaque so it doesn't look like flat dots.
            uOpacity: { value: USE_GLOW_BLENDING ? 1 : 0.95 },
            // Tunable attenuation constant — raise/lower if particles look
            // too big/small at your camera distance (see TWEAKABLE
            // CONSTANTS note near PARTICLE_SIZE for guidance).
            uAttenuation: { value: 380.0 },
            // Elapsed time, updated every frame — drives the traveling
            // shimmer wave (see SHIMMER_* constants near the top).
            uTime: { value: 0 },
            // 0 = idle, 1 = fully hovered — eases smoothly via
            // HOVER_LERP_SPEED in useFrame, fading the shimmer in/out.
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
              // Traveling wave along the rocket's local height (position.y),
              // only visible once uHoverProgress fades it in — this is the
              // "modern shimmer" hover effect replacing the old scale-up.
              float wave = sin(position.y * ${SHIMMER_FREQUENCY.toFixed(2)} - uTime * ${SHIMMER_SPEED.toFixed(2)});
              float shimmer = max(0.0, wave) * uHoverProgress;
              vShimmer = shimmer;

              vColor = color;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              // Size attenuation (distance falloff) + a size boost where the
              // shimmer wave currently passes over this particle.
              float sizeBoost = 1.0 + shimmer * ${SHIMMER_INTENSITY.toFixed(2)};
              gl_PointSize = aSize * uBaseSize * sizeBoost * (uAttenuation / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            uniform float uOpacity;
            varying vec3 vColor;
            varying float vShimmer;

            void main() {
              // Draw each point as a soft circular dot instead of a hard
              // square (gl_PointCoord is 0..1 across the point's quad).
              vec2 coord = gl_PointCoord - vec2(0.5);
              float dist = length(coord);
              if (dist > 0.5) discard;
              float alpha = smoothstep(0.5, 0.15, dist) * uOpacity;
              // Brighten toward white at the shimmer's peak for a glinting
              // "light catching the hull" look as the wave passes.
              vec3 litColor = mix(vColor, vec3(1.0), vShimmer * 0.5);
              gl_FragColor = vec4(litColor, alpha);
            }
          `}
        />
      </points>
    </group>
  );
}

// ============================================================================
// Scroll driver — reads page scroll via Framer Motion and writes a 0..1
// progress value into a ref that the R3F loop reads every frame. Using a
// ref (rather than React state) avoids re-rendering the whole scene on
// every scroll tick.
// ============================================================================

function useScrollExplosionProgress() {
  const progressRef = useRef(0);
  const { scrollY } = useFramerScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      // Map raw scroll px -> 0..1, clamped.
      // Tweak SCROLL_SENSITIVITY_PX above to change how much scrolling
      // is required to reach a full explosion.
      const raw = latest / SCROLL_SENSITIVITY_PX;
      progressRef.current = Math.min(1, Math.max(0, raw));
    });
    return () => unsubscribe();
  }, [scrollY]);

  return progressRef;
}

// ============================================================================
// Public component
// ============================================================================

export default function RocketCanvas() {
  const explosionProgress = useScrollExplosionProgress();

  return (
    <div className="w-full h-full">
      <Canvas
        // Transparent background so the canvas blends with your page/hero bg
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // fully transparent clear color
        }}
        // Camera framed for ROCKET_SCALE at its resting size. Hover no
        // longer scales the rocket up (see the shimmer-wave + rotation
        // boost hover effect instead), so no extra headroom is needed here.
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
