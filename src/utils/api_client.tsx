
import { getToken } from '../lib/utils.ts';
import axios from 'axios';
 
 

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;


export const deleteUserById = async ({ userId }: { userId: string }) => {
  const token = getToken()
  if (!token) {
    return 'user not authorized'
  }
  try {
    const response = await axios.delete(
      `${BACKEND_BASE_URL}/v1/superadmin/removeUser/${userId}`,
      {

        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    )
    if (response.data.message === 'User deleted successfully') {
      return 'success'
    }
  } catch (err) {
    throw new Error(`Failed to delete user ${err}` );
  }
}
