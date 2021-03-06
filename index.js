const db = require('better-sqlite3')(
  'gmjpn21pref.mbtiles',
  { readonly: true }
)
const zlib = require('zlib')
const VectorTile = require('@mapbox/vector-tile').VectorTile
const Protobuf = require('pbf')

const tile = new VectorTile(new Protobuf(zlib.gunzipSync(
  db.prepare('SELECT tile_data FROM tiles WHERE \
  zoom_level = 2 AND tile_column = 3').get().tile_data
)))

const layer = tile.layers.gmjpn21pref
let geojson = {
  type: 'FeatureCollection',
  features: []
}
for (let i = 0; i < layer.length; i++) {
  let f = layer.feature(i).toGeoJSON(3, 1, 2)
  f.properties = {
    code: parseInt(f.properties.adm_code.substring(0, 2)),
    name: f.properties.nam
  }
  geojson.features.push(f)
}
console.log(JSON.stringify(geojson, null, 0))
