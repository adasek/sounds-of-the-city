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


export {GeographyHelper};
