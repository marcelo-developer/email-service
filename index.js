require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const destinatarios = [
  "marcelo.machado@viannasempre.com.br",
  "lucasleandro159@icloud.com",
  "santiagokahan@gmail.com"
];

const enviarEmail = async () => {
  for (const destinatario of destinatarios) {
    try {
      const info = await transporter.sendMail({
        from: `"Lembrete de Gastos" <${process.env.SMTP_USER}>`,
        to: destinatario,
        subject: "💸 Hora de lançar seus gastos!",
        html: `
          <div style="font-family: sans-serif; text-align: center; padding: 20px; background: #f7f7f7;">
            <h2 style="color: #333;">📅 Lembrete financeiro</h2>
            <p style="font-size: 16px;">Hora de lançar os seus gastos diários.</p>
            <a href="https://lancamento-gastos.caprover.m2195m.vps-kinghost.net" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
              Acessar plataforma
            </a>
          </div>
        `
      });

      console.log(`E-mail enviado para ${destinatario}: ${info.messageId}`);
    } catch (err) {
      console.error(`Erro ao enviar e-mail para ${destinatario}:`, err.message);
    }
  }
};

// ⏰ Agendamentos: 9h, 12h, 17h e 21h
const horarios = ['0 9 * * *', '0 12 * * *', '0 17 * * *', '0 21 * * *'];
horarios.forEach(horario => {
  cron.schedule(horario, enviarEmail, { timezone: 'America/Sao_Paulo' });
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
