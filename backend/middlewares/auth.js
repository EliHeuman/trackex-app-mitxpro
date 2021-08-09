const firebase = require("../config/firebase");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  try {
    const decodeValue = await firebase.admin.auth().verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }
    return res.json({ message: "Unauthorize" });
  } catch (e) {
    return res.json({ message: "Internal Error" });
  }
};
