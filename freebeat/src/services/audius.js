// Audius API service - 100% free music streaming via the Audius decentralized platform
// No API key required for basic usage

const AUDIUS_BASE = 'https://api.audius.co';

// Fetch the best available host dynamically
let cachedHost = null;

async function getHost() {
  if (cachedHost) return cachedHost;
  try {
    const res = await fetch(`${AUDIUS_BASE}?app_name=FreeBeat`);
    const data = await res.json();
    const hosts = data?.data;
    if (hosts && hosts.length > 0) {
      cachedHost = hosts[0];
      return cachedHost;
    }
  } catch {
    // fallback
  }
  cachedHost = 'https://discoveryprovider.audius.co';
  return cachedHost;
}

async function apiGet(path, params = {}) {
  const host = await getHost();
  const url = new URL(`${host}/v1${path}`);
  url.searchParams.set('app_name', 'FreeBeat');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Audius API error: ${res.status}`);
  return res.json();
}

export async function getTrendingTracks(genre = '', limit = 20) {
  const params = { limit };
  if (genre) params.genre = genre;
  const data = await apiGet('/tracks/trending', params);
  return data?.data || [];
}

export async function searchTracks(query, limit = 20) {
  const data = await apiGet('/tracks/search', { query, limit });
  return data?.data || [];
}

export async function searchUsers(query, limit = 10) {
  const data = await apiGet('/users/search', { query, limit });
  return data?.data || [];
}

export async function getTrack(trackId) {
  const data = await apiGet(`/tracks/${trackId}`);
  return data?.data || null;
}

export async function getUserTracks(userId, limit = 20) {
  const data = await apiGet(`/users/${userId}/tracks`, { limit });
  return data?.data || [];
}

export async function getTrendingPlaylists(limit = 10) {
  const data = await apiGet('/playlists/trending', { limit });
  return data?.data || [];
}

export async function getPlaylistTracks(playlistId) {
  const data = await apiGet(`/playlists/${playlistId}/tracks`);
  return data?.data || [];
}

export async function getStreamUrl(trackId) {
  const host = await getHost();
  return `${host}/v1/tracks/${trackId}/stream?app_name=FreeBeat`;
}

export function getArtworkUrl(artworkObj, size = '480x480') {
  if (!artworkObj) return null;
  return artworkObj[size] || artworkObj['150x150'] || null;
}

export const GENRES = [
  'All', 'Electronic', 'Rock', 'Metal', 'Alternative', 'Hip-Hop/Rap',
  'Experimental', 'Punk', 'Folk', 'Pop', 'Ambient', 'Soundtrack',
  'World', 'Jazz', 'Acoustic', 'Funk', 'R&B/Soul', 'Devotional',
  'Classical', 'Reggae', 'Podcasts', 'Country', 'Spoken Word',
  'Comedy', 'Blues', 'Kids', 'Audiobooks', 'Latin', 'Lo-fi',
];
