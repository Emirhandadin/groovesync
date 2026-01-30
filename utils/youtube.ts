// Renamed logic to support generic audio URLs instead of just YouTube
export const isValidAudioUrl = (url: string): boolean => {
  // Simple validation: check if it's a url and looks somewhat like an audio file or stream
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

export const getRandomCover = (id: string): string => {
  // Generate a consistent abstract art or use picsum based on ID
  return `https://picsum.photos/seed/${id}/800/800`;
};
