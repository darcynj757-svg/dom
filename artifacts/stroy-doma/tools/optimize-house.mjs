// Regenerates public/house-v2.glb from models/house-source.glb.
// The toolchain is intentionally NOT a project dependency (it is heavy and
// only needed when the model changes). Run it with:
//
//   pnpm dlx -p @gltf-transform/core -p @gltf-transform/extensions \
//     -p @gltf-transform/functions -p draco3dgltf -p meshoptimizer -p sharp \
//     node tools/optimize-house.mjs models/house-source.glb public/house-v2.glb 1 0.01 512 0.0001 12 11 8
//
// Args: <src> <dst> <simplifyRatio> <simplifyError> <textureSize> <weldTolerance> <qPos> <qTexcoord> <qNormal>
// It prints a RESULT line that includes missingMeshNames - that list MUST stay
// empty, because ScrollHouse keys the build stages off mesh names (Material12,
// Material58, ...).

import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { dedup, prune, weld, simplify, resample, textureCompress } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';
import fs from 'node:fs';

const src = process.argv[2];
const dst = process.argv[3];
const ratio = Number(process.argv[4] ?? 0.5);
const error = Number(process.argv[5] ?? 0.01);
const texSize = Number(process.argv[6] ?? 512);
const weldTol = Number(process.argv[7] ?? 0.0001);
const qPos = Number(process.argv[8] ?? 12);
const qTex = Number(process.argv[9] ?? 11);
const qNor = Number(process.argv[10] ?? 8);

await MeshoptEncoder.ready; await MeshoptDecoder.ready; await MeshoptSimplifier.ready;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'draco3d.encoder': await draco3d.createEncoderModule(),
  'meshopt.encoder': MeshoptEncoder,
  'meshopt.decoder': MeshoptDecoder,
});

const count = (doc) => {
  let v = 0, t = 0;
  for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) {
    v += p.getAttribute('POSITION')?.getCount() || 0;
    const i = p.getIndices();
    t += i ? i.getCount() / 3 : 0;
  }
  return { vertices: v, triangles: Math.round(t) };
};

const doc = await io.readBinary(new Uint8Array(fs.readFileSync(src)));
const before = { names: doc.getRoot().listMeshes().map((m) => m.getName()), ...count(doc) };

for (const ext of doc.getRoot().listExtensionsUsed()) {
  if (ext.extensionName === 'KHR_draco_mesh_compression' || ext.extensionName === 'EXT_meshopt_compression') ext.dispose();
}

await doc.transform(
  dedup(),
  weld({ tolerance: weldTol }),
  simplify({ simplifier: MeshoptSimplifier, ratio, error, lockBorder: false }),
  resample(),
  prune({ keepAttributes: false, keepLeaves: false }),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [texSize, texSize], quality: 82 }),
);

doc.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({
  method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER,
  encodeSpeed: 1,
  decodeSpeed: 5,
  quantizationBits: { POSITION: qPos, NORMAL: qNor, TEXCOORD: qTex, COLOR: 8, GENERIC: 8 },
});

fs.writeFileSync(dst, Buffer.from(await io.writeBinary(doc)));

const after = { names: doc.getRoot().listMeshes().map((m) => m.getName()), ...count(doc) };
console.log('RESULT ' + JSON.stringify({
  srcKB: Math.round(fs.statSync(src).size / 1024),
  dstKB: Math.round(fs.statSync(dst).size / 1024),
  args: { ratio, error, texSize, weldTol, qPos, qTex, qNor },
  before: { v: before.vertices, t: before.triangles, meshes: before.names.length },
  after: { v: after.vertices, t: after.triangles, meshes: after.names.length },
  missingMeshNames: [...new Set(before.names)].filter((n) => !after.names.includes(n)),
  extensions: doc.getRoot().listExtensionsUsed().map((e) => e.extensionName),
}));
