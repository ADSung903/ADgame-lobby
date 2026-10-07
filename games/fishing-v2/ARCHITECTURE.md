# Fishing V2 — from-scratch architecture

## Goal
Rebuild Deep Sea Fishing around authored image assets and animation. Legacy fishing code is reference/spec only, not the renderer foundation.

## Non-negotiable visual target
- Painterly, luminous underwater world matching the approved concept direction.
- Scene is composed from authored layers: sky/islands, surface, underwater light, far terrain, mid reef/wreck, foreground reef/plants.
- Fish and boat are image/sprite assets. Do not generate final art with Canvas primitives or procedural SVG geometry.
- Canvas, if used, is restricted to transient effects such as line/hook, particles, ripples and collision/debug overlays.
- Mobile portrait first; parallax and animation must remain smooth.

## Preserve from legacy as game specification
26 species: sardine, carp, clownfish, mackerel, flyingfish, dolphin, seal, bass, squid, shrimp, jellyfish, seahorse, lionfish, shark, turtle, blowfish, swordfish, octopus, crab, lobster, sunfish, whale, manta, oarfish, angler, viperfish.
Preserve species depth, rarity, weather affinity, points and 20-cast session concept.

## V2 modules
- data/species.js — species gameplay metadata only.
- data/weather.js — weather metadata only.
- engine/game.js — state/session loop.
- engine/spawn.js — spawn/depth/weather selection.
- engine/catch.js — hook collision, caught state, pull-out/despawn, respawn.
- render/scene.js — authored layer composition/parallax.
- render/sprites.js — sprite animation, direction, scale, depth tint.
- render/effects.js — line/hook/ripples/bubbles/weather.
- assets/scenes/ — authored raster/WebP scene layers.
- assets/boat/ — boat states/animation.
- assets/fish/<id>/ — per-species swim/catch frames.

## Catch state machine
swimming -> hooked -> reeling -> caught/despawned -> replacement spawned.
A caught entity is removed from collision immediately and cannot score twice.

## First playable gate
Do not call V2 visually complete until it has real authored image assets for the scene, boat and representative fish; parallax; left/right swimming; hook/catch/despawn; and no legacy drawCustomFish dependency.
