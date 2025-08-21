import { Application } from 'express';
import { ModelCtor } from 'sequelize';

export function createApiRoutes(app: Application, models: Record<string, ModelCtor<any>>, prefix: string) {
  for (const [name, model] of Object.entries(models)) {
    const route = `${prefix}/${name.toLowerCase()}`;

    app.get(route, async (req, res) => res.json(await model.findAll()));
    app.get(`${route}/:id`, async (req, res) => {
      const item = await model.findByPk(req.params.id);
      item ? res.json(item) : res.sendStatus(404);
    });

    app.post(route, async (req, res) => {
      try {
        const record = await model.create(req.body)
        res.json(record)
      } catch (e) {
        console.log(e)
        res.json(e)
      }
    })
    app.put(`${route}/:id`, async (req, res) => {
      await model.update(req.body, { where: { id: req.params.id } });
      res.sendStatus(200);
    });
    app.delete(`${route}/:id`, async (req, res) => {
      await model.destroy({ where: { id: req.params.id } });
      res.sendStatus(204);
    });
  }
}
