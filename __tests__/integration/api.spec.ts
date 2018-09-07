
import { getManager, Repository  }   from "typeorm";
import request from "supertest";


import app from "../../app";
import * as db from "../lib/db";
import sample from "../lib/sample";
import { config } from "../../config";

const server = request(app.listen(config.PORT));

  beforeAll(async () => {
    await db.initDB();
  });

  afterAll(async () => {
    await db.closeDB();
  })

 let createdUser: any;

describe('/users Endpoint', () => {


  test('it should add a new staff user', async (done) => {

    server
        .post('/users/create')
        .send(sample.user)
        .expect(201)
        .end((err: Error, res: request.Response) => {
            if(err) return done(err);

            expect(res.body).not.toBeNull();
            expect(res.body.full_name).toEqual(sample.user.full_name);
            expect(res.body.email).toEqual(sample.user.email);

            done();
        });

  });

  test('it should login a new staff user', async (done) => {

    server
        .post('/users/login')
        .send(sample.user)
        .expect(200)
        .end((err: Error, res: request.Response) => {
            if(err) return done(err);

            expect(res.body).not.toBeNull();
            expect(res.body.token).not.toBeNull();
            expect(res.body.user.full_name).toEqual(sample.user.full_name);
            expect(res.body.user.email).toEqual(sample.user.email);

            done();
        });

  });


});

describe('/pets Endpoint', () => {

  let createdPet: any; 

  test('it should add a new pet', async (done) => {
    sample.pet.added_by = createdUser;

    server
        .post('/pets')
        .send(sample.pet)
        .set({ Authorization: `Bearer ${createdUser.token}`})
        .expect(201)
        .end((err: Error, res: request.Response) => {
            if(err) return done(err);

            expect(res.body).not.toBeNull();
            expect(res.body.RFID).toEqual(sample.pet.RFID);

            done();
        });

  });

  test('it should get a pet by id', async (done) => {

    server
        .get(`/pets/${createdPet.id}`)
        .expect(200)
        .end((err: Error, res: request.Response) => {
            if(err) return done(err);

            expect(res.body).not.toBeNull();
            expect(res.body.id).toEqual(createdPet.id);
            expect(res.body.RFID).toEqual(createdPet.RFID);

            done();
        });

  });

  test('it should get a pet by RFID', async (done) => {

    server
        .get(`/pets/${createdPet.RFID}`)
        .expect(200)
        .end((err: Error, res: request.Response) => {
            if(err) return done(err);

            expect(res.body).not.toBeNull();
            expect(res.body.id).toEqual(createdPet.id);
            expect(res.body.RFID).toEqual(createdPet.RFID);

            done();
        });

  });

  test('it should get pets collection paginated', async (done) => {

    server
        .get(`/pets`)
        .expect(200)
        .end((err: Error, res: request.Response) => {
            if(err) return done(err);

            expect(res.body).not.toBeNull();
            expect(res.body.total_docs).toEqual(1);
            expect(res.body.total_pages).toEqual(1);
            expect(res.body.docs).toBeGreaterThan(0);

            done();
        });

  });

  test('it should get pets collection added by a user paginated', async (done) => {

    server
        .get(`/pets?added_by=${createdUser.id}`)
        .expect(200)
        .end((err: Error, res: request.Response) => {
            if(err) return done(err);

            expect(res.body).not.toBeNull();
            expect(res.body.total_docs).toEqual(1);
            expect(res.body.total_pages).toEqual(1);
            expect(res.body.docs).toBeGreaterThan(0);

            done();
        });

  });


});
