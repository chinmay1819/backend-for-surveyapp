const authforadmin = (req, res, next) => {
  try {
    if (req.userId == "63e61b1bf17532e566959d30") {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized User" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized User..." });
  }
};

module.exports = authforadmin;
