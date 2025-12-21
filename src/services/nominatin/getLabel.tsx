export async function getLabel(lat: number, lng: number) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=geocodejson`
    );

    const data = await res.json();

    if (!data.features || data.features.length === 0) return null;

    return {
        label: data.features[0].properties.geocoding.label
    };
}