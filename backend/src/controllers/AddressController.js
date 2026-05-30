import * as addressService from "../services/address.service.js";

export const addAddress = async (req, res) => {
  try {
    const address = await addressService.createAddress(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    if (error.message === "All required fields must be provided") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error adding address",
      error: error.message,
    });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const addresses = await addressService.getUserAddresses(req.user.id);

    return res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching addresses",
      error: error.message,
    });
  }
};

export const removeAddress = async (req, res) => {
  try {
    await addressService.deleteAddress(req.params.id, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Address removed successfully",
    });
  } catch (error) {
    if (error.message === "Address not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Unauthorized") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this address",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error removing address",
      error: error.message,
    });
  }
};
