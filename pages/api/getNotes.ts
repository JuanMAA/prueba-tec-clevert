export default async (req: any, res: any) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Error al obtener datos de la API');
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al obtener datos de la API' });
  }
};