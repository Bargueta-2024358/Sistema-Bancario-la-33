import { useAccountTypeStore } from '../store/useAccountTypeStore';

export const useSaveAccountType =
  () => {
    const {
      createAccountType,
      updateAccountType,
    } =
      useAccountTypeStore();

    const saveAccountType =
      async (
        data,
        id = null
      ) => {
        if (id) {
          await updateAccountType(
            id,
            data
          );
        } else {
          await createAccountType(
            data
          );
        }
      };

    return {
      saveAccountType,
    };
  };