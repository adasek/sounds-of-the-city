export default class ServerRequest {

    constructor(server, req, res) {
        this.server = server;

        res.setHeader('Content-Type', 'application/json');
        var _this = this

        if (req.method == 'POST') {
            var body = '';

            req.on('data', function (data) {
                body += data;

                if (body.length > 1e6) {
                    req.destroy();
                }
            });

            req.on('end', async function () {
                let resultObject = await _this.parseRequest(JSON.parse(body));
                if (!('error' in resultObject)) {
                    resultObject['status'] = "ok";
                } else {
                    resultObject['status'] = "error";
                }
                res.write(JSON.stringify(resultObject));
                res.end();
            });
        } else if (req.method == "HEAD") {
            // Preflight request
            res.end();
        } else {
            res.end(JSON.stringify({"error": "bad http method"}));
        }
    }

    async parseRequest(requestBody) {
        var lat, lon, distance;
        if (!('longitude' in requestBody) || isNaN(lon = parseFloat(requestBody['longitude']))) {
            return {'error': 'Parameter longitude missing/unparsable'}
        }
        if (!('latitude' in requestBody) || isNaN(lat = parseFloat(requestBody['latitude']))) {
            return {'error': 'Parameter latitude missing/unparsable'}
        }
        if ('distance' in requestBody) {
            // distance in meters
            distance = parseInt(requestBody['distance']);
        }
        if(!distance || distance > 200){
            distance = 200
        }
        return this.getFeaturesAround(lat, lon, distance)
    }

    withCorners(lat, lon, distance) {
        return `
            WITH
leftTopCorner(p) as (SELECT ST_Project('POINT(${lon} ${lat})'::geography::geometry, sqrt(${distance * distance}*2), radians(315.0))::geometry as p), 
rightBottomCorner(p) as  (SELECT ST_Project('POINT(${lon} ${lat})'::geography::geometry, sqrt(${distance * distance}*2), radians(135.0))::geometry as p)
`
    }

    makeEnvelope() {
        return `
        ST_MakeEnvelope (
         (SELECT ST_X((select p from leftTopCorner))),
         (SELECT ST_Y((select p from leftTopCorner))),
         (SELECT ST_X((select p from rightBottomCorner))),
         (SELECT ST_Y((select p from rightBottomCorner)))
         )`
    }

    async getTechnicalUsage(lat, lon, distance = 100) {
        let queryString = `
    ${this.withCorners(lat, lon, distance)}
 SELECT 'technical_usage' AS table_name, ctvuk_kod, ctvuk_popis, ST_AsText(ST_UNION(wkb_geometry)) AS geometry
 FROM technicke_vyuziti
 WHERE  wkb_geometry 
     &&  ${this.makeEnvelope()}
     group by ctvuk_kod,ctvuk_popis
     `;
        let result = await this.server.query(queryString);
        return result.rows
    }

    /*
    Work with spatial data that have point geometry
     */
    async getPointData(table_name, lat, lon, distance){
        let queryString = `
     ${this.withCorners(lat, lon, distance)}
 SELECT '${table_name}' AS table_name, *, ST_AsText((wkb_geometry)) AS geometry
 FROM ${table_name}
 WHERE wkb_geometry 
     && ${this.makeEnvelope()}
     `;
        let result = await this.server.query(queryString);
        return result.rows
    }

    async getFeaturesAround(lat, lon, distance = 100) {
        //
        return {
            /* 'technical_usage': await this.getTechnicalUsage(lat, lon, distance), */
            'pid_stops': await this.getPointData("pid_zastavky", lat, lon, distance),
            'culture_venues': await this.getPointData("kultura_body", lat, lon, distance),
            'trash_wc': await this.getPointData("odpad_wc", lat, lon, distance),
            'trash_containers': await this.getPointData("odpad_tridene_kontejnery", lat, lon, distance),
            'trash_centers': await this.getPointData("odpad_sber", lat, lon, distance),
            'police': await this.getPointData("policie", lat, lon, distance),
            'nature_memorial_trees': await this.getPointData("priroda_pamatne_stromy", lat, lon, distance)
        }
    }

};
