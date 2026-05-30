import jwt from "jsonwebtoken";

export const loginAdmin = async (email, password) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail || password !== adminPassword) {
    throw new Error("Invalid Credentials");
  }

  const token = jwt.sign(
    {
      user: {
        id: "admin_user",
        role: "ADMIN",
      },
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  return token;
};

export const logoutAdmin = async () => {
  return true;
};
