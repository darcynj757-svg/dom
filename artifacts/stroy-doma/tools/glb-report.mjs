import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
import fs from 'node:fs';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'draco3d.encoder': await draco3d.createEncoderModule(),
});
const file = process.argv[2];
const doc = await io.read(file);
const root = doc.getRoot();
let texBytes = 0;
const tex = root.listTextures().map(t => {
  const img = t.getImage();
  texBytes += img ? img.byteLength : 0;
  const s = t.getSize();
  return `${t.getName()||'-'} ${t.getMimeType()} ${s? s.join('x'):'?'} ${Math.round((img?img.byteLength:0)/1024)}KB`;
});
let verts = 0, tris = 0;
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  verts += p.getAttribute('POSITION')?.getCount() || 0;
  const idx = p.getIndices();
  tris += idx ? idx.getCount()/3 : 0;
}
console.log(JSON.stringify({
  file, fileKB: Math.round(fs.statSync(file).size/1024),
  meshes: root.listMeshes().length, materials: root.listMaterials().length,
  vertices: verts, triangles: Math.round(tris),
  textures: tex.length, textureKB: Math.round(texBytes/1024),
  extensions: root.listExtensionsUsed().map(e=>e.extensionName),
  meshNames: root.listMeshes().map(m=>m.getName()),
}, null, 1));
console.log(tex.join('\n'));
