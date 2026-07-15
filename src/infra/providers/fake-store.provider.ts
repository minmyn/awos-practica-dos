export class FakeStoreProvider {
  private readonly baseUrl = 'https://fakestoreapi.com/products';

  async getAllProducts(): Promise<any[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      throw Error(`Error fetching products from Fake Store API`);
    }
  }
}