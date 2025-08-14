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

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
      error: error.message,
    });
  }
};

export const removeAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }
    if (address.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this address",
      });
    }
    await Address.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Address removed successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing address",
      error: error.message,
    });
  }
};
