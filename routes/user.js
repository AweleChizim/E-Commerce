const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization } = require("./middleware");

const router = require("express").Router();

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "An error has occured. Please try again" });
  }
});

module.exports = router;
