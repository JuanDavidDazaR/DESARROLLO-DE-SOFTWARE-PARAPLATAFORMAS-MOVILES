const API_KEY = '';
const BASE_URL = 'https://api.opencagedata.com/geocode/v1/json';

export const getAddress = async (lat: number, lng: number) => {
  const response = await fetch(`${BASE_URL}?q=${lat}+${lng}&key=${API_KEY}&language=es`);
  if (!response.ok) throw new Error('Error consultando OpenCage');
  const data = await response.json();
  return data;
};
