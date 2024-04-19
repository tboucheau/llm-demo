import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { messages } = req.body; // Changez 'message' en 'messages'

    try {
      const response = await axios.post(
        'https://api.infomaniak.com/2/llm/667/chat/completions',
        { messages }, // Changez 'message' en 'messages'
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }
      );

      const responseData = response.data;
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error sending message to API:', error);
      res.status(500).json({ error: 'An error occurred while processing your message.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
