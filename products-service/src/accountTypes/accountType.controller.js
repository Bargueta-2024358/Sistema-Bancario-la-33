import {
  fetchAccountTypes,
  fetchAccountTypeById,
  createAccountTypeRecord,
  updateAccountTypeRecord,
  updateAccountTypeStatus,
} from './accountType.service.js';

export const getAccountTypes = async (
  req,
  res
) => {
  try {
    const {
      page = 1,
      limit = 10,
      isActive,
    } = req.query;

    const filters = {};

    if (isActive !== undefined) {
      filters.isActive =
        isActive === 'true';
    }

    const {
      accountTypes,
      pagination,
    } = await fetchAccountTypes({
      page,
      limit,
      ...filters,
    });

    res.status(200).json({
      success: true,
      data: accountTypes,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        'Error al obtener los tipos de cuenta',
      error: error.message,
    });
  }
};

export const getAccountTypeById =
  async (req, res) => {
    try {
      const { id } = req.params;

      const accountType =
        await fetchAccountTypeById(id);

      if (!accountType) {
        return res.status(404).json({
          success: false,
          message:
            'Tipo de cuenta no encontrado',
        });
      }

      res.status(200).json({
        success: true,
        data: accountType,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          'Error al obtener el tipo de cuenta',
        error: error.message,
      });
    }
  };

export const createAccountType =
  async (req, res) => {
    try {
      const accountType =
        await createAccountTypeRecord({
          accountTypeData: req.body,
        });

      res.status(201).json({
        success: true,
        message:
          'Tipo de cuenta creado exitosamente',
        data: accountType,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message:
            'Ya existe un tipo de cuenta con ese nombre',
        });
      }

      res.status(400).json({
        success: false,
        message:
          'Error al crear el tipo de cuenta',
        error: error.message,
      });
    }
  };

export const updateAccountType =
  async (req, res) => {
    try {
      const { id } = req.params;

      const accountType =
        await updateAccountTypeRecord({
          id,
          updateData: req.body,
        });

      if (!accountType) {
        return res.status(404).json({
          success: false,
          message:
            'Tipo de cuenta no encontrado',
        });
      }

      res.status(200).json({
        success: true,
        message:
          'Tipo de cuenta actualizado exitosamente',
        data: accountType,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          'Error al actualizar el tipo de cuenta',
        error: error.message,
      });
    }
  };

export const changeAccountTypeStatus =
  async (req, res) => {
    try {
      const { id } = req.params;

      const isActive =
        req.path.includes(
          '/activate'
        ) &&
        !req.path.includes(
          '/deactivate'
        );

      const action = isActive
        ? 'activado'
        : 'desactivado';

      const accountType =
        await updateAccountTypeStatus({
          id,
          isActive,
        });

      if (!accountType) {
        return res.status(404).json({
          success: false,
          message:
            'Tipo de cuenta no encontrado',
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
        message:
          'Error al cambiar el estado',
        error: error.message,
      });
    }
  };