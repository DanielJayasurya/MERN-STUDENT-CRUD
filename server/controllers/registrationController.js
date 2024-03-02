const pool = require("../connection");

const getRegistration = async (req, res) => {
  const selectQuery = `
    SELECT * FROM students
    ORDER BY S_id DESC
  `;
  try {
    const [rows, fields] = await pool.query(selectQuery);
    if (rows.length === 0) {
      return res.status(404).json({ error: "No students found" });
    }
    res.status(200).json({ students: rows });
  } catch (error) {
    console.error("Error fetching students: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const postRegistration = async (req, res) => {
  const {
    roll_no,
    first_name,
    last_name,
    phone_number,
    dob,
    email,
    gender,
    location,
  } = req.body;
  const insertStudentQuery = `
      INSERT INTO students
      (roll_no, first_name, last_name, phone_number, dob, email, gender, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
  const insertMarksQuery = `
      INSERT INTO marks
      (s_id, first_name, last_name, english, tamil, maths, science, social, total)
      VALUES (?, ?, ?, 0, 0, 0, 0, 0, 0);
    `;
  try {
    const [studentResult, studentFields] = await pool.query(
      insertStudentQuery,
      [
        roll_no,
        first_name,
        last_name,
        phone_number,
        dob,
        email,
        gender,
        location,
      ]
    );
    const studentId = studentResult.insertId;
    await pool.query(insertMarksQuery, [studentId, first_name, last_name]);
    console.log("Student registered successfully");
    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("Error registering student: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const UpdateRegistration = async (req, res) => {
  const studentId = req.params.id;
  const {
    roll_no,
    first_name,
    last_name,
    phone_number,
    dob,
    email,
    gender,
    location,
  } = req.body;
  const updateQuery = `
      UPDATE students
      SET
        roll_no = ?,
        first_name = ?,
        last_name = ?,
        phone_number = ?,
        dob = ?,
        email = ?,
        gender = ?,
        location = ?
      WHERE s_id = ?;
    `;
  const values = [
    roll_no,
    first_name,
    last_name,
    phone_number,
    dob,
    email,
    gender,
    location,
    studentId,
  ];
  try {
    const [result, fields] = await pool.query(updateQuery, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    console.log("Student updated successfully");
    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    console.error("Error updating student: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteRegistration = async (req, res) => {
  const studentId = req.params.id;
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const deleteMarksQuery = `
        DELETE FROM marks
        WHERE s_id = ?;
      `;
    await connection.query(deleteMarksQuery, [studentId]);
    const deleteStudentQuery = `
        DELETE FROM students
        WHERE s_id = ?;
      `;
    const [result, fields] = await connection.query(deleteStudentQuery, [
      studentId,
    ]);
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Student not found" });
    }
    await connection.commit();
    console.log("Student and corresponding marks deleted successfully");
    res
      .status(200)
      .json({
        message: "Student and corresponding marks deleted successfully",
      });
  } catch (error) {
    await connection.rollback();
    console.error(
      "Error deleting student and corresponding marks: " + error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
};

module.exports = {
  getRegistration,
  UpdateRegistration,
  postRegistration,
  deleteRegistration,
};
