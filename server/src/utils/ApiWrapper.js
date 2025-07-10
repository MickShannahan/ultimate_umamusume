import { Cache } from './Cache.js';

export class ApiWrapper {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    this.cache = new Cache();
  }

  async get(endpoint) {
    const cached = this.cache.get(endpoint);
    if (cached) {
      return cached;
    }
    const response = await fetch(this.baseUrl + endpoint);
    const data = await response.json();
    this.cache.set(endpoint, data);
    return data;
  }

  async post(endpoint, body) {
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return response.json();
  }

  async put(endpoint, body) {
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return response.json();
  }

  async delete(endpoint) {
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'DELETE'
    });
    return response.json();
  }
}