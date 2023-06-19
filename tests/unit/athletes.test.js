import { athleteModel } from '../../src/model/athletesModel.js'
import { athleteController } from '../../src/controller/athletesController.js'

test('athleteModel should recive database instance', () => {
  expect(() => athleteModel()).toThrow(new Error('Database is required'))
})

test('athleteController should recive database instance', () => {
  expect(() => athleteController()).toThrow(new Error('Http methods instance is required'))
})