export async function getLatLng(endereco: string) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`
    );

    const data = await res.json();

    if (!data.length) return null;

    return {
        lat: Number(data[0].lat),
        lng: Number(data[0].lon),
    };
}