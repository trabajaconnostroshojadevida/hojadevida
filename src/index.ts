const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'verchajm@gmail.com',
        pass: 'Vercha030923'
    },
});


interface ResetPasswordData {
    email: string;
}


exports.customPasswordReset = functions.https.onCall(async (data: ResetPasswordData, context: any) => {
    // Configura los headers CORS

     // Reemplaza con el dominio correcto de tu Firebase Hosting
    const allowedOrigins = ['https://tu-proyecto.web.app', 'https://tu-proyecto.firebaseapp.com'];
    const origin = context.rawRequest.headers.origin;

    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    if (context.rawRequest.method === 'OPTIONS') {
        const headers = {
            'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };
       return { status: 204, headers };
    }
    
    const email = data.email;

    if (!email) {
      throw new functions.https.HttpsError('invalid-argument', 'Email es requerido.');
    }

    try {
        const user = await admin.auth().getUserByEmail(email);
        const link = await admin.auth().generatePasswordResetLink(email);

        const mailOptions = {
            from: '"Tu App" <alejandrousme47@gmail.com>',
            to: email,
            subject: 'Restablecer tu contraseña',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Hola,</h2>
                    <p>Hemos recibido una solicitud para restablecer tu contraseña en Tu App.</p>
                    <p>Por favor, haz clic en el siguiente enlace para crear una nueva:</p>
                    <a href="${link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Restablecer contraseña</a>
                    <p>Si no solicitaste este cambio, ignora este correo.</p>
                    <p>Gracias,</p>
                    <p>El equipo de Tu App</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        const headers = {
          'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        };
        return { message: 'Correo de restablecimiento enviado con éxito', headers };


    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new functions.https.HttpsError('internal', 'No se pudo enviar el correo.', error);
    }
});