import type { GetStatusResponse } from '@/shared/api/anison-status.api';
import type { Status } from '../../model/track-info';

const baseEnUrl = 'https://en.anison.fm';
const baseUrl = 'https://anison.fm';

export const statusMapper = (response: GetStatusResponse): Status => {
  const status: Status = {
    duration: response.duration,
    anime: response.on_air.anime,
    song: response.on_air.track,
    animeUrl: `${baseEnUrl}/catalog/${response.on_air.link}`,
    posterUrl: `${baseUrl}/resources/poster/150/${response.on_air.link}.jpg`
  };

  return status;
};
