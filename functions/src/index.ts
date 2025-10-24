import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v1";
import { Request, Response } from "express";
import cors from "cors";

admin.initializeApp();

// Configuración de CORS
const corsHandler = cors({ 
  origin: "https://studio--colorplan.us-central1.hosted.app" 
});

// Función para deshabilitar usuarios nuevos
export const disableNewUser = functions.auth
  .user()
  .onCreate(async (user) => {
    try {
      await admin.auth().updateUser(user.uid, { disabled: true });
      console.log(`Usuario ${user.uid} deshabilitado correctamente.`);
    } catch (err) {
      console.error(`Error al deshabilitar usuario ${user.uid}:`, err);
    }
  });

// Ejemplo de función HTTP si la necesitas
export const helloWorld = functions.https.onRequest(
  (req: Request, res: Response) => {
    corsHandler(req, res, () => {
      res.send("Hola desde Firebase con CORS habilitado!");
    });
  }
);