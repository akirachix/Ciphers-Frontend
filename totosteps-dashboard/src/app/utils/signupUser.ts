import { AdminRegistrationData, RegistrationSuccessResponse,AdminRegistrationErrorResponse,FetchAdminFunction } from './types';
const url = '/api/create-user';



export const fetchAdmin: FetchAdminFunction = async (data: AdminRegistrationData) => {
    const response = await fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseData: RegistrationSuccessResponse | AdminRegistrationErrorResponse = await response.json();
    if (!response.ok) {
      throw responseData; 
    }
    return responseData as RegistrationSuccessResponse;
  };