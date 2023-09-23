export default async (req: any, res: any) => {
  try {
    const { id } = req.body;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const deleteUrl = `${apiUrl}/${id}`;

   await fetch(deleteUrl, {
      method: 'DELETE',
    });

    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al eliminar la nota en la API' });
  }
};