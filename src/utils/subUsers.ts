import store from 'store/store';
import { SUBUSER_GETALL, postData } from 'utils';

export type SubUser = {
  username: string;
  subUserId: string;
  token: string;
};

export const getSubUsers = async (reload: boolean = false): Promise<SubUser[]> => {
  if (reload == false) {
    const subUsersFromStore = store.getSubUsers();
    if (subUsersFromStore.length > 0) {
      return subUsersFromStore;
    }
  }

  const originalToken = localStorage.getItem('bitsidyAccessToken') || '';
  const response = await postData(SUBUSER_GETALL, { token: originalToken });
  if (response.result === 'success') {
    store.setSubUsers(response.data);
    return response.data;
  }

  return [];
};
