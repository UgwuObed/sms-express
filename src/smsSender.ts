export interface Contact {
    phone_number: string;
    message: string;
  }
  
  export const simulateSmsSending = async (contact: Contact): Promise<void> => {
    const delay = Math.floor(Math.random() * 1000) + 500; 
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`SMS sent to ${contact.phone_number}: ${contact.message}`);
        resolve();
      }, delay);
    });
  };
  