import {
  fetchAccountTypes,
  fetchAccountTypeById,
  createAccountTypeRecord,
  updateAccountTypeRecord,
  updateAccountTypeStatus,
} from './accountType.service.js';

// Obtener todos los tipos de cuenta
export const getAccountTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive = true } = req.query;
    const { accountTypes, pagination } = await fetchAccountTypes({
      page,
      limit,
      isActive,
    });

    res.status(200).json({
      success: true,
      data: accountTypes,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los tipos de cuenta',
      error: error.message,
    });
  }
};

// Obtener tipo de cuenta por ID
export const getAccountTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const accountType = await fetchAccountTypeById(id);

    if (!accountType) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de cuenta no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: accountType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el tipo de cuenta',
      error: error.message,
    });
  }
};

// Crear tipo de cuenta
export const createAccountType = async (req, res) => {
  try {
    const accountType = await createAccountTypeRecord({
      accountTypeData: req.body,
    });

    res.status(201).json({
      success: true,
      message: 'Tipo de cuenta creado exitosamente',
      data: accountType,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear el tipo de cuenta',
      error: error.message,
    });
  }
};

// Actualizar tipo de cuenta
export const updateAccountType = async (req, res) => {
  try {
    const { id } = req.params;
    const accountType = await updateAccountTypeRecord({
      id,
      updateData: req.body,
    });

    if (!accountType) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de cuenta no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tipo de cuenta actualizado exitosamente',
      data: accountType,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el tipo de cuenta',
      error: error.message,
    });
  }
};

// Activar - Desactivar
export const changeAccountTypeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const isActive = req.url.includes('/activate');
    const action = isActive ? 'activado' : 'desactivado';

    const accountType = await updateAccountTypeStatus({ id, isActive });

    if (!accountType) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de cuenta no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: `Tipo de cuenta ${action} exitosamente`,
      data: accountType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado del tipo de cuenta',
      error: error.message,
    });
  }
};