// POST /api/reports/generateapi
router.post("/generateapi", async (req, res) => {
  const { reportName, username } = req.body;

  // Clean file name
  const cleanedName = reportName.replace(/\+/g, "_");
  const filePath = path.join(__dirname, "../reports/generated", `${cleanedName}_generated.pdf`);

  const reportUrl = `http://rapc/ReportServer?/Rockwell Project Report/${reportName}&rs:Format=PDF`;

  try {
    const response = await axios.get(reportUrl, {
      responseType: "arraybuffer",
      auth: {
        username: "sa",
        password: "Rockwell1",
      },
    });

    fs.writeFileSync(filePath, response.data);

    await pool.request()
      .input("data", sql.VarChar, cleanedName)
      .input("author", sql.VarChar, username)
      .input("author_signed_at", sql.DateTime, new Date())
      .input("status", sql.VarChar, "generated")
      .query(`
        INSERT INTO Reports (data, author, author_signed_at, status)
        VALUES (@data, @author, @author_signed_at, @status)
      `);

    res.status(200).json({ message: "Report downloaded and saved successfully." });
  } catch (error) {
    console.error("SSRS download error:", error.message);
    res.status(500).json({ error: "Failed to generate report from SSRS" });
  }
});