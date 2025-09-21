import api from './api';

export const contactService = {
  async createContact(contactData) {
    // API expects: name, email, phone, subject, message, type, userId
    const response = await api.post('/contacts', {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || '',
      subject: contactData.subject,
      message: contactData.message,
      type: contactData.type || 'inquiry',
      userId: contactData.userId || null
    });
    return response.data;
  },

  async getMyContacts() {
    const response = await api.get('/contacts/my-contacts');
    return response.data;
  }
};
