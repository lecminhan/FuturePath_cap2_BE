const pool = require('../Database/db');

exports.getDataByRoleAndId = async (req, res) => {
  const { role, id } = req.params;  // lấy role và id từ params URL

  if (!role || !id) {
    return res.status(400).json({ error: 'Role and ID are required' });
  }

  const client = await pool.connect();

  try {
    let query = '';
    let params = [id];

    if (role === 'Expert') {
      // Lấy thông tin expert theo expert_id
      query = `
         SELECT e.*, u.username
        FROM "ExpertInformation" e
        JOIN "User" u ON e.user_id = u.id
        WHERE e.id = $1
      `;
    } else if (role === 'Student') {
      // Lấy thông tin user theo user_id
      query = `
        SELECT *
        FROM "UserInformation"
        WHERE user_id = $1
      `;
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const result = await client.query(query, params);
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching data by role and id:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};
