export interface GetStatusResponse {
  duration: number;
  on_air: {
    anime: string;
    track: string;
    link: string;
  };
  poster: string;
}

export const getStatus: () => Promise<GetStatusResponse> = async () => {
  const response = await fetch('https://anison.fm/status.php');

  const data: GetStatusResponse = await response.json();

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return data;
};
