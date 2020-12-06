var GeographyHelper = {}

GeographyHelper.calculateDistance = function (pointA, pointB) {
    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    var R = 6371;
    var dLat = deg2rad(pointB.lat - pointA.lat);
    var dLon = deg2rad(pointB.lon - pointA.lon);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(pointA.lat)) * Math.cos(deg2rad(pointB.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

// https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
GeographyHelper.lon2tile = function(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
GeographyHelper.lat2tile = function(lat,zoom) { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }
GeographyHelper.tile2lon = function(x,z) {
    return (x/Math.pow(2,z)*360-180);
}
GeographyHelper.tile2lat = function(y,z) {
    var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
    return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}

GeographyHelper.gpsToLocal = function(point, centerPoint){
    return {
        x: (point.lat - centerPoint.lat) * 100000,
        y: 0,
        z: (point.lon - centerPoint.lon) * 100000,
    }
}

GeographyHelper.localToGps = function(localPoint, centerPointGPS) {
    return {
        lat: localPoint.x / 100000 + centerPointGPS.lat,
        lon: localPoint.z / 100000 + centerPointGPS.lon
    }
}

export {GeographyHelper};
