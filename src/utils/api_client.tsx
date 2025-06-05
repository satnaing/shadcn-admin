
import { getToken } from '../lib/utils.ts';
import axios from 'axios';
 export const deleteUserById = async ({userId}:{userId:string}) =>  {
    const token = getToken()
    if(!token){
        return "user not authorized";
    }
    try {
    const response =   await axios.delete(`http://localhost:3003/v1/superadmin/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if(response.data.message ==="User deleted successfully"){
        return "success"
      }  
    } catch (err) {
      console.error('Failed to delete user:', err)
      alert('Failed to delete user. Please try again.')
    } 
  }