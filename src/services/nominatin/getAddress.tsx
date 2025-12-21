export async function getAddress(lat: number, lng: number) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=geocodejson`
    );

    const data = await res.json();

    if (!data.features || data.features.length === 0) return null;
    const name = data.features[0].properties.geocoding.name ?? data.features[0].properties.geocoding.street

    return name + ', ' + data.features[0].properties.geocoding.district + ', ' + data.features[0].properties.geocoding.city;
}