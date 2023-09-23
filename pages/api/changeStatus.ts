export default async (req: any, res: any) => {
  try {
    const { id } = req.body;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const changeStatusUrl = `${apiUrl}/changeStatus/${id}`;

    const response = await fetch(changeStatusUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Error al obtener datos de la API' });
  }
};