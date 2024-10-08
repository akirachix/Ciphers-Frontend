export const fetchResources = async (): Promise<{ id: string; title: string }[]> => {
    try {
      const response = await fetch('https://your-api-url.com/resources');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw new Error('Failed to fetch resources');
    }
  };
  
