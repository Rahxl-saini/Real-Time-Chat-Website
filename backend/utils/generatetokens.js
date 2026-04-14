import jwt from "jsonwebtoken";

const generatetokens = (userId, res) => {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET environment variable is required");
	}

	const token = jwt.sign({ userId }, secret, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // MS
	});
};
export default generatetokens;