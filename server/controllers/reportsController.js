const pool = require("../connection");

const getReports = async (req, res) => {
  try {
    const query = `
          SELECT m.mark_id, m.s_id, s.first_name, s.last_name, m.english, m.tamil, m.maths, m.science, m.social, m.total
          FROM marks m
          JOIN students s ON m.s_id = s.s_id  ORDER BY S_id DESC;
        `;
    const [rows, fields] = await pool.query(query);
    if (rows.length === 0) {
      return res.status(404).json({ error: "No marks found" });
    }
    res.status(200).json({ marks: rows });
  } catch (error) {
    console.error("Error fetching marks: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateReport = async (req, res) => {
  try {
    const { s_id, english, tamil, maths, science, social } = req.body;
    const updateQuery = `
      UPDATE marks
      SET
        english = ?,
        tamil = ?,
        maths = ?,
        science = ?,
        social = ?,
        total = english + tamil + maths + science + social
      WHERE s_id = ?;
    `;
    const values = [english, tamil, maths, science, social, s_id];
    const [result, fields] = await pool.query(updateQuery, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reports not found for the specified student" });
    }
    const passStatus = english >= 35 && tamil >= 35 && maths >= 35 && science >= 35 && social >= 35 ? "Pass" : "Fail";
    const updateStatusQuery = `
      UPDATE students
      SET total = (SELECT total FROM marks WHERE s_id = ?),
      status = ?
      WHERE s_id = ?;
    `;
    const statusValues = [s_id, passStatus, s_id];
    await pool.query(updateStatusQuery, statusValues);
    res.status(200).json({ message: "Reports updated successfully", status: passStatus });
  } catch (error) {
    console.error("Error updating reports: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = { getReports, updateReport }