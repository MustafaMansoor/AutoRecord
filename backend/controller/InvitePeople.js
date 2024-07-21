



const invitePeople = async (req, res) => {
  const { email, companyId, admin, company } = req.body;

  try {
    
  }
    catch (error) {
        console.error("Error inviting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { invitePeople };
