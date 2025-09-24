const { BASE, BUSINESS_ID, getAuthHeaders } = require('./_phorest');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { firstName, lastName, email, mobile } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // search for existing client by email
    const searchUrl = `${BASE}/business/${BUSINESS_ID}/client?email=${encodeURIComponent(email)}`;
    const searchRes = await fetch(searchUrl, {
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json'
      }
    });
    const searchData = await searchRes.json();
    if (searchData._embedded && searchData._embedded.length > 0) {
      const existing = searchData._embedded[0];
      return res.status(200).json(existing);
    }

    // create new client
    const createRes = await fetch(`${BASE}/business/${BUSINESS_ID}/client`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        mobile,
        version: 0
      })
    });
    const created = await createRes.json();
    return res.status(createRes.status).json(created);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
