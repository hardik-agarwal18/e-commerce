import Address from "../models/AddressModel.js";

export const addAddress = async (req, res) => {
  const {
    fullName,
    phone,
    street,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = req.body;

  try {
    // Validate required fields
    if (!fullName || !phone || !street || !city || !state || !postalCode) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
        missingFields: {
          fullName: !fullName,
          phone: !phone,
          street: !street,
          city: !city,
          state: !state,
          postalCode: !postalCode,
        },
      });
    }

    const newAddress = new Address({
      userId: req.user.id, // Get userId from authenticated user
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country: country || "India", // Default to India if not provided
      isDefault: isDefault || false,
    });

    await newAddress.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding address",
      error: error.message,
    });
  }
};
