export class Model {
  public static async getModel(model, body, query?): Promise<Model> {
    try {
      const m2 = new model(body, query);
      return m2;
    } catch (error) {
      throw error;
    }
  }
}
