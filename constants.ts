import { Song, User, ChatMessage } from './types';
import { getRandomCover } from './utils/youtube';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ahmet', avatar: 'https://picsum.photos/seed/ahmet/50/50', status: 'online' },
  { id: 'u2', name: 'Ayşe', avatar: 'https://picsum.photos/seed/ayse/50/50', status: 'listening' },
  { id: 'u3', name: 'Mehmet', avatar: 'https://picsum.photos/seed/mehmet/50/50', status: 'offline' },
];

export const CURRENT_USER: User = {
  id: 'me',
  name: 'Ben',
  avatar: 'https://picsum.photos/seed/me/50/50',
  status: 'online'
};

// Using high quality royalty free samples from Pixabay for reliability
export const INITIAL_SONGS: Song[] = [
  {
    id: 'song1',
    url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
    title: 'Lofi Study Beat',
    addedBy: 'Ben',
    thumbnail: getRandomCover('song1')
  },
  {
    id: 'song2',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3',
    title: 'Future Bass Vibes',
    addedBy: 'Ahmet',
    thumbnail: getRandomCover('song2')
  },
  {
    id: 'song3',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3',
    title: 'Relaxing Jazz',
    addedBy: 'Ayşe',
    thumbnail: getRandomCover('song3')
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 'm1', userId: 'u1', text: 'Bu player çok daha iyi çalışıyor!', timestamp: Date.now() - 100000 },
  { id: 'system', userId: 'system', text: 'Sistem MP3 moduna geçirildi.', timestamp: Date.now() - 200000, isSystem: true },
];