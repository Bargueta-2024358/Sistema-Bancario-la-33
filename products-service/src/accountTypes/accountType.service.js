import AccountType from './accountType.model.js';
import eventBus from '../events/eventBus.js';

export const fetchAccountTypes = async ({
  page = 1,
  limit = 10,
  isActive = true,
}) => {
  const filter = { isActive };
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const accountTypes = await AccountType.find(filter)
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 });

  const total = await AccountType.countDocuments(filter);

  return {
    accountTypes,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalRecords: total,
      limit: limitNumber,
    },
  };
};

export const fetchAccountTypeById = async (id) => {
  return AccountType.findById(id);
};

export const createAccountTypeRecord = async ({ accountTypeData }) => {
  const accountType = new AccountType(accountTypeData);
  await accountType.save();

  eventBus.emit('accountType.created', {
    id: accountType._id,
    name: accountType.name,
    interestRate: accountType.interestRate,
    createdAt: accountType.createdAt,
  });

  return accountType;
};

export const updateAccountTypeRecord = async ({ id, updateData }) => {
  const accountType = await AccountType.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (accountType) {
    eventBus.emit('accountType.updated', {
      id: accountType._id,
      name: accountType.name,
      updatedAt: new Date(),
    });
  }

  return accountType;
};

export const updateAccountTypeStatus = async ({ id, isActive }) => {
  const accountType = await AccountType.findByIdAndUpdate(
    id,
    { isActive },
    { new: true }
  );

  if (accountType && !isActive) {
    eventBus.emit('accountType.deactivated', {
      id: accountType._id,
      name: accountType.name,
      deactivatedAt: new Date(),
    });
  }

  return accountType;
};